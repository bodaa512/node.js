import mongoose, { Document, Schema } from 'mongoose';

export interface IAssetCategory extends Document {
  name: string;
  slug: string;
  icon?: string;
  parentCategory?: mongoose.Types.ObjectId | null;
  defaultMaintenanceSchedule: Array<{ task: string; intervalDays: number; description: string; }>;
  expectedLifespanYears?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const assetCategorySchema = new Schema<IAssetCategory>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  icon: { type: String },
  parentCategory: { type: Schema.Types.ObjectId, ref: 'AssetCategory', default: null },
  defaultMaintenanceSchedule: [{
    task: String,
    intervalDays: Number,
    description: String
  }],
  expectedLifespanYears: { type: Number },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

assetCategorySchema.index({ parentCategory: 1 });

export const AssetCategory = mongoose.model<IAssetCategory>('AssetCategory', assetCategorySchema);
