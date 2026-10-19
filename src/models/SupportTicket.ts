import mongoose, { Document, Schema } from 'mongoose';
import { TicketStatus, TicketCategory, NotificationPriority } from '../types/enums';

export interface ISupportTicket extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  category: TicketCategory;
  description: string;
  priority: NotificationPriority;
  status: TicketStatus;
  assignedTo?: mongoose.Types.ObjectId;
  attachments: string[];
  messages: Array<{
    sender: mongoose.Types.ObjectId;
    senderRole: string;
    content: string;
    attachments?: string[];
    createdAt: Date;
  }>;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const supportTicketSchema = new Schema<ISupportTicket>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    category: { type: String, enum: Object.values(TicketCategory), required: true },
    description: { type: String, required: true },
    priority: { type: String, enum: Object.values(NotificationPriority), default: NotificationPriority.MEDIUM },
    status: { type: String, enum: Object.values(TicketStatus), default: TicketStatus.OPEN },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    attachments: [{ type: String }],
    messages: [
      {
        sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        senderRole: { type: String, required: true },
        content: { type: String, required: true },
        attachments: [{ type: String }],
        createdAt: { type: Date, default: Date.now },
      },
    ],
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

supportTicketSchema.index({ user: 1 });
supportTicketSchema.index({ status: 1 });
supportTicketSchema.index({ assignedTo: 1, status: 1 });
supportTicketSchema.index({ priority: 1, status: 1 });

export const SupportTicket = mongoose.model<ISupportTicket>('SupportTicket', supportTicketSchema);
