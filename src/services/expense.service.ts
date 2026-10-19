import { Expense, IExpense } from '../models/Expense';
import { SubscriptionTracker, ISubscriptionTracker } from '../models/SubscriptionTracker';
import { NotFoundError } from '../errors';
import { ExpenseCategory, BillingFrequency, PaymentMethod } from '../types/enums';

export class ExpenseService {
  static async createExpense(homeId: string, userId: string, data: Partial<IExpense>): Promise<IExpense> {
    return Expense.create({
      ...data,
      home: homeId,
      createdBy: userId,
      date: data.date ? new Date(data.date) : new Date(),
    });
  }

  static async getHomeExpenses(homeId: string, filters: { category?: string; startDate?: string; endDate?: string } = {}): Promise<IExpense[]> {
    const query: any = { home: homeId };
    if (filters.category) query.category = filters.category;
    if (filters.startDate || filters.endDate) {
      query.date = {};
      if (filters.startDate) query.date.$gte = new Date(filters.startDate);
      if (filters.endDate) query.date.$lte = new Date(filters.endDate);
    }

    return Expense.find(query).populate('asset', 'name brand').populate('receipt', 'filename storageUrl').sort({ date: -1 });
  }

  static async getExpenseAnalytics(homeId: string, year: number = new Date().getFullYear()) {
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31, 23, 59, 59);

    const expenses = await Expense.find({
      home: homeId,
      date: { $gte: startOfYear, $lte: endOfYear },
    });

    const monthlyBreakdown = Array(12).fill(0);
    const categoryTotals: Record<string, number> = {};

    let totalSpending = 0;

    for (const exp of expenses) {
      const month = new Date(exp.date).getMonth();
      monthlyBreakdown[month] += exp.amount;
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
      totalSpending += exp.amount;
    }

    const categoryList = Object.keys(categoryTotals).map((cat) => ({
      category: cat,
      total: categoryTotals[cat],
      percentage: totalSpending > 0 ? Math.round((categoryTotals[cat] / totalSpending) * 100) : 0,
    }));

    return {
      year,
      totalSpending,
      monthlyAverage: Math.round(totalSpending / 12),
      monthlyBreakdown,
      categoryList: categoryList.sort((a, b) => b.total - a.total),
    };
  }

  static async deleteExpense(expenseId: string, homeId: string): Promise<void> {
    const exp = await Expense.findOneAndDelete({ _id: expenseId, home: homeId });
    if (!exp) {
      throw new NotFoundError('Expense record not found');
    }
  }
}

export class SubscriptionService {
  static async createSubscription(homeId: string, userId: string, data: Partial<ISubscriptionTracker>): Promise<ISubscriptionTracker> {
    return SubscriptionTracker.create({
      ...data,
      home: homeId,
      createdBy: userId,
      startDate: data.startDate ? new Date(data.startDate) : new Date(),
      nextBillingDate: data.nextBillingDate ? new Date(data.nextBillingDate) : new Date(),
    });
  }

  static async getHomeSubscriptions(homeId: string): Promise<ISubscriptionTracker[]> {
    return SubscriptionTracker.find({ home: homeId, isActive: true }).sort({ nextBillingDate: 1 });
  }

  static async getSubscriptionInsights(homeId: string) {
    const subs = await SubscriptionTracker.find({ home: homeId, isActive: true });
    let totalAnnualCost = 0;

    for (const sub of subs) {
      if (sub.billingFrequency === BillingFrequency.WEEKLY) totalAnnualCost += sub.amount * 52;
      else if (sub.billingFrequency === BillingFrequency.MONTHLY) totalAnnualCost += sub.amount * 12;
      else if (sub.billingFrequency === BillingFrequency.QUARTERLY) totalAnnualCost += sub.amount * 4;
      else if (sub.billingFrequency === BillingFrequency.SEMI_ANNUAL) totalAnnualCost += sub.amount * 2;
      else if (sub.billingFrequency === BillingFrequency.ANNUAL) totalAnnualCost += sub.amount;
    }

    const recommendations = [];
    if (subs.length > 5) {
      recommendations.push('You have more than 5 active recurring household subscriptions. Consider reviewing unused services.');
    }
    if (totalAnnualCost > 20000) {
      recommendations.push(`Your recurring home subscriptions total ${totalAnnualCost.toLocaleString()} EGP per year.`);
    }

    return {
      activeSubscriptionsCount: subs.length,
      totalAnnualCost,
      monthlyAverage: Math.round(totalAnnualCost / 12),
      recommendations,
      subscriptions: subs,
    };
  }

  static async deleteSubscription(subId: string, homeId: string): Promise<void> {
    const sub = await SubscriptionTracker.findOneAndUpdate(
      { _id: subId, home: homeId },
      { $set: { isActive: false } }
    );
    if (!sub) {
      throw new NotFoundError('Subscription not found');
    }
  }
}
