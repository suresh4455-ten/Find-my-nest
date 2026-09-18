import React from 'react';
import { X, ShieldCheck, CheckCircle2, Award, Users, Bot, Building, FileCheck2, Lock, Sparkles, HeartHandshake, PhoneCall } from 'lucide-react';

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-10">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2.5 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-bold mb-3 border border-sky-200">
            <Award className="w-3.5 h-3.5 text-sky-600" />
            <span>Trusted Accommodation Intelligence Platform</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            About FindMyHostel AI
          </h2>
          <p className="text-sm text-slate-500 mt-2 font-medium leading-relaxed">
            Empowering students and working professionals to discover verified, secure, and comfortable hostel and PG accommodations with 100% grounded transparency.
          </p>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          
          <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-100 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center mb-3 shadow-md">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">Direct Verification</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every official property listing is verified directly with property managers and hostel desk operators to ensure genuine pricing, accurate room types, and verified amenities.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-sky-200/60 text-[11px] font-bold text-sky-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Zero Guesswork Policy
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-3 shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">Grounded AI Engine</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our Retrieval-Augmented Generation (RAG) assistant answers questions strictly using verified data. If a field is unconfirmed in public directories, our system strictly refuses to guess.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-200/60 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Anti-Hallucination Guaranteed
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-3 shadow-md">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">Student & Tenant First</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Designed specifically for collegiate communities (JNTUK, Aditya, Pragati) and career professionals seeking reliable Wi-Fi, nutritious homely food, and safe premises.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-indigo-200/60 text-[11px] font-bold text-indigo-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Safe Curfews & Gated Security
            </div>
          </div>

        </div>

        {/* Platform Standards & Quality Commitment */}
        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 mb-8">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-sky-600" />
            <span>Our Quality & Verification Standards</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 font-bold block">Verified Pricing Transparency:</strong>
                All room pricing and security deposit policies are checked to prevent surprise hidden charges.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 font-bold block">Nutritional Food Quality:</strong>
                Details on meal frequencies, Andhra-style menus, and vegetarian/non-vegetarian schedules are documented.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 font-bold block">24/7 Security & Power Backup:</strong>
                Listings indicate CCTV surveillance coverage, biometric entry points, and inverter power reliability.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 font-bold block">Live Availability Direct Confirmation:</strong>
                We respect tenant privacy and always redirect occupancy confirmations directly to property wardens.
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Partnership */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-700 text-white gap-4 shadow-lg">
          <div>
            <h4 className="text-base font-extrabold">Are you a PG or Hostel Owner in Kakinada?</h4>
            <p className="text-xs text-sky-100 mt-0.5">
              Partner with FindMyHostel to list your accommodation with official verified status.
            </p>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white text-sky-700 hover:bg-sky-50 font-bold text-xs shrink-0 shadow-md transition-all active:scale-95"
          >
            Explore Accommodations
          </button>
        </div>

      </div>
    </div>
  );
}
