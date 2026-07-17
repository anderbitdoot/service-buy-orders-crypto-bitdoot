import { injectable }  from "tsyringe";
import type { BuyCryptoOrderRepositoryPort } from "../../domain/ports/out/BuyCryptoOrderRepositoryPort";
import { BuyCryptoOrder }      from "../../domain/model/BuyCryptoOrder";
import { OrderStatus }         from "../../domain/enums/OrderStatus";
import { BuyCryptoOrderModel } from "../persistance/mongoose/BuyCryptoOrderDocument";
import { ENV }                 from "../../../../config/env";

@injectable()
export class BuyCryptoOrderRepositoryAdapter implements BuyCryptoOrderRepositoryPort {

    async save(order: BuyCryptoOrder): Promise<void> {
        await BuyCryptoOrderModel.create(order.toPersistence());
    }

    async findByOrderId(orderId: string): Promise<BuyCryptoOrder | null> {
        const doc = await BuyCryptoOrderModel.findOne({ orderId }).lean();
        if (!doc) return null;
        return BuyCryptoOrder.fromPersistence({
            orderId:       doc.orderId,
            userId:        doc.userId,
            from:          doc.from,
            to:            doc.to,
            amount:        doc.amount,
            receiveAmount: doc.receiveAmount,
            price:         doc.price,
            feeRate:       doc.feeRate,
            feeAmount:     doc.feeAmount,
            total:         doc.total,
            status:        doc.status,
            expireAt:      doc.expireAt,
            createdAt:     doc.createdAt,
            paidAt:        doc.paidAt,
            cancelledAt:   doc.cancelledAt,
        });
    }

    async findPendingByPair(from: string, to: string): Promise<BuyCryptoOrder[]> {
        const docs = await BuyCryptoOrderModel.find({
            status: OrderStatus.PENDING,
            from:   from.toLowerCase(),
            to:     to.toLowerCase(),
        }).lean();

        return docs.map(doc => BuyCryptoOrder.fromPersistence({
            orderId:       doc.orderId,
            userId:        doc.userId,
            from:          doc.from,
            to:            doc.to,
            amount:        doc.amount,
            receiveAmount: doc.receiveAmount,
            price:         doc.price,
            feeRate:       doc.feeRate,
            feeAmount:     doc.feeAmount,
            total:         doc.total,
            status:        doc.status,
            expireAt:      doc.expireAt,
            createdAt:     doc.createdAt,
            paidAt:        doc.paidAt,
            cancelledAt:   doc.cancelledAt,
        }));
    }

    async findExpiredPending(): Promise<BuyCryptoOrder[]> {
        const cutoff = new Date(Date.now() - ENV.ORDER_EXPIRY_MS);
        const docs   = await BuyCryptoOrderModel.find({
            status:    OrderStatus.PENDING,
            createdAt: { $lte: cutoff },
        }).lean();

        return docs.map(doc => BuyCryptoOrder.fromPersistence({
            orderId:       doc.orderId,
            userId:        doc.userId,
            from:          doc.from,
            to:            doc.to,
            amount:        doc.amount,
            receiveAmount: doc.receiveAmount,
            price:         doc.price,
            feeRate:       doc.feeRate,
            feeAmount:     doc.feeAmount,
            total:         doc.total,
            status:        doc.status,
            expireAt:      doc.expireAt,
            createdAt:     doc.createdAt,
            paidAt:        doc.paidAt,
            cancelledAt:   doc.cancelledAt,
        }));
    }

    async updatePrice(orderId: string, price: number, receiveAmount: number, expireAt: Date): Promise<void> {
        await BuyCryptoOrderModel.updateOne(
            { orderId, status: OrderStatus.PENDING },
            { $set: { price, receiveAmount, expireAt } },
        );
    }

    async updateStatus(orderId: string, status: OrderStatus, extra?: { paidAt?: Date; cancelledAt?: Date }): Promise<BuyCryptoOrder | null> {
        const doc = await BuyCryptoOrderModel.findOneAndUpdate(
            { orderId },
            { $set: { status, ...extra } },
            { new: true },
        ).lean();

        if (!doc) return null;

        return BuyCryptoOrder.fromPersistence({
            orderId:       doc.orderId,
            userId:        doc.userId,
            from:          doc.from,
            to:            doc.to,
            amount:        doc.amount,
            receiveAmount: doc.receiveAmount,
            price:         doc.price,
            feeRate:       doc.feeRate,
            feeAmount:     doc.feeAmount,
            total:         doc.total,
            status:        doc.status,
            expireAt:      doc.expireAt,
            createdAt:     doc.createdAt,
            paidAt:        doc.paidAt,
            cancelledAt:   doc.cancelledAt,
        });
    }

    async cancelMany(orderIds: string[]): Promise<number> {
        const result = await BuyCryptoOrderModel.updateMany(
            { orderId: { $in: orderIds }, status: OrderStatus.PENDING },
            { $set: { status: OrderStatus.CANCELLED, cancelledAt: new Date() } },
        );
        return result.modifiedCount;
    }
}