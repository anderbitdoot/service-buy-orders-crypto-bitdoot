import mongoose, { Schema, type Document } from "mongoose";

export interface TransactionMongoDocument extends Document {
    userId:    mongoose.Types.ObjectId;
    amount:    number;
    currency:  string;
    from:      string;
    to:        string;
    hash:      string;
    type:      string;
    refId:     mongoose.Types.ObjectId;
    status:    string;
    opCode:    string;
    createdAt: Date;
    updatedAt: Date;
}

const TransactionSchema = new Schema<TransactionMongoDocument>(
    {
        userId:   { type: Schema.Types.ObjectId, required: true },
        amount:   { type: Number, required: true },
        currency: { type: String, required: true },
        from:     { type: String, required: true },
        to:       { type: String, required: true },
        hash:     { type: String, required: true },
        type:     { type: String, required: true },
        refId:    { type: Schema.Types.ObjectId, required: true },
        status:   { type: String, required: true },
        opCode:   { type: String, required: true },
    },
    { timestamps: true }
);

export const TransactionModel = mongoose.model<TransactionMongoDocument>("Transaction", TransactionSchema);
