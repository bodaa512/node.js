import { z } from 'zod';

export const createHomeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['house', 'apartment', 'condo', 'townhouse', 'other']).optional(),
  address: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    country: z.string().min(1, 'Country is required'),
    state: z.string().optional(),
    zipCode: z.string().optional(),
  }),
  ownershipType: z.enum(['own', 'rent']).optional(),
  numberOfRooms: z.number().int().nonnegative().optional(),
  numberOfResidents: z.number().int().nonnegative().optional(),
  area: z.number().nonnegative().optional(),
  areaUnit: z.enum(['sqft', 'sqm']).optional(),
  notes: z.string().optional(),
});

export const updateHomeSchema = createHomeSchema.partial();

export const createRoomSchema = z.object({
  name: z.string().min(1, 'Room name is required'),
  type: z.string().min(1, 'Room type is required'),
  floor: z.number().int().optional(),
  area: z.number().nonnegative().optional(),
  notes: z.string().optional(),
});

export const updateRoomSchema = createRoomSchema.partial();
