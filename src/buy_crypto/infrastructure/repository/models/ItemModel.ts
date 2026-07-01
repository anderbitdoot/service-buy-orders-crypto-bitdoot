import mongoose, { Schema, Document } from "mongoose";

export interface ItemDocument extends Document {
  name: string;
  value: string;
}

export const ItemSchema = new Schema<ItemDocument>(
    {
        name: { type: String, required: true },
        value: { type: String, required: true },
    },
    {
        _id: false
    }
);

