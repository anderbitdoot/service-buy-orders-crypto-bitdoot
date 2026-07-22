import { inject, injectable } from "tsyringe";
import { BuyCryptoOrderTokens } from "../../infrastructure/di/BuyCryptoOrderTokens";
import type {
    CreateBuyCryptoOrderUseCase,
    CreateBuyCryptoOrderInput,
} from "../../domain/ports/in/CreateBuyCryptoOrderUseCase";
import type { ExchangeRateCachePort } from "../../domain/ports/out/ExchangeRateCachePort";
import type { AssetPriceProviderPort } from "../../domain/ports/out/AssetPriceProviderPort";
import type { BuyCryptoOrderRepositoryPort } from "../../domain/ports/out/BuyCryptoOrderRepositoryPort";
import { BuyCryptoOrder } from "../../domain/model/BuyCryptoOrder";
import { BuyCryptoOrderCalculator } from "../service/BuyCryptoOrderCalculator";
import {
    InvalidCurrencyPairError,
    InvalidOrderAmountError,
    AssetPriceUnavailableError,
} from "../../domain/error/BuyCryptoOrderDomainError";
import { BuyCryptoOrderConstants } from "../../domain/constants/BuyCryptoOrderConstants";
import { createLogger } from "../../../shared/utils/logs/Logger";

const logger = createLogger("CreateBuyCryptoOrderUseCase");

@injectable()
export class CreateBuyCryptoOrderUseCaseImpl implements CreateBuyCryptoOrderUseCase {
    constructor(
        @inject(BuyCryptoOrderTokens.ExchangeRateCachePort)
        private readonly exchangeRateCache: ExchangeRateCachePort,

        @inject(BuyCryptoOrderTokens.AssetPriceProviderPort)
        private readonly assetPriceProvider: AssetPriceProviderPort,

        @inject(BuyCryptoOrderTokens.BuyCryptoOrderRepositoryPort)
        private readonly buyCryptoOrderRepository: BuyCryptoOrderRepositoryPort
    ) {}

    async execute(input: CreateBuyCryptoOrderInput): Promise<BuyCryptoOrder> {
        const from = input.from.toLowerCase();
        const to   = input.to.toLowerCase();

        if (!BuyCryptoOrderConstants.SUPPORTED_FROM_CURRENCIES.includes(from as any)) {
            throw new InvalidCurrencyPairError(from, to);
        }
        if (!BuyCryptoOrderConstants.SUPPORTED_TO_TOKENS.includes(to as any)) {
            throw new InvalidCurrencyPairError(from, to);
        }

        if (!input.amount || input.amount <= 0) {
            throw new InvalidOrderAmountError(input.amount);
        }

        const price = await this.resolvePrice(from, to);

        const { receiveAmount, feeRate, feeAmount, total } =
            BuyCryptoOrderCalculator.calculate({ amount: input.amount, price });

        const order = BuyCryptoOrder.create({
            userId: input.userId,
            from,
            to,
            amount:        input.amount,
            receiveAmount,
            price,
            feeRate,
            feeAmount,
            total,
        });

        await this.buyCryptoOrderRepository.save(order);

        logger.info(
            `Order ${order.orderId} — ${input.amount} ${from.toUpperCase()} → ${receiveAmount} ${to.toUpperCase()} @ ${price}`
        );

        return order;
    }

    private async resolvePrice(from: string, to: string): Promise<number> {
        const pair = `${from}_${to}`;

        const cached = this.exchangeRateCache.getRate(pair);
        if (cached !== null && cached > 0) {
            return cached;
        }

        logger.warn(`Cache miss for ${pair} — fetching on-demand`);

        const prices = await this.assetPriceProvider.getPricesByQuote(from.toUpperCase());
        const match  = prices.find((p) => p.symbol.toLowerCase() === to);

        if (!match || match.price <= 0) {
            throw new AssetPriceUnavailableError(`${from.toUpperCase()}→${to.toUpperCase()}`);
        }

        this.exchangeRateCache.setRate(pair, match.price);
        return match.price;
    }
}