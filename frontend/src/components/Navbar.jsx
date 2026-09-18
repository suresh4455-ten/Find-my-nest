import React from 'react';
import { Home, MapPin, Info, User, LogIn } from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  onOpenAbout,
  user,
  onOpenLogin
}) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4 py-2.5">
        
        {/* Left: Brand Logo */}
        <div
          onClick={() => setActiveTab('explore')}
          className="flex items-center space-x-3 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-sky-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/25 group-hover:scale-105 transition-transform duration-200">
            <Home className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900">
                FindMy<span className="text-sky-600">Hostel</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 border border-sky-200 hidden sm:flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5 text-sky-600" /> Kakinada
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block font-medium">Verified PGs & Student Hostels in Kakinada, AP</p>
          </div>
        </div>

        {/* Right: Navigation Action Buttons */}
        <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
          
          {/* Home Button */}
          <button
            onClick={() => setActiveTab('explore')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'explore'
                ? 'bg-sky-50 text-sky-600 border border-sky-200 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Home className="w-4 h-4 text-sky-600" />
            <span>Home</span>
          </button>

          {/* About Platform Button */}
          <button
            onClick={onOpenAbout}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:text-sky-600 hover:bg-sky-50 transition-all border border-slate-200 hover:border-sky-200 shadow-sm"
          >
            <Info className="w-4 h-4 text-sky-600" />
            <span>About</span>
          </button>

          {/* Professional Login / Profile Button */}
          {user ? (
            <button
              onClick={onOpenLogin}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100 shadow-sm transition-all"
            >
              <div className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px]">
                {user.avatar || '👤'}
              </div>
              <span className="hidden sm:inline font-bold">{user.name.split(' ')[0]}</span>
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white shadow-md hover:shadow-lg transition-all active:scale-95 ml-1 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}


