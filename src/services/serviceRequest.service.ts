import { ServiceRequest, IServiceRequest } from '../models/ServiceRequest';
import { ServiceOffer, IServiceOffer } from '../models/ServiceOffer';
import { ProviderProfile } from '../models/ProviderProfile';
import { Appointment } from '../models/Appointment';
import { NotFoundError, ValidationError } from '../errors';
import { ServiceRequestStatus, OfferStatus, AppointmentStatus, RequestUrgency } from '../types/enums';

export class ServiceRequestService {
  static async createRequest(homeId: string, userId: string, data: Partial<IServiceRequest>): Promise<IServiceRequest> {
    return ServiceRequest.create({
      ...data,
      home: homeId,
      requestedBy: userId,
      status: ServiceRequestStatus.REQUESTED,
      urgency: data.urgency || RequestUrgency.MEDIUM,
      statusHistory: [
        {
          status: ServiceRequestStatus.REQUESTED,
          changedBy: userId as any,
          changedAt: new Date(),
          notes: 'Service request created.',
        },
      ],
    });
  }

  static async getHomeRequests(homeId: string): Promise<IServiceRequest[]> {
    return ServiceRequest.find({ home: homeId })
      .populate('selectedProvider', 'businessName rating verificationStatus')
      .populate('selectedOffer')
      .sort({ createdAt: -1 });
  }

  static async getRequestById(requestId: string): Promise<IServiceRequest> {
    const request = await ServiceRequest.findById(requestId)
      .populate('requestedBy', 'firstName lastName email phone')
      .populate('selectedProvider')
      .populate('selectedOffer');
    if (!request) {
      throw new NotFoundError('Service request not found');
    }
    return request;
  }

  static async submitOffer(providerId: string, requestId: string, data: Partial<IServiceOffer>): Promise<IServiceOffer> {
    const request = await ServiceRequest.findById(requestId);
    if (!request) {
      throw new NotFoundError('Service request not found');
    }

    const offer = await ServiceOffer.create({
      ...data,
      serviceRequest: requestId,
      provider: providerId,
      status: OfferStatus.PENDING,
    });

    // Update request status to OFFERS_RECEIVED if it's currently REQUESTED or REVIEWING
    if (request.status === ServiceRequestStatus.REQUESTED || request.status === ServiceRequestStatus.REVIEWING) {
      request.status = ServiceRequestStatus.OFFERS_RECEIVED;
      request.statusHistory.push({
        status: ServiceRequestStatus.OFFERS_RECEIVED,
        changedBy: providerId as any,
        changedAt: new Date(),
        notes: 'Offer submitted by service provider.',
      });
      await request.save();
    }

    return offer;
  }

  static async getRequestOffers(requestId: string): Promise<IServiceOffer[]> {
    return ServiceOffer.find({ serviceRequest: requestId })
      .populate('provider', 'businessName rating completedJobs verificationStatus experience portfolio')
      .sort({ price: 1 });
  }

  static async selectOffer(requestId: string, offerId: string, userId: string): Promise<{ request: IServiceRequest; appointment: any }> {
    const request = await ServiceRequest.findById(requestId);
    if (!request) throw new NotFoundError('Service request not found');

    const offer = await ServiceOffer.findById(offerId);
    if (!offer) throw new NotFoundError('Service offer not found');

    // Reject other offers
    await ServiceOffer.updateMany(
      { serviceRequest: requestId, _id: { $ne: offerId } },
      { $set: { status: OfferStatus.REJECTED } }
    );

    offer.status = OfferStatus.ACCEPTED;
    await offer.save();

    request.selectedOffer = offer._id;
    request.selectedProvider = offer.provider;
    request.status = ServiceRequestStatus.PROVIDER_SELECTED;
    request.statusHistory.push({
      status: ServiceRequestStatus.PROVIDER_SELECTED,
      changedBy: userId as any,
      changedAt: new Date(),
      notes: `Offer of ${offer.price} ${offer.currency || 'EGP'} selected.`,
    });
    await request.save();

    // Create an appointment automatically
    const appointment = await Appointment.create({
      home: request.home,
      serviceRequest: request._id,
      customer: userId,
      provider: offer.provider,
      date: offer.proposedDate || request.preferredDate || new Date(),
      startTime: request.preferredTime || '10:00 AM',
      endTime: '12:00 PM',
      status: AppointmentStatus.SCHEDULED,
      notes: `Appointment for ${request.title}`,
    });

    request.status = ServiceRequestStatus.SCHEDULED;
    request.statusHistory.push({
      status: ServiceRequestStatus.SCHEDULED,
      changedBy: userId as any,
      changedAt: new Date(),
      notes: 'Appointment scheduled automatically.',
    });
    await request.save();

    return { request, appointment };
  }

  static async completeJob(requestId: string, providerId: string, summary: string, cost: number): Promise<IServiceRequest> {
    const request = await ServiceRequest.findById(requestId);
    if (!request) throw new NotFoundError('Service request not found');

    request.status = ServiceRequestStatus.COMPLETED;
    request.completionReport = {
      summary,
      photos: [],
      cost,
      completedAt: new Date(),
    };
    request.statusHistory.push({
      status: ServiceRequestStatus.COMPLETED,
      changedBy: providerId as any,
      changedAt: new Date(),
      notes: summary,
    });
    await request.save();

    // Increment completed jobs count for provider
    await ProviderProfile.findByIdAndUpdate(providerId, { $inc: { completedJobs: 1 } });

    return request;
  }
}

export class ProviderService {
  static async createOrUpdateProfile(userId: string, data: Partial<any>) {
    return ProviderProfile.findOneAndUpdate(
      { user: userId },
      { $set: { ...data, user: userId } },
      { new: true, upsert: true, runValidators: true }
    );
  }

  static async getProviders(category?: string, city?: string) {
    const query: any = { isActive: true };
    if (category) query.categories = category;
    if (city) query['serviceAreas.city'] = new RegExp(city, 'i');

    return ProviderProfile.find(query).populate('user', 'firstName lastName email avatar phone').sort({ 'rating.average': -1 });
  }

  static async getProviderById(id: string) {
    const provider = await ProviderProfile.findById(id).populate('user', 'firstName lastName email avatar phone');
    if (!provider) throw new NotFoundError('Provider profile not found');
    return provider;
  }
}
