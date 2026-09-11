import React, { useState, useMemo } from 'react';
import { Mention, SocialChannel, SentimentType } from '../../types/monitor';
import { MentionCard } from './MentionCard';
import { 
  Search, 
  Filter, 
  Instagram, 
  Video, 
  Twitter, 
  Youtube, 
  Newspaper, 
  MessageSquareShare,
  SlidersHorizontal,
  Flame,
  RefreshCw
} from 'lucide-react';

interface MentionsFeedProps {
  mentions: Mention[];
  selectedTopicFilter?: string;
  onClearTopicFilter?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const MentionsFeed: React.FC<MentionsFeedProps> = ({
  mentions,
  selectedTopicFilter,
  onClearTopicFilter,
  onRefresh,
  isRefreshing = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<SocialChannel | 'all'>('all');
  const [selectedSentiment, setSelectedSentiment] = useState<SentimentType | 'all'>('all');
  const [onlyCrises, setOnlyCrises] = useState(false);

  const filteredMentions = useMemo(() => {
    return mentions.filter((m) => {
      // Busca textual
      if (searchTerm) {
        const text = `${m.content} ${m.author.name} ${m.author.username} ${m.topics.join(' ')}`.toLowerCase();
        if (!text.includes(searchTerm.toLowerCase())) return false;
      }

      // Filtro de canal
      if (selectedChannel !== 'all' && m.channel !== selectedChannel) return false;

      // Filtro de sentimento
      if (selectedSentiment !== 'all' && m.sentiment !== selectedSentiment) return false;

      // Filtro de tópicos externos
      if (selectedTopicFilter && !m.topics.some(t => t.toLowerCase() === selectedTopicFilter.toLowerCase())) {
        return false;
      }

      // Filtro de crises
      if (onlyCrises && m.riskLevel !== 'critical' && m.riskLevel !== 'high') return false;

      return true;
    });
  }, [mentions, searchTerm, selectedChannel, selectedSentiment, selectedTopicFilter, onlyCrises]);

  const channelButtons: { id: SocialChannel | 'all'; label: string; icon?: any }[] = [
    { id: 'all', label: 'Todas as Redes' },
    { id: 'instagram', label: 'Instagram', icon: Instagram },
    { id: 'tiktok', label: 'TikTok', icon: Video },
    { id: 'twitter', label: 'X / Twitter', icon: Twitter },
    { id: 'youtube', label: 'YouTube', icon: Youtube },
    { id: 'news', label: 'Notícias', icon: Newspaper },
    { id: 'reddit', label: 'Reddit', icon: MessageSquareShare },
  ];

  return (
    <div className="space-y-4">
      
      {/* Barra de Filtros & Busca */}
      <div className="glass-panel rounded-2xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          
          {/* Input de Busca */}
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por palavras-chave, autor, hashtags (#BugApp, Procon)..."
              className="w-full rounded-xl bg-slate-900/90 border border-slate-700/80 pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Filtro de Apenas Crises */}
          <button
            onClick={() => setOnlyCrises(!onlyCrises)}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold border transition-all whitespace-nowrap ${
              onlyCrises
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-sm shadow-rose-950/40'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className={`h-3.5 w-3.5 ${onlyCrises ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`} />
            <span>Apenas Alertas de Crise</span>
          </button>

          {/* Botão de Atualizar do Banco */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold border border-indigo-500/40 bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 transition-all whitespace-nowrap"
              title="Sincronizar com banco de dados MySQL"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-indigo-400' : 'text-indigo-400'}`} />
              <span>{isRefreshing ? 'Sincronizando...' : 'Atualizar Feed'}</span>
            </button>
          )}

          {/* Seletor de Sentimento */}
          <select
            value={selectedSentiment}
            onChange={(e) => setSelectedSentiment(e.target.value as any)}
            className="rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs font-medium text-slate-200 focus:border-indigo-500 focus:outline-none"
          >
            <option value="all">Todos os Sentimentos</option>
            <option value="positive">Positivo</option>
            <option value="neutral">Neutro</option>
            <option value="negative">Negativo</option>
            <option value="critical">Crítico (Crise)</option>
          </select>
        </div>

        {/* Channels Pill Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
          {channelButtons.map((btn) => {
            const Icon = btn.icon;
            const isSelected = selectedChannel === btn.id;

            return (
              <button
                key={btn.id}
                onClick={() => setSelectedChannel(btn.id)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium border transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}
                <span>{btn.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Topic Filter Pill if any */}
        {selectedTopicFilter && (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-800 text-xs">
            <span className="text-slate-400">Filtrando pelo tópico:</span>
            <span className="rounded-md bg-indigo-500/20 border border-indigo-500/40 px-2 py-0.5 font-semibold text-indigo-300 flex items-center gap-1">
              #{selectedTopicFilter}
              <button onClick={onClearTopicFilter} className="hover:text-white ml-1">✕</button>
            </span>
          </div>
        )}
      </div>

      {/* Feed List */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-1 text-xs text-slate-400">
          <span>Mostrando <strong>{filteredMentions.length}</strong> de {mentions.length} publicações indexadas</span>
          <span>Ordenado por: <strong>Mais Recentes</strong></span>
        </div>

        {filteredMentions.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center">
            <p className="text-base font-semibold text-slate-300">Nenhuma menção encontrada para esses filtros.</p>
            <p className="text-xs text-slate-500 mt-1">Tente remover os filtros ou buscar por outro termo.</p>
          </div>
        ) : (
          filteredMentions.map((mention) => (
            <MentionCard key={mention.id} mention={mention} />
          ))
        )}
      </div>

    </div>
  );
};
