import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, ShieldCheck, Eye, EyeOff, Sparkles, Building2, CheckCircle2, ArrowRight } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, user, onLogin, onLogout }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [userRole, setUserRole] = useState('tenant'); // 'tenant' | 'owner'
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    rememberMe: true,
  });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.email || !formData.password) {
      setErrorMsg('Please provide your email and password.');
      return;
    }

    if (isSignUp && !formData.name) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    // Mock successful authentication
    const authedUser = {
      name: formData.name || (formData.email.split('@')[0].toUpperCase()),
      email: formData.email,
      phone: formData.phone || '+91 98765 43210',
      role: userRole,
      avatar: userRole === 'owner' ? '🏢' : '🎓',
      verified: true
    };

    setSuccessMsg(isSignUp ? 'Account created successfully!' : 'Signed in successfully!');
    setTimeout(() => {
      onLogin(authedUser);
      setSuccessMsg('');
      onClose();
    }, 800);
  };

  const handleGoogleAuth = () => {
    const authedUser = {
      name: 'Suresh Venkat',
      email: 'venkat.suresh@example.com',
      phone: '+91 94934 89134',
      role: userRole,
      avatar: '🎓',
      verified: true
    };
    setSuccessMsg('Signed in with Google!');
    setTimeout(() => {
      onLogin(authedUser);
      setSuccessMsg('');
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      
      {/* Modal Card */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden"
      >
        {/* Header Gradient Top Banner */}
        <div className="relative bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 px-6 py-6 text-white overflow-hidden">
          {/* Subtle decorative elements */}
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute left-10 -top-10 w-24 h-24 bg-white/10 rounded-full blur-lg pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/15 hover:bg-white/30 text-white transition-all backdrop-blur-md cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-amber-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs uppercase tracking-widest font-bold text-sky-200">
              FindMyHostel Auth
            </span>
          </div>

          <h2 className="text-2xl font-black tracking-tight text-white">
            {user ? 'My Profile' : isSignUp ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-sky-100/90 mt-1 font-medium">
            {user 
              ? 'Manage your verified hostel bookings and inquiries.'
              : isSignUp 
                ? 'Join to save favorite PGs, contact wardens directly, and track room inquiries.' 
                : 'Sign in to access verified listings, live AI assistant and direct warden contacts.'}
          </p>
        </div>

        {/* Logged in state */}
        {user ? (
          <div className="p-6 space-y-5 text-slate-800">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-sky-50 border border-sky-200">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-2xl shadow-md text-white">
                {user.avatar || '👤'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-base text-slate-900">{user.name}</h3>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-xs text-slate-600 font-medium">{user.email}</p>
                <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 text-[10px] font-bold uppercase font-mono">
                  {user.role === 'owner' ? 'Property Warden / Owner' : 'Verified Student / Tenant'}
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Phone Number</span>
                <span className="font-bold text-slate-800">{user.phone}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Account Status</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Citizen
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Preferred Hub</span>
                <span className="font-bold text-slate-800">Kakinada & Madhapur</span>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          /* Sign In / Sign Up Form */
          <div className="p-6 space-y-4">

            {/* Role Switcher */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setUserRole('tenant')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  userRole === 'tenant'
                    ? 'bg-white text-sky-700 shadow-sm border border-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Student / Tenant</span>
              </button>
              <button
                type="button"
                onClick={() => setUserRole('owner')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  userRole === 'owner'
                    ? 'bg-white text-sky-700 shadow-sm border border-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>PG Owner / Warden</span>
              </button>
            </div>

            {/* Google Quick Sign In */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 shadow-sm flex items-center justify-center gap-2.5 transition-all hover:border-slate-300 active:scale-98"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">or with email</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Error & Success Messages */}
            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              
              {/* Full Name for Sign Up */}
              {isSignUp && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Full Name
                  </label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Venkat Suresh"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 font-medium"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 font-medium"
                  />
                </div>
              </div>

              {/* Phone for Sign Up */}
              {isSignUp && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Phone Number (Optional)
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="absolute left-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 font-medium"
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    Password
                  </label>
                  {!isSignUp && (
                    <button
                      type="button"
                      onClick={() => alert('Password reset link sent to your registered email.')}
                      className="text-[11px] text-sky-600 hover:text-sky-700 font-bold hover:underline"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Toggle Sign Up / Sign In */}
            <div className="pt-2 text-center text-xs text-slate-500">
              {isSignUp ? (
                <span>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(false)}
                    className="font-bold text-sky-600 hover:text-sky-700 underline"
                  >
                    Sign In
                  </button>
                </span>
              ) : (
                <span>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(true)}
                    className="font-bold text-sky-600 hover:text-sky-700 underline"
                  >
                    Create Account
                  </button>
                </span>
              )}
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
