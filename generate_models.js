const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const modelsDir = path.join(srcDir, 'models');
const typesDir = path.join(srcDir, 'types');

fs.mkdirSync(modelsDir, { recursive: true });
fs.mkdirSync(typesDir, { recursive: true });

const enumsStr = `
export enum HomeType { APARTMENT = 'APARTMENT', HOUSE = 'HOUSE', TOWNHOUSE = 'TOWNHOUSE', CONDO = 'CONDO', OTHER = 'OTHER' }
export enum HomeMemberRole { OWNER = 'OWNER', ADMIN = 'ADMIN', MEMBER = 'MEMBER', GUEST = 'GUEST' }
export enum HomeMemberStatus { PENDING = 'PENDING', ACTIVE = 'ACTIVE', INACTIVE = 'INACTIVE' }
export enum RoomType { BEDROOM = 'BEDROOM', BATHROOM = 'BATHROOM', KITCHEN = 'KITCHEN', LIVING_ROOM = 'LIVING_ROOM', DINING_ROOM = 'DINING_ROOM', GARAGE = 'GARAGE', BASEMENT = 'BASEMENT', ATTIC = 'ATTIC', OTHER = 'OTHER' }
export enum AssetCondition { EXCELLENT = 'EXCELLENT', GOOD = 'GOOD', FAIR = 'FAIR', POOR = 'POOR', BROKEN = 'BROKEN' }
export enum DocumentType { RECEIPT = 'RECEIPT', MANUAL = 'MANUAL', WARRANTY = 'WARRANTY', CONTRACT = 'CONTRACT', INSURANCE = 'INSURANCE', OTHER = 'OTHER' }
export enum OcrStatus { PENDING = 'PENDING', PROCESSING = 'PROCESSING', COMPLETED = 'COMPLETED', FAILED = 'FAILED' }
export enum MaintenanceType { PREVENTIVE = 'PREVENTIVE', REPAIR = 'REPAIR', INSPECTION = 'INSPECTION', UPGRADE = 'UPGRADE' }
export enum MaintenancePriority { LOW = 'LOW', MEDIUM = 'MEDIUM', HIGH = 'HIGH', URGENT = 'URGENT' }
export enum MaintenanceStatus { SCHEDULED = 'SCHEDULED', IN_PROGRESS = 'IN_PROGRESS', COMPLETED = 'COMPLETED', CANCELLED = 'CANCELLED' }
export enum ExpenseCategory { MORTGAGE = 'MORTGAGE', UTILITIES = 'UTILITIES', MAINTENANCE = 'MAINTENANCE', INSURANCE = 'INSURANCE', TAXES = 'TAXES', OTHER = 'OTHER' }
export enum PaymentMethod { CREDIT_CARD = 'CREDIT_CARD', BANK_TRANSFER = 'BANK_TRANSFER', CASH = 'CASH', OTHER = 'OTHER' }
export enum BillingFrequency { WEEKLY = 'WEEKLY', MONTHLY = 'MONTHLY', QUARTERLY = 'QUARTERLY', YEARLY = 'YEARLY' }
export enum ServiceCategory { PLUMBING = 'PLUMBING', ELECTRICAL = 'ELECTRICAL', HVAC = 'HVAC', CLEANING = 'CLEANING', LANDSCAPING = 'LANDSCAPING', GENERAL_MAINTENANCE = 'GENERAL_MAINTENANCE', OTHER = 'OTHER' }
export enum RequestUrgency { LOW = 'LOW', MEDIUM = 'MEDIUM', HIGH = 'HIGH', EMERGENCY = 'EMERGENCY' }
export enum ServiceRequestStatus { OPEN = 'OPEN', QUOTES_RECEIVED = 'QUOTES_RECEIVED', IN_PROGRESS = 'IN_PROGRESS', COMPLETED = 'COMPLETED', CANCELLED = 'CANCELLED' }
export enum OfferStatus { PENDING = 'PENDING', ACCEPTED = 'ACCEPTED', REJECTED = 'REJECTED' }
export enum VerificationStatus { UNVERIFIED = 'UNVERIFIED', PENDING = 'PENDING', VERIFIED = 'VERIFIED', REJECTED = 'REJECTED' }
export enum AppointmentStatus { SCHEDULED = 'SCHEDULED', COMPLETED = 'COMPLETED', CANCELLED = 'CANCELLED', RESCHEDULED = 'RESCHEDULED' }
export enum ConversationType { DIRECT = 'DIRECT', GROUP = 'GROUP', SUPPORT = 'SUPPORT' }
export enum MessageType { TEXT = 'TEXT', IMAGE = 'IMAGE', FILE = 'FILE', SYSTEM = 'SYSTEM' }
export enum NotificationType { MAINTENANCE = 'MAINTENANCE', EXPENSE = 'EXPENSE', SYSTEM = 'SYSTEM', MESSAGE = 'MESSAGE', DOCUMENT = 'DOCUMENT' }
export enum NotificationPriority { LOW = 'LOW', NORMAL = 'NORMAL', HIGH = 'HIGH', URGENT = 'URGENT' }
export enum AIRole { USER = 'USER', ASSISTANT = 'ASSISTANT', SYSTEM = 'SYSTEM' }
export enum EventType { MAINTENANCE = 'MAINTENANCE', RENT = 'RENT', REMINDER = 'REMINDER', OTHER = 'OTHER' }
export enum PropertyType { RESIDENTIAL = 'RESIDENTIAL', COMMERCIAL = 'COMMERCIAL' }
export enum TenantStatus { ACTIVE = 'ACTIVE', PAST = 'PAST', EVICTED = 'EVICTED' }
export enum PaymentType { RENT = 'RENT', DEPOSIT = 'DEPOSIT', FEE = 'FEE' }
export enum PlanType { BASIC = 'BASIC', PREMIUM = 'PREMIUM', PRO = 'PRO' }
export enum TicketStatus { OPEN = 'OPEN', IN_PROGRESS = 'IN_PROGRESS', RESOLVED = 'RESOLVED', CLOSED = 'CLOSED' }
export enum TicketPriority { LOW = 'LOW', MEDIUM = 'MEDIUM', HIGH = 'HIGH', URGENT = 'URGENT' }
export enum AuditLogAction { CREATE = 'CREATE', UPDATE = 'UPDATE', DELETE = 'DELETE', LOGIN = 'LOGIN' }
export enum AchievementType { BRONZE = 'BRONZE', SILVER = 'SILVER', GOLD = 'GOLD' }
export enum BlogPostStatus { DRAFT = 'DRAFT', PUBLISHED = 'PUBLISHED', ARCHIVED = 'ARCHIVED' }
`;
fs.writeFileSync(path.join(typesDir, 'enums.ts'), enumsStr);

const models = {};

models['Home.ts'] = `
import mongoose, { Document, Schema } from 'mongoose';
import { HomeType } from '../../types/enums';

export interface IHome extends Document {
  owner: mongoose.Types.ObjectId;
  name: string;
  type: HomeType;
  address: { street: string; city: string; state: string; country: string; postalCode: string; coordinates?: { lat: number; lng: number } };
  ownershipType: string;
  numberOfRooms?: number;
  numberOfResidents?: number;
  area?: number;
  areaUnit?: string;
  images?: string[];
  notes?: string;
  healthScore?: { score: number; lastCalculated: Date; breakdown: { maintenance: number; warranty: number; assetCondition: number; documentCompleteness: number; repairHistory: number; expenseStability: number; safety: number; } };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const homeSchema = new Schema<IHome>({
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  type: { type: String, enum: Object.values(HomeType), required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: String, required: true },
    coordinates: { lat: Number, lng: Number }
  },
  ownershipType: { type: String },
  numberOfRooms: { type: Number },
  numberOfResidents: { type: Number },
  area: { type: Number },
  areaUnit: { type: String, default: 'sqm' },
  images: [{ type: String }],
  notes: { type: String },
  healthScore: {
    score: { type: Number, default: 100 },
    lastCalculated: { type: Date, default: Date.now },
    breakdown: {
      maintenance: { type: Number, default: 100 },
      warranty: { type: Number, default: 100 },
      assetCondition: { type: Number, default: 100 },
      documentCompleteness: { type: Number, default: 100 },
      repairHistory: { type: Number, default: 100 },
      expenseStability: { type: Number, default: 100 },
      safety: { type: Number, default: 100 },
    }
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

homeSchema.index({ owner: 1 });
homeSchema.index({ 'address.city': 1 });
homeSchema.index({ owner: 1, isActive: 1 });

export const Home = mongoose.model<IHome>('Home', homeSchema);
`;

models['HomeMember.ts'] = `
import mongoose, { Document, Schema } from 'mongoose';
import { HomeMemberRole, HomeMemberStatus } from '../../types/enums';

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
`;

models['Room.ts'] = `
import mongoose, { Document, Schema } from 'mongoose';
import { RoomType } from '../../types/enums';

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
`;

models['AssetCategory.ts'] = `
import mongoose, { Document, Schema } from 'mongoose';

export interface IAssetCategory extends Document {
  name: string;
  slug: string;
  icon?: string;
  parentCategory?: mongoose.Types.ObjectId | null;
  defaultMaintenanceSchedule: Array<{ task: string; intervalDays: number; description: string; }>;
  expectedLifespanYears?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const assetCategorySchema = new Schema<IAssetCategory>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  icon: { type: String },
  parentCategory: { type: Schema.Types.ObjectId, ref: 'AssetCategory', default: null },
  defaultMaintenanceSchedule: [{
    task: String,
    intervalDays: Number,
    description: String
  }],
  expectedLifespanYears: { type: Number },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

assetCategorySchema.index({ slug: 1 }, { unique: true });
assetCategorySchema.index({ parentCategory: 1 });

export const AssetCategory = mongoose.model<IAssetCategory>('AssetCategory', assetCategorySchema);
`;

models['Asset.ts'] = `
import mongoose, { Document, Schema } from 'mongoose';
import { AssetCondition } from '../../types/enums';

export interface IAsset extends Document {
  home: mongoose.Types.ObjectId;
  room?: mongoose.Types.ObjectId | null;
  category: mongoose.Types.ObjectId;
  name: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  purchaseDate?: Date;
  purchasePrice?: number;
  currency?: string;
  condition: AssetCondition;
  expectedLifespanYears?: number;
  image?: string;
  notes?: string;
  warranty: { hasWarranty: boolean; startDate?: Date; endDate?: Date; provider?: string; coverage?: string; documentId?: mongoose.Types.ObjectId; };
  maintenance: { lastDate?: Date; nextDate?: Date; totalCost: number; totalRepairs: number; };
  documents: mongoose.Types.ObjectId[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const assetSchema = new Schema<IAsset>({
  home: { type: Schema.Types.ObjectId, ref: 'Home', required: true },
  room: { type: Schema.Types.ObjectId, ref: 'Room', default: null },
  category: { type: Schema.Types.ObjectId, ref: 'AssetCategory', required: true },
  name: { type: String, required: true },
  brand: { type: String },
  model: { type: String },
  serialNumber: { type: String },
  purchaseDate: { type: Date },
  purchasePrice: { type: Number },
  currency: { type: String, default: 'USD' },
  condition: { type: String, enum: Object.values(AssetCondition), default: AssetCondition.GOOD },
  expectedLifespanYears: { type: Number },
  image: { type: String },
  notes: { type: String },
  warranty: {
    hasWarranty: { type: Boolean, default: false },
    startDate: { type: Date },
    endDate: { type: Date },
    provider: { type: String },
    coverage: { type: String },
    documentId: { type: Schema.Types.ObjectId, ref: 'Document' }
  },
  maintenance: {
    lastDate: { type: Date },
    nextDate: { type: Date },
    totalCost: { type: Number, default: 0 },
    totalRepairs: { type: Number, default: 0 }
  },
  documents: [{ type: Schema.Types.ObjectId, ref: 'Document' }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

assetSchema.index({ home: 1 });
assetSchema.index({ home: 1, category: 1 });
assetSchema.index({ home: 1, condition: 1 });
assetSchema.index({ 'warranty.endDate': 1 });
assetSchema.index({ home: 1, room: 1 });

export const Asset = mongoose.model<IAsset>('Asset', assetSchema);
`;

models['Document.ts'] = `
import mongoose, { Document as MongooseDoc, Schema } from 'mongoose';
import { DocumentType, OcrStatus } from '../../types/enums';

export interface IDocument extends MongooseDoc {
  home: mongoose.Types.ObjectId;
  asset?: mongoose.Types.ObjectId | null;
  uploadedBy: mongoose.Types.ObjectId;
  filename: string;
  originalName: string;
  type: DocumentType;
  mimeType: string;
  size: number;
  storageUrl: string;
  thumbnailUrl?: string;
  expirationDate?: Date;
  extractedData?: { documentType?: string; company?: string; product?: string; model?: string; purchaseDate?: Date; price?: number; currency?: string; warrantyDuration?: string; warrantyExpiration?: Date; contractExpiration?: Date; invoiceNumber?: string; importantDates: Array<{ label: string; date: Date; }>; rawText?: string; confidence?: number; };
  ocrStatus: OcrStatus;
  tags: string[];
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocument>({
  home: { type: Schema.Types.ObjectId, ref: 'Home', required: true },
  asset: { type: Schema.Types.ObjectId, ref: 'Asset', default: null },
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  type: { type: String, enum: Object.values(DocumentType), required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  storageUrl: { type: String, required: true },
  thumbnailUrl: { type: String },
  expirationDate: { type: Date },
  extractedData: {
    documentType: String,
    company: String,
    product: String,
    model: String,
    purchaseDate: Date,
    price: Number,
    currency: String,
    warrantyDuration: String,
    warrantyExpiration: Date,
    contractExpiration: Date,
    invoiceNumber: String,
    importantDates: [{ label: String, date: Date }],
    rawText: String,
    confidence: Number
  },
  ocrStatus: { type: String, enum: Object.values(OcrStatus), default: OcrStatus.PENDING },
  tags: [{ type: String }],
  notes: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

documentSchema.index({ home: 1 });
documentSchema.index({ home: 1, type: 1 });
documentSchema.index({ asset: 1 });
documentSchema.index({ expirationDate: 1 });
documentSchema.index({ home: 1, ocrStatus: 1 });

export const DocumentModel = mongoose.model<IDocument>('Document', documentSchema);
`;

models['MaintenanceTask.ts'] = `
import mongoose, { Document, Schema } from 'mongoose';
import { MaintenanceType, MaintenancePriority, MaintenanceStatus } from '../../types/enums';

export interface IMaintenanceTask extends Document {
  home: mongoose.Types.ObjectId;
  asset?: mongoose.Types.ObjectId | null;
  room?: mongoose.Types.ObjectId | null;
  title: string;
  description: string;
  type: MaintenanceType;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  recurring: { enabled: boolean; intervalDays?: number; intervalType?: string; intervalValue?: number; lastCompleted?: Date; nextDue?: Date; };
  dueDate?: Date;
  completedDate?: Date;
  completedBy?: mongoose.Types.ObjectId;
  estimatedCost?: number;
  actualCost?: number;
  serviceRequest?: mongoose.Types.ObjectId | null;
  notes?: string;
  photos?: string[];
  isAIRecommended: boolean;
  aiRecommendationReason?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const maintenanceTaskSchema = new Schema<IMaintenanceTask>({
  home: { type: Schema.Types.ObjectId, ref: 'Home', required: true },
  asset: { type: Schema.Types.ObjectId, ref: 'Asset', default: null },
  room: { type: Schema.Types.ObjectId, ref: 'Room', default: null },
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: Object.values(MaintenanceType), required: true },
  priority: { type: String, enum: Object.values(MaintenancePriority), default: MaintenancePriority.MEDIUM },
  status: { type: String, enum: Object.values(MaintenanceStatus), default: MaintenanceStatus.SCHEDULED },
  recurring: {
    enabled: { type: Boolean, default: false },
    intervalDays: Number,
    intervalType: String,
    intervalValue: Number,
    lastCompleted: Date,
    nextDue: Date
  },
  dueDate: { type: Date },
  completedDate: { type: Date },
  completedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  estimatedCost: { type: Number },
  actualCost: { type: Number },
  serviceRequest: { type: Schema.Types.ObjectId, ref: 'ServiceRequest', default: null },
  notes: { type: String },
  photos: [{ type: String }],
  isAIRecommended: { type: Boolean, default: false },
  aiRecommendationReason: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

maintenanceTaskSchema.index({ home: 1, status: 1 });
maintenanceTaskSchema.index({ home: 1, dueDate: 1 });
maintenanceTaskSchema.index({ asset: 1 });
maintenanceTaskSchema.index({ status: 1, dueDate: 1 });
maintenanceTaskSchema.index({ 'recurring.nextDue': 1 });

export const MaintenanceTask = mongoose.model<IMaintenanceTask>('MaintenanceTask', maintenanceTaskSchema);
`;

models['MaintenanceHistory.ts'] = `
import mongoose, { Document, Schema } from 'mongoose';

export interface IMaintenanceHistory extends Document {
  task: mongoose.Types.ObjectId;
  home: mongoose.Types.ObjectId;
  asset?: mongoose.Types.ObjectId | null;
  action: 'created' | 'started' | 'completed' | 'skipped' | 'cancelled' | 'rescheduled';
  performedBy?: mongoose.Types.ObjectId;
  cost?: number;
  notes?: string;
  photos?: string[];
  serviceProvider?: mongoose.Types.ObjectId | null;
  date: Date;
  createdAt: Date;
}

const maintenanceHistorySchema = new Schema<IMaintenanceHistory>({
  task: { type: Schema.Types.ObjectId, ref: 'MaintenanceTask', required: true },
  home: { type: Schema.Types.ObjectId, ref: 'Home', required: true },
  asset: { type: Schema.Types.ObjectId, ref: 'Asset', default: null },
  action: { type: String, enum: ['created', 'started', 'completed', 'skipped', 'cancelled', 'rescheduled'], required: true },
  performedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  cost: { type: Number },
  notes: { type: String },
  photos: [{ type: String }],
  serviceProvider: { type: Schema.Types.ObjectId, ref: 'ProviderProfile', default: null },
  date: { type: Date, default: Date.now },
}, { timestamps: { createdAt: true, updatedAt: false } });

maintenanceHistorySchema.index({ task: 1 });
maintenanceHistorySchema.index({ home: 1, date: 1 });
maintenanceHistorySchema.index({ asset: 1, date: 1 });

export const MaintenanceHistory = mongoose.model<IMaintenanceHistory>('MaintenanceHistory', maintenanceHistorySchema);
`;

models['Expense.ts'] = `
import mongoose, { Document, Schema } from 'mongoose';
import { ExpenseCategory, PaymentMethod } from '../../types/enums';

export interface IExpense extends Document {
  home: mongoose.Types.ObjectId;
  asset?: mongoose.Types.ObjectId | null;
  category: ExpenseCategory;
  amount: number;
  currency: string;
  date: Date;
  paymentMethod: PaymentMethod;
  description?: string;
  receipt?: mongoose.Types.ObjectId | null;
  isRecurring: boolean;
  recurringSubscription?: mongoose.Types.ObjectId | null;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const expenseSchema = new Schema<IExpense>({
  home: { type: Schema.Types.ObjectId, ref: 'Home', required: true },
  asset: { type: Schema.Types.ObjectId, ref: 'Asset', default: null },
  category: { type: String, enum: Object.values(ExpenseCategory), required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  date: { type: Date, required: true },
  paymentMethod: { type: String, enum: Object.values(PaymentMethod), required: true },
  description: { type: String },
  receipt: { type: Schema.Types.ObjectId, ref: 'Document', default: null },
  isRecurring: { type: Boolean, default: false },
  recurringSubscription: { type: Schema.Types.ObjectId, ref: 'SubscriptionTracker', default: null },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

expenseSchema.index({ home: 1, date: 1 });
expenseSchema.index({ home: 1, category: 1 });
expenseSchema.index({ home: 1, category: 1, date: 1 });
expenseSchema.index({ asset: 1 });

export const Expense = mongoose.model<IExpense>('Expense', expenseSchema);
`;

models['SubscriptionTracker.ts'] = `
import mongoose, { Document, Schema } from 'mongoose';
import { BillingFrequency } from '../../types/enums';

export interface ISubscriptionTracker extends Document {
  home: mongoose.Types.ObjectId;
  name: string;
  category: string;
  provider: string;
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
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionTrackerSchema = new Schema<ISubscriptionTracker>({
  home: { type: Schema.Types.ObjectId, ref: 'Home', required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  provider: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  billingFrequency: { type: String, enum: Object.values(BillingFrequency), required: true },
  startDate: { type: Date, required: true },
  nextBillingDate: { type: Date, required: true },
  renewalDate: { type: Date },
  autoRenew: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  notes: { type: String },
  lastUsed: { type: Date },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

subscriptionTrackerSchema.index({ home: 1 });
subscriptionTrackerSchema.index({ home: 1, isActive: 1 });
subscriptionTrackerSchema.index({ nextBillingDate: 1 });

export const SubscriptionTracker = mongoose.model<ISubscriptionTracker>('SubscriptionTracker', subscriptionTrackerSchema);
`;

models['ServiceRequest.ts'] = `
import mongoose, { Document, Schema } from 'mongoose';
import { ServiceCategory, RequestUrgency, ServiceRequestStatus } from '../../types/enums';

export interface IServiceRequest extends Document {
  home: mongoose.Types.ObjectId;
  requestedBy: mongoose.Types.ObjectId;
  category: ServiceCategory;
  title: string;
  description: string;
  urgency: RequestUrgency;
  status: ServiceRequestStatus;
  relatedAsset?: mongoose.Types.ObjectId | null;
  relatedRoom?: mongoose.Types.ObjectId | null;
  preferredDate?: Date;
  preferredTime?: string;
  estimatedBudget?: number;
  photos?: string[];
  selectedOffer?: mongoose.Types.ObjectId | null;
  selectedProvider?: mongoose.Types.ObjectId | null;
  statusHistory: Array<{ status: ServiceRequestStatus; changedBy: mongoose.Types.ObjectId; changedAt: Date; notes?: string; }>;
  completionReport?: { summary: string; photos: string[]; cost: number; completedAt: Date; };
  createdAt: Date;
  updatedAt: Date;
}

const serviceRequestSchema = new Schema<IServiceRequest>({
  home: { type: Schema.Types.ObjectId, ref: 'Home', required: true },
  requestedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, enum: Object.values(ServiceCategory), required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  urgency: { type: String, enum: Object.values(RequestUrgency), required: true },
  status: { type: String, enum: Object.values(ServiceRequestStatus), default: ServiceRequestStatus.OPEN },
  relatedAsset: { type: Schema.Types.ObjectId, ref: 'Asset', default: null },
  relatedRoom: { type: Schema.Types.ObjectId, ref: 'Room', default: null },
  preferredDate: { type: Date },
  preferredTime: { type: String },
  estimatedBudget: { type: Number },
  photos: [{ type: String }],
  selectedOffer: { type: Schema.Types.ObjectId, ref: 'ServiceOffer', default: null },
  selectedProvider: { type: Schema.Types.ObjectId, ref: 'ProviderProfile', default: null },
  statusHistory: [{
    status: { type: String, enum: Object.values(ServiceRequestStatus) },
    changedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    changedAt: { type: Date, default: Date.now },
    notes: String
  }],
  completionReport: {
    summary: String,
    photos: [String],
    cost: Number,
    completedAt: Date
  }
}, { timestamps: true });

serviceRequestSchema.index({ home: 1, status: 1 });
serviceRequestSchema.index({ requestedBy: 1 });
serviceRequestSchema.index({ status: 1, category: 1 });
serviceRequestSchema.index({ createdAt: 1 });

export const ServiceRequest = mongoose.model<IServiceRequest>('ServiceRequest', serviceRequestSchema);
`;

models['ServiceOffer.ts'] = `
import mongoose, { Document, Schema } from 'mongoose';
import { OfferStatus } from '../../types/enums';

export interface IServiceOffer extends Document {
  serviceRequest: mongoose.Types.ObjectId;
  provider: mongoose.Types.ObjectId;
  price: number;
  currency: string;
  estimatedDuration: string;
  proposedDate: Date;
  message?: string;
  warrantyPeriod?: string;
  includedServices?: string[];
  status: OfferStatus;
  createdAt: Date;
  updatedAt: Date;
}

const serviceOfferSchema = new Schema<IServiceOffer>({
  serviceRequest: { type: Schema.Types.ObjectId, ref: 'ServiceRequest', required: true },
  provider: { type: Schema.Types.ObjectId, ref: 'ProviderProfile', required: true },
  price: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  estimatedDuration: { type: String, required: true },
  proposedDate: { type: Date, required: true },
  message: { type: String },
  warrantyPeriod: { type: String },
  includedServices: [{ type: String }],
  status: { type: String, enum: Object.values(OfferStatus), default: OfferStatus.PENDING }
}, { timestamps: true });

serviceOfferSchema.index({ serviceRequest: 1 });
serviceOfferSchema.index({ provider: 1 });
serviceOfferSchema.index({ serviceRequest: 1, status: 1 });

export const ServiceOffer = mongoose.model<IServiceOffer>('ServiceOffer', serviceOfferSchema);
`;

models['ProviderProfile.ts'] = `
import mongoose, { Document, Schema } from 'mongoose';
import { ServiceCategory, VerificationStatus } from '../../types/enums';

export interface IProviderProfile extends Document {
  user: mongoose.Types.ObjectId;
  businessName: string;
  description?: string;
  categories: ServiceCategory[];
  serviceAreas: Array<{ city: string; state: string; country: string; }>;
  experience: number;
  verificationStatus: VerificationStatus;
  verificationDocuments: Array<{ type: string; url: string; uploadedAt: Date; }>;
  rating: { average: number; count: number; breakdown: { professionalism: number; punctuality: number; quality: number; communication: number; value: number; } };
  completedJobs: number;
  portfolio: Array<{ image: string; description: string; }>;
  availability: { workingDays: number[]; workingHours: { start: string; end: string; } };
  subscription: { plan: string; status: string; };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const providerProfileSchema = new Schema<IProviderProfile>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  businessName: { type: String, required: true },
  description: { type: String },
  categories: [{ type: String, enum: Object.values(ServiceCategory) }],
  serviceAreas: [{
    city: String,
    state: String,
    country: String
  }],
  experience: { type: Number, default: 0 },
  verificationStatus: { type: String, enum: Object.values(VerificationStatus), default: VerificationStatus.UNVERIFIED },
  verificationDocuments: [{
    type: { type: String },
    url: { type: String },
    uploadedAt: { type: Date, default: Date.now }
  }],
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
    breakdown: {
      professionalism: { type: Number, default: 0 },
      punctuality: { type: Number, default: 0 },
      quality: { type: Number, default: 0 },
      communication: { type: Number, default: 0 },
      value: { type: Number, default: 0 }
    }
  },
  completedJobs: { type: Number, default: 0 },
  portfolio: [{
    image: String,
    description: String
  }],
  availability: {
    workingDays: [{ type: Number }],
    workingHours: {
      start: String,
      end: String
    }
  },
  subscription: {
    plan: { type: String, default: 'free' },
    status: { type: String, default: 'active' }
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

providerProfileSchema.index({ user: 1 }, { unique: true });
providerProfileSchema.index({ categories: 1 });
providerProfileSchema.index({ 'serviceAreas.city': 1 });
providerProfileSchema.index({ verificationStatus: 1 });
providerProfileSchema.index({ 'rating.average': 1 });
providerProfileSchema.index({ categories: 1, 'serviceAreas.city': 1, verificationStatus: 1 });

export const ProviderProfile = mongoose.model<IProviderProfile>('ProviderProfile', providerProfileSchema);
`;

models['ProviderReview.ts'] = `
import mongoose, { Document, Schema } from 'mongoose';

export interface IProviderReview extends Document {
  provider: mongoose.Types.ObjectId;
  reviewer: mongoose.Types.ObjectId;
  serviceRequest: mongoose.Types.ObjectId;
  ratings: { professionalism: number; punctuality: number; quality: number; communication: number; value: number; overall: number; };
  comment?: string;
  photos?: string[];
  response?: { text: string; respondedAt: Date; };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const providerReviewSchema = new Schema<IProviderReview>({
  provider: { type: Schema.Types.ObjectId, ref: 'ProviderProfile', required: true },
  reviewer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  serviceRequest: { type: Schema.Types.ObjectId, ref: 'ServiceRequest', required: true },
  ratings: {
    professionalism: { type: Number, min: 1, max: 5, required: true },
    punctuality: { type: Number, min: 1, max: 5, required: true },
    quality: { type: Number, min: 1, max: 5, required: true },
    communication: { type: Number, min: 1, max: 5, required: true },
    value: { type: Number, min: 1, max: 5, required: true },
    overall: { type: Number, min: 1, max: 5, required: true }
  },
  comment: { type: String },
  photos: [{ type: String }],
  response: {
    text: String,
    respondedAt: Date
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

providerReviewSchema.index({ provider: 1 });
providerReviewSchema.index({ reviewer: 1 });
providerReviewSchema.index({ provider: 1, createdAt: 1 });

export const ProviderReview = mongoose.model<IProviderReview>('ProviderReview', providerReviewSchema);
`;

models['Appointment.ts'] = `
import mongoose, { Document, Schema } from 'mongoose';
import { AppointmentStatus } from '../../types/enums';

export interface IAppointment extends Document {
  home: mongoose.Types.ObjectId;
  serviceRequest: mongoose.Types.ObjectId;
  customer: mongoose.Types.ObjectId;
  provider: mongoose.Types.ObjectId;
  date: Date;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes?: string;
  address?: string;
  reminderSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>({
  home: { type: Schema.Types.ObjectId, ref: 'Home', required: true },
  serviceRequest: { type: Schema.Types.ObjectId, ref: 'ServiceRequest', required: true },
  customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: Schema.Types.ObjectId, ref: 'ProviderProfile', required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  status: { type: String, enum: Object.values(AppointmentStatus), default: AppointmentStatus.SCHEDULED },
  notes: { type: String },
  address: { type: String },
  reminderSent: { type: Boolean, default: false }
}, { timestamps: true });

appointmentSchema.index({ customer: 1, date: 1 });
appointmentSchema.index({ provider: 1, date: 1 });
appointmentSchema.index({ date: 1, status: 1 });
appointmentSchema.index({ home: 1, date: 1 });

export const Appointment = mongoose.model<IAppointment>('Appointment', appointmentSchema);
`;

models['Conversation.ts'] = `
import mongoose, { Document, Schema } from 'mongoose';
import { ConversationType } from '../../types/enums';

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[];
  type: ConversationType;
  relatedEntity?: { type: string; id: mongoose.Types.ObjectId; };
  lastMessage?: { content: string; sender: mongoose.Types.ObjectId; sentAt: Date; };
  unreadCount: Map<string, number>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  type: { type: String, enum: Object.values(ConversationType), required: true },
  relatedEntity: {
    type: { type: String },
    id: { type: Schema.Types.ObjectId }
  },
  lastMessage: {
    content: String,
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    sentAt: Date
  },
  unreadCount: { type: Map, of: Number, default: new Map() },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

conversationSchema.index({ participants: 1 });
conversationSchema.index({ 'lastMessage.sentAt': -1 });

export const Conversation = mongoose.model<IConversation>('Conversation', conversationSchema);
`;

models['Message.ts'] = `
import mongoose, { Document, Schema } from 'mongoose';
import { MessageType } from '../../types/enums';

export interface IMessage extends Document {
  conversation: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  content: string;
  type: MessageType;
  attachments?: Array<{ url: string; filename: string; mimeType: string; size: number; }>;
  readBy: Array<{ user: mongoose.Types.ObjectId; readAt: Date; }>;
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>({
  conversation: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  type: { type: String, enum: Object.values(MessageType), default: MessageType.TEXT },
  attachments: [{
    url: String,
    filename: String,
    mimeType: String,
    size: Number
  }],
  readBy: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    readAt: { type: Date, default: Date.now }
  }],
  isEdited: { type: Boolean, default: false }
}, { timestamps: true });

messageSchema.index({ conversation: 1, createdAt: 1 });
messageSchema.index({ sender: 1 });

export const Message = mongoose.model<IMessage>('Message', messageSchema);
`;

models['Notification.ts'] = `
import mongoose, { Document, Schema } from 'mongoose';
import { NotificationType, NotificationPriority } from '../../types/enums';

export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  isRead: boolean;
  relatedEntity?: { type: string; id: mongoose.Types.ObjectId; };
  actionUrl?: string;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: Object.values(NotificationType), required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  priority: { type: String, enum: Object.values(NotificationPriority), default: NotificationPriority.NORMAL },
  isRead: { type: Boolean, default: false },
  relatedEntity: {
    type: { type: String },
    id: { type: Schema.Types.ObjectId }
  },
  actionUrl: { type: String },
  metadata: { type: Schema.Types.Mixed }
}, { timestamps: true });

notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, type: 1 });

export const NotificationModel = mongoose.model<INotification>('Notification', notificationSchema);
`;

models['CalendarEvent.ts'] = `
import mongoose, { Document, Schema } from 'mongoose';
import { EventType } from '../../types/enums';

export interface ICalendarEvent extends Document {
  home: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  type: EventType;
  startDate: Date;
  endDate: Date;
  isAllDay: boolean;
  relatedEntity?: { type: string; id: mongoose.Types.ObjectId; };
  createdAt: Date;
  updatedAt: Date;
}

const calendarEventSchema = new Schema<ICalendarEvent>({
  home: { type: Schema.Types.ObjectId, ref: 'Home', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: Object.values(EventType), required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isAllDay: { type: Boolean, default: false },
  relatedEntity: {
    type: { type: String },
    id: { type: Schema.Types.ObjectId }
  }
}, { timestamps: true });

calendarEventSchema.index({ home: 1, startDate: 1 });
calendarEventSchema.index({ user: 1, startDate: 1 });

export const CalendarEvent = mongoose.model<ICalendarEvent>('CalendarEvent', calendarEventSchema);
`;

models['AIConversation.ts'] = `
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
`;

models['AIMessage.ts'] = `
import mongoose, { Document, Schema } from 'mongoose';
import { AIRole } from '../../types/enums';

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
`;

models['Property.ts'] = `
import mongoose, { Document, Schema } from 'mongoose';
import { PropertyType, PropertyStatus } from '../../types/enums';

export interface IProperty extends Document {
  manager: mongoose.Types.ObjectId;
  name: string;
  type: PropertyType;
  status: PropertyStatus;
  address: { street: string; city: string; state: string; country: string; postalCode: string; };
  description?: string;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const propertySchema = new Schema<IProperty>({
  manager: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  type: { type: String, enum: Object.values(PropertyType), required: true },
  status: { type: String, enum: Object.values(PropertyStatus), default: PropertyStatus.ACTIVE },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: String, required: true }
  },
  description: { type: String },
  images: [{ type: String }]
}, { timestamps: true });

propertySchema.index({ manager: 1 });
propertySchema.index({ 'address.city': 1 });

export const Property = mongoose.model<IProperty>('Property', propertySchema);
`;

models['Tenant.ts'] = `
import mongoose, { Document, Schema } from 'mongoose';
import { TenantStatus } from '../../types/enums';

export interface ITenant extends Document {
  user: mongoose.Types.ObjectId;
  property: mongoose.Types.ObjectId;
  status: TenantStatus;
  leaseStart: Date;
  leaseEnd: Date;
  rentAmount: number;
  currency: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const tenantSchema = new Schema<ITenant>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  property: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
  status: { type: String, enum: Object.values(TenantStatus), default: TenantStatus.ACTIVE },
  leaseStart: { type: Date, required: true },
  leaseEnd: { type: Date, required: true },
  rentAmount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  notes: { type: String }
}, { timestamps: true });

tenantSchema.index({ user: 1 });
tenantSchema.index({ property: 1 });
tenantSchema.index({ property: 1, status: 1 });

export const Tenant = mongoose.model<ITenant>('Tenant', tenantSchema);
`;

models['Payment.ts'] = `
import mongoose, { Document, Schema } from 'mongoose';
import { PaymentType } from '../../types/enums';

export interface IPayment extends Document {
  user: mongoose.Types.ObjectId;
  stripePaymentIntentId: string;
  type: PaymentType;
  amount: number;
  currency: string;
  status: string;
  relatedEntity?: { type: string; id: mongoose.Types.ObjectId; };
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  stripePaymentIntentId: { type: String, required: true },
  type: { type: String, enum: Object.values(PaymentType), required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  status: { type: String, required: true },
  relatedEntity: {
    type: { type: String },
    id: { type: Schema.Types.ObjectId }
  }
}, { timestamps: true });

paymentSchema.index({ user: 1 });
paymentSchema.index({ stripePaymentIntentId: 1 });
paymentSchema.index({ user: 1, type: 1, createdAt: -1 });

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema);
`;

models['Plan.ts'] = `
import mongoose, { Document, Schema } from 'mongoose';
import { PlanType } from '../../types/enums';

export interface IPlan extends Document {
  name: string;
  slug: string;
  type: PlanType;
  price: number;
  currency: string;
  features: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const planSchema = new Schema<IPlan>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  type: { type: String, enum: Object.values(PlanType), required: true },
  price: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  features: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

planSchema.index({ slug: 1 }, { unique: true });
planSchema.index({ type: 1, isActive: 1 });

export const Plan = mongoose.model<IPlan>('Plan', planSchema);
`;

models['SupportTicket.ts'] = `
import mongoose, { Document, Schema } from 'mongoose';
import { TicketStatus, TicketPriority } from '../../types/enums';

export interface ISupportTicket extends Document {
  user: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

const supportTicketSchema = new Schema<ISupportTicket>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: Object.values(TicketStatus), default: TicketStatus.OPEN },
  priority: { type: String, enum: Object.values(TicketPriority), default: TicketPriority.MEDIUM },
  category: { type: String }
}, { timestamps: true });

supportTicketSchema.index({ user: 1 });
supportTicketSchema.index({ status: 1 });
supportTicketSchema.index({ assignedTo: 1, status: 1 });
supportTicketSchema.index({ priority: 1, status: 1 });

export const SupportTicket = mongoose.model<ISupportTicket>('SupportTicket', supportTicketSchema);
`;

models['AuditLog.ts'] = `
import mongoose, { Document, Schema } from 'mongoose';
import { AuditLogAction } from '../../types/enums';

export interface IAuditLog extends Document {
  actor: mongoose.Types.ObjectId;
  entityType: string;
  entityId: mongoose.Types.ObjectId;
  action: AuditLogAction;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>({
  actor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  entityType: { type: String, required: true },
  entityId: { type: Schema.Types.ObjectId, required: true },
  action: { type: String, enum: Object.values(AuditLogAction), required: true },
  details: { type: Schema.Types.Mixed },
  ipAddress: { type: String },
  userAgent: { type: String }
}, { timestamps: { createdAt: true, updatedAt: false } });

auditLogSchema.index({ actor: 1, createdAt: -1 });
auditLogSchema.index({ entityType: 1, entityId: 1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ createdAt: -1 });

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', auditLogSchema);
`;

models['Achievement.ts'] = `
import mongoose, { Document, Schema } from 'mongoose';
import { AchievementType } from '../../types/enums';

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
`;

models['BlogPost.ts'] = `
import mongoose, { Document, Schema } from 'mongoose';
import { BlogPostStatus } from '../../types/enums';

export interface IBlogPost extends Document {
  author: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  content: string;
  summary?: string;
  status: BlogPostStatus;
  publishedAt?: Date;
  category: string;
  tags: string[];
  coverImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const blogPostSchema = new Schema<IBlogPost>({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  summary: { type: String },
  status: { type: String, enum: Object.values(BlogPostStatus), default: BlogPostStatus.DRAFT },
  publishedAt: { type: Date },
  category: { type: String, required: true },
  tags: [{ type: String }],
  coverImage: { type: String }
}, { timestamps: true });

blogPostSchema.index({ slug: 1 }, { unique: true });
blogPostSchema.index({ status: 1, publishedAt: -1 });
blogPostSchema.index({ category: 1, status: 1 });
blogPostSchema.index({ tags: 1 });

export const BlogPost = mongoose.model<IBlogPost>('BlogPost', blogPostSchema);
`;

const indexExports = Object.keys(models).map(file => {
  const modelName = file.replace('.ts', '');
  return "export * from './" + modelName + "';";
}).join('\n');
models['index.ts'] = indexExports + '\n';

for (const [filename, content] of Object.entries(models)) {
  fs.writeFileSync(path.join(modelsDir, filename), content.trim() + '\n');
}

console.log('Successfully generated all models and enums!');
