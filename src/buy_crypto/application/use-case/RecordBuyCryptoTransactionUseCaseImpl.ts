import { inject, injectable }  from "tsyringe";
import { BuyCryptoOrderTokens } from "../../infrastructure/di/BuyCryptoOrderTokens";
import type { TransactionRepositoryPort } from "../../domain/ports/out/TransactionRepositoryPort";
import type { SequenceRepositoryPort }    from "../../domain/ports/out/SequenceRepositoryPort";
import type { ExchangeRateCachePort }     from "../../domain/ports/out/ExchangeRateCachePort";
import type { BuyCryptoOrder }            from "../../domain/model/BuyCryptoOrder";
import { TransactionType }   from "../../domain/enums/TransactionType";
import { TransactionStatus } from "../../domain/enums/TransactionStatus";
import { createLogger }      from "../../../shared/utils/logs/Logger";

const logger = createLogger("RecordBuyCryptoTransaction");

const HASH_PLACEHOLDER = "example-hash";

@injectable()
export class RecordBuyCryptoTransactionUseCaseImpl {
    constructor(
        @inject(BuyCryptoOrderTokens.TransactionRepositoryPort)
        private readonly transactionRepository: TransactionRepositoryPort,

        @inject(BuyCryptoOrderTokens.SequenceRepositoryPort)
        private readonly sequenceRepository: SequenceRepositoryPort,

        @inject(BuyCryptoOrderTokens.ExchangeRateCachePort)
        private readonly rateCache: ExchangeRateCachePort,
    ) {}

    async execute(order: BuyCryptoOrder, status: TransactionStatus): Promise<void> {
        if (!order.userId || !order.mongoId) {
            logger.warn(`Missing userId/mongoId for orderId=${order.orderId} — skipping transaction record`);
            return;
        }

        const toSymbol = order.to.toUpperCase();
        const currency = this.rateCache.getCoinId(toSymbol) ?? toSymbol;

        try {
            const opCode = await this.sequenceRepository.getNextOpCode();

            await this.transactionRepository.createTransaction({
                userId:   order.userId,
                amount:   order.receiveAmount,
                currency,
                from:     "buy-crypto",
                to:       toSymbol,
                hash:     HASH_PLACEHOLDER,
                type:     TransactionType.IN,
                refId:    order.mongoId,
                status,
                opCode,
            });
        } catch (err) {
            logger.error(`Failed to record transaction for orderId=${order.orderId}`, err);
        }
    }
}
