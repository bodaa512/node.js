import { Request, Response, NextFunction } from 'express';
import { DocumentService } from '../services/document.service';
import { DocumentType } from '../types/enums';

export class DocumentController {
  static async uploadDocument(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'Please attach a document file' });
      }

      const homeId = Array.isArray(req.params.homeId) ? req.params.homeId[0] : req.params.homeId;
      const userId = req.user?.userId || '';
      const { assetId, type } = req.body;

      const document = await DocumentService.uploadDocument(homeId, userId, req.file, assetId, type as DocumentType);
      res.status(201).json({ success: true, message: 'Document uploaded successfully', data: document });
    } catch (error) {
      next(error);
    }
  }

  static async getHomeDocuments(req: Request, res: Response, next: NextFunction) {
    try {
      const homeId = Array.isArray(req.params.homeId) ? req.params.homeId[0] : req.params.homeId;
      const filters = {
        assetId: req.query.assetId as string,
        type: req.query.type as string,
      };
      const documents = await DocumentService.getHomeDocuments(homeId, filters);
      res.status(200).json({ success: true, message: 'Documents retrieved', data: documents });
    } catch (error) {
      next(error);
    }
  }

  static async getDocumentById(req: Request, res: Response, next: NextFunction) {
    try {
      const docId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const homeId = req.homeAccess?.homeId || '';
      const document = await DocumentService.getDocumentById(docId, homeId);
      res.status(200).json({ success: true, message: 'Document retrieved', data: document });
    } catch (error) {
      next(error);
    }
  }

  static async confirmExtraction(req: Request, res: Response, next: NextFunction) {
    try {
      const docId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const homeId = req.homeAccess?.homeId || '';
      const document = await DocumentService.confirmExtraction(docId, homeId, req.body);
      res.status(200).json({ success: true, message: 'Extraction confirmed', data: document });
    } catch (error) {
      next(error);
    }
  }

  static async deleteDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const docId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const homeId = req.homeAccess?.homeId || '';
      await DocumentService.deleteDocument(docId, homeId);
      res.status(200).json({ success: true, message: 'Document deleted', data: null });
    } catch (error) {
      next(error);
    }
  }
}
