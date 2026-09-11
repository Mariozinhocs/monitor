// Painel do Usuário (Perfil & Configurações de Conta) - Sentinela.ai
// Squad A-Team | Mario Henrique & Antigravity AI
// Desenvolvido por Mario Henrique (mariozinhocs) - mariozinhocs@gmail.com
// "si vis pacem para bellum"

import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Key, 
  Clock, 
  Camera, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  Activity,
  Sparkles,
  Lock,
  Crown,
  Check,
  ArrowRight,
  Radio,
  Zap,
  Layers
} from 'lucide-react';
import { UserProfile, UserActivityLog } from '../../types/user';
import { getPlanConfig, getPlanServices } from '../../services/planPermissionsService';

interface UserProfileViewProps {
  user: UserProfile;
  onUpdateProfile?: (updatedData: Partial<UserProfile>, currentPass?: string, newPass?: string) => Promise<void>;
  activityLogs?: UserActivityLog[];
  onOpenPlans?: () => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  user,
  onUpdateProfile,
  activityLogs = [],
  onOpenPlans
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'security' | 'plan' | 'activity'>('profile');
  const [email, setEmail] = useState(user.email);
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url || '');
  const [timezone, setTimezone] = useState(user.timezone || 'America/Sao_Paulo');
  
  const planConfig = getPlanConfig(user.plan);
  const activeServices = getPlanServices(user.plan);
  
  // Troca de Senha
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusFeedback(null);
    setIsSaving(true);

    try {
      if (activeSubTab === 'security') {
        if (!newPassword) {
          throw new Error('Informe a nova senha desejada.');
        }
        if (newPassword !== confirmPassword) {
          throw new Error('A confirmação de senha não confere com a nova senha.');
        }
        if (newPassword.length < 6) {
          throw new Error('A nova senha deve possuir pelo menos 6 caracteres.');
        }
      }

      if (onUpdateProfile) {
        await onUpdateProfile(
          { email, avatar_url: avatarUrl, timezone },
          currentPassword,
          newPassword
        );
      }

      setStatusFeedback({
        type: 'success',
        message: activeSubTab === 'security' 
          ? 'Senha alterada com sucesso!' 
          : 'Dados do perfil salvos com sucesso!'
      });

      if (activeSubTab === 'security') {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      setStatusFeedback({
        type: 'error',
        message: err.message || 'Falha ao salvar as alterações.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header do Perfil com Capa Dark Cyberpunk */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-slate-800/80 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40">
        
        {/* Glow de Fundo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          
          {/* Avatar Grande com Anel Neon */}
          <div className="relative group">
            <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl overflow-hidden border-2 border-indigo-500/50 bg-slate-900 shadow-xl shadow-indigo-950/50 flex items-center justify-center text-3xl font-bold text-indigo-400">
              {avatarUrl ? (
                <img src={avatarUrl} alt={user.username} className="h-full w-full object-cover" />
              ) : (
                user.username.substring(0, 2).toUpperCase()
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 p-1.5 rounded-lg border-2 border-slate-950 text-slate-950 shadow-md">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>

          {/* Dados Principais do Usuário */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight">
                {user.username}
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                user.role === 'admin' 
                  ? 'bg-rose-500/15 border-rose-500/40 text-rose-300 shadow-sm shadow-rose-500/20' 
                  : 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300'
              }`}>
                {user.role === 'admin' ? '🛡️ Administrador Executivo' : '👤 Operador Sentinela'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/15 border border-emerald-500/40 text-emerald-300">
                ⚡ Plano {user.plan.toUpperCase()}
              </span>
            </div>

            <p className="text-sm text-slate-300 flex items-center justify-center sm:justify-start gap-2">
              <Mail className="h-3.5 w-3.5 text-indigo-400" />
              <span>{user.email}</span>
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-slate-500" />
                Fuso: <strong className="text-slate-200">{user.timezone || 'America/Sao_Paulo'}</strong>
              </span>
              <span>•</span>
              <span>ID da Conta: <strong className="text-slate-200">#STN-{String(user.id).padStart(4, '0')}</strong></span>
            </div>
          </div>

        </div>

        {/* Abas Internas de Navegação do Perfil */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('profile')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'profile'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <User className="h-3.5 w-3.5" />
            Dados Cadastrais
          </button>

          <button
            onClick={() => setActiveSubTab('security')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'security'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Key className="h-3.5 w-3.5" />
            Segurança & Senha
          </button>

          <button
            onClick={() => setActiveSubTab('plan')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'plan'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Crown className="h-3.5 w-3.5 text-yellow-400" />
            Plano & Quotas
          </button>

          <button
            onClick={() => setActiveSubTab('activity')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'activity'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            Trilha de Auditoria (Logs)
          </button>
        </div>

      </div>

      {/* Alerta de Feedback */}
      {statusFeedback && (
        <div className={`p-4 rounded-2xl border flex items-center gap-3 text-xs font-semibold animate-fadeIn ${
          statusFeedback.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
            : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
        }`}>
          {statusFeedback.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          )}
          <span>{statusFeedback.message}</span>
        </div>
      )}

      {/* ABA 1: Dados Cadastrais */}
      {activeSubTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-800">
          <div>
            <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
              <User className="h-4 w-4 text-indigo-400" />
              Informações do Perfil
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Atualize seu e-mail corporativo, imagem de avatar e fuso horário do painel.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Username (Somente Leitura) */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Nome de Usuário (Username)
              </label>
              <input
                type="text"
                value={user.username}
                disabled
                className="w-full rounded-xl bg-slate-900/60 border border-slate-800 px-4 py-2.5 text-xs text-slate-400 font-mono cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-500">O username é único e identificador no sistema.</span>
            </div>

            {/* E-mail */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Endereço de E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl bg-slate-900 border border-slate-700 focus:border-indigo-500 px-4 py-2.5 text-xs text-slate-100 outline-none transition-all"
              />
            </div>

            {/* URL do Avatar */}
            <div className="space-y-2 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                URL da Imagem de Avatar
              </label>
              <div className="flex gap-3">
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://exemplo.com/avatar.jpg"
                  className="flex-1 rounded-xl bg-slate-900 border border-slate-700 focus:border-indigo-500 px-4 py-2.5 text-xs text-slate-100 outline-none transition-all"
                />
              </div>
            </div>

            {/* Fuso Horário */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Fuso Horário Operacional
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-slate-700 focus:border-indigo-500 px-4 py-2.5 text-xs text-slate-100 outline-none transition-all"
              >
                <option value="America/Sao_Paulo">America/Sao_Paulo (GMT-3)</option>
                <option value="America/Manaus">America/Manaus (GMT-4)</option>
                <option value="UTC">UTC / GMT Universal</option>
              </select>
            </div>

          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</span>
            </button>
          </div>
        </form>
      )}

      {/* ABA 2: Segurança & Senha */}
      {activeSubTab === 'security' && (
        <form onSubmit={handleSaveProfile} className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-800">
          <div>
            <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
              <Lock className="h-4 w-4 text-indigo-400" />
              Alterar Senha de Acesso
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Escolha uma senha forte para proteger sua conta e o acesso aos alertas de crise.
            </p>
          </div>

          <div className="space-y-4 max-w-md">
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Senha Atual
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl bg-slate-900 border border-slate-700 focus:border-indigo-500 px-4 py-2.5 text-xs text-slate-100 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Nova Senha
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full rounded-xl bg-slate-900 border border-slate-700 focus:border-indigo-500 px-4 py-2.5 text-xs text-slate-100 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Confirmar Nova Senha
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a nova senha"
                className="w-full rounded-xl bg-slate-900 border border-slate-700 focus:border-indigo-500 px-4 py-2.5 text-xs text-slate-100 outline-none transition-all"
              />
            </div>

          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50"
            >
              <Key className="h-4 w-4" />
              <span>{isSaving ? 'Atualizando...' : 'Atualizar Senha'}</span>
            </button>
          </div>
        </form>
      )}

      {/* ABA 3: Plano & Quotas */}
      {activeSubTab === 'plan' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-400" />
                <span>Assinatura & Recursos do Plano</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {planConfig.name}
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {planConfig.tagline}
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenPlans}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 self-start sm:self-auto"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Alterar / Explorar Planos</span>
            </button>
          </div>

          {/* Quota Progress Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Marcas / Órgãos</span>
                <span className="font-bold text-white">1 de {planConfig.limits.maxBrands}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 rounded-full" 
                  style={{ width: `${Math.min(100, (1 / planConfig.limits.maxBrands) * 100)}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-slate-500">Alvos configurados simultaneamente</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Menções Mensais</span>
                <span className="font-bold text-white">14.2k de {planConfig.limits.monthlyMentionsLimit.toLocaleString()}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full" 
                  style={{ width: `${Math.min(100, (14200 / planConfig.limits.monthlyMentionsLimit) * 100)}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-slate-500">Volume indexado nas últimas 30d</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Equipe / Membros</span>
                <span className="font-bold text-white">2 de {planConfig.limits.maxTeamMembers}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-purple-500 rounded-full" 
                  style={{ width: `${Math.min(100, (2 / planConfig.limits.maxTeamMembers) * 100)}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-slate-500">Usuários com acesso ao painel</p>
            </div>
          </div>

          {/* Serviços Ativos no Plano */}
          <div className="space-y-3 pt-4 border-t border-slate-800/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Serviços Habilitados na sua Conta ({activeServices.length} de 12)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeServices.map((service) => (
                <div key={service.id} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{service.name}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{service.shortDescription}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ABA 4: Trilha de Auditoria (Activity Logs) */}
      {activeSubTab === 'activity' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4 border border-slate-800">
          <div>
            <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-indigo-400" />
              Histórico de Ações & Auditoria
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Registro imutável das últimas operações realizadas com o seu usuário (Conformidade M.E.L.T.).
            </p>
          </div>

          {activityLogs.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800 text-xs text-slate-400">
              Nenhuma atividade registrada até o momento.
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              {activityLogs.map((log, index) => (
                <div key={index} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      <Sparkles className="h-3.5 w-3.5" />
                    </span>
                    <div>
                      <p className="font-semibold text-slate-200">{log.action}</p>
                      {log.details && <p className="text-[11px] text-slate-400 mt-0.5">{log.details}</p>}
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-slate-400">
                    <p>{log.created_at}</p>
                    {log.ip_address && <p className="text-slate-500 font-mono">IP: {log.ip_address}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
