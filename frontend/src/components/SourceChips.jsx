import React from 'react';
import { ShieldCheck, AlertTriangle, ExternalLink } from 'lucide-react';

export default function SourceChips({ sources, onSelectSource }) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-3 pt-3 border-t border-slate-800/80">
      <div className="flex items-center space-x-1.5 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        <span>Verified Sources & Citations</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {sources.map((src, idx) => (
          <button
            key={idx}
            onClick={() => onSelectSource && onSelectSource(src.property_id)}
            className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-xs font-medium border transition-all duration-200 ${
              src.is_verified
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30 hover:bg-emerald-900/40 hover:border-emerald-400/50'
                : 'bg-amber-950/40 text-amber-300 border-amber-500/30 hover:bg-amber-900/40 hover:border-amber-400/50'
            }`}
          >
            {src.is_verified ? (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            )}
            <span className="font-semibold">{src.name}</span>
            <span className="text-[10px] opacity-75 font-mono">({src.property_id})</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-60 ml-0.5" />
          </button>
        ))}
      </div>
    </div>
  );
}
