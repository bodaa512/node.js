import mongoose, { Document, Schema } from 'mongoose';
import { AppointmentStatus } from '../types/enums';

export interface IAppointment extends Document {
  home: mongoose.Types.ObjectId;
  serviceRequest: mongoose.Types.ObjectId;
  customer: mongoose.Types.ObjectId;
  provider: mongoose.Types.ObjectId;
  date: Date;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes?: string;
  address?: string;
  reminderSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>({
  home: { type: Schema.Types.ObjectId, ref: 'Home', required: true },
  serviceRequest: { type: Schema.Types.ObjectId, ref: 'ServiceRequest', required: true },
  customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: Schema.Types.ObjectId, ref: 'ProviderProfile', required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  status: { type: String, enum: Object.values(AppointmentStatus), default: AppointmentStatus.SCHEDULED },
  notes: { type: String },
  address: { type: String },
  reminderSent: { type: Boolean, default: false }
}, { timestamps: true });

appointmentSchema.index({ customer: 1, date: 1 });
appointmentSchema.index({ provider: 1, date: 1 });
appointmentSchema.index({ date: 1, status: 1 });
appointmentSchema.index({ home: 1, date: 1 });

export const Appointment = mongoose.model<IAppointment>('Appointment', appointmentSchema);
