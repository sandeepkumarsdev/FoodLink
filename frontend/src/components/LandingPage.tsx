import React, { useState } from 'react';
import { 
  UtensilsCrossed, 
  Building2, 
  GraduationCap, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Leaf, 
  Clock, 
  HeartHandshake,
  Lock
} from 'lucide-react';
import { User, UserType } from '../types';
import { CAMPUS_OPTIONS } from '../utils/helpers';

interface LandingPageProps {
  onLogin: (email: string, role?: string) => Promise<void>;
  onRegister: (data: any) => Promise<void>;
  onSelectUser: (user: User) => void;
  availableUsers: User[];
  isAuthenticating: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLogin,
  onRegister,
  onSelectUser,
  availableUsers,
  isAuthenticating,
}) => {
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [selectedRole, setSelectedRole] = useState<UserType>('USER');

  // Form states
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('Stanford Central Campus');
  const [canteenName, setCanteenName] = useState('Central Dining Commons');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (authMode === 'LOGIN') {
        if (!email.trim()) {
          setError('Please enter your email');
          return;
        }
        await onLogin(email, selectedRole);
      } else {
        if (!name.trim() || !email.trim()) {
          setError('Please fill in all required fields');
          return;
        }
        await onRegister({
          name,
          email,
          phone,
          userType: selectedRole,
          college,
          canteenName: selectedRole === 'COLLEGE' ? canteenName : undefined,
        });
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-emerald-50/60 via-slate-50 to-white flex flex-col justify-between">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Mission & Highlights */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 shadow-2xs">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              <span>Campus Food Rescue & Redistribution</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                Connecting surplus food with people who need it.
              </h1>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                When college canteens have safe, nutritious surplus food from dining halls or catering events, Foodlink notifies registered campus members to reserve and collect it in real time.
              </p>
            </div>

            {/* Value Props Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">Atomic First-Come Claiming</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Single-claim concurrency engine ensures once an item is claimed, it is instantly reserved for the first student.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">Food Safety Verified</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Clear holding temperatures, prep times, allergens, and authorized staff pickup verification codes.
                </p>
              </div>
            </div>


          </div>

          {/* Right Column: Interactive Login / Register Form */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full pointer-events-none" />

              {/* Form Mode Selector: Login vs Register */}
              <div className="flex p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setAuthMode('LOGIN')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    authMode === 'LOGIN'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('REGISTER')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    authMode === 'REGISTER'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Role Type Selector: Student/User vs College/Canteen */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Select Account Type
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('USER')}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                      selectedRole === 'USER'
                        ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <GraduationCap className={`w-5 h-5 ${selectedRole === 'USER' ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <div>
                      <div className="text-xs font-bold">Foodlink User</div>
                      <div className="text-[10px] text-slate-500">Student & Staff</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('COLLEGE')}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                      selectedRole === 'COLLEGE'
                        ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <Building2 className={`w-5 h-5 ${selectedRole === 'COLLEGE' ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <div>
                      <div className="text-xs font-bold">Canteen Staff</div>
                      <div className="text-[10px] text-slate-500">Publish Surplus</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Auth Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
                    {error}
                  </div>
                )}

                {authMode === 'REGISTER' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Rivera or Chef Marco"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-emerald-500 font-medium"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Campus Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder={selectedRole === 'COLLEGE' ? 'chef.canteen@campus.edu' : 'student@campus.edu'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-emerald-500 font-medium"
                  />
                </div>

                {authMode === 'REGISTER' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Phone Number (for collection SMS/alerts)
                      </label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-emerald-500 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        College / Campus *
                      </label>
                      <select
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-emerald-500 font-medium bg-white"
                      >
                        {CAMPUS_OPTIONS.filter((c) => c !== 'All Campuses').map((camp) => (
                          <option key={camp} value={camp}>
                            {camp}
                          </option>
                        ))}
                      </select>
                    </div>

                    {selectedRole === 'COLLEGE' && (
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Canteen / Dining Facility Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Tresidder Student Dining Hall"
                          value={canteenName}
                          onChange={(e) => setCanteenName(e.target.value)}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-emerald-500 font-medium"
                        />
                      </div>
                    )}
                  </>
                )}

                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>
                    {isAuthenticating
                      ? 'Authenticating...'
                      : authMode === 'LOGIN'
                        ? `Sign In as ${selectedRole === 'COLLEGE' ? 'Canteen Staff' : 'Foodlink User'}`
                        : `Register as ${selectedRole === 'COLLEGE' ? 'Canteen Account' : 'Student Account'}`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="text-center text-xs text-slate-500">
                <span>By continuing, you agree to our </span>
                <span className="text-emerald-700 font-semibold underline">Campus Food Safety Guidelines</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Campus Community Trust Footer */}
      <div className="border-t border-slate-200/80 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-slate-800">Foodlink Campus Network</span>
            <span>· Rescuing safe surplus food across universities</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Zero Food Waste Mission
            </span>
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              Atomic Claim Concurrency
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
