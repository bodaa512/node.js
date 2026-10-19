import mongoose, { Document, Schema } from 'mongoose';

export interface IMaintenanceHistory extends Document {
  task: mongoose.Types.ObjectId;
  home: mongoose.Types.ObjectId;
  asset?: mongoose.Types.ObjectId | null;
  action: 'created' | 'started' | 'completed' | 'skipped' | 'cancelled' | 'rescheduled';
  performedBy?: mongoose.Types.ObjectId;
  cost?: number;
  notes?: string;
  photos?: string[];
  serviceProvider?: mongoose.Types.ObjectId | null;
  date: Date;
  createdAt: Date;
}

const maintenanceHistorySchema = new Schema<IMaintenanceHistory>({
  task: { type: Schema.Types.ObjectId, ref: 'MaintenanceTask', required: true },
  home: { type: Schema.Types.ObjectId, ref: 'Home', required: true },
  asset: { type: Schema.Types.ObjectId, ref: 'Asset', default: null },
  action: { type: String, enum: ['created', 'started', 'completed', 'skipped', 'cancelled', 'rescheduled'], required: true },
  performedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  cost: { type: Number },
  notes: { type: String },
  photos: [{ type: String }],
  serviceProvider: { type: Schema.Types.ObjectId, ref: 'ProviderProfile', default: null },
  date: { type: Date, default: Date.now },
}, { timestamps: { createdAt: true, updatedAt: false } });

maintenanceHistorySchema.index({ task: 1 });
maintenanceHistorySchema.index({ home: 1, date: 1 });
maintenanceHistorySchema.index({ asset: 1, date: 1 });

export const MaintenanceHistory = mongoose.model<IMaintenanceHistory>('MaintenanceHistory', maintenanceHistorySchema);
