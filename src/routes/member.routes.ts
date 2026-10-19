import { Router } from 'express';
import { MemberController } from '../controllers/member.controller';
import { requireHomeAccess } from '../middleware/homeAccess.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { HomeMemberRole } from '../types/enums';

const router = Router();

// Accept invitation
router.post('/accept/:token', authenticate, MemberController.acceptInvitation);

// Routes scoped to a specific home
router.get('/:homeId', authenticate, requireHomeAccess(), MemberController.getMembers);
router.post('/:homeId/invite', authenticate, requireHomeAccess(HomeMemberRole.OWNER, HomeMemberRole.ADMIN), MemberController.inviteMember);
router.put('/:homeId/:memberId', authenticate, requireHomeAccess(HomeMemberRole.OWNER, HomeMemberRole.ADMIN), MemberController.updateMember);
router.delete('/:homeId/:memberId', authenticate, requireHomeAccess(HomeMemberRole.OWNER, HomeMemberRole.ADMIN), MemberController.removeMember);

export default router;
