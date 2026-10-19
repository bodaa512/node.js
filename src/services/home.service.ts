import { Home } from '../models/Home';

export class HomeService {
  /**
   * Creates a new home and sets the creator as the owner.
   */
  static async createHome(userId: string, data: any) {
    // The schema defines 'owner' as the creator.
    // Also including members array for compatibility if the schema is updated
    const home = new Home({
      ...data,
      owner: userId,
      members: [{ user: userId, role: 'OWNER' }]
    });
    await home.save();
    return home;
  }

  /**
   * Retrieves all homes where the user is an owner or member.
   */
  static async getUserHomes(userId: string) {
    // Finding where user is owner. (Extend to members if schema adds it)
    const homes = await Home.find({ 
      $or: [
        { owner: userId },
        { 'members.user': userId }
      ] 
    }).exec();
    return homes;
  }

  /**
   * Gets a specific home by ID.
   */
  static async getHomeById(homeId: string, userId: string) {
    const home = await Home.findOne({ 
      _id: homeId, 
      $or: [
        { owner: userId },
        { 'members.user': userId }
      ]
    }).exec();
    
    if (!home) {
      throw new Error('Home not found or access denied');
    }
    
    return home;
  }

  /**
   * Updates home details.
   */
  static async updateHome(homeId: string, userId: string, data: any) {
    const home = await Home.findOne({ 
      _id: homeId,
      $or: [
        { owner: userId },
        { 'members.user': userId, 'members.role': { $in: ['OWNER', 'ADMIN'] } }
      ]
    });

    if (!home) {
      throw new Error('Home not found or access denied');
    }

    const updatedHome = await Home.findByIdAndUpdate(
      homeId,
      { $set: data },
      { new: true, runValidators: true }
    ).exec();

    return updatedHome;
  }

  /**
   * Soft deletes or completely deletes a home.
   */
  static async deleteHome(homeId: string, userId: string) {
    const home = await Home.findOneAndDelete({ 
      _id: homeId,
      $or: [
        { owner: userId },
        { 'members.user': userId, 'members.role': 'OWNER' }
      ]
    }).exec();

    if (!home) {
      throw new Error('Home not found or access denied');
    }

    return { success: true, id: homeId };
  }

  /**
   * Aggregates dashboard data for the home.
   */
  static async getDashboard(homeId: string) {
    return {
      assetCount: 0,
      pendingTasks: 0,
      upcomingAppointments: [],
      recentActivity: [],
      healthScore: 100
    };
  }

  /**
   * Gets chronological activity for the home.
   */
  static async getTimeline(homeId: string, pagination: any = { page: 1, limit: 10 }) {
    return {
      events: [],
      total: 0,
      page: pagination.page,
      totalPages: 1
    };
  }
}
