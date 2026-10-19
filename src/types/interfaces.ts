import { Document, Types } from 'mongoose';
import {
  UserRole,
  HomeType,
  OwnershipType,
  RoomType,
  AssetCondition,
  DocumentType,
  OcrStatus,
  MaintenanceType,
  MaintenancePriority,
  MaintenanceStatus,
  ExpenseCategory,
  PaymentMethod,
  BillingFrequency,
  ServiceCategory,
  RequestUrgency,
  ServiceRequestStatus,
  OfferStatus,
  VerificationStatus,
  AppointmentStatus,
  ConversationType,
  MessageType,
  NotificationType,
  NotificationPriority,
  CalendarEventType,
  HomeMemberRole,
  HomeMemberStatus,
  SubscriptionPlan,
  SubscriptionStatus,
  PaymentStatus,
  PaymentType,
  TicketStatus,
  TicketCategory,
  AuditAction,
  BlogStatus,
  AchievementType,
  TenantStatus,
  PropertyType,
  UnitStatus,
  ProviderPlan,
  PlanType,
  AIRole,
} from './enums';

// ============================================
// API Interfaces
// ============================================
export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface IPagination {
  page: number;
  limit: number;
  skip: number;
  sort?: Record<string, 1 | -1>;
}

export interface IPaginatedMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface IPaginatedResponse<T> {
  items: T[];
  pagination: IPaginatedMeta;
}

// ============================================
// Auth & Context
// ============================================
export interface ITokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface IHomePermissions {
  manageAssets: boolean;
  manageMaintenance: boolean;
  manageDocuments: boolean;
  manageExpenses: boolean;
  manageMembers: boolean;
  createRequests: boolean;
  viewOnly: boolean;
}

export interface IHomeAccessContext {
  homeId: string;
  userId: string;
  role: HomeMemberRole;
  permissions: IHomePermissions;
}

// ============================================
// Document Interfaces
// ============================================
export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  emailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  refreshTokens: string[];
  subscription: {
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    currentPeriodStart?: Date;
    currentPeriodEnd?: Date;
  };
  preferences: {
    language: string;
    currency: string;
    timezone: string;
    notifications: {
      email: boolean;
      push: boolean;
      maintenance: boolean;
      warranty: boolean;
      expenses: boolean;
    };
  };
  onboarding: {
    completed: boolean;
    currentStep: number;
    completedSteps: string[];
  };
  lastLogin?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

export interface IHome extends Document {
  _id: Types.ObjectId;
  owner: Types.ObjectId;
  name: string;
  type: HomeType;
  address: {
    street: string;
    city: string;
    state?: string;
    country: string;
    postalCode?: string;
    coordinates?: { lat: number; lng: number };
  };
  ownershipType: OwnershipType;
  numberOfRooms: number;
  numberOfResidents: number;
  area?: number;
  areaUnit?: 'sqft' | 'sqm';
  images: string[];
  notes?: string;
  healthScore: {
    score: number;
    lastCalculated: Date;
    breakdown: {
      maintenance: number;
      warranty: number;
      assetCondition: number;
      documentCompleteness: number;
      repairHistory: number;
      expenseStability: number;
      safety: number;
    };
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IHomeMember extends Document {
  _id: Types.ObjectId;
  home: Types.ObjectId;
  user: Types.ObjectId;
  role: HomeMemberRole;
  invitedBy?: Types.ObjectId;
  invitedAt: Date;
  joinedAt?: Date;
  status: HomeMemberStatus;
  permissions: IHomePermissions;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRoom extends Document {
  _id: Types.ObjectId;
  home: Types.ObjectId;
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

export interface IAssetCategory extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  icon?: string;
  parentCategory?: Types.ObjectId;
  defaultMaintenanceSchedule: Array<{
    task: string;
    intervalDays: number;
    description?: string;
  }>;
  expectedLifespanYears: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAsset {
  _id: Types.ObjectId;
  home: Types.ObjectId;
  room?: Types.ObjectId;
  category?: Types.ObjectId;
  name: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  purchaseDate?: Date;
  purchasePrice?: number;
  currency: string;
  condition: AssetCondition;
  expectedLifespanYears?: number;
  image?: string;
  notes?: string;
  warranty: {
    hasWarranty: boolean;
    startDate?: Date;
    endDate?: Date;
    provider?: string;
    coverage?: string;
    documentId?: Types.ObjectId;
  };
  maintenance: {
    lastDate?: Date;
    nextDate?: Date;
    totalCost: number;
    totalRepairs: number;
  };
  documents: Types.ObjectId[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type IAssetDocument = IAsset & Document;

export interface IDocument extends Document {
  _id: Types.ObjectId;
  home: Types.ObjectId;
  asset?: Types.ObjectId;
  uploadedBy: Types.ObjectId;
  filename: string;
  originalName: string;
  type: DocumentType;
  mimeType: string;
  size: number;
  storageUrl: string;
  thumbnailUrl?: string;
  expirationDate?: Date;
  extractedData: {
    documentType?: string;
    company?: string;
    product?: string;
    model?: string;
    purchaseDate?: Date;
    price?: number;
    currency?: string;
    warrantyDuration?: string;
    warrantyExpiration?: Date;
    contractExpiration?: Date;
    invoiceNumber?: string;
    importantDates?: Array<{ label: string; date: Date }>;
    rawText?: string;
    confidence?: number;
  };
  ocrStatus: OcrStatus;
  tags: string[];
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMaintenanceTask extends Document {
  _id: Types.ObjectId;
  home: Types.ObjectId;
  asset?: Types.ObjectId;
  room?: Types.ObjectId;
  title: string;
  description?: string;
  type: MaintenanceType;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  recurring: {
    enabled: boolean;
    intervalDays?: number;
    intervalType?: 'days' | 'weeks' | 'months' | 'years';
    intervalValue?: number;
    lastCompleted?: Date;
    nextDue?: Date;
  };
  dueDate?: Date;
  completedDate?: Date;
  completedBy?: Types.ObjectId;
  estimatedCost?: number;
  actualCost?: number;
  serviceRequest?: Types.ObjectId;
  notes?: string;
  photos: string[];
  isAIRecommended: boolean;
  aiRecommendationReason?: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IExpense extends Document {
  _id: Types.ObjectId;
  home: Types.ObjectId;
  asset?: Types.ObjectId;
  category: ExpenseCategory;
  amount: number;
  currency: string;
  date: Date;
  paymentMethod: PaymentMethod;
  description?: string;
  receipt?: Types.ObjectId;
  isRecurring: boolean;
  recurringSubscription?: Types.ObjectId;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubscriptionTracker extends Document {
  _id: Types.ObjectId;
  home: Types.ObjectId;
  name: string;
  category: string;
  provider?: string;
  amount: number;
  currency: string;
  billingFrequency: BillingFrequency;
  startDate: Date;
  nextBillingDate: Date;
  renewalDate?: Date;
  autoRenew: boolean;
  isActive: boolean;
  notes?: string;
  lastUsed?: Date;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IServiceRequest extends Document {
  _id: Types.ObjectId;
  home: Types.ObjectId;
  requestedBy: Types.ObjectId;
  category: ServiceCategory;
  title: string;
  description: string;
  urgency: RequestUrgency;
  status: ServiceRequestStatus;
  relatedAsset?: Types.ObjectId;
  relatedRoom?: Types.ObjectId;
  preferredDate?: Date;
  preferredTime?: string;
  estimatedBudget?: number;
  photos: string[];
  selectedOffer?: Types.ObjectId;
  selectedProvider?: Types.ObjectId;
  statusHistory: Array<{
    status: ServiceRequestStatus;
    changedBy: Types.ObjectId;
    changedAt: Date;
    notes?: string;
  }>;
  completionReport?: {
    summary: string;
    photos: string[];
    cost: number;
    completedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IServiceOffer extends Document {
  _id: Types.ObjectId;
  serviceRequest: Types.ObjectId;
  provider: Types.ObjectId;
  price: number;
  currency: string;
  estimatedDuration: string;
  proposedDate: Date;
  message: string;
  warrantyPeriod?: string;
  includedServices: string[];
  status: OfferStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProviderProfile extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  businessName: string;
  description: string;
  categories: ServiceCategory[];
  serviceAreas: Array<{ city: string; state?: string; country: string }>;
  experience: number;
  verificationStatus: VerificationStatus;
  verificationDocuments: Array<{
    type: 'id' | 'certification' | 'business_license' | 'experience';
    url: string;
    uploadedAt: Date;
  }>;
  rating: {
    average: number;
    count: number;
    breakdown: {
      professionalism: number;
      punctuality: number;
      quality: number;
      communication: number;
      value: number;
    };
  };
  completedJobs: number;
  portfolio: Array<{ image: string; description: string }>;
  availability: {
    workingDays: number[];
    workingHours: { start: string; end: string };
  };
  subscription: {
    plan: ProviderPlan;
    status: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
