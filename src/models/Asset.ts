import mongoose, { Document, Schema } from 'mongoose';
import { AssetCondition } from '../types/enums';

export interface IAsset {
  home: mongoose.Types.ObjectId;
  room?: mongoose.Types.ObjectId | null;
  category: mongoose.Types.ObjectId;
  name: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  purchaseDate?: Date;
  purchasePrice?: number;
  currency?: string;
  condition: AssetCondition;
  expectedLifespanYears?: number;
  image?: string;
  notes?: string;
  warranty: { hasWarranty: boolean; startDate?: Date; endDate?: Date; provider?: string; coverage?: string; documentId?: mongoose.Types.ObjectId; };
  maintenance: { lastDate?: Date; nextDate?: Date; totalCost: number; totalRepairs: number; };
  documents: mongoose.Types.ObjectId[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type IAssetDocument = IAsset & Document;

const assetSchema = new Schema<IAsset>({
  home: { type: Schema.Types.ObjectId, ref: 'Home', required: true },
  room: { type: Schema.Types.ObjectId, ref: 'Room', default: null },
  category: { type: Schema.Types.ObjectId, ref: 'AssetCategory', required: true },
  name: { type: String, required: true },
  brand: { type: String },
  model: { type: String },
  serialNumber: { type: String },
  purchaseDate: { type: Date },
  purchasePrice: { type: Number },
  currency: { type: String, default: 'USD' },
  condition: { type: String, enum: Object.values(AssetCondition), default: AssetCondition.GOOD },
  expectedLifespanYears: { type: Number },
  image: { type: String },
  notes: { type: String },
  warranty: {
    hasWarranty: { type: Boolean, default: false },
    startDate: { type: Date },
    endDate: { type: Date },
    provider: { type: String },
    coverage: { type: String },
    documentId: { type: Schema.Types.ObjectId, ref: 'Document' }
  },
  maintenance: {
    lastDate: { type: Date },
    nextDate: { type: Date },
    totalCost: { type: Number, default: 0 },
    totalRepairs: { type: Number, default: 0 }
  },
  documents: [{ type: Schema.Types.ObjectId, ref: 'Document' }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

assetSchema.index({ home: 1 });
assetSchema.index({ home: 1, category: 1 });
assetSchema.index({ home: 1, condition: 1 });
assetSchema.index({ 'warranty.endDate': 1 });
assetSchema.index({ home: 1, room: 1 });

export const Asset = mongoose.model<IAsset>('Asset', assetSchema);
