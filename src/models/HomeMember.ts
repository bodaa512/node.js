import mongoose, { Document, Schema } from 'mongoose';
import { HomeMemberRole, HomeMemberStatus } from '../types/enums';

export interface IHomeMember extends Document {
  home: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  role: HomeMemberRole;
  invitedBy?: mongoose.Types.ObjectId;
  invitedAt?: Date;
  joinedAt?: Date;
  status: HomeMemberStatus;
  permissions: { manageAssets: boolean; manageMaintenance: boolean; manageDocuments: boolean; manageExpenses: boolean; manageMembers: boolean; createRequests: boolean; viewOnly: boolean; };
  createdAt: Date;
  updatedAt: Date;
}

const homeMemberSchema = new Schema<IHomeMember>({
  home: { type: Schema.Types.ObjectId, ref: 'Home', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: Object.values(HomeMemberRole), required: true },
  invitedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  invitedAt: { type: Date },
  joinedAt: { type: Date },
  status: { type: String, enum: Object.values(HomeMemberStatus), default: HomeMemberStatus.PENDING },
  permissions: {
    manageAssets: { type: Boolean, default: false },
    manageMaintenance: { type: Boolean, default: false },
    manageDocuments: { type: Boolean, default: false },
    manageExpenses: { type: Boolean, default: false },
    manageMembers: { type: Boolean, default: false },
    createRequests: { type: Boolean, default: false },
    viewOnly: { type: Boolean, default: true }
  }
}, { timestamps: true });

homeMemberSchema.index({ home: 1, user: 1 }, { unique: true });
homeMemberSchema.index({ user: 1, status: 1 });
homeMemberSchema.index({ home: 1, role: 1 });

export const HomeMember = mongoose.model<IHomeMember>('HomeMember', homeMemberSchema);
