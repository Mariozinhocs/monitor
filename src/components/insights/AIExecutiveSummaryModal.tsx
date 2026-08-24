import React from 'react';
import { AIExecutiveReport } from '../../types/monitor';
import { 
  Sparkles, 
  X, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Target, 
  ShieldCheck,
  FileText
} from 'lucide-react';

interface AIExecutiveSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: AIExecutiveReport;
}

export const AIExecutiveSummaryModal: React.FC<AIExecutiveSummaryModalProps> = ({
  isOpen,
  onClose,
  report,
}) => {
  if (!isOpen) return null;

  const handlePrintOrExport = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl p-6 sm:p-8 space-y-6 my-8">
        
        {/* Header do Relatório */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 rounded-md bg-purple-500/20 border border-purple-500/40 px-2 py-0.5 text-xs font-bold text-purple-300">
                <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
                Sentinela AI Executive Intelligence
              </span>
              <span className="text-xs text-slate-400">
                Período: <strong>{report.period}</strong>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-white mt-1">
              Relatório Diário de Social Listening & Gestão de Marca
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Resumo Executivo */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Síntese da Narrativa Pública
          </h3>
          <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-4 text-sm text-slate-200 leading-relaxed font-normal">
            {report.executiveSummary}
          </div>
        </div>

        {/* Drivers Positivos vs Negativos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Positivos */}
          <div className="rounded-xl bg-emerald-950/20 border border-emerald-500/30 p-4 space-y-3">
            <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="h-4 w-4" />
              O que impulsionou o sentimento positivo
            </h4>
            <ul className="space-y-2 text-xs text-slate-200">
              {report.topDriversPositive.map((driver, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{driver}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Negativos */}
          <div className="rounded-xl bg-rose-950/20 border border-rose-500/30 p-4 space-y-3">
            <h4 className="text-xs font-bold text-rose-400 flex items-center gap-1.5 uppercase tracking-wider">
              <AlertTriangle className="h-4 w-4" />
              Principais pontos de atrito e risco
            </h4>
            <ul className="space-y-2 text-xs text-slate-200">
              {report.topDriversNegative.map((driver, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{driver}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Avaliação de Risco de Crise */}
        <div className="rounded-xl bg-indigo-950/30 border border-indigo-500/40 p-4 space-y-2">
          <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-1.5 uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4 text-indigo-400" />
            Diagnóstico Preditivo de Crises
          </h4>
          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            {report.crisisRiskEvaluation}
          </p>
        </div>

        {/* Recomendações Estratégicas */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Target className="h-4 w-4 text-purple-400" />
            Recomendações Estratégicas para o Board & Marketing
          </h4>
          <div className="space-y-2">
            {report.strategicRecommendations.map((rec, idx) => (
              <div key={idx} className="flex items-start gap-3 rounded-lg bg-slate-950/60 border border-slate-800 p-3 text-xs text-slate-200">
                <span className="rounded bg-indigo-500/20 text-indigo-300 font-bold px-1.5 py-0.5 text-[10px]">
                  0{idx + 1}
                </span>
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
          <span className="text-slate-400">
            Gerado automaticamente pelo modelo <strong>Sentinela AI Core</strong> em {report.generatedAt}.
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrintOrExport}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 font-bold text-white shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Exportar / Imprimir PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
