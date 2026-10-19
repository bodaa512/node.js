import { Request, Response, NextFunction } from 'express';
import { Home } from '../models/Home';
import { HomeMember } from '../models/HomeMember';
import { HomeMemberRole } from '../types/enums';
import { AuthorizationError, AuthenticationError, NotFoundError } from '../errors';

/**
 * Middleware factory to restrict access based on home membership role
 */
export const requireHomeAccess = (...allowedRoles: HomeMemberRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.userId) {
        throw new AuthenticationError('Authentication required');
      }

      const userId = req.user.userId;
      const rawHomeId = req.params.homeId || req.params.id;
      const homeId = Array.isArray(rawHomeId) ? rawHomeId[0] : rawHomeId;

      if (!homeId) {
        throw new AuthorizationError('Home ID is required');
      }

      const home = await Home.findById(homeId);
      if (!home || !home.isActive) {
        throw new NotFoundError('Home not found');
      }

      let role: HomeMemberRole | null = null;

      if (home.owner.toString() === userId) {
        role = HomeMemberRole.OWNER;
      } else {
        const member = await HomeMember.findOne({
          home: homeId,
          user: userId,
          status: 'accepted',
        });
        if (member) {
          role = member.role;
        }
      }

      if (!role) {
        throw new AuthorizationError('You do not have access to this home');
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
        throw new AuthorizationError('You do not have sufficient permissions to perform this action');
      }

      req.homeAccess = {
        homeId,
        userId,
        role,
        permissions: {
          manageAssets: role === HomeMemberRole.OWNER || role === HomeMemberRole.ADMIN,
          manageMaintenance: role === HomeMemberRole.OWNER || role === HomeMemberRole.ADMIN,
          manageDocuments: role === HomeMemberRole.OWNER || role === HomeMemberRole.ADMIN,
          manageExpenses: role === HomeMemberRole.OWNER || role === HomeMemberRole.ADMIN,
          manageMembers: role === HomeMemberRole.OWNER || role === HomeMemberRole.ADMIN,
          createRequests: role !== HomeMemberRole.VIEWER,
          viewOnly: role === HomeMemberRole.VIEWER,
        },
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const requireHomeOwner = requireHomeAccess(HomeMemberRole.OWNER);
