import mongoose, { Document, Schema } from 'mongoose';
import { TenantStatus } from '../types/enums';

export interface ITenant extends Document {
  user: mongoose.Types.ObjectId;
  property: mongoose.Types.ObjectId;
  status: TenantStatus;
  leaseStart: Date;
  leaseEnd: Date;
  rentAmount: number;
  currency: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const tenantSchema = new Schema<ITenant>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  property: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
  status: { type: String, enum: Object.values(TenantStatus), default: TenantStatus.ACTIVE },
  leaseStart: { type: Date, required: true },
  leaseEnd: { type: Date, required: true },
  rentAmount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  notes: { type: String }
}, { timestamps: true });

tenantSchema.index({ user: 1 });
tenantSchema.index({ property: 1 });
tenantSchema.index({ property: 1, status: 1 });

export const Tenant = mongoose.model<ITenant>('Tenant', tenantSchema);
