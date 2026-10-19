import { AuditAction } from '../types/enums';
import mongoose, { Schema, Document } from 'mongoose';

// Since we need an AuditLog model to implement this service,
// we'll define a quick inline model here for the time being, 
// or assume it will be properly separated later.
export interface IAuditLog extends Document {
  actor: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  description: string;
  metadata?: Record<string, any>;
  ip?: string;
  userAgent?: string;
  createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>({
  actor: { type: String, required: true, index: true },
  action: { type: String, enum: Object.values(AuditAction), required: true, index: true },
  entityType: { type: String, required: true, index: true },
  entityId: { type: String, required: true, index: true },
  description: { type: String, required: true },
  metadata: { type: Schema.Types.Mixed },
  ip: { type: String },
  userAgent: { type: String },
  createdAt: { type: Date, default: Date.now, index: -1 }
});

const AuditLog = mongoose.model<IAuditLog>('AuditLog', auditLogSchema);

export class AuditService {
  /**
   * Log an audit event
   */
  static async log(data: {
    actor: string;
    action: AuditAction;
    entityType: string;
    entityId: string;
    description: string;
    metadata?: any;
    ip?: string;
    userAgent?: string;
  }): Promise<IAuditLog> {
    return await AuditLog.create(data);
  }

  /**
   * Search audit logs with filters and pagination
   */
  static async search(
    filters: Record<string, any>,
    pagination: { page?: number; limit?: number } = {}
  ): Promise<{ data: IAuditLog[]; total: number }> {
    const page = pagination.page || 1;
    const limit = pagination.limit || 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      AuditLog.find(filters).sort({ createdAt: -1 }).skip(skip).limit(limit),
      AuditLog.countDocuments(filters),
    ]);

    return { data, total };
  }

  /**
   * Get logs for a specific entity
   */
  static async getByEntity(entityType: string, entityId: string): Promise<IAuditLog[]> {
    return await AuditLog.find({ entityType, entityId }).sort({ createdAt: -1 });
  }

  /**
   * Get logs performed by a specific actor
   */
  static async getByActor(actorId: string, pagination: { page?: number; limit?: number } = {}): Promise<{ data: IAuditLog[]; total: number }> {
    return await this.search({ actor: actorId }, pagination);
  }
}
