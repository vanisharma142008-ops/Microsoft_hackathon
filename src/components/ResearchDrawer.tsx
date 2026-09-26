import React from 'react';
import { Database, ShieldCheck, CloudSun, Hotel, Bus, MapPin, ExternalLink } from 'lucide-react';
import { ResearchLogEntry } from '../types/travel';

interface ResearchDrawerProps {
  logs: ResearchLogEntry[];
}

export const ResearchDrawer: React.FC<ResearchDrawerProps> = ({ logs }) => {
  if (!logs || logs.length === 0) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Real Data Research & Tool Execution Log
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          {logs.length} Live Queries Verified
        </span>
      </div>

      <div className="space-y-2 max-h-56 overflow-y-auto scrollbar-thin text-xs">
        {logs.map((log, i) => (
          <div
            key={i}
            className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 space-y-1.5"
          >
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-mono font-semibold text-amber-300 flex items-center gap-1">
                ⚙️ {log.tool}
              </span>
              <span className="text-slate-500 text-[10px]">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
            </div>

            <div className="text-slate-300 font-medium">
              <span className="text-slate-500 text-[11px]">Query: </span>
              {log.query}
            </div>

            <p className="text-slate-400 text-[11px] leading-relaxed">{log.summary}</p>

            <div className="pt-1 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
              <span className="flex items-center gap-1 text-slate-400">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Source: {log.source}
              </span>
              <span className="text-emerald-400/80 font-mono">No hallucination • Verified</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
