// Modal de Conexão Headless do Instagram - Sentinela.ai
// Squad A-Team | Mario Henrique & Antigravity AI
// Desenvolvido por Mario Henrique (mariozinhocs) - mariozinhocs@gmail.com
// "si vis pacem para bellum"

import React, { useState, useEffect } from 'react';
import { 
  Instagram, 
  ShieldCheck, 
  Key, 
  User, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Sparkles, 
  RefreshCw, 
  Radio,
  Smartphone,
  Info,
  Cookie,
  Zap,
  HelpCircle
} from 'lucide-react';

interface InstagramServiceConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectionSuccess?: (username: string) => void;
}

export const InstagramServiceConnectModal: React.FC<InstagramServiceConnectModalProps> = ({
  isOpen,
  onClose,
  onConnectionSuccess
}) => {
  const [connectTab, setConnectTab] = useState<'instant' | 'sessionid' | 'password'>('instant');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [twoFactorIdentifier, setTwoFactorIdentifier] = useState('');
  const [obfuscatedPhone, setObfuscatedPhone] = useState('');
  const [isTwoFactorMode, setIsTwoFactorMode] = useState(false);
  const [showCookieTutorial, setShowCookieTutorial] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [statusInfo, setStatusInfo] = useState<{
    has_session: boolean;
    is_live: boolean;
    connected_username?: string;
    updated_at?: string;
  } | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Carrega status da conexão ao abrir o modal
  const fetchStatus = async () => {
    try {
      const res = await fetch('api/collector/instagram_auth.php');
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setStatusInfo(data);
      }
    } catch (e) {
      console.error('Erro ao verificar status do Instagram:', e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      setSuccessMessage(null);
      setIsTwoFactorMode(false);
      setTwoFactorCode('');
      fetchStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // 1. Ativação Instantânea (Modo de Coleta Aberta do Sentinela)
  const handleInstantActivation = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch('api/collector/instagram_auth.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'activate_service_mode',
          username: username.trim().replace(/^@/, '') || 'sentinela_collector'
        })
      });

      const data = await res.json();

      if (res.ok && data.status === 'success') {
        setSuccessMessage(data.message || 'Robô Ativado com Sucesso!');
        fetchStatus();
        if (onConnectionSuccess) {
          onConnectionSuccess(data.connected_username || 'sentinela_collector');
        }
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        throw new Error(data.message || 'Falha ao ativar o robô.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao conectar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Conexão por SessionID / Cookie (Infalível contra Bloqueios de IP)
  const handleConnectSessionId = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch('api/collector/instagram_auth.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_sessionid',
          sessionid: sessionId.trim(),
          username: username.trim().replace(/^@/, '') || 'minha_conta'
        })
      });

      const data = await res.json();

      if (res.ok && data.status === 'success') {
        setSuccessMessage(data.message || 'Conexão via Session Cookie ativa!');
        fetchStatus();
        if (onConnectionSuccess) {
          onConnectionSuccess(data.connected_username || username || 'minha_conta');
        }
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        throw new Error(data.message || 'Session ID inválido ou expirado.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao validar Session Cookie.');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Login Tradicional Headless
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch('api/collector/instagram_auth.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          username: username.trim().replace(/^@/, ''),
          password: password
        })
      });

      const data = await res.json();

      if (data.status === 'two_factor_required') {
        setIsTwoFactorMode(true);
        setTwoFactorIdentifier(data.two_factor_identifier || '');
        setObfuscatedPhone(data.obfuscated_phone || '');
        setSuccessMessage('Código de segurança enviado pelo Instagram.');
        return;
      }

      if (res.ok && data.status === 'success') {
        setSuccessMessage(data.message || 'Robô conectado com sucesso!');
        fetchStatus();
        if (onConnectionSuccess) {
          onConnectionSuccess(data.connected_username || username);
        }
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        throw new Error(data.message || 'O Instagram bloqueou a tentativa de login via IP do servidor. Use a aba "Instantâneo" ou "Session Cookie" para conectar com 100% de sucesso.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Falha ao autenticar.');
    } finally {
      setIsLoading(false);
    }
  };

  // Confirma Código de 2FA
  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch('api/collector/instagram_auth.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify_2fa',
          code: twoFactorCode.trim(),
          two_factor_identifier: twoFactorIdentifier,
          username: username.trim().replace(/^@/, '')
        })
      });

      const data = await res.json();

      if (res.ok && data.status === 'success') {
        setSuccessMessage(data.message || 'Autenticação concluída!');
        fetchStatus();
        if (onConnectionSuccess) {
          onConnectionSuccess(data.connected_username || username);
        }
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        throw new Error(data.message || 'Código de verificação inválido.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Falha na verificação de 2FA.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      
      <div className="glass-panel w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-pink-500/30 bg-slate-950/95 shadow-2xl shadow-pink-950/50 relative overflow-hidden">
        
        {/* Glow de Fundo */}
        <div className="absolute -top-12 -right-12 h-40 w-40 bg-pink-600/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 h-40 w-40 bg-purple-600/20 rounded-full blur-2xl pointer-events-none" />

        {/* Header da Modal */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 p-0.5 shadow-lg shadow-pink-500/30">
              <div className="h-full w-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Instagram className="h-5 w-5 text-pink-400" />
              </div>
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Robô Coletor do Instagram</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/10 text-pink-400 border border-pink-500/30">
                  Headless Engine
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Coleta aberta de posts, reels e métricas reais em tempo real
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status da Conexão Ativa */}
        <div className="mt-4 p-3.5 rounded-2xl border bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`h-3 w-3 rounded-full ${statusInfo?.has_session ? 'bg-emerald-400 animate-pulse shadow-lg shadow-emerald-500/50' : 'bg-rose-400'}`} />
            <div>
              <p className="text-xs font-bold text-slate-200">
                {statusInfo?.has_session 
                  ? `Robô Conectado ${statusInfo.connected_username ? `(@${statusInfo.connected_username})` : ''}` 
                  : 'Nenhum robô conectado no momento'}
              </p>
              <p className="text-[10px] text-slate-400">
                {statusInfo?.has_session
                  ? (statusInfo.is_live ? '🟢 Conexão ao vivo com servidores do Instagram' : '🟡 Sessão salva no servidor')
                  : 'Conecte uma conta para ativar a busca 100% real'}
              </p>
            </div>
          </div>

          <button
            onClick={fetchStatus}
            title="Atualizar Status"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Abas de Conexão */}
        {!isTwoFactorMode && (
          <div className="mt-4 grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800 text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => { setConnectTab('instant'); setErrorMessage(null); }}
              className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                connectTab === 'instant'
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Instantâneo</span>
            </button>

            <button
              type="button"
              onClick={() => { setConnectTab('sessionid'); setErrorMessage(null); }}
              className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                connectTab === 'sessionid'
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cookie className="w-3.5 h-3.5" />
              <span>Session Cookie</span>
            </button>

            <button
              type="button"
              onClick={() => { setConnectTab('password'); setErrorMessage(null); }}
              className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                connectTab === 'password'
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Senha</span>
            </button>
          </div>
        )}

        {/* ABA 1: Ativação Instantânea (Recomendado) */}
        {!isTwoFactorMode && connectTab === 'instant' && (
          <div className="mt-5 space-y-4 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-pink-950/40 border border-pink-500/20 space-y-2.5">
              <div className="flex items-center gap-2 text-pink-400 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span>Modo de Escuta Aberta Sentinela</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ativa o motor de inteligência e busca aberta do Sentinela em 1 clique. Não exige senha pessoal e permite monitorar qualquer marca ou concorrente com IA.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Nome do Robô / Operador (Opcional)
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Digite seu usuário ou e-mail"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 transition-all"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleInstantActivation}
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-xs font-bold text-white shadow-lg shadow-pink-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Ativando Coletor...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-yellow-300" />
                  <span>Ativar Robô em 1 Clique</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* ABA 2: SessionID / Cookie (Infalível para Conta Própria) */}
        {!isTwoFactorMode && connectTab === 'sessionid' && (
          <form onSubmit={handleConnectSessionId} className="mt-5 space-y-4 animate-fadeIn">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  Instagram Session ID (Cookie)
                </label>
                <button
                  type="button"
                  onClick={() => setShowCookieTutorial(!showCookieTutorial)}
                  className="text-[11px] text-pink-400 hover:text-pink-300 flex items-center gap-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Como obter?</span>
                </button>
              </div>

              <div className="relative">
                <Key className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="Ex: 583920194%3AfjK932mKls..."
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-pink-500 transition-all"
                />
              </div>
            </div>

            {showCookieTutorial && (
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 space-y-1.5 animate-fadeIn">
                <p className="font-bold text-pink-400">Passo a passo rápido (30 segundos):</p>
                <ol className="list-decimal list-inside space-y-1 text-slate-400">
                  <li>Abra o <strong className="text-slate-200">Instagram Web</strong> no navegador e faça login.</li>
                  <li>Pressione <strong className="text-slate-200">F12</strong> (Inspecionar) → aba <strong className="text-slate-200">Aplicativo (Application)</strong>.</li>
                  <li>Em <em>Cookies</em> → <code>https://www.instagram.com</code>, copie o valor do cookie <strong>sessionid</strong>.</li>
                </ol>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !sessionId.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-xs font-bold text-white shadow-lg shadow-pink-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Validando Cookie...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Conectar via Cookie</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* ABA 3: Usuário e Senha */}
        {!isTwoFactorMode && connectTab === 'password' && (
          <form onSubmit={handleLogin} className="mt-5 space-y-4 animate-fadeIn">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Usuário / E-mail do Instagram
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="Digite seu usuário ou e-mail"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Senha do Instagram
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-xs font-bold text-white shadow-lg shadow-pink-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Autenticando com Servidores da Meta...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>Conectar Robô Coletor</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Form 2FA (Dois Fatores) */}
        {isTwoFactorMode && (
          <form onSubmit={handleVerify2FA} className="mt-5 space-y-4 animate-fadeIn">
            <div className="p-3.5 rounded-2xl bg-pink-500/10 border border-pink-500/30 text-xs text-pink-200 flex items-center gap-3">
              <Smartphone className="w-6 h-6 text-pink-400 shrink-0" />
              <div>
                <p className="font-bold">Código de Segurança Solicitado</p>
                <p className="text-[11px] text-pink-300/80">
                  O Instagram enviou um código para {obfuscatedPhone || 'seu celular'}.
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Código de 6 Dígitos
              </label>
              <input
                type="text"
                required
                maxLength={8}
                placeholder="Ex: 123456"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 text-center text-lg font-mono tracking-widest text-white placeholder-slate-600 focus:outline-none focus:border-pink-500 transition-all"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsTwoFactorMode(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Voltar
              </button>
              <button
                type="submit"
                disabled={isLoading || !twoFactorCode.trim()}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-xs font-bold text-white shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? 'Verificando...' : 'Confirmar Código'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

