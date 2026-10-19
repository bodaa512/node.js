import mongoose, { Document, Schema } from 'mongoose';
import { OfferStatus } from '../types/enums';

export interface IServiceOffer extends Document {
  serviceRequest: mongoose.Types.ObjectId;
  provider: mongoose.Types.ObjectId;
  price: number;
  currency: string;
  estimatedDuration: string;
  proposedDate: Date;
  message?: string;
  warrantyPeriod?: string;
  includedServices?: string[];
  status: OfferStatus;
  createdAt: Date;
  updatedAt: Date;
}

const serviceOfferSchema = new Schema<IServiceOffer>({
  serviceRequest: { type: Schema.Types.ObjectId, ref: 'ServiceRequest', required: true },
  provider: { type: Schema.Types.ObjectId, ref: 'ProviderProfile', required: true },
  price: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  estimatedDuration: { type: String, required: true },
  proposedDate: { type: Date, required: true },
  message: { type: String },
  warrantyPeriod: { type: String },
  includedServices: [{ type: String }],
  status: { type: String, enum: Object.values(OfferStatus), default: OfferStatus.PENDING }
}, { timestamps: true });

serviceOfferSchema.index({ serviceRequest: 1 });
serviceOfferSchema.index({ provider: 1 });
serviceOfferSchema.index({ serviceRequest: 1, status: 1 });

export const ServiceOffer = mongoose.model<IServiceOffer>('ServiceOffer', serviceOfferSchema);
