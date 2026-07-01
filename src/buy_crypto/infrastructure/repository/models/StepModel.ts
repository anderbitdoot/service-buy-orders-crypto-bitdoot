import mongoose, { Schema, Document } from "mongoose";
import { ItemDocument, ItemSchema } from "./ItemModel";

export interface StepDocument extends Document {
  name: string;
  order: number;
  status: boolean;
  process: string;
  items?:  ItemDocument[];
}

export const StepSchema = new Schema<StepDocument>({
  name: { type: String, required: true },
  order: { type: Number, required: true },
  status: { type: Boolean, required: false },
  process: { type: String, required: true },
  items: { type: [ItemSchema], required: false, default: [] },
}, { _id: false }); 
