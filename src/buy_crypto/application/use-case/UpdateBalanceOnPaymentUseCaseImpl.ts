import { inject, injectable }  from "tsyringe";
import { BuyCryptoOrderTokens } from "../../infrastructure/di/BuyCryptoOrderTokens";
import type { BalanceRepositoryPort } from "../../domain/ports/out/BalanceRepositoryPort";
import type { ExchangeRateCachePort } from "../../domain/ports/out/ExchangeRateCachePort";
import type { BuyCryptoOrder }        from "../../domain/model/BuyCryptoOrder";
import { createLogger }               from "../../../shared/utils/logs/Logger";

const logger = createLogger("UpdateBalanceOnPayment");

@injectable()
export class UpdateBalanceOnPaymentUseCaseImpl {
    constructor(
        @inject(BuyCryptoOrderTokens.BalanceRepositoryPort)
        private readonly balanceRepository: BalanceRepositoryPort,

        @inject(BuyCryptoOrderTokens.ExchangeRateCachePort)
        private readonly rateCache: ExchangeRateCachePort,
    ) {}

    async execute(order: BuyCryptoOrder): Promise<void> {
        const balance = await this.balanceRepository.findByUserId(order.userId!);

        if (!balance) {
            logger.warn(`No balance found for userId=${order.userId} — skipping update`);
            return;
        }

        const toSymbol = order.to.toUpperCase();
        const fromSymbol = order.from.toUpperCase();
        const toAssetName = this.rateCache.getAssetName(toSymbol) ?? toSymbol;

        const existingTo  = balance.balanceItems.find(
            item => item.currency === toSymbol
        );

        if (existingTo) {
            existingTo.amountTotal = Number(
                (existingTo.amountTotal + order.receiveAmount).toFixed(8)
            );
        } else {
            balance.balanceItems.push({
                currency:     toSymbol,
                currencyName: toAssetName,
                amountTotal:  Number(order.receiveAmount.toFixed(8)),
            });
        }

        const existingFrom = balance.balanceItems.find(
            item => item.currency === fromSymbol
        );

        if (existingFrom) {
            existingFrom.amountTotal = Number(
                (existingFrom.amountTotal - order.total).toFixed(8)
            );
        }

        await this.balanceRepository.updateBalance(balance._id, balance);

        logger.info(
            `Balance updated for userId=${order.userId} — ` +
            `+${order.receiveAmount} ${toSymbol}` +
            (existingFrom ? ` / -${order.total} ${fromSymbol}` : ` (${fromSymbol} paid externally)`)
        );
    }
}