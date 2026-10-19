import mongoose, { Document, Schema } from 'mongoose';
import { MaintenanceType, MaintenancePriority, MaintenanceStatus } from '../types/enums';

export interface IMaintenanceTask extends Document {
  home: mongoose.Types.ObjectId;
  asset?: mongoose.Types.ObjectId | null;
  room?: mongoose.Types.ObjectId | null;
  title: string;
  description: string;
  type: MaintenanceType;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  recurring: { enabled: boolean; intervalDays?: number; intervalType?: string; intervalValue?: number; lastCompleted?: Date; nextDue?: Date; };
  dueDate?: Date;
  completedDate?: Date;
  completedBy?: mongoose.Types.ObjectId;
  estimatedCost?: number;
  actualCost?: number;
  serviceRequest?: mongoose.Types.ObjectId | null;
  notes?: string;
  photos?: string[];
  isAIRecommended: boolean;
  aiRecommendationReason?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const maintenanceTaskSchema = new Schema<IMaintenanceTask>({
  home: { type: Schema.Types.ObjectId, ref: 'Home', required: true },
  asset: { type: Schema.Types.ObjectId, ref: 'Asset', default: null },
  room: { type: Schema.Types.ObjectId, ref: 'Room', default: null },
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: Object.values(MaintenanceType), required: true },
  priority: { type: String, enum: Object.values(MaintenancePriority), default: MaintenancePriority.MEDIUM },
  status: { type: String, enum: Object.values(MaintenanceStatus), default: MaintenanceStatus.PENDING },
  recurring: {
    enabled: { type: Boolean, default: false },
    intervalDays: Number,
    intervalType: String,
    intervalValue: Number,
    lastCompleted: Date,
    nextDue: Date
  },
  dueDate: { type: Date },
  completedDate: { type: Date },
  completedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  estimatedCost: { type: Number },
  actualCost: { type: Number },
  serviceRequest: { type: Schema.Types.ObjectId, ref: 'ServiceRequest', default: null },
  notes: { type: String },
  photos: [{ type: String }],
  isAIRecommended: { type: Boolean, default: false },
  aiRecommendationReason: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

maintenanceTaskSchema.index({ home: 1, status: 1 });
maintenanceTaskSchema.index({ home: 1, dueDate: 1 });
maintenanceTaskSchema.index({ asset: 1 });
maintenanceTaskSchema.index({ status: 1, dueDate: 1 });
maintenanceTaskSchema.index({ 'recurring.nextDue': 1 });

export const MaintenanceTask = mongoose.model<IMaintenanceTask>('MaintenanceTask', maintenanceTaskSchema);
