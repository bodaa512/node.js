import { Document as DocumentModel, IDocument } from '../models/Document';
import { Asset } from '../models/Asset';
import { UploadService } from './upload.service';
import { OcrService } from './ocr.service';
import { NotFoundError } from '../errors';
import { OcrStatus, DocumentType } from '../types/enums';

export class DocumentService {
  static async uploadDocument(
    homeId: string,
    userId: string,
    file: Express.Multer.File,
    assetId?: string,
    type?: DocumentType
  ): Promise<IDocument> {
    const uploadResult = await UploadService.uploadFile(file, `homepilot/homes/${homeId}/documents`);

    const doc = await DocumentModel.create({
      home: homeId,
      uploadedBy: userId,
      asset: assetId || null,
      filename: file.originalname,
      originalName: file.originalname,
      type: type || DocumentType.OTHER,
      mimeType: file.mimetype,
      size: file.size,
      storageUrl: uploadResult.url,
      ocrStatus: OcrStatus.PROCESSING,
    });

    // Run OCR asynchronously
    setImmediate(async () => {
      try {
        const extracted = await OcrService.extractDocumentData(uploadResult.url, file.mimetype, file.originalname);
        doc.extractedData = extracted as any;
        doc.ocrStatus = OcrStatus.COMPLETED;
        if (!type && extracted.documentType) {
          doc.type = extracted.documentType;
        }
        if (extracted.warrantyExpiration) {
          doc.expirationDate = extracted.warrantyExpiration;
        }
        await doc.save();

        // Link document to asset if specified
        if (assetId) {
          await Asset.findByIdAndUpdate(assetId, {
            $addToSet: { documents: doc._id },
            ...(extracted.warrantyExpiration && {
              'warranty.hasWarranty': true,
              'warranty.endDate': extracted.warrantyExpiration,
              'warranty.documentId': doc._id,
            }),
          });
        }
      } catch (err) {
        doc.ocrStatus = OcrStatus.FAILED;
        await doc.save();
      }
    });

    return doc;
  }

  static async getHomeDocuments(homeId: string, filters: { assetId?: string; type?: string } = {}): Promise<IDocument[]> {
    const query: any = { home: homeId, isActive: true };
    if (filters.assetId) query.asset = filters.assetId;
    if (filters.type) query.type = filters.type;

    return DocumentModel.find(query).populate('asset', 'name brand model').sort({ createdAt: -1 });
  }

  static async getDocumentById(docId: string, homeId: string): Promise<IDocument> {
    const doc = await DocumentModel.findOne({ _id: docId, home: homeId, isActive: true }).populate('asset');
    if (!doc) {
      throw new NotFoundError('Document not found');
    }
    return doc;
  }

  static async confirmExtraction(docId: string, homeId: string, confirmedData: any): Promise<IDocument> {
    const doc = await DocumentModel.findOne({ _id: docId, home: homeId, isActive: true });
    if (!doc) {
      throw new NotFoundError('Document not found');
    }

    doc.extractedData = { ...doc.extractedData, ...confirmedData };
    doc.ocrStatus = OcrStatus.COMPLETED;

    if (confirmedData.documentType) {
      doc.type = confirmedData.documentType;
    }
    if (confirmedData.warrantyExpiration) {
      doc.expirationDate = new Date(confirmedData.warrantyExpiration);
    }

    await doc.save();

    // If attached to an asset, update asset warranty info
    if (doc.asset && confirmedData.warrantyExpiration) {
      await Asset.findByIdAndUpdate(doc.asset, {
        'warranty.hasWarranty': true,
        'warranty.endDate': new Date(confirmedData.warrantyExpiration),
        'warranty.documentId': doc._id,
      });
    }

    return doc;
  }

  static async deleteDocument(docId: string, homeId: string): Promise<void> {
    const doc = await DocumentModel.findOneAndUpdate(
      { _id: docId, home: homeId },
      { $set: { isActive: false } }
    );
    if (!doc) {
      throw new NotFoundError('Document not found');
    }
  }
}
