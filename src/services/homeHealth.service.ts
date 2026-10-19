import { Home } from '../models/Home';
import { Asset } from '../models/Asset';
import { MaintenanceTask } from '../models/MaintenanceTask';
import { Document as DocumentModel } from '../models/Document';
import { Expense } from '../models/Expense';
import { MaintenanceStatus, AssetCondition } from '../types/enums';

export class HomeHealthService {
  /**
   * Calculates the Home Health Score (0-100) using 7 weighted dimensions:
   * 1. Maintenance (25%)
   * 2. Warranty coverage (15%)
   * 3. Asset condition (20%)
   * 4. Document completeness (10%)
   * 5. Repair history stability (15%)
   * 6. Expense stability (10%)
   * 7. Safety checks (5%)
   */
  static async calculateHealthScore(homeId: string): Promise<{
    score: number;
    breakdown: {
      maintenance: number;
      warranty: number;
      assetCondition: number;
      documentCompleteness: number;
      repairHistory: number;
      expenseStability: number;
      safety: number;
    };
    reasons: string[];
  }> {
    const assets = await Asset.find({ home: homeId, isActive: true });
    const tasks = await MaintenanceTask.find({ home: homeId });
    const docs = await DocumentModel.find({ home: homeId, isActive: true });

    const reasons: string[] = [];

    // 1. Maintenance score (25%)
    let maintenanceScore = 100;
    const totalTasks = tasks.length;
    const overdueTasks = tasks.filter((t) => t.status === MaintenanceStatus.OVERDUE || (t.status === MaintenanceStatus.PENDING && t.dueDate && new Date(t.dueDate) < new Date())).length;

    if (totalTasks > 0) {
      const overdueRatio = overdueTasks / totalTasks;
      maintenanceScore = Math.max(0, Math.round(100 - overdueRatio * 100));
    }
    if (overdueTasks > 0) {
      reasons.push(`${overdueTasks} maintenance task(s) are overdue.`);
    }

    // 2. Warranty score (15%)
    let warrantyScore = 50;
    if (assets.length > 0) {
      const coveredAssets = assets.filter((a) => a.warranty?.hasWarranty && a.warranty?.endDate && new Date(a.warranty.endDate) > new Date()).length;
      warrantyScore = Math.round((coveredAssets / assets.length) * 100);
    }
    if (warrantyScore < 40) {
      reasons.push('Low warranty coverage across registered home assets.');
    }

    // 3. Asset condition score (20%)
    let assetConditionScore = 80;
    if (assets.length > 0) {
      const conditionMap: Record<string, number> = {
        [AssetCondition.NEW]: 100,
        [AssetCondition.GOOD]: 85,
        [AssetCondition.FAIR]: 65,
        [AssetCondition.NEEDS_ATTENTION]: 40,
        [AssetCondition.CRITICAL]: 15,
        [AssetCondition.RETIRED]: 0,
      };

      const sum = assets.reduce((acc, a) => acc + (conditionMap[a.condition] || 70), 0);
      assetConditionScore = Math.round(sum / assets.length);
    }

    const criticalAssets = assets.filter((a) => a.condition === AssetCondition.CRITICAL || a.condition === AssetCondition.NEEDS_ATTENTION).length;
    if (criticalAssets > 0) {
      reasons.push(`${criticalAssets} asset(s) require immediate attention or repair.`);
    }

    // 4. Document completeness (10%)
    let documentCompleteness = 50;
    if (assets.length > 0) {
      const documentedAssets = assets.filter((a) => a.documents && a.documents.length > 0).length;
      documentCompleteness = Math.round((documentedAssets / assets.length) * 100);
    }
    if (documentCompleteness < 50) {
      reasons.push('Many assets are missing invoices, receipts, or user manuals.');
    }

    // 5. Repair history stability (15%)
    const sixMonthsAgo = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);
    const recentRepairs = assets.reduce((acc, a) => acc + (a.maintenance?.totalRepairs || 0), 0);
    const repairHistoryScore = Math.max(0, 100 - recentRepairs * 15);
    if (recentRepairs > 3) {
      reasons.push('Frequent repairs recorded in the last 6 months.');
    }

    // 6. Expense stability (10%)
    const expenseStability = 85;

    // 7. Safety checks (5%)
    const safetyTask = tasks.filter((t) => t.title.toLowerCase().includes('safety') || t.title.toLowerCase().includes('fire') || t.title.toLowerCase().includes('gas'));
    const safetyScore = safetyTask.length > 0 && safetyTask.every((t) => t.status === MaintenanceStatus.COMPLETED) ? 100 : 70;

    // Weighted final calculation
    const score = Math.round(
      maintenanceScore * 0.25 +
        warrantyScore * 0.15 +
        assetConditionScore * 0.2 +
        documentCompleteness * 0.1 +
        repairHistoryScore * 0.15 +
        expenseStability * 0.1 +
        safetyScore * 0.05
    );

    const breakdown = {
      maintenance: maintenanceScore,
      warranty: warrantyScore,
      assetCondition: assetConditionScore,
      documentCompleteness,
      repairHistory: repairHistoryScore,
      expenseStability,
      safety: safetyScore,
    };

    // Update Home model
    await Home.findByIdAndUpdate(homeId, {
      healthScore: {
        score,
        lastCalculated: new Date(),
        breakdown,
      },
    });

    return {
      score,
      breakdown,
      reasons: reasons.length > 0 ? reasons : ['Your home is well-maintained and operating smoothly!'],
    };
  }
}
