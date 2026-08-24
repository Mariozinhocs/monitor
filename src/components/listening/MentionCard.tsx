import React, { useState } from 'react';
import { Mention } from '../../types/monitor';
import { 
  Instagram, 
  Video, 
  Twitter, 
  Youtube, 
  Newspaper, 
  MessageSquareShare,
  Heart,
  MessageCircle,
  Share2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Volume2,
  FileText,
  Send
} from 'lucide-react';

interface MentionCardProps {
  mention: Mention;
  onRespond?: (mentionId: string) => void;
}

export const MentionCard: React.FC<MentionCardProps> = ({ mention, onRespond }) => {
  const [showResponseBox, setShowResponseBox] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSent, setIsSent] = useState(false);

  const getChannelIcon = (channel: Mention['channel']) => {
    switch (channel) {
      case 'instagram': return <Instagram className="h-4 w-4 text-pink-400" />;
      case 'tiktok': return <Video className="h-4 w-4 text-cyan-400" />;
      case 'twitter': return <Twitter className="h-4 w-4 text-sky-400" />;
      case 'youtube': return <Youtube className="h-4 w-4 text-red-400" />;
      case 'news': return <Newspaper className="h-4 w-4 text-emerald-400" />;
      case 'reddit': return <MessageSquareShare className="h-4 w-4 text-orange-400" />;
    }
  };

  const getSentimentBadge = (sentiment: Mention['sentiment']) => {
    switch (sentiment) {
      case 'positive':
        return <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">Positivo</span>;
      case 'neutral':
        return <span className="rounded-full bg-slate-500/15 border border-slate-500/30 px-2.5 py-0.5 text-[11px] font-semibold text-slate-300">Neutro</span>;
      case 'negative':
        return <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300">Negativo</span>;
      case 'critical':
        return <span className="rounded-full bg-rose-500/20 border border-rose-500/40 px-2.5 py-0.5 text-[11px] font-bold text-rose-300 animate-pulse flex items-center gap-1"><Flame className="h-3 w-3" /> Crítico</span>;
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setIsSent(true);
    setTimeout(() => {
      setShowResponseBox(false);
      setIsSent(false);
      setReplyText('');
    }, 1800);
  };

  return (
    <div className={`glass-panel rounded-2xl p-5 transition-all ${
      mention.riskLevel === 'critical' ? 'border-rose-500/40 shadow-lg shadow-rose-950/20' : 'hover:border-slate-700'
    }`}>
      
      {/* Header do Autor & Canal */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={mention.author.avatar}
            alt={mention.author.name}
            className="h-10 w-10 rounded-full object-cover border border-slate-700"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-white">{mention.author.name}</span>
              {mention.author.verified && (
                <CheckCircle2 className="h-3.5 w-3.5 text-sky-400" title="Perfil Verificado" />
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>{mention.author.username}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                {getChannelIcon(mention.channel)}
                <span className="capitalize">{mention.channel}</span>
              </span>
              <span>•</span>
              <span>{mention.timestamp}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {getSentimentBadge(mention.sentiment)}
        </div>
      </div>

      {/* Conteúdo do Post */}
      <p className="mt-3.5 text-sm text-slate-200 leading-relaxed">
        {mention.content}
      </p>

      {/* Mídia / Imagem / Transcrição de Vídeo */}
      {mention.mediaUrl && (
        <div className="mt-3 overflow-hidden rounded-xl border border-slate-800 relative max-h-56">
          <img
            src={mention.mediaUrl}
            alt="Mídia da menção"
            className="w-full object-cover max-h-56"
          />
          {mention.mediaType === 'video' && (
            <div className="absolute top-2 right-2 rounded-md bg-slate-950/80 px-2 py-1 text-[10px] font-bold text-white flex items-center gap-1 border border-slate-700">
              <Video className="h-3 w-3 text-red-400" /> Vídeo / Reel
            </div>
          )}
        </div>
      )}

      {/* Transcrição de Áudio/Vídeo por IA */}
      {mention.transcription && (
        <div className="mt-3 rounded-xl bg-slate-900/90 border border-indigo-500/20 p-3 text-xs text-indigo-200">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-400 mb-1">
            <Volume2 className="h-3.5 w-3.5" />
            Transcrição Multimodal de Áudio (Sentinela Voice IA):
          </div>
          <p className="italic text-slate-300">{mention.transcription}</p>
        </div>
      )}

      {/* IA Insights Badge / Ação Sugerida */}
      <div className="mt-3.5 rounded-xl bg-gradient-to-r from-slate-900 to-indigo-950/30 border border-slate-800 p-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-semibold text-indigo-300 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-yellow-400" />
            Diagnóstico Sentinela IA:
          </span>
          <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium text-indigo-300 border border-indigo-500/20">
            Emoção: {mention.aiAnalysis.emotion}
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {mention.aiAnalysis.summary}
        </p>
        {mention.aiAnalysis.suggestedAction && (
          <p className="mt-1.5 text-xs text-amber-300 font-medium flex items-center gap-1">
            💡 <strong>Recomendação:</strong> {mention.aiAnalysis.suggestedAction}
          </p>
        )}
      </div>

      {/* Métricas de Engajamento & Ações */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 hover:text-slate-200">
            <Heart className="h-3.5 w-3.5 text-pink-400" /> {mention.likes.toLocaleString()}
          </span>
          <span className="flex items-center gap-1 hover:text-slate-200">
            <MessageCircle className="h-3.5 w-3.5 text-sky-400" /> {mention.comments.toLocaleString()}
          </span>
          <span className="flex items-center gap-1 hover:text-slate-200">
            <Share2 className="h-3.5 w-3.5 text-emerald-400" /> {mention.shares.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowResponseBox(!showResponseBox)}
            className="flex items-center gap-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-all"
          >
            <MessageCircle className="h-3.5 w-3.5 text-indigo-400" />
            <span>{showResponseBox ? 'Cancelar' : 'Responder / Interagir'}</span>
          </button>
        </div>
      </div>

      {/* Caixa de Resposta Rápida (SAC / Retratação) */}
      {showResponseBox && (
        <form onSubmit={handleSendReply} className="mt-3 pt-3 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Responder via perfil oficial da marca:</span>
            <button
              type="button"
              onClick={() => setReplyText(`Olá @${mention.author.username}, lamentamos o ocorrido. Nossa equipe técnica já está atuando para normalizar o checkout. Poderia nos enviar seu e-mail via mensagem privada para priorizarmos seu cupom?`)}
              className="text-indigo-400 hover:underline text-[11px]"
            >
              🪄 Usar resposta sugerida por IA
            </button>
          </div>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Digite a resposta oficial ou selecione uma sugestão da IA..."
            rows={2}
            className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
          <div className="flex justify-end gap-2">
            <button
              type="submit"
              disabled={isSent || !replyText.trim()}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 text-xs font-semibold text-white transition-all disabled:opacity-50"
            >
              {isSent ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Enviado com Sucesso!</span>
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  <span>Publicar Resposta</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

    </div>
  );
};
