import mongoose, { Document, Schema } from 'mongoose';
import { BillingFrequency } from '../types/enums';

export interface ISubscriptionTracker extends Document {
  home: mongoose.Types.ObjectId;
  name: string;
  category: string;
  provider: string;
  amount: number;
  currency: string;
  billingFrequency: BillingFrequency;
  startDate: Date;
  nextBillingDate: Date;
  renewalDate?: Date;
  autoRenew: boolean;
  isActive: boolean;
  notes?: string;
  lastUsed?: Date;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionTrackerSchema = new Schema<ISubscriptionTracker>({
  home: { type: Schema.Types.ObjectId, ref: 'Home', required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  provider: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  billingFrequency: { type: String, enum: Object.values(BillingFrequency), required: true },
  startDate: { type: Date, required: true },
  nextBillingDate: { type: Date, required: true },
  renewalDate: { type: Date },
  autoRenew: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  notes: { type: String },
  lastUsed: { type: Date },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

subscriptionTrackerSchema.index({ home: 1 });
subscriptionTrackerSchema.index({ home: 1, isActive: 1 });
subscriptionTrackerSchema.index({ nextBillingDate: 1 });

export const SubscriptionTracker = mongoose.model<ISubscriptionTracker>('SubscriptionTracker', subscriptionTrackerSchema);
