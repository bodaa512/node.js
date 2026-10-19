import mongoose, { Document, Schema } from 'mongoose';
import { ExpenseCategory, PaymentMethod } from '../types/enums';

export interface IExpense extends Document {
  home: mongoose.Types.ObjectId;
  asset?: mongoose.Types.ObjectId | null;
  category: ExpenseCategory;
  amount: number;
  currency: string;
  date: Date;
  paymentMethod: PaymentMethod;
  description?: string;
  receipt?: mongoose.Types.ObjectId | null;
  isRecurring: boolean;
  recurringSubscription?: mongoose.Types.ObjectId | null;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const expenseSchema = new Schema<IExpense>({
  home: { type: Schema.Types.ObjectId, ref: 'Home', required: true },
  asset: { type: Schema.Types.ObjectId, ref: 'Asset', default: null },
  category: { type: String, enum: Object.values(ExpenseCategory), required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  date: { type: Date, required: true },
  paymentMethod: { type: String, enum: Object.values(PaymentMethod), required: true },
  description: { type: String },
  receipt: { type: Schema.Types.ObjectId, ref: 'Document', default: null },
  isRecurring: { type: Boolean, default: false },
  recurringSubscription: { type: Schema.Types.ObjectId, ref: 'SubscriptionTracker', default: null },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

expenseSchema.index({ home: 1, date: 1 });
expenseSchema.index({ home: 1, category: 1 });
expenseSchema.index({ home: 1, category: 1, date: 1 });
expenseSchema.index({ asset: 1 });

export const Expense = mongoose.model<IExpense>('Expense', expenseSchema);
