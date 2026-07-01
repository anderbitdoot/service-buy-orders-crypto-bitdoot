import { inject, injectable } from "tsyringe";
import { BuyCryptoOrderTokens } from "../../infrastructure/di/BuyCryptoOrderTokens";
import type {
    CreateBuyCryptoOrderUseCase,
    CreateBuyCryptoOrderInput,
} from "../../domain/ports/in/CreateBuyCryptoOrderUseCase";
import type { ExchangeRateCachePort } from "../../domain/ports/out/ExchangeRateCachePort";
import type { BuyCryptoOrderRepositoryPort } from "../../domain/ports/out/BuyCryptoOrderRepositoryPort";
import { BuyCryptoOrder } from "../../domain/model/BuyCryptoOrder";
import { BuyCryptoOrderCalculator } from "../service/BuyCryptoOrderCalculator";
import { InvalidCurrencyPairError, InvalidOrderAmountError } from "../../domain/error/BuyCryptoOrderDomainError";
import { BuyCryptoOrderConstants } from "../../domain/constants/BuyCryptoOrderConstants";
import { createLogger } from "../../../shared/utils/logs/Logger";

const logger = createLogger("CreateBuyCryptoOrderUseCase");

@injectable()
export class CreateBuyCryptoOrderUseCaseImpl implements CreateBuyCryptoOrderUseCase {
    constructor(
        @inject(BuyCryptoOrderTokens.ExchangeRateCachePort)
        private readonly exchangeRateCache: ExchangeRateCachePort,
        @inject(BuyCryptoOrderTokens.BuyCryptoOrderRepositoryPort)
        private readonly buyCryptoOrderRepository: BuyCryptoOrderRepositoryPort
        // TODO: inyectar WalletBalancePort cuando se confirme el flujo de ejecución/wallet
    ) {}

    async execute(input: CreateBuyCryptoOrderInput): Promise<BuyCryptoOrder> {
        const from = input.from.toLowerCase();
        const to = input.to.toLowerCase();

        if (
            !BuyCryptoOrderConstants.SUPPORTED_FROM_CURRENCIES.includes(from as any) ||
            !BuyCryptoOrderConstants.SUPPORTED_TO_CURRENCIES.includes(to as any)
        ) {
            throw new InvalidCurrencyPairError(from, to);
        }

        if (!input.amount || input.amount <= 0) {
            throw new InvalidOrderAmountError(input.amount);
        }

        const cachedPrice = this.exchangeRateCache.getRate(`${from}_${to}`);
        const price = cachedPrice && cachedPrice > 0 ? cachedPrice : BuyCryptoOrderConstants.DEFAULT_EXCHANGE_RATE;

        const { receiveAmount, feeRate, feeAmount, total } = BuyCryptoOrderCalculator.calculate({
            amount: input.amount,
            price,
        });

        const order = BuyCryptoOrder.create({
            userId: input.userId,
            from,
            to,
            amount: input.amount,
            receiveAmount,
            price,
            feeRate,
            feeAmount,
            total,
        });

        await this.buyCryptoOrderRepository.save(order);
        logger.info(`Order ${order.orderId} created for user ${input.userId ?? "unknown"}`, false);

        // TODO (pendiente de confirmación): reflejar en service-wallet.
        // await this.walletBalancePort.creditBalance({
        //   userId: input.userId!,
        //   token: to.toUpperCase(),
        //   amount: receiveAmount,
        //   reference: order.orderId,
        // });

        return order;
    }
}