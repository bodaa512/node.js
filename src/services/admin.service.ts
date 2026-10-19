import { User } from '../models/User';
import { Home } from '../models/Home';
import { ProviderProfile } from '../models/ProviderProfile';
import { ServiceRequest } from '../models/ServiceRequest';
import { Payment } from '../models/Payment';
import { AuditLog } from '../models/AuditLog';
import { SupportTicket } from '../models/SupportTicket';
import { BlogPost } from '../models/BlogPost';
import { NotFoundError } from '../errors';
import { VerificationStatus, BlogStatus, TicketStatus } from '../types/enums';

export class AdminService {
  static async getDashboardMetrics() {
    const [totalUsers, totalHomes, totalProviders, activeServiceRequests, completedServices, payments] = await Promise.all([
      User.countDocuments(),
      Home.countDocuments({ isActive: true }),
      ProviderProfile.countDocuments(),
      ServiceRequest.countDocuments({ status: { $in: ['requested', 'offers_received', 'scheduled', 'in_progress'] } }),
      ServiceRequest.countDocuments({ status: 'completed' }),
      Payment.aggregate([{ $match: { status: 'completed' } }, { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }]),
    ]);

    const monthlyRevenue = payments.length > 0 ? payments[0].totalRevenue : 0;

    return {
      totalUsers,
      totalHomes,
      totalProviders,
      activeServiceRequests,
      completedServices,
      monthlyRevenue,
      currency: 'EGP',
    };
  }

  static async getUsers(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const users = await User.find().select('-password -refreshTokens').sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await User.countDocuments();

    return { users, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  static async verifyProvider(providerId: string, status: VerificationStatus) {
    const provider = await ProviderProfile.findByIdAndUpdate(
      providerId,
      { $set: { verificationStatus: status } },
      { new: true }
    );
    if (!provider) throw new NotFoundError('Provider not found');
    return provider;
  }

  static async getAuditLogs(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;
    const logs = await AuditLog.find().populate('actor', 'firstName lastName email').sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await AuditLog.countDocuments();

    return { logs, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}

export class SupportService {
  static async createTicket(userId: string, data: Partial<any>) {
    return SupportTicket.create({
      ...data,
      user: userId,
      status: TicketStatus.OPEN,
      messages: [
        {
          sender: userId as any,
          senderRole: 'user',
          content: data.description || '',
          createdAt: new Date(),
        },
      ],
    });
  }

  static async getUserTickets(userId: string) {
    return SupportTicket.find({ user: userId }).sort({ updatedAt: -1 });
  }

  static async replyTicket(ticketId: string, senderId: string, senderRole: string, content: string) {
    const ticket = await SupportTicket.findById(ticketId);
    if (!ticket) throw new NotFoundError('Support ticket not found');

    ticket.messages.push({
      sender: senderId as any,
      senderRole,
      content,
      createdAt: new Date(),
    });

    if (senderRole === 'admin' || senderRole === 'agent') {
      ticket.status = TicketStatus.WAITING_FOR_USER;
    } else {
      ticket.status = TicketStatus.IN_PROGRESS;
    }

    await ticket.save();
    return ticket;
  }
}

export class BlogService {
  static async getPublishedPosts(category?: string) {
    const query: any = { status: BlogStatus.PUBLISHED };
    if (category) query.category = category;

    return BlogPost.find(query).populate('author', 'firstName lastName avatar').sort({ publishedAt: -1 });
  }

  static async getPostBySlug(slug: string) {
    const post = await BlogPost.findOneAndUpdate(
      { slug, status: BlogStatus.PUBLISHED },
      { $inc: { viewCount: 1 } },
      { new: true }
    ).populate('author', 'firstName lastName avatar');

    if (!post) throw new NotFoundError('Blog post not found');
    return post;
  }

  static async createPost(authorId: string, data: Partial<any>) {
    return BlogPost.create({
      ...data,
      author: authorId,
      status: data.status || BlogStatus.PUBLISHED,
      publishedAt: data.status === BlogStatus.PUBLISHED ? new Date() : undefined,
    });
  }
}
