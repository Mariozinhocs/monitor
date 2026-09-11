// Modal/Tela de Autenticação - Sentinela.ai
// Squad A-Team | Mario Henrique & Antigravity AI
// Desenvolvido por Mario Henrique (mariozinhocs) - mariozinhocs@gmail.com
// "si vis pacem para bellum"

import React, { useState } from 'react';
import { Radio, Lock, User, AlertCircle, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { UserProfile } from '../../types/user';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const response = await fetch('api/auth/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok && data.status === 'success' && data.user) {
        onLoginSuccess(data.user);
        onClose();
      } else {
        throw new Error(data.message || 'Credenciais inválidas ou usuário não cadastrado.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Falha ao autenticar no servidor. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      
      <div className="glass-panel w-full max-w-md rounded-3xl p-6 sm:p-8 border border-indigo-500/30 bg-slate-950/90 shadow-2xl shadow-indigo-950/50 relative overflow-hidden">
        
        {/* Glow de Fundo */}
        <div className="absolute -top-12 -right-12 h-40 w-40 bg-indigo-600/20 rounded-full blur-2xl pointer-events-none" />

        {/* Header da Modal */}
        <div className="text-center space-y-3 mb-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/30">
            <div className="h-full w-full rounded-[14px] bg-slate-950 flex items-center justify-center">
              <Radio className="h-6 w-6 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold font-heading text-white">
              Sentinela<span className="text-indigo-400">.ai</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Autenticação de Usuário & Controle de Acesso
            </p>
          </div>
        </div>


        {/* Feedback de Erro */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Formulário de Login */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Usuário ou E-mail</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite seu usuário ou e-mail"
                className="w-full rounded-xl bg-slate-900 border border-slate-700 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Senha de Acesso</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl bg-slate-900 border border-slate-700 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50"
            >
              <span>{isLoading ? 'Autenticando...' : 'Entrar no Sentinela.ai'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};
