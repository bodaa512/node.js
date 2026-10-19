import mongoose, { Document, Schema } from 'mongoose';
import { AchievementType } from '../types/enums';

export interface IAchievement extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  type: AchievementType;
  points: number;
  awardedAt: Date;
  description?: string;
}

const achievementSchema = new Schema<IAchievement>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  type: { type: String, enum: Object.values(AchievementType), required: true },
  points: { type: Number, default: 0 },
  awardedAt: { type: Date, default: Date.now },
  description: { type: String }
});

achievementSchema.index({ user: 1 });
achievementSchema.index({ user: 1, type: 1 }, { unique: true });

export const Achievement = mongoose.model<IAchievement>('Achievement', achievementSchema);
