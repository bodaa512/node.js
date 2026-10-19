import mongoose, { Document, Schema } from 'mongoose';
import { ServiceCategory, VerificationStatus } from '../types/enums';

export interface IProviderProfile extends Document {
  user: mongoose.Types.ObjectId;
  businessName: string;
  description?: string;
  categories: ServiceCategory[];
  serviceAreas: Array<{ city: string; state: string; country: string; }>;
  experience: number;
  verificationStatus: VerificationStatus;
  verificationDocuments: Array<{ type: string; url: string; uploadedAt: Date; }>;
  rating: { average: number; count: number; breakdown: { professionalism: number; punctuality: number; quality: number; communication: number; value: number; } };
  completedJobs: number;
  portfolio: Array<{ image: string; description: string; }>;
  availability: { workingDays: number[]; workingHours: { start: string; end: string; } };
  subscription: { plan: string; status: string; };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const providerProfileSchema = new Schema<IProviderProfile>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  businessName: { type: String, required: true },
  description: { type: String },
  categories: [{ type: String, enum: Object.values(ServiceCategory) }],
  serviceAreas: [{
    city: String,
    state: String,
    country: String
  }],
  experience: { type: Number, default: 0 },
  verificationStatus: { type: String, enum: Object.values(VerificationStatus), default: VerificationStatus.UNVERIFIED },
  verificationDocuments: [{
    type: { type: String },
    url: { type: String },
    uploadedAt: { type: Date, default: Date.now }
  }],
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
    breakdown: {
      professionalism: { type: Number, default: 0 },
      punctuality: { type: Number, default: 0 },
      quality: { type: Number, default: 0 },
      communication: { type: Number, default: 0 },
      value: { type: Number, default: 0 }
    }
  },
  completedJobs: { type: Number, default: 0 },
  portfolio: [{
    image: String,
    description: String
  }],
  availability: {
    workingDays: [{ type: Number }],
    workingHours: {
      start: String,
      end: String
    }
  },
  subscription: {
    plan: { type: String, default: 'free' },
    status: { type: String, default: 'active' }
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

providerProfileSchema.index({ user: 1 }, { unique: true });
providerProfileSchema.index({ categories: 1 });
providerProfileSchema.index({ 'serviceAreas.city': 1 });
providerProfileSchema.index({ verificationStatus: 1 });
providerProfileSchema.index({ 'rating.average': 1 });
providerProfileSchema.index({ categories: 1, 'serviceAreas.city': 1, verificationStatus: 1 });

export const ProviderProfile = mongoose.model<IProviderProfile>('ProviderProfile', providerProfileSchema);
