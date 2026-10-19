import { ServiceRequestStatus, MaintenanceStatus } from '../types/enums';

export const VALID_SERVICE_REQUEST_TRANSITIONS: Record<ServiceRequestStatus, ServiceRequestStatus[]> = {
  [ServiceRequestStatus.REQUESTED]: [ServiceRequestStatus.REVIEWING, ServiceRequestStatus.CANCELLED],
  [ServiceRequestStatus.REVIEWING]: [ServiceRequestStatus.OFFERS_RECEIVED, ServiceRequestStatus.CANCELLED],
  [ServiceRequestStatus.OFFERS_RECEIVED]: [ServiceRequestStatus.PROVIDER_SELECTED, ServiceRequestStatus.CANCELLED],
  [ServiceRequestStatus.PROVIDER_SELECTED]: [ServiceRequestStatus.SCHEDULED, ServiceRequestStatus.CANCELLED],
  [ServiceRequestStatus.SCHEDULED]: [ServiceRequestStatus.IN_PROGRESS, ServiceRequestStatus.CANCELLED],
  [ServiceRequestStatus.IN_PROGRESS]: [ServiceRequestStatus.COMPLETED, ServiceRequestStatus.CANCELLED],
  [ServiceRequestStatus.COMPLETED]: [ServiceRequestStatus.REVIEWED],
  [ServiceRequestStatus.REVIEWED]: [],
  [ServiceRequestStatus.CANCELLED]: []
};

export const VALID_MAINTENANCE_TRANSITIONS: Record<MaintenanceStatus, MaintenanceStatus[]> = {
  [MaintenanceStatus.PENDING]: [MaintenanceStatus.IN_PROGRESS, MaintenanceStatus.OVERDUE, MaintenanceStatus.SKIPPED, MaintenanceStatus.CANCELLED],
  [MaintenanceStatus.IN_PROGRESS]: [MaintenanceStatus.COMPLETED, MaintenanceStatus.OVERDUE, MaintenanceStatus.CANCELLED],
  [MaintenanceStatus.COMPLETED]: [],
  [MaintenanceStatus.OVERDUE]: [MaintenanceStatus.IN_PROGRESS, MaintenanceStatus.SKIPPED, MaintenanceStatus.CANCELLED],
  [MaintenanceStatus.SKIPPED]: [],
  [MaintenanceStatus.CANCELLED]: []
};
