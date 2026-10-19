import { AuditService } from '../services/audit.service';
import { AuditAction } from '../types/enums';

/**
 * Creates an audit log asynchronously in the background.
 * Uses .catch to ensure errors are logged but do not crash the app.
 */
export const createAuditLog = (
  actor: string,
  action: AuditAction,
  entityType: string,
  entityId: string,
  description: string,
  metadata?: any,
  ip?: string,
  userAgent?: string
): void => {
  AuditService.log({ actor, action, entityType, entityId, description, metadata, ip, userAgent })
    .catch((error) => {
      console.error('Failed to create audit log:', error);
    });
};
