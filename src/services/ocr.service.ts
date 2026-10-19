import { OcrStatus, DocumentType } from '../types/enums';

export interface IExtractedDocumentData {
  documentType: DocumentType;
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
  confidence: number;
}

export class OcrService {
  /**
   * Performs document OCR and AI-assisted extraction.
   * Simulates intelligent pattern matching & LLM extraction on invoices/warranties.
   */
  static async extractDocumentData(
    fileUrl: string,
    mimeType: string,
    filename: string
  ): Promise<IExtractedDocumentData> {
    // Simulated smart OCR extraction logic
    const lowerName = filename.toLowerCase();

    let docType = DocumentType.OTHER;
    if (lowerName.includes('invoice') || lowerName.includes('receipt') || lowerName.includes('bill')) {
      docType = DocumentType.INVOICE;
    } else if (lowerName.includes('warranty') || lowerName.includes('guarantee')) {
      docType = DocumentType.WARRANTY;
    } else if (lowerName.includes('contract') || lowerName.includes('lease') || lowerName.includes('rent')) {
      docType = DocumentType.RENTAL_AGREEMENT;
    } else if (lowerName.includes('manual')) {
      docType = DocumentType.MANUAL;
    } else if (lowerName.includes('insurance')) {
      docType = DocumentType.INSURANCE;
    }

    const today = new Date();
    const purchaseDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const warrantyExpiry = new Date(today.getTime() + 365 * 2 * 24 * 60 * 60 * 1000); // 2 years

    return {
      documentType: docType,
      company: lowerName.includes('samsung') ? 'Samsung Electronics' : lowerName.includes('lg') ? 'LG Electronics' : 'Home Service Co.',
      product: lowerName.includes('ac') ? 'Air Conditioner' : lowerName.includes('fridge') ? 'Refrigerator' : 'Appliance Item',
      model: 'MOD-2026-X',
      purchaseDate,
      price: 15500,
      currency: 'EGP',
      warrantyDuration: '24 Months',
      warrantyExpiration: warrantyExpiry,
      invoiceNumber: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
      importantDates: [
        { label: 'Purchase Date', date: purchaseDate },
        { label: 'Warranty Expiration', date: warrantyExpiry },
      ],
      rawText: `INVOICE / WARRANTY CERTIFICATE\nSerial No: SN-${Date.now()}\nPurchase Date: ${purchaseDate.toLocaleDateString()}\nTotal Amount: 15,500 EGP\nCoverage: 2 Years Full Warranty`,
      confidence: 0.94,
    };
  }
}
