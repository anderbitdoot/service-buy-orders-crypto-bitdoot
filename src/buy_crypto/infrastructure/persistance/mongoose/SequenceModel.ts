import mongoose, { Schema, type Document } from "mongoose";

export interface SequenceDocument extends Document {
    sequenceValue: number;
}

const SequenceSchema = new Schema<SequenceDocument>(
    { sequenceValue: { type: Number, default: 0 } },
    { _id: false }
);

export const SequenceModel = mongoose.model<SequenceDocument>("Sequence", SequenceSchema);
