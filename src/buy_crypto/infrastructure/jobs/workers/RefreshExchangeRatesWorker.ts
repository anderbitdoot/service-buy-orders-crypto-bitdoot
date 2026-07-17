import { type Job }             from "bullmq";
import { createWorker }         from "../BullMQConnection";
import { BuyCryptoJobNames }    from "../../../domain/constants/BuyCryptoJobNames";
import { container }            from "tsyringe";
import { BuyCryptoOrderTokens } from "../../di/BuyCryptoOrderTokens";
import type { AssetPriceProviderPort } from "../../../domain/ports/out/AssetPriceProviderPort";
import type { ExchangeRateCachePort }  from "../../../domain/ports/out/ExchangeRateCachePort";
import { BuyCryptoOrderConstants }     from "../../../domain/constants/BuyCryptoOrderConstants";
import { BuyCryptoOrderModel }         from "../../persistance/mongoose/BuyCryptoOrderDocument";
import { OrderStatus }                 from "../../../domain/enums/OrderStatus";
import { ENV }                         from "../../../../../config/env";
import { createLogger, formatDateTime } from "../../../../shared/utils/logs/Logger";

const logger = createLogger("ExchangeRateWorker");

export function startRefreshExchangeRatesWorker() {
    const worker = createWorker(
        BuyCryptoJobNames.REFRESH_EXCHANGE_RATES,
        async (_job: Job) => {
            const priceProvider = container.resolve<AssetPriceProviderPort>(
                BuyCryptoOrderTokens.AssetPriceProviderPort
            );
            const rateCache = container.resolve<ExchangeRateCachePort>(
                BuyCryptoOrderTokens.ExchangeRateCachePort
            );

            for (const from of BuyCryptoOrderConstants.SUPPORTED_FROM_CURRENCIES) {
                const prices = await priceProvider.getPricesByQuote(from.toUpperCase());

                if (prices.length === 0) {
                    logger.warn(`No prices for quote=${from.toUpperCase()}`);
                    continue;
                }

                const summary = prices.map(r => `${r.symbol}=${r.price}`).join(", ");
                logger.plain(`${formatDateTime()} Prices for ${from.toUpperCase()}: ${summary}`);

                for (const { symbol, price } of prices) {
                    const pair = `${from.toLowerCase()}_${symbol.toLowerCase()}`;
                    rateCache.setRate(pair, price);

                    const cutoff = new Date(Date.now() - ENV.ORDER_EXPIRY_MS);

                    // expireAt = ahora + mismo intervalo del job → siempre sincronizado
                    const newExpireAt = new Date(Date.now() + ENV.EXCHANGE_RATE_REFRESH_MS);

                    const pending = await BuyCryptoOrderModel.find({
                        status:    OrderStatus.PENDING,
                        from:      from.toLowerCase(),
                        to:        symbol.toLowerCase(),
                        createdAt: { $gte: cutoff },
                    }).lean();

                    if (pending.length === 0) continue;

                    await Promise.all(
                        pending.map(order =>
                            BuyCryptoOrderModel.updateOne(
                                { orderId: order.orderId },
                                {
                                    $set: {
                                        price,
                                        receiveAmount: Number((order.amount / price).toFixed(8)),
                                        expireAt:      newExpireAt,
                                    },
                                }
                            )
                        )
                    );

                    logger.info(`Updated ${pending.length} pending order(s) for ${pair}`);
                }
            }
        }
    );

    worker.on("completed", (job: Job)                         => logger.info(`Job ${job.id} completed`));
    worker.on("failed",    (job: Job | undefined, err: Error) => logger.error(`Job ${job?.id} failed`, err));

    return worker;
}