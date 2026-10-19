import mongoose, { Document, Schema } from 'mongoose';
import { AIRole } from '../types/enums';

export interface IAIMessage extends Document {
  conversation: mongoose.Types.ObjectId;
  role: AIRole;
  content: string;
  functionCall?: { name: string; arguments: any; result?: any; };
  tokensUsed?: number;
  createdAt: Date;
}

const aiMessageSchema = new Schema<IAIMessage>({
  conversation: { type: Schema.Types.ObjectId, ref: 'AIConversation', required: true },
  role: { type: String, enum: Object.values(AIRole), required: true },
  content: { type: String, required: true },
  functionCall: {
    name: String,
    arguments: Schema.Types.Mixed,
    result: Schema.Types.Mixed
  },
  tokensUsed: { type: Number }
}, { timestamps: { createdAt: true, updatedAt: false } });

aiMessageSchema.index({ conversation: 1, createdAt: 1 });

export const AIMessage = mongoose.model<IAIMessage>('AIMessage', aiMessageSchema);
