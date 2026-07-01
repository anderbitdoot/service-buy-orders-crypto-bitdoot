import mongoose, { Schema, Document } from "mongoose";
import { StepDocument, StepSchema } from "./StepModel";

export interface UserSessionDocument extends Document {

  email: string;
  password?: string;
  securityLevel: number;
  token: string;
  cellphone: string;  
  steps?: StepDocument[];
}

const UserSessionSchema = new Schema<UserSessionDocument>({

  email: { type: String, required: true },
  password: { type: String, required: false },
  securityLevel: { type: Number, required: true },
  token: { type: String, required: true },
  cellphone: { type: String, required: false },
  steps: { type: [StepSchema], default: [] }
});

export const UserSessionModel = mongoose.model<UserSessionDocument>("UserSession", UserSessionSchema);