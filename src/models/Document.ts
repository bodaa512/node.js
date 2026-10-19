import mongoose, { Document as MongooseDoc, Schema } from 'mongoose';
import { DocumentType, OcrStatus } from '../types/enums';

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

export const Document = mongoose.model<IDocument>('Document', documentSchema);
export const DocumentModel = Document;
