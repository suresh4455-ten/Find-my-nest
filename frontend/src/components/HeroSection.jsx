import React, { useState } from 'react';
import { Search, MapPin, Users, Sparkles, SlidersHorizontal, ArrowRight, ShieldCheck, Info } from 'lucide-react';

export default function HeroSection({ onSearch, onOpenChat, onOpenAbout, onOpenMap }) {
  const [queryLocation, setQueryLocation] = useState('');
  const [selectedGender, setSelectedGender] = useState('All');

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (onSearch) {
      onSearch({
        location: queryLocation.trim(),
        gender: selectedGender === 'All' ? '' : selectedGender
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(e);
    }
  };

  return (
    <section className="relative w-full pt-2 pb-6">
      
      {/* Hero Container */}
      <div className="relative rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-r from-sky-100 via-blue-50 to-sky-100 overflow-hidden border border-sky-200/80 shadow-xl">
        
        {/* Background Clouds / Sky accents */}
        <div className="absolute top-0 left-0 right-0 h-full overflow-hidden pointer-events-none opacity-60">
          <div className="absolute top-4 left-10 w-24 h-12 bg-white/80 rounded-full blur-sm" />
          <div className="absolute top-12 left-28 w-32 h-16 bg-white/70 rounded-full blur-sm" />
          <div className="absolute top-6 right-20 w-40 h-16 bg-white/80 rounded-full blur-sm" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[440px] items-center">
          
          {/* Left Visual: Traveler Illustration */}
          <div className="lg:col-span-5 relative flex items-center justify-center p-6 sm:p-8 order-2 lg:order-1">
            <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform hover:scale-[1.02] transition-transform duration-300">
              <img
                src="/hero_illustration.jpg"
                alt="Traveler exploring hostels and PGs in Kakinada"
                className="w-full h-auto object-cover max-h-[340px]"
              />
              <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-extrabold text-blue-700 shadow-md flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Kakinada Accommodations</span>
              </div>
            </div>
          </div>

          {/* Right Content: Curved Blue Hero Card */}
          <div className="lg:col-span-7 p-4 sm:p-6 lg:p-8 order-1 lg:order-2 flex flex-col justify-center">
            <div className="hero-blue-card p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden">
              
              {/* Subtle light orb */}
              <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

              {/* Tag / Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-sky-100 text-xs font-semibold border border-white/20">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Kakinada's #1 Verified Hostel & PG Platform</span>
                </div>

                <button
                  onClick={onOpenAbout}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all border border-white/30 cursor-pointer"
                >
                  <Info className="w-3 h-3 text-amber-300" />
                  <span>About</span>
                </button>

                <button
                  onClick={onOpenMap}
                  className="inline-flex items-center gap-1 px-3.5 py-1 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold shadow-sm transition-all cursor-pointer active:scale-95"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>🗺️ View Map Locations</span>
                </button>
              </div>

              {/* Heading */}
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-2 leading-tight">
                Find Hostels & PGs in Kakinada
              </h1>
              <p className="text-sm sm:text-base text-sky-100 font-medium mb-7 max-w-xl opacity-95">
                Verified student hostels near JNTUK, Aditya College & working men/women PGs across Kakinada.
              </p>

              {/* White Capsule Search Bar */}
              <form onSubmit={handleSearchSubmit} className="curved-search-bar p-2 sm:p-2.5 flex flex-col sm:flex-row items-center gap-2 text-slate-800">
                
                {/* Location Input */}
                <div className="flex items-center gap-2.5 px-4 py-2 w-full sm:flex-1 border-b sm:border-b-0 sm:border-r border-slate-200">
                  <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
                  <input
                    type="text"
                    value={queryLocation}
                    onChange={(e) => setQueryLocation(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search area (e.g. Ramanayyapeta, Ayodhya Nagar, JNTUK, Bhanugudi)..."
                    className="w-full text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
                  />
                </div>

                {/* Gender Dropdown */}
                <div className="flex items-center gap-2 px-4 py-2 w-full sm:w-auto border-b sm:border-b-0 sm:border-r border-slate-200">
                  <Users className="w-4 h-4 text-sky-600 shrink-0" />
                  <select
                    value={selectedGender}
                    onChange={(e) => setSelectedGender(e.target.value)}
                    className="text-xs sm:text-sm font-semibold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
                  >
                    <option value="All">Boys & Girls</option>
                    <option value="Men">Boys / Men</option>
                    <option value="Women">Girls / Women</option>
                  </select>
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  id="hero-search-btn"
                  className="w-full sm:w-auto px-7 py-3 rounded-full bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-95 shrink-0 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>
              </form>

              {/* Quick AI prompt link */}
              <div className="mt-4 flex items-center justify-between text-xs text-sky-100/90 pt-2 border-t border-white/15">
                <span>Want to ask about food menu, non-veg days, or curfew?</span>
                <button
                  onClick={onOpenChat}
                  className="font-bold text-white hover:text-amber-200 underline flex items-center gap-1 transition-colors"
                >
                  <span>Ask AI Assistant</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
