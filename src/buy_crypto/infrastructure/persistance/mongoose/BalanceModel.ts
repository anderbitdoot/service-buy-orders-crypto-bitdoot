import mongoose, { Schema, type Document } from "mongoose";

export interface BalanceItemDocument {
    currency:     string;
    currencyName: string;
    amountTotal:  number;
}

export interface BalanceMongoDocument extends Document {
    userId:       mongoose.Types.ObjectId;
    balanceItems: BalanceItemDocument[];
}

const BalanceItemSchema = new Schema<BalanceItemDocument>(
    {
        currency:     { type: String, required: true },
        currencyName: { type: String, required: true },
        amountTotal:  { type: Number, required: true },
    },
    { _id: false }
);

const BalanceSchema = new Schema<BalanceMongoDocument>(
    {
        userId:       { type: Schema.Types.ObjectId, ref: "UserSession", required: true },
        balanceItems: { type: [BalanceItemSchema], required: true, default: [] },
    },
    {
        timestamps:  true,
        collection:  "balances",
        toJSON:      { getters: true },
        toObject:    { getters: true },
    }
);

export const BalanceModel = mongoose.model<BalanceMongoDocument>(
    "BuyCryptoBalance",
    BalanceSchema,
);