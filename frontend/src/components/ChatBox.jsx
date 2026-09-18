import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, RefreshCw, AlertTriangle, ShieldCheck, HelpCircle, Layers, Bot, User, CornerDownRight } from 'lucide-react';
import PropertyCard from './PropertyCard';
import SourceChips from './SourceChips';

const DEMO_QUESTIONS = [
  { label: '1. Simple lookup', query: 'Where is Aashraya Co-living?' },
  { label: '2. Multi-condition', query: 'Find properties in Madhapur with Wi-Fi and food.' },
  { label: '3. Pricing check', query: 'What is the price of a single AC room at Aashraya?' },
  { label: '4. Trust refusal', query: "What's the price at Colours Men's PG?" },
  { label: '5. Availability refusal', query: 'Is Sri Ven PG currently available?' },
  { label: '6. Memory follow-up', query: 'Which ones have food?' },
];

export default function ChatBox({ properties, onSelectProperty }) {
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: "**FindMyHostel AI — Verified Dataset Assistant**\n\nI answer inquiries strictly from the indexed property records (Kakinada & Madhapur).\n\nPlease enter a specific query about property pricing, location, meal plans, house rules, amenities, or contact details.",
      sources: [],
      flags: { low_confidence: false }
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => 'sess_' + Math.random().toString(36).substring(2, 9));
  const [activeCards, setActiveCards] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (queryText) => {
    const q = (queryText || inputQuery).trim();
    if (!q || loading) return;

    setInputQuery('');
    const userMsg = { sender: 'user', text: q };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, message: q }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.statusText}`);
      }

      const data = await res.json();
      const botMsg = {
        sender: 'assistant',
        text: data.answer,
        sources: data.sources || [],
        flags: data.flags || {},
        rewritten_query: data.rewritten_query
      };

      setMessages((prev) => [...prev, botMsg]);

      // Update sidebar property cards
      if (data.sources && data.sources.length > 0) {
        const matched = properties.filter((p) =>
          data.sources.some((s) => s.property_id === p.property_id || s.name === p.name)
        );
        setActiveCards(matched);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: `⚠️ **Connection Error**: Could not connect to the backend server at http://localhost:8000.`,
          flags: { low_confidence: true }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSourceClick = (propertyId) => {
    const found = properties.find((p) => (p.property_id || p.id) === propertyId);
    if (found && onSelectProperty) {
      onSelectProperty(found);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8.5rem)]">
      
      {/* Main Chat Area */}
      <div className="lg:col-span-2 flex flex-col bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        
        {/* Chat Header Bar */}
        <div className="px-6 py-4 border-b border-slate-200/80 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-slate-900">AI Grounded Assistant</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Anti-Hallucination Guardrails Active</span>
            </div>
          </div>

          <button
            onClick={() => setMessages([messages[0]])}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-200/60 font-medium"
            title="Reset Chat Session"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-slate-50/30">
          {messages.map((msg, index) => {
            const isUser = msg.sender === 'user';
            return (
              <div key={index} className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} my-2`}>
                <div className={`flex gap-3 max-w-3xl ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  
                  {/* Avatar */}
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                      isUser
                        ? 'bg-sky-600 text-white'
                        : 'bg-white border border-slate-200 text-sky-600 shadow-md'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-5 h-5" />}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`rounded-2xl px-5 py-4 shadow-sm text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-sky-600 text-white font-medium rounded-tr-sm'
                        : 'bg-white text-slate-800 rounded-tl-sm border border-slate-200/90 shadow-sm'
                    }`}
                  >
                    {/* Resolved Context Tag */}
                    {msg.rewritten_query && (
                      <div className="mb-2 px-2 py-0.5 rounded-md bg-sky-50 border border-sky-200 text-[11px] text-sky-800 flex items-center gap-1.5 font-mono">
                        <CornerDownRight className="w-3 h-3 text-sky-600" />
                        <span>Resolved context: <span className="font-bold">"{msg.rewritten_query}"</span></span>
                      </div>
                    )}

                    {/* Text Body */}
                    <div className="whitespace-pre-line space-y-2">
                      {msg.text}
                    </div>

                    {/* Source Chips */}
                    {msg.sources && msg.sources.length > 0 && (
                      <SourceChips sources={msg.sources} onSelectSource={handleSourceClick} />
                    )}
                  </div>

                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center space-x-3 text-sky-600 text-xs py-2.5 px-4 bg-sky-50 border border-sky-200 rounded-2xl w-fit animate-pulse font-semibold">
              <Sparkles className="w-4 h-4 animate-spin text-sky-600" />
              <span>Retrieving verified property context & enforcing guardrails...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Demo Prompts Chips */}
        <div className="px-6 py-2.5 bg-slate-100/80 border-t border-slate-200 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase font-bold tracking-wider text-slate-500 shrink-0 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Demo Prompts:
            </span>
            {DEMO_QUESTIONS.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip.query)}
                disabled={loading}
                className="shrink-0 px-3 py-1 rounded-full bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-700 border border-slate-200 hover:border-sky-300 text-xs font-semibold shadow-sm transition-all"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2.5"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask about pricing, food, Wi-Fi, rules, or room availability..."
              disabled={loading}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all font-medium"
            />
            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>

      </div>

      {/* Sidebar Cards */}
      <div className="hidden lg:flex flex-col bg-white rounded-3xl border border-slate-200 p-5 shadow-xl overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-sky-600" />
            <h3 className="text-sm font-extrabold text-slate-900">Retrieved Properties ({activeCards.length})</h3>
          </div>
          <span className="text-[10px] font-bold text-sky-600 uppercase font-mono px-2 py-0.5 rounded bg-sky-50 border border-sky-200">
            Live Grounding
          </span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {activeCards.length > 0 ? (
            activeCards.map((prop, idx) => (
              <PropertyCard
                key={idx}
                property={prop}
                onSelect={onSelectProperty}
              />
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <ShieldCheck className="w-12 h-12 text-slate-300 mb-3" />
              <p className="text-sm font-bold text-slate-600">No properties referenced yet</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Ask a query or click any demo prompt to view verified cards here.
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
