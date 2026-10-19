import Stripe from 'stripe';
import { env } from './env';

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16' as any, // Cast to any to avoid strict version mismatch if needed, or use specific version
  appInfo: {
    name: 'HomePilot',
    version: '1.0.0',
  },
});
