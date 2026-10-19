import mongoose, { Document, Schema } from 'mongoose';
import { ConversationType } from '../types/enums';

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[];
  type: ConversationType;
  relatedEntity?: { type: string; id: mongoose.Types.ObjectId; };
  lastMessage?: { content: string; sender: mongoose.Types.ObjectId; sentAt: Date; };
  unreadCount: Map<string, number>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  type: { type: String, enum: Object.values(ConversationType), required: true },
  relatedEntity: {
    type: { type: String },
    id: { type: Schema.Types.ObjectId }
  },
  lastMessage: {
    content: String,
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    sentAt: Date
  },
  unreadCount: { type: Map, of: Number, default: new Map() },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

conversationSchema.index({ participants: 1 });
conversationSchema.index({ 'lastMessage.sentAt': -1 });

export const Conversation = mongoose.model<IConversation>('Conversation', conversationSchema);
