import mongoose, { Document, Schema } from 'mongoose';
import { MessageType } from '../types/enums';

export interface IMessage extends Document {
  conversation: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  content: string;
  type: MessageType;
  attachments?: Array<{ url: string; filename: string; mimeType: string; size: number; }>;
  readBy: Array<{ user: mongoose.Types.ObjectId; readAt: Date; }>;
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>({
  conversation: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  type: { type: String, enum: Object.values(MessageType), default: MessageType.TEXT },
  attachments: [{
    url: String,
    filename: String,
    mimeType: String,
    size: Number
  }],
  readBy: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    readAt: { type: Date, default: Date.now }
  }],
  isEdited: { type: Boolean, default: false }
}, { timestamps: true });

messageSchema.index({ conversation: 1, createdAt: 1 });
messageSchema.index({ sender: 1 });

export const Message = mongoose.model<IMessage>('Message', messageSchema);
