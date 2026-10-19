import mongoose, { Document, Schema } from 'mongoose';
import { HomeType } from '../types/enums';

export interface IHome extends Document {
  owner: mongoose.Types.ObjectId;
  name: string;
  type: HomeType;
  address: { street: string; city: string; state: string; country: string; postalCode: string; coordinates?: { lat: number; lng: number } };
  ownershipType: string;
  numberOfRooms?: number;
  numberOfResidents?: number;
  area?: number;
  areaUnit?: string;
  images?: string[];
  notes?: string;
  healthScore?: { score: number; lastCalculated: Date; breakdown: { maintenance: number; warranty: number; assetCondition: number; documentCompleteness: number; repairHistory: number; expenseStability: number; safety: number; } };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const homeSchema = new Schema<IHome>({
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  type: { type: String, enum: Object.values(HomeType), required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: String, required: true },
    coordinates: { lat: Number, lng: Number }
  },
  ownershipType: { type: String },
  numberOfRooms: { type: Number },
  numberOfResidents: { type: Number },
  area: { type: Number },
  areaUnit: { type: String, default: 'sqm' },
  images: [{ type: String }],
  notes: { type: String },
  healthScore: {
    score: { type: Number, default: 100 },
    lastCalculated: { type: Date, default: Date.now },
    breakdown: {
      maintenance: { type: Number, default: 100 },
      warranty: { type: Number, default: 100 },
      assetCondition: { type: Number, default: 100 },
      documentCompleteness: { type: Number, default: 100 },
      repairHistory: { type: Number, default: 100 },
      expenseStability: { type: Number, default: 100 },
      safety: { type: Number, default: 100 },
    }
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

homeSchema.index({ owner: 1 });
homeSchema.index({ 'address.city': 1 });
homeSchema.index({ owner: 1, isActive: 1 });

export const Home = mongoose.model<IHome>('Home', homeSchema);
