import React from 'react';
import { Bot, User, ShieldAlert, Sparkles, CornerDownRight, CheckCircle } from 'lucide-react';
import SourceChips from './SourceChips';

export default function Message({ message, onSelectSource }) {
  const isUser = message.sender === 'user';
  const isAssistant = message.sender === 'assistant';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} my-3`}>
      <div className={`flex gap-3 max-w-3xl ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
            isUser
              ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
              : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white ring-2 ring-emerald-500/20'
          }`}
        >
          {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
        </div>

        {/* Bubble */}
        <div
          className={`rounded-2xl px-5 py-4 shadow-lg text-sm leading-relaxed ${
            isUser
              ? 'bg-indigo-600/90 text-white font-medium rounded-tr-sm'
              : 'glass-panel text-slate-200 rounded-tl-sm border border-slate-700/60'
          }`}
        >
          {/* Query rewrite badge if follow-up memory resolved it */}
          {message.rewritten_query && (
            <div className="mb-2.5 px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/80 text-[11px] text-slate-300 flex items-center gap-1.5 font-mono">
              <CornerDownRight className="w-3 h-3 text-emerald-400" />
              <span>Resolved with context: <span className="text-emerald-300">"{message.rewritten_query}"</span></span>
            </div>
          )}

          {/* Assistant Safety Notice Flag */}
          {message.flags?.refusal_triggered && (
            <div className="mb-2.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-semibold">Guardrail Triggered:</span> Unverified or missing field refused to prevent hallucination.
            </div>
          )}

          {/* Body Text formatted */}
          <div className="whitespace-pre-line space-y-2">
            {message.text}
          </div>

          {/* Source Chips */}
          {message.sources && message.sources.length > 0 && (
            <SourceChips sources={message.sources} onSelectSource={onSelectSource} />
          )}
        </div>

      </div>
    </div>
  );
}
