import mongoose, { Document, Schema } from 'mongoose';
import { PaymentType } from '../types/enums';

export interface IPayment extends Document {
  user: mongoose.Types.ObjectId;
  stripePaymentIntentId: string;
  type: PaymentType;
  amount: number;
  currency: string;
  status: string;
  relatedEntity?: { type: string; id: mongoose.Types.ObjectId; };
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  stripePaymentIntentId: { type: String, required: true },
  type: { type: String, enum: Object.values(PaymentType), required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  status: { type: String, required: true },
  relatedEntity: {
    type: { type: String },
    id: { type: Schema.Types.ObjectId }
  }
}, { timestamps: true });

paymentSchema.index({ user: 1 });
paymentSchema.index({ stripePaymentIntentId: 1 });
paymentSchema.index({ user: 1, type: 1, createdAt: -1 });

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema);
