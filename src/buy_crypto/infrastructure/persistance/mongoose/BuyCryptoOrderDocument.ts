import { Schema, model, type Document } from "mongoose";
import { OrderStatus } from "../../../domain/enums/OrderStatus";

export interface BuyCryptoOrderDocument extends Document {
    orderId:       string;
    userId?:       string;
    from:          string;
    to:            string;
    amount:        number;
    receiveAmount: number;
    price:         number;
    feeRate:       number;
    feeAmount:     number;
    total:         number;
    status:        OrderStatus;
    expireAt:      Date;
    createdAt:     Date;
    paidAt?:       Date;
    cancelledAt?:  Date;
}

const BuyCryptoOrderSchema = new Schema<BuyCryptoOrderDocument>(
    {
        orderId:       { type: String, required: true, unique: true, index: true },
        userId:        { type: String, required: false, index: true },
        from:          { type: String, required: true },
        to:            { type: String, required: true },
        amount:        { type: Number, required: true },
        receiveAmount: { type: Number, required: true },
        price:         { type: Number, required: true },
        feeRate:       { type: Number, required: true },
        feeAmount:     { type: Number, required: true },
        total:         { type: Number, required: true },
        status: {
            type:    String,
            enum:    Object.values(OrderStatus),
            default: OrderStatus.PENDING,
            index:   true,
        },
        expireAt:    { type: Date, required: true },
        createdAt:   { type: Date, required: true, default: Date.now },
        paidAt:      { type: Date },
        cancelledAt: { type: Date },
    },
    {
        collection: "orders_transactions",
        versionKey: false,
    }
);

// Job de expiración: busca PENDING + createdAt viejo
BuyCryptoOrderSchema.index({ status: 1, createdAt: 1 });
// Job de actualización de precio: busca PENDING por par
BuyCryptoOrderSchema.index({ status: 1, from: 1, to: 1 });

export const BuyCryptoOrderModel = model<BuyCryptoOrderDocument>(
    "BuyCryptoOrder",
    BuyCryptoOrderSchema
);