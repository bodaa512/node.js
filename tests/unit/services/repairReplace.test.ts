import { RepairReplaceService } from '../../../src/services/asset.service';

describe('Repair vs Replace Service (RepairReplaceService.calculateRecommendation)', () => {
  it('should recommend REPAIR when asset is young, repair cost is low, and previous repair is low', () => {
    const result = RepairReplaceService.calculateRecommendation({
      purchasePrice: 10000,
      currentAgeYears: 1,
      repairCost: 500,
      previousRepairCost: 0,
      replacementCost: 12000,
      expectedLifespanYears: 10,
    });

    expect(result.recommendation).toBe('REPAIR');
    expect(result.score).toBeLessThan(40);
    expect(result.metrics.repairToReplacementRatio).toBeLessThan(30);
  });

  it('should recommend REPLACE when repair exceeds 50% of replacement cost and cumulative repair is high', () => {
    const result = RepairReplaceService.calculateRecommendation({
      purchasePrice: 10000,
      currentAgeYears: 9,
      repairCost: 6500,
      previousRepairCost: 2000,
      replacementCost: 10000,
      expectedLifespanYears: 10,
    });

    // repairCost / replacementCost = 65% (>= 50 -> +40)
    // totalRepair = 8500 / 10000 = 85% (>= 60 -> +35)
    // age = 9/10 = 90% (>= 80 -> +25)
    // score = 100
    expect(result.recommendation).toBe('REPLACE');
    expect(result.score).toBeGreaterThanOrEqual(65);
    expect(result.explanation).toContain('50% rule');
  });

  it('should recommend CONSIDER_REPLACEMENT when repair cost is moderate or lifespan is nearing end', () => {
    const result = RepairReplaceService.calculateRecommendation({
      purchasePrice: 10000,
      currentAgeYears: 8,
      repairCost: 3500,
      previousRepairCost: 0,
      replacementCost: 10000,
      expectedLifespanYears: 10,
    });

    // repair/replace = 35% (>= 30 -> +20)
    // totalRepair = 3500/10000 = 35% (< 60 -> 0)
    // age = 8/10 = 80% (>= 80 -> +25)
    // score = 45 -> CONSIDER_REPLACEMENT
    expect(result.recommendation).toBe('CONSIDER_REPLACEMENT');
    expect(result.score).toBeGreaterThanOrEqual(40);
    expect(result.score).toBeLessThan(65);
  });
});
