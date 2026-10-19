import mongoose, { Document, Schema } from 'mongoose';
import { CalendarEventType } from '../types/enums';

export interface ICalendarEvent extends Document {
  home: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  type: CalendarEventType;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
  recurring?: { enabled: boolean; pattern: string };
  relatedEntity?: { type: string; id: mongoose.Types.ObjectId };
  color?: string;
  reminders: Array<{ type: string; minutesBefore: number }>;
  createdAt: Date;
  updatedAt: Date;
}

const calendarEventSchema = new Schema<ICalendarEvent>(
  {
    home: { type: Schema.Types.ObjectId, ref: 'Home', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: Object.values(CalendarEventType), required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    allDay: { type: Boolean, default: false },
    recurring: {
      enabled: { type: Boolean, default: false },
      pattern: { type: String },
    },
    relatedEntity: {
      type: { type: String },
      id: { type: Schema.Types.ObjectId },
    },
    color: { type: String },
    reminders: [
      {
        type: { type: String, enum: ['email', 'push'] },
        minutesBefore: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

calendarEventSchema.index({ home: 1, startDate: 1 });
calendarEventSchema.index({ user: 1, startDate: 1 });

export const CalendarEvent = mongoose.model<ICalendarEvent>('CalendarEvent', calendarEventSchema);
