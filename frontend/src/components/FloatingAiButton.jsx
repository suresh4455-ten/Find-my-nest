import React, { useState } from 'react';
import { Sparkles, Bot, MessageSquare, X, ShieldCheck } from 'lucide-react';

export default function FloatingAiButton({ activeTab, onToggleChat }) {
  const [hovered, setHovered] = useState(false);
  const isChatActive = activeTab === 'chat';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      
      {/* Floating Tooltip Pill (visible on hover or animated on load) */}
      {!isChatActive && (
        <div
          onClick={onToggleChat}
          className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/95 backdrop-blur-md border border-sky-200 text-slate-800 shadow-xl cursor-pointer transition-all duration-300 transform ${
            hovered ? 'scale-105 shadow-2xl -translate-x-1' : 'opacity-90'
          }`}
        >
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <div className="text-left">
            <p className="text-xs font-black text-slate-900 leading-tight flex items-center gap-1">
              Ask AI Assistant <Sparkles className="w-3 h-3 text-amber-500 inline" />
            </p>
            <p className="text-[10px] text-slate-500 font-medium">Pricing, food menu & rules</p>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={onToggleChat}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`group relative flex items-center justify-center rounded-2xl p-4 sm:p-4.5 shadow-2xl transition-all duration-300 active:scale-90 cursor-pointer ${
          isChatActive
            ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/30'
            : 'bg-gradient-to-tr from-sky-600 via-blue-600 to-indigo-600 text-white shadow-sky-500/40 hover:shadow-sky-500/60 hover:scale-110'
        }`}
        title={isChatActive ? 'Close AI Chat' : 'Ask AI Assistant'}
      >
        {/* Pulsing ring animation behind button */}
        {!isChatActive && (
          <span className="absolute inset-0 rounded-2xl bg-sky-400/30 animate-ping pointer-events-none" />
        )}

        {/* Icon Toggle */}
        {isChatActive ? (
          <div className="flex items-center gap-1.5 font-bold text-xs">
            <X className="w-5 h-5 text-white" />
            <span className="hidden sm:inline">Close Chat</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-300 group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-extrabold text-xs tracking-wide hidden sm:inline text-white">
              AI Assistant
            </span>
          </div>
        )}
      </button>

    </div>
  );
}
