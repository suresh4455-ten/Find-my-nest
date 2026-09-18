import React, { useState, useEffect } from 'react';
import { X, Play, CheckCircle2, AlertOctagon, BarChart3, ShieldCheck, HelpCircle, Layers } from 'lucide-react';

export default function EvalModal({ isOpen, onClose }) {
  const [evalData, setEvalData] = useState(null);
  const [loading, setLoading] = useState(false);

  const runEvaluation = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/eval');
      if (res.ok) {
        const data = await res.json();
        setEvalData(data);
      }
    } catch (err) {
      console.error('Eval failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !evalData && !loading) {
      runEvaluation();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                Hackathon Judge Benchmark
              </span>
              <span className="text-xs text-slate-500 font-medium">Phase 8 / Section 9 Eval Set</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <BarChart3 className="w-6 h-6 text-amber-500" />
              <span>Anti-Hallucination Evaluation Suite</span>
            </h2>
          </div>

          <button
            onClick={runEvaluation}
            disabled={loading}
            className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Running 20 Tests...' : 'Re-run 20-Q Benchmark'}</span>
          </button>
        </div>

        {/* Pitch Framing Banner */}
        <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-900 mb-6 italic leading-relaxed font-medium">
          "FindMyHostel AI turns scattered, inconsistent property listings into a conversational search system — but its real contribution is what it refuses to say. Half of our dataset is unverified directory data, and the system is built to detect that and say so, rather than hallucinate a price or availability."
        </div>

        {/* Key Metrics Cards */}
        {evalData && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Questions</div>
              <div className="text-2xl font-black text-slate-900 font-mono">{evalData.total_questions}</div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
              <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider mb-1">Pass Rate</div>
              <div className="text-2xl font-black text-emerald-600 font-mono">{evalData.pass_rate_percent.toFixed(1)}%</div>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-center">
              <div className="text-[11px] font-bold text-sky-700 uppercase tracking-wider mb-1">Hallucination Rate</div>
              <div className="text-2xl font-black text-sky-600 font-mono flex items-center justify-center gap-1">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span>{evalData.hallucination_rate_percent.toFixed(1)}%</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center">
              <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider mb-1">Refusal Accuracy</div>
              <div className="text-2xl font-black text-amber-600 font-mono">{evalData.refusal_accuracy_percent.toFixed(1)}%</div>
            </div>
          </div>
        )}

        {/* Results Table */}
        {evalData?.details && (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-mono text-[11px]">
                  <th className="py-3 px-3.5 font-bold">ID</th>
                  <th className="py-3 px-3.5 font-bold">Category</th>
                  <th className="py-3 px-3.5 font-bold">Type</th>
                  <th className="py-3 px-3.5 font-bold">Question</th>
                  <th className="py-3 px-3.5 font-bold">Output Response</th>
                  <th className="py-3 px-3.5 text-center font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {evalData.details.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3.5 font-mono font-bold text-slate-800 whitespace-nowrap">{row.id}</td>
                    <td className="py-3 px-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 border border-slate-200 whitespace-nowrap font-medium">
                        {row.category}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-slate-500 font-mono text-[11px] whitespace-nowrap">{row.type}</td>
                    <td className="py-3 px-3.5 font-semibold text-slate-800 min-w-[180px]">{row.question}</td>
                    <td className="py-3 px-3.5 text-slate-600 min-w-[280px] line-clamp-3 text-[11px]">
                      {row.answer}
                    </td>
                    <td className="py-3 px-3.5 text-center whitespace-nowrap">
                      {row.passed ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-extrabold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> PASS
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-800 border border-red-300 text-[11px] font-extrabold">
                          <AlertOctagon className="w-3 h-3 text-red-600" /> FAIL
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
