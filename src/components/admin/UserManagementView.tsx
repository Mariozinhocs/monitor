// Painel de Gestão de Usuários (Admin) - Sentinela.ai
// Squad A-Team | Mario Henrique & Antigravity AI
// Desenvolvido por Mario Henrique (mariozinhocs) - mariozinhocs@gmail.com
// "si vis pacem para bellum"

import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Key, 
  CheckCircle2, 
  AlertCircle,
  X,
  Sparkles,
  Shield,
  Zap
} from 'lucide-react';
import { UserProfile, UserManagementMetrics } from '../../types/user';

interface UserManagementViewProps {
  usersList: UserProfile[];
  metrics: UserManagementMetrics;
  onCreateUser: (newUser: { username: string; email: string; password: string; role: 'admin' | 'user'; plan: 'basic' | 'pro' | 'enterprise'; avatar_url?: string }) => Promise<void>;
  onUpdateUser: (updatedUser: Partial<UserProfile> & { id: number }) => Promise<void>;
  onResetUserPassword: (userId: number, newPass: string) => Promise<void>;
  onDeleteUser: (userId: number) => Promise<void>;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  usersList,
  metrics,
  onCreateUser,
  onUpdateUser,
  onResetUserPassword,
  onDeleteUser
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  
  // Modais State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [resettingUserPassword, setResettingUserPassword] = useState<UserProfile | null>(null);

  // Form State Novo Usuário
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'user'>('user');
  const [newPlan, setNewPlan] = useState<'basic' | 'pro' | 'enterprise'>('enterprise');
  const [newAvatarUrl, setNewAvatarUrl] = useState('');

  // Form State Edição Usuário
  const [editRole, setEditRole] = useState<'admin' | 'user'>('user');
  const [editPlan, setEditPlan] = useState<'basic' | 'pro' | 'enterprise'>('enterprise');
  const [editStatus, setEditStatus] = useState<'active' | 'suspended'>('active');

  // Form State Reset Senha
  const [adminResetPass, setAdminResetPass] = useState('');

  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filtrar Usuários
  const filteredUsers = usersList.filter((u) => {
    const matchesSearch = 
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Handler Criar Usuário
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newEmail || !newPassword) {
      showToast('error', 'Preencha todos os campos obrigatórios.');
      return;
    }
    setIsLoadingAction(true);
    try {
      await onCreateUser({
        username: newUsername,
        email: newEmail,
        password: newPassword,
        role: newRole,
        plan: newPlan,
        avatar_url: newAvatarUrl
      });
      showToast('success', `Usuário @${newUsername} criado com sucesso!`);
      setIsCreateModalOpen(false);
      setNewUsername('');
      setNewEmail('');
      setNewPassword('');
      setNewAvatarUrl('');
    } catch (err: any) {
      showToast('error', err.message || 'Falha ao criar usuário.');
    } finally {
      setIsLoadingAction(false);
    }
  };

  // Handler Atualizar Usuário
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setIsLoadingAction(true);
    try {
      await onUpdateUser({
        id: editingUser.id,
        role: editRole,
        plan: editPlan,
        plan_status: editStatus
      });
      showToast('success', `Permissões de @${editingUser.username} atualizadas com sucesso.`);
      setEditingUser(null);
    } catch (err: any) {
      showToast('error', err.message || 'Falha ao atualizar usuário.');
    } finally {
      setIsLoadingAction(false);
    }
  };

  // Handler Redefinir Senha
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resettingUserPassword || !adminResetPass) return;
    setIsLoadingAction(true);
    try {
      await onResetUserPassword(resettingUserPassword.id, adminResetPass);
      showToast('success', `Senha do usuário @${resettingUserPassword.username} redefinida.`);
      setResettingUserPassword(null);
      setAdminResetPass('');
    } catch (err: any) {
      showToast('error', err.message || 'Falha ao redefinir senha.');
    } finally {
      setIsLoadingAction(false);
    }
  };

  // Handler Deletar Usuário
  const handleDeleteConfirm = async (user: UserProfile) => {
    if (!window.confirm(`Tem certeza que deseja desativar o acesso do usuário @${user.username}?`)) {
      return;
    }
    try {
      await onDeleteUser(user.id);
      showToast('success', `Acesso de @${user.username} suspenso.`);
    } catch (err: any) {
      showToast('error', err.message || 'Falha ao remover usuário.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Top Banner do Painel de Gestão */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/30">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-heading text-white tracking-tight flex items-center gap-2">
              <Users className="h-6 w-6 text-indigo-400" />
              Gestão de Usuários & Controle de Acesso
            </h1>
            <span className="rounded-full bg-rose-500/10 border border-rose-500/30 px-2.5 py-0.5 text-[10px] font-bold text-rose-300 uppercase tracking-wider">
              Área Restrita Admin
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Administre contas do sistema, atribua cargos corporativos e gerencie privilégios de acesso.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all active:scale-95 shrink-0"
        >
          <UserPlus className="h-4 w-4" />
          <span>Cadastrar Novo Usuário</span>
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className={`p-4 rounded-2xl border flex items-center gap-3 text-xs font-semibold animate-fadeIn ${
          toastMessage.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
            : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
        }`}>
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* KPI Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total de Usuários</p>
            <p className="text-2xl font-bold font-heading text-white mt-1">{metrics.total_users}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Usuários Ativos</p>
            <p className="text-2xl font-bold font-heading text-emerald-400 mt-1">{metrics.active_users}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Zap className="h-5 w-5" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Administradores</p>
            <p className="text-2xl font-bold font-heading text-rose-400 mt-1">{metrics.admin_count}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Shield className="h-5 w-5" />
          </div>
        </div>

      </div>

      {/* Tabela de Usuários com Filtro & Buscas */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
        
        {/* Barra de Filtros */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Busca por Texto */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por username ou e-mail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl bg-slate-900 border border-slate-700 pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500"
            />
          </div>

          {/* Filtro por Role */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-slate-400 shrink-0" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500"
            >
              <option value="all">Todos os Cargos</option>
              <option value="admin">Apenas Admins</option>
              <option value="user">Apenas Usuários Operadores</option>
            </select>
          </div>

        </div>

        {/* Tabela de Dados */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Usuário</th>
                <th className="p-4">E-mail</th>
                <th className="p-4">Perfil (Role)</th>
                <th className="p-4">Plano</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-950/40">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Nenhum usuário encontrado com os filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-900/50 transition-colors">
                    
                    {/* Usuário + Avatar */}
                    <td className="p-4 font-medium text-white">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-indigo-400 text-xs shrink-0">
                          {user.avatar_url ? (
                            <img src={user.avatar_url} alt={user.username} className="h-full w-full object-cover" />
                          ) : (
                            user.username.substring(0, 2).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-white">@{user.username}</p>
                          <p className="text-[10px] text-slate-500 font-mono">ID: #{user.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="p-4 text-slate-300 font-mono">{user.email}</td>

                    {/* Role */}
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        user.role === 'admin'
                          ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                          : 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300'
                      }`}>
                        {user.role === 'admin' ? '🛡️ Admin' : '👤 User'}
                      </span>
                    </td>

                    {/* Plano */}
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                        ⚡ {user.plan}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        user.plan_status === 'active'
                          ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                          : 'bg-amber-500/15 border border-amber-500/30 text-amber-400'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${user.plan_status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                        {user.plan_status === 'active' ? 'Ativo' : 'Suspenso'}
                      </span>
                    </td>

                    {/* Ações */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Editar Role/Plano */}
                        <button
                          onClick={() => {
                            setEditingUser(user);
                            setEditRole(user.role);
                            setEditPlan(user.plan);
                            setEditStatus(user.plan_status);
                          }}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-all"
                          title="Editar permissões e plano"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>

                        {/* Reset de Senha */}
                        <button
                          onClick={() => setResettingUserPassword(user)}
                          className="p-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-800/80 transition-all"
                          title="Redefinir Senha do Usuário"
                        >
                          <Key className="h-3.5 w-3.5" />
                        </button>

                        {/* Deletar / Suspender */}
                        <button
                          onClick={() => handleDeleteConfirm(user)}
                          className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-400 border border-rose-800/80 transition-all"
                          title="Desativar Conta de Usuário"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* MODAL 1: Cadastrar Novo Usuário */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-indigo-400" />
                Cadastrar Novo Usuário
              </h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              
              <div>
                <label className="text-xs font-semibold text-slate-300">Username (Nome de Usuário)</label>
                <input
                  type="text"
                  required
                  placeholder="ex: marcio_analista"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full mt-1 rounded-xl bg-slate-900 border border-slate-700 px-4 py-2 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">E-mail Corporativo</label>
                <input
                  type="email"
                  required
                  placeholder="marcio@empresa.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full mt-1 rounded-xl bg-slate-900 border border-slate-700 px-4 py-2 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Senha Inicial</label>
                <input
                  type="password"
                  required
                  placeholder="Mínimo 6 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full mt-1 rounded-xl bg-slate-900 border border-slate-700 px-4 py-2 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Nível de Permissão (Role)</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    className="w-full mt-1 rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                  >
                    <option value="user">Usuário Operador</option>
                    <option value="admin">Administrador Executivo</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300">Plano Ativo</label>
                  <select
                    value={newPlan}
                    onChange={(e) => setNewPlan(e.target.value as any)}
                    className="w-full mt-1 rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                  >
                    <option value="basic">Basic</option>
                    <option value="pro">Pro</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">URL do Avatar (Opcional)</label>
                <input
                  type="url"
                  placeholder="https://exemplo.com/avatar.jpg"
                  value={newAvatarUrl}
                  onChange={(e) => setNewAvatarUrl(e.target.value)}
                  className="w-full mt-1 rounded-xl bg-slate-900 border border-slate-700 px-4 py-2 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoadingAction}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30"
                >
                  {isLoadingAction ? 'Cadastrando...' : 'Criar Conta'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Editar Usuário */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold font-heading text-white">Editar Permissões</h2>
                <p className="text-xs text-indigo-400 font-mono">@{editingUser.username}</p>
              </div>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              
              <div>
                <label className="text-xs font-semibold text-slate-300">Cargo / Permissão</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as any)}
                  className="w-full mt-1 rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                >
                  <option value="user">Usuário Operador</option>
                  <option value="admin">Administrador Executivo</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Plano de Assinatura</label>
                <select
                  value={editPlan}
                  onChange={(e) => setEditPlan(e.target.value as any)}
                  className="w-full mt-1 rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                >
                  <option value="basic">Basic</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Status da Conta</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full mt-1 rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                >
                  <option value="active">Ativo (Acesso Liberado)</option>
                  <option value="suspended">Suspenso (Bloqueado)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoadingAction}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30"
                >
                  {isLoadingAction ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Resetar Senha por Admin */}
      {resettingUserPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
                  <Key className="h-5 w-5 text-indigo-400" />
                  Redefinir Senha
                </h2>
                <p className="text-xs text-indigo-400 font-mono">@{resettingUserPassword.username}</p>
              </div>
              <button onClick={() => setResettingUserPassword(null)} className="text-slate-400 hover:text-white p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              
              <div>
                <label className="text-xs font-semibold text-slate-300">Nova Senha Temporária</label>
                <input
                  type="text"
                  required
                  placeholder="Digite a nova senha..."
                  value={adminResetPass}
                  onChange={(e) => setAdminResetPass(e.target.value)}
                  className="w-full mt-1 rounded-xl bg-slate-900 border border-slate-700 px-4 py-2 text-xs text-white outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setResettingUserPassword(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoadingAction}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30"
                >
                  {isLoadingAction ? 'Processando...' : 'Confirmar Redefinição'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
