import mongoose, { Document, Schema } from 'mongoose';
import { PlanType } from '../types/enums';

export interface IPlan extends Document {
  name: string;
  slug: string;
  type: PlanType;
  price: number;
  currency: string;
  features: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const planSchema = new Schema<IPlan>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  type: { type: String, enum: Object.values(PlanType), required: true },
  price: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  features: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

planSchema.index({ type: 1, isActive: 1 });

export const Plan = mongoose.model<IPlan>('Plan', planSchema);
