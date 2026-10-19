import { z } from 'zod';
import { AssetCondition } from '../types/enums';

export const createAssetSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  category: z.string().min(1, 'Category is required'),
  room: z.string().optional().nullable(),
  brand: z.string().optional(),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  purchaseDate: z.string().optional(),
  purchasePrice: z.number().min(0).optional(),
  currency: z.string().default('EGP'),
  condition: z.nativeEnum(AssetCondition).default(AssetCondition.GOOD),
  expectedLifespanYears: z.number().min(1).max(50).optional(),
  image: z.string().optional(),
  notes: z.string().optional(),
  warranty: z
    .object({
      hasWarranty: z.boolean().default(false),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      provider: z.string().optional(),
      coverage: z.string().optional(),
    })
    .optional(),
});

export const updateAssetSchema = createAssetSchema.partial();

export const repairReplaceSchema = z.object({
  purchasePrice: z.number().positive(),
  currentAgeYears: z.number().min(0),
  repairCost: z.number().positive(),
  previousRepairCost: z.number().min(0).default(0),
  replacementCost: z.number().positive(),
  expectedLifespanYears: z.number().positive().default(10),
});
