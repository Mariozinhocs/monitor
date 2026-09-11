// Serviço de Governança e Permissões por Plano - Sentinela.ai
// Squad A-Team | Mario Henrique & Antigravity AI
// "si vis pacem para bellum"

import { PlanTier, PlanLimits, SUBSCRIPTION_PLANS, SENTINELA_SERVICES_CATALOG, ServiceItem } from '../types/plans';
import { SocialChannel } from '../types/monitor';

export function normalizePlanTier(plan?: string): PlanTier {
  if (!plan) return 'starter';
  const p = plan.toLowerCase();
  if (p === 'enterprise') return 'enterprise';
  if (p === 'pro' || p === 'professional') return 'pro';
  if (p === 'governo' || p === 'gov') return 'governo';
  if (p === 'basic' || p === 'starter') return 'starter';
  return 'starter';
}

export function getPlanConfig(planTier?: string) {
  const tier = normalizePlanTier(planTier);
  return SUBSCRIPTION_PLANS.find(p => p.id === tier) || SUBSCRIPTION_PLANS[0];
}

export function getPlanLimits(planTier?: string): PlanLimits {
  return getPlanConfig(planTier).limits;
}

export function isServiceAllowed(serviceCode: string, planTier?: string): boolean {
  const config = getPlanConfig(planTier);
  const service = SENTINELA_SERVICES_CATALOG.find(s => s.code === serviceCode || s.id === serviceCode);
  if (!service) return false;

  return config.serviceCodes.includes(service.id);
}

export function isChannelAllowed(channel: SocialChannel, planTier?: string): boolean {
  const limits = getPlanLimits(planTier);
  return limits.monitoredChannels.includes(channel);
}

export function getPlanServices(planTier?: string): ServiceItem[] {
  const config = getPlanConfig(planTier);
  return SENTINELA_SERVICES_CATALOG.filter(s => config.serviceCodes.includes(s.id));
}

export function getUpgradePlanForService(serviceCode: string): string {
  const service = SENTINELA_SERVICES_CATALOG.find(s => s.code === serviceCode || s.id === serviceCode);
  if (!service) return 'Professional';

  switch (service.minPlan) {
    case 'starter':
      return 'Starter';
    case 'pro':
      return 'Professional';
    case 'enterprise':
      return 'Enterprise';
    case 'governo':
      return 'Governo & Smart City';
    default:
      return 'Professional';
  }
}
