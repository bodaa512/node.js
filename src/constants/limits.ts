import { SubscriptionPlan } from '../types/enums';

export const PLAN_LIMITS = {
  [SubscriptionPlan.FREE]: {
    homes: 1,
    assets: 10,
    documents: 20,
    aiRequestsPerMonth: 10
  },
  [SubscriptionPlan.PREMIUM]: {
    homes: 5,
    assets: Infinity,
    documents: Infinity,
    aiRequestsPerMonth: 100
  },
  [SubscriptionPlan.PROPERTY_PRO]: {
    homes: 20,
    assets: Infinity,
    documents: Infinity,
    aiRequestsPerMonth: 200
  }
};
