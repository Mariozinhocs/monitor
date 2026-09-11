// Tipos TypeScript para Usuários, Autenticação & Gestão - Sentinela.ai
// Squad A-Team | Mario Henrique & Antigravity AI
// Desenvolvido por Mario Henrique (mariozinhocs) - mariozinhocs@gmail.com
// "si vis pacem para bellum"

export type UserRole = 'admin' | 'user';

export type UserPlan = 'basic' | 'pro' | 'enterprise';

export type PlanStatus = 'active' | 'suspended';

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  plan: UserPlan;
  plan_status: PlanStatus;
  avatar_url?: string;
  timezone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserActivityLog {
  id?: number;
  action: string;
  details?: string;
  ip_address?: string;
  created_at: string;
}

export interface UserManagementMetrics {
  total_users: number;
  active_users: number;
  admin_count: number;
}
