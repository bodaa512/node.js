import { Request, Response, NextFunction } from 'express';
import { Conversation } from '../models/Conversation';
import { Message } from '../models/Message';
import { NotFoundError } from '../errors';

export class ChatController {
  static async getConversations(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId || '';
      const conversations = await Conversation.find({ participants: userId, isActive: true })
        .populate('participants', 'firstName lastName avatar role')
        .sort({ updatedAt: -1 });
      res.status(200).json({ success: true, message: 'Conversations retrieved', data: conversations });
    } catch (error) {
      next(error);
    }
  }

  static async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const conversationId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const messages = await Message.find({ conversation: conversationId })
        .populate('sender', 'firstName lastName avatar')
        .sort({ createdAt: 1 });
      res.status(200).json({ success: true, message: 'Messages retrieved', data: messages });
    } catch (error) {
      next(error);
    }
  }

  static async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const conversationId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const senderId = req.user?.userId || '';
      const { content, type } = req.body;

      const message = await Message.create({
        conversation: conversationId,
        sender: senderId,
        content,
        type: type || 'text',
      });

      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: {
          content,
          sender: senderId as any,
          sentAt: new Date(),
        },
      });

      res.status(201).json({ success: true, message: 'Message sent', data: message });
    } catch (error) {
      next(error);
    }
  }
}
