import { Schema, model, type Document } from "mongoose";

export interface BuyCryptoOrderDocument extends Document {
    orderId: string;
    userId?: string;
    from: string;
    to: string;
    amount: number;
    receiveAmount: number;
    price: number;
    feeRate: number;
    feeAmount: number;
    total: number;
    expireAt: Date;
    createdAt: Date;
}

const BuyCryptoOrderSchema = new Schema<BuyCryptoOrderDocument>(
    {
        orderId: { type: String, required: true, unique: true, index: true },
        userId: { type: String, required: false, index: true },
        from: { type: String, required: true },
        to: { type: String, required: true },
        amount: { type: Number, required: true },
        receiveAmount: { type: Number, required: true },
        price: { type: Number, required: true },
        feeRate: { type: Number, required: true },
        feeAmount: { type: Number, required: true },
        total: { type: Number, required: true },
        expireAt: { type: Date, required: true },
        createdAt: { type: Date, required: true, default: Date.now },
    },
    { collection: "orders_transactions", versionKey: false }
);

export const BuyCryptoOrderModel = model<BuyCryptoOrderDocument>(
    "BuyCryptoOrder",
    BuyCryptoOrderSchema
);