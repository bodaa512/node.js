import { Asset } from '../models/Asset';
import { Document as DocumentModel } from '../models/Document';
import { MaintenanceTask } from '../models/MaintenanceTask';
import { Expense } from '../models/Expense';
import { ServiceRequest } from '../models/ServiceRequest';
import { ProviderProfile } from '../models/ProviderProfile';

export class SearchService {
  /**
   * Unified global search across assets, documents, tasks, expenses, service requests, and providers.
   */
  static async globalSearch(homeId: string, query: string) {
    if (!query || query.trim().length < 2) {
      return { assets: [], documents: [], tasks: [], expenses: [], requests: [], providers: [] };
    }

    const regex = new RegExp(query, 'i');

    const [assets, documents, tasks, expenses, requests, providers] = await Promise.all([
      Asset.find({ home: homeId, isActive: true, $or: [{ name: regex }, { brand: regex }, { model: regex }, { notes: regex }] }).limit(5),
      DocumentModel.find({ home: homeId, isActive: true, $or: [{ filename: regex }, { originalName: regex }, { tags: regex }, { notes: regex }] }).limit(5),
      MaintenanceTask.find({ home: homeId, $or: [{ title: regex }, { description: regex }, { notes: regex }] }).limit(5),
      Expense.find({ home: homeId, $or: [{ category: regex }, { description: regex }] }).limit(5),
      ServiceRequest.find({ home: homeId, $or: [{ title: regex }, { description: regex }, { category: regex }] }).limit(5),
      ProviderProfile.find({ isActive: true, $or: [{ businessName: regex }, { description: regex }, { categories: regex }] }).limit(5),
    ]);

    return {
      assets,
      documents,
      tasks,
      expenses,
      requests,
      providers,
    };
  }
}
