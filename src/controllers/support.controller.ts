import { Request, Response, NextFunction } from 'express';
import { SupportService, BlogService } from '../services/admin.service';

export class SupportController {
  static async createTicket(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId || '';
      const ticket = await SupportService.createTicket(userId, req.body);
      res.status(201).json({ success: true, message: 'Ticket created', data: ticket });
    } catch (error) {
      next(error);
    }
  }

  static async getUserTickets(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId || '';
      const tickets = await SupportService.getUserTickets(userId);
      res.status(200).json({ success: true, message: 'Tickets retrieved', data: tickets });
    } catch (error) {
      next(error);
    }
  }

  static async replyTicket(req: Request, res: Response, next: NextFunction) {
    try {
      const ticketId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const senderId = req.user?.userId || '';
      const senderRole = req.user?.role || 'user';
      const { content } = req.body;
      const ticket = await SupportService.replyTicket(ticketId, senderId, senderRole, content);
      res.status(200).json({ success: true, message: 'Reply added', data: ticket });
    } catch (error) {
      next(error);
    }
  }
}

export class BlogController {
  static async getPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const category = req.query.category as string;
      const posts = await BlogService.getPublishedPosts(category);
      res.status(200).json({ success: true, message: 'Blog posts retrieved', data: posts });
    } catch (error) {
      next(error);
    }
  }

  static async getPostBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
      const post = await BlogService.getPostBySlug(slug);
      res.status(200).json({ success: true, message: 'Blog post details', data: post });
    } catch (error) {
      next(error);
    }
  }

  static async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      const authorId = req.user?.userId || '';
      const post = await BlogService.createPost(authorId, req.body);
      res.status(201).json({ success: true, message: 'Blog post created', data: post });
    } catch (error) {
      next(error);
    }
  }
}
