import { Property, IProperty } from '../models/Property';
import { Tenant, ITenant } from '../models/Tenant';
import { NotFoundError } from '../errors';
import { UnitStatus, TenantStatus } from '../types/enums';

export class PropertyService {
  static async createProperty(managerId: string, data: Partial<IProperty>): Promise<IProperty> {
    const totalUnits = data.units ? data.units.length : 0;
    const occupiedUnits = data.units ? data.units.filter((u) => u.status === UnitStatus.OCCUPIED).length : 0;

    return Property.create({
      ...data,
      manager: managerId,
      totalUnits,
      occupiedUnits,
    });
  }

  static async getManagerProperties(managerId: string): Promise<IProperty[]> {
    return Property.find({ manager: managerId, isActive: true }).sort({ createdAt: -1 });
  }

  static async getPropertyById(id: string, managerId: string): Promise<IProperty> {
    const property = await Property.findOne({ _id: id, manager: managerId, isActive: true }).populate('units.tenant');
    if (!property) throw new NotFoundError('Property not found');
    return property;
  }

  static async addTenant(propertyId: string, unitNumber: string, userId: string, data: Partial<ITenant>): Promise<ITenant> {
    const property = await Property.findById(propertyId);
    if (!property) throw new NotFoundError('Property not found');

    const tenant = await Tenant.create({
      ...data,
      user: userId,
      property: propertyId,
      unitNumber,
      status: TenantStatus.ACTIVE,
    });

    // Update unit status in Property document
    const unit = property.units.find((u) => u.unitNumber === unitNumber);
    if (unit) {
      unit.status = UnitStatus.OCCUPIED;
      unit.tenant = tenant._id;
      property.occupiedUnits = property.units.filter((u) => u.status === UnitStatus.OCCUPIED).length;
      await property.save();
    }

    return tenant;
  }
}
