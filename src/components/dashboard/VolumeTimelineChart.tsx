import React, { useState } from 'react';
import { VolumePoint, VOLUME_TIMELINE_DATA } from '../../services/mockDataService';
import { Flame, Clock } from 'lucide-react';

interface VolumeTimelineChartProps {
  timeline?: VolumePoint[];
}

export const VolumeTimelineChart: React.FC<VolumeTimelineChartProps> = ({ timeline }) => {
  const data = timeline && timeline.length > 0 ? timeline : VOLUME_TIMELINE_DATA;
  const [selectedPoint, setSelectedPoint] = useState<number | null>(Math.min(5, data.length - 1));

  const maxVolume = Math.max(...data.map(d => d.volume), 1);

  return (
    <div className="glass-panel rounded-2xl p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold font-heading text-white">
              Volume de Menções (Timeline 24h)
            </h3>
            <span className="rounded-full bg-indigo-500/10 border border-indigo-500/30 px-2 py-0.5 text-[10px] font-semibold text-indigo-400">
              Anomalia Detectada às 14h
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Frequência temporal com detecção automática de picos de crise
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span className="text-slate-400">Positivo</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500"></span>
            <span className="text-slate-400">Negativo</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-500"></span>
            <span className="text-slate-400">Crítico</span>
          </div>
        </div>
      </div>

      {/* Bar Chart Visualization */}
      <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 border-b border-slate-800">
        {data.map((item, index) => {
          const heightPercent = (item.volume / maxVolume) * 100;
          const isAnomaly = item.time === '14:00';
          const isSelected = selectedPoint === index;

          return (
            <div
              key={item.time}
              onClick={() => setSelectedPoint(index)}
              className="flex-1 flex flex-col items-center gap-2 cursor-pointer group"
            >
              {/* Tooltip / Badge on Peak */}
              {isAnomaly && (
                <div className="animate-bounce flex items-center gap-1 rounded bg-rose-500/20 border border-rose-500/40 px-1.5 py-0.5 text-[9px] font-bold text-rose-300">
                  <Flame className="h-2.5 w-2.5" /> Pico
                </div>
              )}

              {/* Bar Stack */}
              <div 
                className={`w-full rounded-t-lg transition-all duration-300 relative flex flex-col justify-end overflow-hidden ${
                  isSelected ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-950' : 'group-hover:opacity-80'
                }`}
                style={{ height: `${heightPercent}%`, minHeight: '12px' }}
              >
                {/* Positivo */}
                <div 
                  className="w-full bg-emerald-500/90" 
                  style={{ height: `${(item.positive / item.volume) * 100}%` }}
                ></div>
                {/* Negativo */}
                <div 
                  className="w-full bg-amber-500/90" 
                  style={{ height: `${(item.negative / item.volume) * 100}%` }}
                ></div>
                {/* Crítico */}
                <div 
                  className="w-full bg-rose-600" 
                  style={{ height: `${(item.critical / item.volume) * 100}%` }}
                ></div>
              </div>

              {/* Time Label */}
              <span className={`text-[10px] font-medium transition-colors ${
                isSelected ? 'text-indigo-400 font-bold' : 'text-slate-500 group-hover:text-slate-300'
              }`}>
                {item.time}
              </span>
            </div>
          );
        })}
      </div>

      {/* Selected Point Details */}
      {selectedPoint !== null && data[selectedPoint] && (
        <div className="mt-4 flex flex-wrap items-center justify-between rounded-xl bg-slate-900/60 border border-slate-800/80 p-3 text-xs">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400" />
            <span className="text-slate-400">Horário:</span>
            <span className="font-bold text-white">{data[selectedPoint].time}</span>
          </div>

          <div className="flex items-center gap-4">
            <span>Volume: <strong className="text-white">{data[selectedPoint].volume} posts</strong></span>
            <span className="text-emerald-400">Positivo: <strong>{data[selectedPoint].positive}</strong></span>
            <span className="text-amber-400">Negativo: <strong>{data[selectedPoint].negative}</strong></span>
            <span className="text-rose-400">Crítico: <strong>{data[selectedPoint].critical}</strong></span>
          </div>
        </div>
      )}

    </div>
  );
};
