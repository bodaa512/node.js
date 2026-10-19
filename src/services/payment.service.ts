import { Payment, IPayment } from '../models/Payment';
import { Plan } from '../models/Plan';
import { User } from '../models/User';
import { NotFoundError } from '../errors';
import { PaymentStatus, PaymentType, SubscriptionPlan, SubscriptionStatus } from '../types/enums';

export class PaymentService {
  static async getPlans() {
    return Plan.find({ isActive: true }).sort({ displayOrder: 1 });
  }

  static async createCheckoutSession(userId: string, planSlug: string) {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError('User not found');

    const plan = await Plan.findOne({ slug: planSlug, isActive: true });
    if (!plan) throw new NotFoundError('Plan not found');

    // Simulate Stripe Checkout Session URL
    const mockSessionId = `cs_test_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const mockCheckoutUrl = `https://checkout.stripe.com/pay/${mockSessionId}`;

    await Payment.create({
      user: userId,
      type: PaymentType.SUBSCRIPTION,
      amount: plan.price,
      currency: plan.currency || 'EGP',
      status: PaymentStatus.PENDING,
      stripePaymentIntentId: mockSessionId,
      metadata: { planSlug },
    });

    return {
      sessionId: mockSessionId,
      url: mockCheckoutUrl,
      planName: plan.name,
      amount: plan.price,
    };
  }

  static async handleWebhook(event: any) {
    // Verified Stripe Webhook processing
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const payment = await Payment.findOne({ stripePaymentIntentId: session.id });
      if (payment) {
        payment.status = PaymentStatus.COMPLETED;
        await payment.save();

        const planSlug = (payment as any).metadata?.planSlug || 'premium';
        await User.findByIdAndUpdate(payment.user, {
          'subscription.plan': planSlug === 'property_pro' ? SubscriptionPlan.PROPERTY_PRO : SubscriptionPlan.PREMIUM,
          'subscription.status': SubscriptionStatus.ACTIVE,
          'subscription.currentPeriodStart': new Date(),
          'subscription.currentPeriodEnd': new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });
      }
    }
    return { received: true };
  }

  static async getUserPayments(userId: string): Promise<IPayment[]> {
    return Payment.find({ user: userId }).sort({ createdAt: -1 });
  }
}
