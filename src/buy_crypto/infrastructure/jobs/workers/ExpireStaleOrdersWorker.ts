import { type Job }          from "bullmq";
import { createWorker }      from "../BullMQConnection";
import { BuyCryptoJobNames } from "../../../domain/constants/BuyCryptoJobNames";
import { BuyCryptoOrderModel } from "../../persistance/mongoose/BuyCryptoOrderDocument";
import { OrderStatus }         from "../../../domain/enums/OrderStatus";
import { ENV }                 from "../../../../../config/env";
import { createLogger }        from "../../../../shared/utils/logs/Logger";

const logger = createLogger("OrderExpiryWorker");

export function startExpireStaleOrdersWorker() {
    const worker = createWorker(
        BuyCryptoJobNames.EXPIRE_STALE_ORDERS,
        async (_job: Job) => {
            const cutoff = new Date(Date.now() - ENV.ORDER_EXPIRY_MS);

            const expired = await BuyCryptoOrderModel.find({
                status:    OrderStatus.PENDING,
                createdAt: { $lte: cutoff },
            }).lean();

            if (expired.length === 0) return;

            const ids    = expired.map(o => o.orderId);
            const result = await BuyCryptoOrderModel.updateMany(
                { orderId: { $in: ids }, status: OrderStatus.PENDING },
                { $set: { status: OrderStatus.CANCELLED, cancelledAt: new Date() } },
            );

            logger.warn(`${result.modifiedCount} order(s) expired and cancelled: [${ids.join(", ")}]`);
        }
    );

    worker.on("completed", (job: Job)                        => logger.info(`Job ${job.id} completed`));
    worker.on("failed",    (job: Job | undefined, err: Error) => logger.error(`Job ${job?.id} failed`, err));

    return worker;
}