import { Asset, IAsset } from '../models/Asset';
import { AssetCategory } from '../models/AssetCategory';
import { MaintenanceTask } from '../models/MaintenanceTask';
import { Expense } from '../models/Expense';
import { NotFoundError, ValidationError } from '../errors';
import { AssetCondition, ExpenseCategory } from '../types/enums';

export class AssetService {
  static async createAsset(homeId: string, data: Partial<IAsset>): Promise<IAsset> {
    const asset = await Asset.create({
      ...data,
      home: homeId,
      condition: data.condition || AssetCondition.GOOD,
      maintenance: {
        totalCost: 0,
        totalRepairs: 0,
      },
    });

    // Auto-generate default maintenance schedule if category exists
    if (asset.category) {
      const category = await AssetCategory.findById(asset.category);
      if (category && category.defaultMaintenanceSchedule.length > 0) {
        for (const item of category.defaultMaintenanceSchedule) {
          await MaintenanceTask.create({
            home: homeId,
            asset: asset._id,
            title: item.task,
            description: item.description || `Scheduled maintenance for ${asset.name}`,
            type: 'manufacturer',
            priority: 'medium',
            status: 'pending',
            recurring: {
              enabled: true,
              intervalDays: item.intervalDays,
              nextDue: new Date(Date.now() + item.intervalDays * 24 * 60 * 60 * 1000),
            },
            dueDate: new Date(Date.now() + item.intervalDays * 24 * 60 * 60 * 1000),
            createdBy: asset.home,
          });
        }
      }
    }

    return asset;
  }

  static async getHomeAssets(homeId: string, filters: { room?: string; category?: string; condition?: string } = {}): Promise<IAsset[]> {
    const query: any = { home: homeId, isActive: true };
    if (filters.room) query.room = filters.room;
    if (filters.category) query.category = filters.category;
    if (filters.condition) query.condition = filters.condition;

    return Asset.find(query).populate('room').populate('category').sort({ name: 1 });
  }

  static async getAssetById(assetId: string, homeId: string): Promise<IAsset> {
    const asset = await Asset.findOne({ _id: assetId, home: homeId, isActive: true }).populate('room').populate('category');
    if (!asset) {
      throw new NotFoundError('Asset not found');
    }
    return asset;
  }

  static async updateAsset(assetId: string, homeId: string, data: Partial<IAsset>): Promise<IAsset> {
    const asset = await Asset.findOneAndUpdate(
      { _id: assetId, home: homeId, isActive: true },
      { $set: data },
      { new: true, runValidators: true }
    ).populate('room').populate('category');

    if (!asset) {
      throw new NotFoundError('Asset not found');
    }
    return asset;
  }

  static async deleteAsset(assetId: string, homeId: string): Promise<void> {
    const asset = await Asset.findOneAndUpdate(
      { _id: assetId, home: homeId },
      { $set: { isActive: false } }
    );
    if (!asset) {
      throw new NotFoundError('Asset not found');
    }
  }

  static async getAssetCategories() {
    return AssetCategory.find({ isActive: true }).sort({ name: 1 });
  }
}

export class RepairReplaceService {
  /**
   * Evaluates whether to Repair, Replace, or Consider Replacement for an asset.
   * Logic based on 50% rule, accumulated repair costs, and remaining lifespan.
   */
  static calculateRecommendation(params: {
    purchasePrice: number;
    currentAgeYears: number;
    repairCost: number;
    previousRepairCost: number;
    replacementCost: number;
    expectedLifespanYears: number;
  }): {
    recommendation: 'REPAIR' | 'REPLACE' | 'CONSIDER_REPLACEMENT';
    score: number; // 0-100 score (higher = better to replace)
    explanation: string;
    metrics: {
      repairToReplacementRatio: number;
      totalRepairToPurchaseRatio: number;
      agePercentOfLifespan: number;
    };
  } {
    const {
      purchasePrice,
      currentAgeYears,
      repairCost,
      previousRepairCost,
      replacementCost,
      expectedLifespanYears,
    } = params;

    const totalRepairCost = previousRepairCost + repairCost;
    const repairToReplacementRatio = (repairCost / replacementCost) * 100;
    const totalRepairToPurchaseRatio = (totalRepairCost / purchasePrice) * 100;
    const agePercentOfLifespan = (currentAgeYears / Math.max(1, expectedLifespanYears)) * 100;

    let score = 0;
    let reasons: string[] = [];

    // Factor 1: 50% Rule (If repair cost > 50% of replacement cost)
    if (repairToReplacementRatio >= 50) {
      score += 40;
      reasons.push(`Repair cost is ${repairToReplacementRatio.toFixed(0)}% of a new replacement unit (exceeds 50% rule).`);
    } else if (repairToReplacementRatio >= 30) {
      score += 20;
      reasons.push(`Repair cost is substantial (${repairToReplacementRatio.toFixed(0)}% of replacement).`);
    }

    // Factor 2: Cumulative repair cost
    if (totalRepairToPurchaseRatio >= 60) {
      score += 35;
      reasons.push(`Total maintenance costs (${totalRepairCost} EGP) have reached ${totalRepairToPurchaseRatio.toFixed(0)}% of original price.`);
    }

    // Factor 3: Asset age & lifespan
    if (agePercentOfLifespan >= 80) {
      score += 25;
      reasons.push(`Asset has reached ${agePercentOfLifespan.toFixed(0)}% of its expected lifespan (${currentAgeYears}/${expectedLifespanYears} years).`);
    }

    let recommendation: 'REPAIR' | 'REPLACE' | 'CONSIDER_REPLACEMENT';
    if (score >= 65) {
      recommendation = 'REPLACE';
    } else if (score >= 40) {
      recommendation = 'CONSIDER_REPLACEMENT';
    } else {
      recommendation = 'REPAIR';
    }

    return {
      recommendation,
      score: Math.min(100, score),
      explanation: reasons.length > 0 ? reasons.join(' ') : 'The current repair cost is economical compared to purchasing a new unit.',
      metrics: {
        repairToReplacementRatio: Math.round(repairToReplacementRatio),
        totalRepairToPurchaseRatio: Math.round(totalRepairToPurchaseRatio),
        agePercentOfLifespan: Math.round(agePercentOfLifespan),
      },
    };
  }
}
