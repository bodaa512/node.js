import { Request, Response, NextFunction } from 'express';
import { MemberService } from '../services/member.service';

export class MemberController {
  static async inviteMember(req: Request, res: Response, next: NextFunction) {
    try {
      const homeId = Array.isArray(req.params.homeId) ? req.params.homeId[0] : req.params.homeId;
      const inviterId = req.user?.userId || '';
      const result = await MemberService.inviteMember(homeId, inviterId, req.body);
      res.status(200).json({ success: true, message: 'Invitation sent', data: result });
    } catch (error) {
      next(error);
    }
  }

  static async acceptInvitation(req: Request, res: Response, next: NextFunction) {
    try {
      const token = Array.isArray(req.params.token) ? req.params.token[0] : req.params.token;
      const userId = req.user?.userId || '';
      const result = await MemberService.acceptInvitation(token, userId);
      res.status(200).json({ success: true, message: 'Invitation accepted', data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getMembers(req: Request, res: Response, next: NextFunction) {
    try {
      const homeId = Array.isArray(req.params.homeId) ? req.params.homeId[0] : req.params.homeId;
      const members = await MemberService.getMembers(homeId);
      res.status(200).json({ success: true, message: 'Members retrieved', data: members });
    } catch (error) {
      next(error);
    }
  }

  static async updateMember(req: Request, res: Response, next: NextFunction) {
    try {
      const homeId = Array.isArray(req.params.homeId) ? req.params.homeId[0] : req.params.homeId;
      const memberId = Array.isArray(req.params.memberId) ? req.params.memberId[0] : req.params.memberId;
      const result = await MemberService.updateMember(homeId, memberId, req.body);
      res.status(200).json({ success: true, message: 'Member updated', data: result });
    } catch (error) {
      next(error);
    }
  }

  static async removeMember(req: Request, res: Response, next: NextFunction) {
    try {
      const homeId = Array.isArray(req.params.homeId) ? req.params.homeId[0] : req.params.homeId;
      const memberId = Array.isArray(req.params.memberId) ? req.params.memberId[0] : req.params.memberId;
      const actorId = req.user?.userId || '';
      await MemberService.removeMember(homeId, memberId, actorId);
      res.status(200).json({ success: true, message: 'Member removed', data: null });
    } catch (error) {
      next(error);
    }
  }
}
