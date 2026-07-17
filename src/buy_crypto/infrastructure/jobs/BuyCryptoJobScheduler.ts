import { createQueue }        from "./BullMQConnection";
import { BuyCryptoJobNames }  from "../../domain/constants/BuyCryptoJobNames";
import { ENV }                from "../../../../config/env";
import { createLogger }       from "../../../shared/utils/logs/Logger";

const logger = createLogger("JobScheduler");

export async function scheduleBuyCryptoJobs(): Promise<void> {
    const rateQueue   = createQueue(BuyCryptoJobNames.REFRESH_EXCHANGE_RATES);
    const expiryQueue = createQueue(BuyCryptoJobNames.EXPIRE_STALE_ORDERS);

    // Limpiar jobs repetitivos anteriores para evitar duplicados al reiniciar
    await rateQueue.obliterate({ force: true }).catch(() => {});
    await expiryQueue.obliterate({ force: true }).catch(() => {});

    await rateQueue.add(
        BuyCryptoJobNames.REFRESH_EXCHANGE_RATES,
        {},
        {
            repeat:    { every: ENV.EXCHANGE_RATE_REFRESH_MS },
            removeOnComplete: 10,
            removeOnFail:      5,
        }
    );

    await expiryQueue.add(
        BuyCryptoJobNames.EXPIRE_STALE_ORDERS,
        {},
        {
            repeat:    { every: ENV.ORDER_EXPIRY_CHECK_MS },
            removeOnComplete: 10,
            removeOnFail:      5,
        }
    );

    logger.info(`Refresh exchange rates — every ${ENV.EXCHANGE_RATE_REFRESH_MS / 1000}s`);
    logger.info(`Expire stale orders   — every ${ENV.ORDER_EXPIRY_CHECK_MS / 1000}s`);
}