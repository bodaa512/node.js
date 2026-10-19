export enum UserRole {
  HOMEOWNER = 'homeowner',
  RENTER = 'renter',
  PROVIDER = 'provider',
  PROPERTY_MANAGER = 'property_manager',
  ADMIN = 'admin',
}

export enum HomeType {
  APARTMENT = 'apartment',
  HOUSE = 'house',
  VILLA = 'villa',
  OFFICE = 'office',
  VACATION = 'vacation',
  RENTAL = 'rental',
  COMMERCIAL = 'commercial',
}

export enum OwnershipType {
  OWNED = 'owned',
  RENTED = 'rented',
  MANAGED = 'managed',
}

export enum RoomType {
  LIVING_ROOM = 'living_room',
  BEDROOM = 'bedroom',
  KITCHEN = 'kitchen',
  BATHROOM = 'bathroom',
  OFFICE = 'office',
  BALCONY = 'balcony',
  GARAGE = 'garage',
  STORAGE = 'storage',
  LAUNDRY = 'laundry',
  DINING = 'dining',
  ENTRANCE = 'entrance',
  GARDEN = 'garden',
  ROOF = 'roof',
  OTHER = 'other',
}

export enum AssetCondition {
  NEW = 'new',
  GOOD = 'good',
  FAIR = 'fair',
  NEEDS_ATTENTION = 'needs_attention',
  CRITICAL = 'critical',
  RETIRED = 'retired',
}

export enum DocumentType {
  INVOICE = 'invoice',
  RECEIPT = 'receipt',
  WARRANTY = 'warranty',
  CONTRACT = 'contract',
  INSURANCE = 'insurance',
  MANUAL = 'manual',
  MAINTENANCE_REPORT = 'maintenance_report',
  RENTAL_AGREEMENT = 'rental_agreement',
  OWNERSHIP = 'ownership',
  CERTIFICATE = 'certificate',
  INSPECTION = 'inspection',
  OTHER = 'other',
}

export enum OcrStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  SKIPPED = 'skipped',
}

export enum MaintenanceType {
  ONE_TIME = 'one_time',
  RECURRING = 'recurring',
  AI_GENERATED = 'ai_generated',
  MANUFACTURER = 'manufacturer',
}

export enum MaintenancePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum MaintenanceStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  OVERDUE = 'overdue',
  SKIPPED = 'skipped',
  CANCELLED = 'cancelled',
}

export enum ExpenseCategory {
  ELECTRICITY = 'electricity',
  WATER = 'water',
  GAS = 'gas',
  INTERNET = 'internet',
  RENT = 'rent',
  INSURANCE = 'insurance',
  REPAIRS = 'repairs',
  MAINTENANCE = 'maintenance',
  CLEANING = 'cleaning',
  FURNITURE = 'furniture',
  RENOVATIONS = 'renovations',
  SUBSCRIPTIONS = 'subscriptions',
  SECURITY = 'security',
  MISCELLANEOUS = 'miscellaneous',
}

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  BANK_TRANSFER = 'bank_transfer',
  ONLINE = 'online',
  OTHER = 'other',
}

export enum BillingFrequency {
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  SEMI_ANNUAL = 'semi_annual',
  ANNUAL = 'annual',
}

export enum ServiceCategory {
  PLUMBING = 'plumbing',
  ELECTRICITY = 'electricity',
  AC = 'ac',
  APPLIANCE_REPAIR = 'appliance_repair',
  CLEANING = 'cleaning',
  PAINTING = 'painting',
  CARPENTRY = 'carpentry',
  LOCKSMITH = 'locksmith',
  INTERNET = 'internet',
  HOME_INSPECTION = 'home_inspection',
  OTHER = 'other',
}

export enum RequestUrgency {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  EMERGENCY = 'emergency',
}

export enum ServiceRequestStatus {
  REQUESTED = 'requested',
  REVIEWING = 'reviewing',
  OFFERS_RECEIVED = 'offers_received',
  PROVIDER_SELECTED = 'provider_selected',
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  REVIEWED = 'reviewed',
  CANCELLED = 'cancelled',
}

export enum OfferStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
  EXPIRED = 'expired',
}

export enum VerificationStatus {
  UNVERIFIED = 'unverified',
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended',
}

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

export enum ConversationType {
  USER_PROVIDER = 'user_provider',
  OWNER_TENANT = 'owner_tenant',
  ADMIN_USER = 'admin_user',
  SUPPORT = 'support',
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  SYSTEM = 'system',
}

export enum NotificationType {
  MAINTENANCE = 'maintenance',
  WARRANTY = 'warranty',
  APPOINTMENT = 'appointment',
  SERVICE = 'service',
  PAYMENT = 'payment',
  SUBSCRIPTION = 'subscription',
  DOCUMENT = 'document',
  SYSTEM = 'system',
  SECURITY = 'security',
  AI = 'ai',
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum CalendarEventType {
  MAINTENANCE = 'maintenance',
  APPOINTMENT = 'appointment',
  WARRANTY_EXPIRY = 'warranty_expiry',
  RENT_PAYMENT = 'rent_payment',
  SUBSCRIPTION_RENEWAL = 'subscription_renewal',
  INSURANCE_RENEWAL = 'insurance_renewal',
  INSPECTION = 'inspection',
  CUSTOM = 'custom',
}

export enum HomeMemberRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
  VIEWER = 'viewer',
}

export enum HomeMemberStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  REMOVED = 'removed',
}

export enum SubscriptionPlan {
  FREE = 'free',
  PREMIUM = 'premium',
  PROPERTY_PRO = 'property_pro',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  PAST_DUE = 'past_due',
  CANCELLED = 'cancelled',
  TRIALING = 'trialing',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PaymentType {
  SUBSCRIPTION = 'subscription',
  SERVICE = 'service',
  PROVIDER_SUBSCRIPTION = 'provider_subscription',
}

export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  WAITING_FOR_USER = 'waiting_for_user',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export enum TicketCategory {
  BILLING = 'billing',
  TECHNICAL = 'technical',
  ACCOUNT = 'account',
  PROVIDER = 'provider',
  FEATURE = 'feature',
  OTHER = 'other',
}

export enum AuditAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LOGIN = 'login',
  LOGOUT = 'logout',
  VERIFY = 'verify',
  APPROVE = 'approve',
  REJECT = 'reject',
  UPLOAD = 'upload',
  DOWNLOAD = 'download',
  INVITE = 'invite',
  PAYMENT = 'payment',
  SETTINGS_CHANGE = 'settings_change',
}

export enum BlogStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export enum AchievementType {
  MAINTENANCE_MASTER = 'maintenance_master',
  DOCUMENT_ORGANIZER = 'document_organizer',
  BUDGET_SAVER = 'budget_saver',
  WARRANTY_GUARDIAN = 'warranty_guardian',
  HOME_MANAGER = 'home_manager',
  FIRST_HOME = 'first_home',
  FIRST_ASSET = 'first_asset',
  FIRST_MAINTENANCE = 'first_maintenance',
  REVIEW_WRITER = 'review_writer',
}

export enum TenantStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  ENDED = 'ended',
  EVICTED = 'evicted',
}

export enum PropertyType {
  BUILDING = 'building',
  COMPLEX = 'complex',
  SINGLE = 'single',
}

export enum UnitStatus {
  VACANT = 'vacant',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance',
}

export enum ProviderPlan {
  FREE = 'free',
  PROFESSIONAL = 'professional',
  FEATURED = 'featured',
}

export enum PlanType {
  USER = 'user',
  PROVIDER = 'provider',
}

export enum AIRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}
