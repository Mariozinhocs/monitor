import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Tag, 
  ShieldAlert, 
  Building2, 
  Layers, 
  CheckCircle2, 
  X, 
  Plus, 
  Radio, 
  Sparkles, 
  Trash2,
  Sliders,
  Bell
} from 'lucide-react';
import { BrandOverview, SocialChannel } from '../../types/monitor';

export interface BrandMonitorConfig {
  brandName: string;
  primaryKeywords: string[];
  sensitiveCrisisTerms: string[];
  competitors: string[];
  monitoredChannels: SocialChannel[];
  alertSensitivity: 'low' | 'medium' | 'high';
}

interface BrandMonitorSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: BrandOverview;
  initialConfig?: BrandMonitorConfig;
  onSaveConfig: (newConfig: BrandMonitorConfig) => void;
}

export function BrandMonitorSetupModal({
  isOpen,
  onClose,
  brand,
  initialConfig,
  onSaveConfig,
}: BrandMonitorSetupModalProps) {
  const [brandName, setBrandName] = useState(initialConfig?.brandName || brand.brandName || 'Centro de Cooperação da Cidade');
  
  const [primaryKeywords, setPrimaryKeywords] = useState<string[]>(
    initialConfig?.primaryKeywords || [
      brand.brandName || 'Centro de Cooperação da Cidade',
      '#MonitoramentoUrbano',
      'Defesa Civil',
      'Trânsito & Vias'
    ]
  );
  const [newKeyword, setNewKeyword] = useState('');

  const [sensitiveTerms, setSensitiveTerms] = useState<string[]>(
    initialConfig?.sensitiveCrisisTerms || [
      'Alagamento',
      'Semáforo Quebrado',
      'Acidente Grave',
      'Deslizamento',
      'Falta de Luz',
      'Interdição'
    ]
  );
  const [newSensitiveTerm, setNewSensitiveTerm] = useState('');

  const [competitors, setCompetitors] = useState<string[]>(
    initialConfig?.competitors || [
      'Centro de Operações Rio (COR)',
      'CET Trânsito',
      'Central Integrada 190'
    ]
  );
  const [newCompetitor, setNewCompetitor] = useState('');

  const [monitoredChannels, setMonitoredChannels] = useState<SocialChannel[]>(
    initialConfig?.monitoredChannels || ['instagram', 'tiktok', 'twitter', 'youtube', 'news', 'reddit']
  );

  const [alertSensitivity, setAlertSensitivity] = useState<'low' | 'medium' | 'high'>(
    initialConfig?.alertSensitivity || 'high'
  );

  const [instagramSessionId, setInstagramSessionId] = useState('');
  const [isSavingSession, setIsSavingSession] = useState(false);
  const [sessionStatusMsg, setSessionStatusMsg] = useState<string | null>(null);

  // Sincroniza o formulário com a configuração ativa sempre que a modal for aberta
  useEffect(() => {
    if (isOpen) {
      const activeName = initialConfig?.brandName || brand.brandName || 'Mario Henrique (@mariozinhocs)';
      setBrandName(activeName);
      setPrimaryKeywords(initialConfig?.primaryKeywords || [
        activeName,
        '#mariozinhocs',
        'Mario Henrique',
        'Sentinela AI'
      ]);
      setSensitiveTerms(initialConfig?.sensitiveCrisisTerms || [
        'Crítica',
        'Fake News',
        'Golpe',
        'Reclamação',
        'Instabilidade'
      ]);
      setCompetitors(initialConfig?.competitors || [
        'Tech Influencers BR',
        'Startups de IA'
      ]);
      setMonitoredChannels(initialConfig?.monitoredChannels || [
        'instagram', 'tiktok', 'twitter', 'youtube', 'news', 'reddit'
      ]);
      setAlertSensitivity(initialConfig?.alertSensitivity || 'high');

      // Verifica status da sessão no backend
      fetch('api/collector/session_manager.php')
        .then(res => res.json())
        .then(data => {
          if (data && data.has_session) {
            setSessionStatusMsg(`✅ Sessão conectada (${data.session_preview})`);
          }
        })
        .catch(() => {});
    }
  }, [isOpen, initialConfig, brand.brandName]);

  const handleSaveInstagramSession = async () => {
    if (!instagramSessionId.trim()) return;
    setIsSavingSession(true);
    setSessionStatusMsg(null);
    try {
      const res = await fetch('api/collector/session_manager.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionid: instagramSessionId.trim() })
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setSessionStatusMsg('✅ Cookie de sessão salvo! Coletor autenticado com o Instagram.');
      } else {
        setSessionStatusMsg(`⚠️ ${data.message || 'Falha ao salvar sessão.'}`);
      }
    } catch (err: any) {
      setSessionStatusMsg('⚠️ Erro de comunicação ao salvar sessão.');
    } finally {
      setIsSavingSession(false);
    }
  };

  if (!isOpen) return null;

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newKeyword.trim() && !primaryKeywords.includes(newKeyword.trim())) {
      setPrimaryKeywords([...primaryKeywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setPrimaryKeywords(primaryKeywords.filter(k => k !== keyword));
  };

  const handleAddSensitiveTerm = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSensitiveTerm.trim() && !sensitiveTerms.includes(newSensitiveTerm.trim())) {
      setSensitiveTerms([...sensitiveTerms, newSensitiveTerm.trim()]);
      setNewSensitiveTerm('');
    }
  };

  const handleRemoveSensitiveTerm = (term: string) => {
    setSensitiveTerms(sensitiveTerms.filter(t => t !== term));
  };

  const handleAddCompetitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCompetitor.trim() && !competitors.includes(newCompetitor.trim())) {
      setCompetitors([...competitors, newCompetitor.trim()]);
      setNewCompetitor('');
    }
  };

  const handleRemoveCompetitor = (comp: string) => {
    setCompetitors(competitors.filter(c => c !== comp));
  };

  const toggleChannel = (channel: SocialChannel) => {
    if (monitoredChannels.includes(channel)) {
      if (monitoredChannels.length > 1) {
        setMonitoredChannels(monitoredChannels.filter(c => c !== channel));
      }
    } else {
      setMonitoredChannels([...monitoredChannels, channel]);
    }
  };

  const handleSave = () => {
    onSaveConfig({
      brandName,
      primaryKeywords,
      sensitiveCrisisTerms: sensitiveTerms,
      competitors,
      monitoredChannels,
      alertSensitivity
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-heading text-white">
                Definição do Que Monitorar (Alvo de Monitoramento)
              </h2>
              <p className="text-xs text-slate-400">
                Configure os termos da sua marca, palavras-chave de crise, concorrentes e redes sociais ativas.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Section 1: Nome da Marca */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-400" />
              <span>1. Nome da Sua Marca / Empresa Monitorada</span>
            </label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Ex: Sentinela Tech, Minha Empresa, Produto X"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Section 2: Palavras-chave Principais & Hashtags */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Tag className="w-4 h-4 text-indigo-400" />
              <span>2. Palavras-chave e Hashtags da Marca</span>
            </label>
            <p className="text-xs text-slate-400">
              Termos que a IA vai rastrear continuamente no Instagram, TikTok, X, YouTube, Notícias e Reddit.
            </p>

            <form onSubmit={handleAddKeyword} className="flex gap-2">
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="Ex: @MinhaMarca, #LancamentoProduto, MinhaMarca"
                className="flex-1 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Adicionar
              </button>
            </form>

            <div className="flex flex-wrap gap-2">
              {primaryKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center gap-2"
                >
                  <span>{kw}</span>
                  <button
                    onClick={() => handleRemoveKeyword(kw)}
                    className="hover:text-rose-400 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Section 3: Termos Sensíveis & Gatilhos de Crise */}
          <div className="space-y-3 pt-2 border-t border-slate-800/80">
            <label className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>3. Termos Sensíveis de Alerta Preditivo de Crise</span>
            </label>
            <p className="text-xs text-slate-400">
              Se qualquer menção contiver a marca + uma destas palavras, um alerta prioritário de crise será disparado para a equipe.
            </p>

            <form onSubmit={handleAddSensitiveTerm} className="flex gap-2">
              <input
                type="text"
                value={newSensitiveTerm}
                onChange={(e) => setNewSensitiveTerm(e.target.value)}
                placeholder="Ex: Procon, Processo, ReclameAqui, Vazamento, Demora"
                className="flex-1 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-xs font-bold text-white flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Adicionar
              </button>
            </form>

            <div className="flex flex-wrap gap-2">
              {sensitiveTerms.map((term, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-2"
                >
                  <span>{term}</span>
                  <button
                    onClick={() => handleRemoveSensitiveTerm(term)}
                    className="hover:text-rose-400 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Section 4: Concorrentes para Benchmark */}
          <div className="space-y-3 pt-2 border-t border-slate-800/80">
            <label className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-400" />
              <span>4. Concorrentes para Comparativo de Mercado (Share of Voice)</span>
            </label>

            <form onSubmit={handleAddCompetitor} className="flex gap-2">
              <input
                type="text"
                value={newCompetitor}
                onChange={(e) => setNewCompetitor(e.target.value)}
                placeholder="Ex: Concorrente Alpha, Empresa Beta"
                className="flex-1 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Adicionar
              </button>
            </form>

            <div className="flex flex-wrap gap-2">
              {competitors.map((comp, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold flex items-center gap-2"
                >
                  <span>{comp}</span>
                  <button
                    onClick={() => handleRemoveCompetitor(comp)}
                    className="hover:text-rose-400 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Section 5: Canais Ativos de Varredura */}
          <div className="space-y-3 pt-2 border-t border-slate-800/80">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400" />
              <span>5. Canais e Redes Sociais Ativas</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { id: 'instagram', label: 'Instagram (Reels/Feed)' },
                { id: 'tiktok', label: 'TikTok' },
                { id: 'twitter', label: 'X (Twitter)' },
                { id: 'youtube', label: 'YouTube (Shorts/Vídeos)' },
                { id: 'news', label: 'Portais de Notícias' },
                { id: 'reddit', label: 'Reddit & Fóruns' },
              ].map((ch) => {
                const isActive = monitoredChannels.includes(ch.id as SocialChannel);
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => toggleChannel(ch.id as SocialChannel)}
                    className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                      isActive
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{ch.label}</span>
                    {isActive && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 6: Conexão Direta ao Vivo do Instagram (Session / Cookie) */}
          <div className="space-y-3 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span>6. Conexão ao Vivo do Instagram (Cookie de Sessão)</span>
              </label>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/10 text-pink-400 border border-pink-500/30">
                Opção 2 Ativa
              </span>
            </div>
            
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Para capturar 100% dos posts, carrosséis e reels reais de qualquer perfil público sem bloqueios, insira o cookie <code className="text-pink-300 bg-slate-950 px-1 py-0.5 rounded">sessionid</code> de uma conta do Instagram (Chrome F12 &gt; Application &gt; Cookies &gt; instagram.com &gt; sessionid):
            </p>

            <div className="flex gap-2">
              <input
                type="password"
                placeholder="Ex: 684920482%3Akf92... (ou cole o cookie completo)"
                value={instagramSessionId}
                onChange={(e) => setInstagramSessionId(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 transition-all font-mono"
              />
              <button
                type="button"
                onClick={handleSaveInstagramSession}
                disabled={isSavingSession || !instagramSessionId.trim()}
                className="px-4 py-2.5 rounded-xl bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/40 text-pink-300 text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 shrink-0"
              >
                {isSavingSession ? 'Salvando...' : 'Conectar Sessão'}
              </button>
            </div>
            {sessionStatusMsg && (
              <p className="text-[11px] text-emerald-400 font-medium animate-fadeIn">
                {sessionStatusMsg}
              </p>
            )}
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-all"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>Salvar e Atualizar Radar de IA</span>
          </button>
        </div>

      </div>
    </div>
  );
}
