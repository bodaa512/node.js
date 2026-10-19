import mongoose, { Document, Schema } from 'mongoose';
import { ServiceCategory, RequestUrgency, ServiceRequestStatus } from '../types/enums';

export interface IServiceRequest extends Document {
  home: mongoose.Types.ObjectId;
  requestedBy: mongoose.Types.ObjectId;
  category: ServiceCategory;
  title: string;
  description: string;
  urgency: RequestUrgency;
  status: ServiceRequestStatus;
  relatedAsset?: mongoose.Types.ObjectId | null;
  relatedRoom?: mongoose.Types.ObjectId | null;
  preferredDate?: Date;
  preferredTime?: string;
  estimatedBudget?: number;
  photos?: string[];
  selectedOffer?: mongoose.Types.ObjectId | null;
  selectedProvider?: mongoose.Types.ObjectId | null;
  statusHistory: Array<{ status: ServiceRequestStatus; changedBy: mongoose.Types.ObjectId; changedAt: Date; notes?: string; }>;
  completionReport?: { summary: string; photos: string[]; cost: number; completedAt: Date; };
  createdAt: Date;
  updatedAt: Date;
}

const serviceRequestSchema = new Schema<IServiceRequest>({
  home: { type: Schema.Types.ObjectId, ref: 'Home', required: true },
  requestedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, enum: Object.values(ServiceCategory), required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  urgency: { type: String, enum: Object.values(RequestUrgency), required: true },
  status: { type: String, enum: Object.values(ServiceRequestStatus), default: ServiceRequestStatus.REQUESTED },
  relatedAsset: { type: Schema.Types.ObjectId, ref: 'Asset', default: null },
  relatedRoom: { type: Schema.Types.ObjectId, ref: 'Room', default: null },
  preferredDate: { type: Date },
  preferredTime: { type: String },
  estimatedBudget: { type: Number },
  photos: [{ type: String }],
  selectedOffer: { type: Schema.Types.ObjectId, ref: 'ServiceOffer', default: null },
  selectedProvider: { type: Schema.Types.ObjectId, ref: 'ProviderProfile', default: null },
  statusHistory: [{
    status: { type: String, enum: Object.values(ServiceRequestStatus) },
    changedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    changedAt: { type: Date, default: Date.now },
    notes: String
  }],
  completionReport: {
    summary: String,
    photos: [String],
    cost: Number,
    completedAt: Date
  }
}, { timestamps: true });

serviceRequestSchema.index({ home: 1, status: 1 });
serviceRequestSchema.index({ requestedBy: 1 });
serviceRequestSchema.index({ status: 1, category: 1 });
serviceRequestSchema.index({ createdAt: 1 });

export const ServiceRequest = mongoose.model<IServiceRequest>('ServiceRequest', serviceRequestSchema);
