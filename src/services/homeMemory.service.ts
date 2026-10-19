import { Asset } from '../models/Asset';
import { MaintenanceTask } from '../models/MaintenanceTask';
import { Expense } from '../models/Expense';
import { ServiceRequest } from '../models/ServiceRequest';
import { Document as DocumentModel } from '../models/Document';

export class HomeMemoryService {
  /**
   * Synthesizes historical event data into natural language memory insights.
   */
  static async getHomeMemories(homeId: string): Promise<string[]> {
    const memories: string[] = [];

    const assets = await Asset.find({ home: homeId, isActive: true });
    const tasks = await MaintenanceTask.find({ home: homeId });
    const expenses = await Expense.find({ home: homeId });
    const requests = await ServiceRequest.find({ home: homeId }).populate('selectedProvider');

    // Asset age memory
    for (const asset of assets) {
      if (asset.purchaseDate) {
        const years = Math.floor((Date.now() - new Date(asset.purchaseDate).getTime()) / (365 * 24 * 60 * 60 * 1000));
        if (years >= 1) {
          memories.push(`The ${asset.brand || ''} ${asset.name} was installed ${years} year(s) ago.`);
        }
      }
      if (asset.maintenance?.totalRepairs && asset.maintenance.totalRepairs >= 2) {
        memories.push(`The ${asset.name} has been repaired ${asset.maintenance.totalRepairs} times with total repair expenses of ${asset.maintenance.totalCost} EGP.`);
      }
    }

    // Provider memory
    const completedRequests = requests.filter((r) => r.status === 'completed' && r.selectedProvider);
    for (const req of completedRequests) {
      const provider: any = req.selectedProvider;
      if (provider) {
        memories.push(`Technician ${provider.businessName || 'Service Provider'} serviced the ${req.title} for your home.`);
      }
    }

    // Expense trend memory
    if (expenses.length > 0) {
      const totalCost = expenses.reduce((sum, e) => sum + e.amount, 0);
      memories.push(`Total recorded home spending to date is ${totalCost.toLocaleString()} EGP.`);
    }

    return memories.length > 0
      ? memories
      : [
          'HomePilot is currently monitoring your home history. As you add assets, maintenance, and expenses, memories will automatically build here.',
        ];
  }
}
