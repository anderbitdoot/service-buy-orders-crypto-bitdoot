import { injectable } from "tsyringe";
import type { BuyCryptoOrderRepositoryPort} from "../../domain/ports/out/BuyCryptoOrderRepositoryPort";
import { BuyCryptoOrder } from "../../domain/model/BuyCryptoOrder";
import { BuyCryptoOrderModel} from "../persistance/mongoose/BuyCryptoOrderDocument";

@injectable()
export class BuyCryptoOrderRepositoryAdapter implements BuyCryptoOrderRepositoryPort {
    async save(order: BuyCryptoOrder): Promise<void> {
        const props = order.toPersistence();
        await BuyCryptoOrderModel.create(props);
    }

    async findByOrderId(orderId: string): Promise<BuyCryptoOrder | null> {
        const doc = await BuyCryptoOrderModel.findOne({ orderId }).lean();
        if (!doc) return null;

        return BuyCryptoOrder.fromPersistence({
            orderId: doc.orderId,
            userId: doc.userId,
            from: doc.from,
            to: doc.to,
            amount: doc.amount,
            receiveAmount: doc.receiveAmount,
            price: doc.price,
            feeRate: doc.feeRate,
            feeAmount: doc.feeAmount,
            total: doc.total,
            expireAt: doc.expireAt,
            createdAt: doc.createdAt,
        });
    }
}