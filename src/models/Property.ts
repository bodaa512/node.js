import mongoose, { Document, Schema } from 'mongoose';
import { PropertyType, UnitStatus } from '../types/enums';

export interface IProperty extends Document {
  manager: mongoose.Types.ObjectId;
  name: string;
  type: PropertyType;
  address: {
    street: string;
    city: string;
    state?: string;
    country: string;
  };
  units: Array<{
    unitNumber: string;
    floor?: number;
    bedrooms?: number;
    bathrooms?: number;
    area?: number;
    status: UnitStatus;
    rent?: number;
    tenant?: mongoose.Types.ObjectId;
  }>;
  totalUnits: number;
  occupiedUnits: number;
  images: string[];
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const propertySchema = new Schema<IProperty>(
  {
    manager: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    type: { type: String, enum: Object.values(PropertyType), default: PropertyType.BUILDING },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String },
      country: { type: String, required: true },
    },
    units: [
      {
        unitNumber: { type: String, required: true },
        floor: { type: Number },
        bedrooms: { type: Number },
        bathrooms: { type: Number },
        area: { type: Number },
        status: { type: String, enum: Object.values(UnitStatus), default: UnitStatus.VACANT },
        rent: { type: Number },
        tenant: { type: Schema.Types.ObjectId, ref: 'Tenant' },
      },
    ],
    totalUnits: { type: Number, default: 0 },
    occupiedUnits: { type: Number, default: 0 },
    images: [{ type: String }],
    notes: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

propertySchema.index({ manager: 1 });
propertySchema.index({ 'address.city': 1 });

export const Property = mongoose.model<IProperty>('Property', propertySchema);
