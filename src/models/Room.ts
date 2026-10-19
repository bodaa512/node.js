import mongoose, { Document, Schema } from 'mongoose';
import { RoomType } from '../types/enums';

export interface IRoom extends Document {
  home: mongoose.Types.ObjectId;
  name: string;
  type: RoomType;
  floor?: number;
  area?: number;
  image?: string;
  notes?: string;
  assetCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const roomSchema = new Schema<IRoom>({
  home: { type: Schema.Types.ObjectId, ref: 'Home', required: true },
  name: { type: String, required: true },
  type: { type: String, enum: Object.values(RoomType), required: true },
  floor: { type: Number },
  area: { type: Number },
  image: { type: String },
  notes: { type: String },
  assetCount: { type: Number, default: 0 }
}, { timestamps: true });

roomSchema.index({ home: 1 });

export const Room = mongoose.model<IRoom>('Room', roomSchema);
