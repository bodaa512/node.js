import mongoose, { Document, Schema } from 'mongoose';

export interface IAIConversation extends Document {
  user: mongoose.Types.ObjectId;
  home: mongoose.Types.ObjectId;
  title: string;
  messageCount: number;
  lastMessageAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const aiConversationSchema = new Schema<IAIConversation>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  home: { type: Schema.Types.ObjectId, ref: 'Home', required: true },
  title: { type: String, required: true },
  messageCount: { type: Number, default: 0 },
  lastMessageAt: { type: Date, default: Date.now }
}, { timestamps: true });

aiConversationSchema.index({ user: 1, home: 1 });
aiConversationSchema.index({ user: 1, lastMessageAt: -1 });

export const AIConversation = mongoose.model<IAIConversation>('AIConversation', aiConversationSchema);
