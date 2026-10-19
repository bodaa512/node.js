import mongoose, { Document, Schema } from 'mongoose';
import { BlogStatus } from '../types/enums';

export interface IBlogPost extends Document {
  author: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category: string;
  tags: string[];
  coverImage?: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  status: BlogStatus;
  publishedAt?: Date;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const blogPostSchema = new Schema<IBlogPost>(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    excerpt: { type: String },
    category: { type: String, required: true },
    tags: [{ type: String }],
    coverImage: { type: String },
    seo: {
      title: { type: String },
      description: { type: String },
      keywords: [{ type: String }],
    },
    status: { type: String, enum: Object.values(BlogStatus), default: BlogStatus.DRAFT },
    publishedAt: { type: Date },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

blogPostSchema.index({ status: 1, publishedAt: -1 });
blogPostSchema.index({ category: 1, status: 1 });
blogPostSchema.index({ tags: 1 });

export const BlogPost = mongoose.model<IBlogPost>('BlogPost', blogPostSchema);
