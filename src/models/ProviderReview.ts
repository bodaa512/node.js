import mongoose, { Document, Schema } from 'mongoose';

export interface IProviderReview extends Document {
  provider: mongoose.Types.ObjectId;
  reviewer: mongoose.Types.ObjectId;
  serviceRequest: mongoose.Types.ObjectId;
  ratings: { professionalism: number; punctuality: number; quality: number; communication: number; value: number; overall: number; };
  comment?: string;
  photos?: string[];
  response?: { text: string; respondedAt: Date; };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const providerReviewSchema = new Schema<IProviderReview>({
  provider: { type: Schema.Types.ObjectId, ref: 'ProviderProfile', required: true },
  reviewer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  serviceRequest: { type: Schema.Types.ObjectId, ref: 'ServiceRequest', required: true },
  ratings: {
    professionalism: { type: Number, min: 1, max: 5, required: true },
    punctuality: { type: Number, min: 1, max: 5, required: true },
    quality: { type: Number, min: 1, max: 5, required: true },
    communication: { type: Number, min: 1, max: 5, required: true },
    value: { type: Number, min: 1, max: 5, required: true },
    overall: { type: Number, min: 1, max: 5, required: true }
  },
  comment: { type: String },
  photos: [{ type: String }],
  response: {
    text: String,
    respondedAt: Date
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

providerReviewSchema.index({ provider: 1 });
providerReviewSchema.index({ reviewer: 1 });
providerReviewSchema.index({ provider: 1, createdAt: 1 });

export const ProviderReview = mongoose.model<IProviderReview>('ProviderReview', providerReviewSchema);
