import React from 'react';
import { UtensilsCrossed, CheckCircle2, Building2, Sparkles } from 'lucide-react';
import { User } from '../types';

interface MobileBottomNavProps {
  currentUser: User | null;
  activeTab: 'browse' | 'my-claims' | 'canteen' | 'stats';
  setActiveTab: (tab: 'browse' | 'my-claims' | 'canteen' | 'stats') => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
}) => {
  if (!currentUser) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-50 px-2 py-1.5 pb-[calc(0.5rem+env(safe-area-inset-bottom))] flex justify-around items-center shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
      <button
        onClick={() => setActiveTab('browse')}
        className={`flex flex-col items-center gap-1 p-2 min-w-[64px] rounded-xl transition-all ${
          activeTab === 'browse' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <UtensilsCrossed className="w-5 h-5" />
        <span className="text-[10px] font-bold">Food</span>
      </button>

      {currentUser.userType === 'USER' && (
        <button
          onClick={() => setActiveTab('my-claims')}
          className={`flex flex-col items-center gap-1 p-2 min-w-[64px] rounded-xl transition-all ${
            activeTab === 'my-claims' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-[10px] font-bold">Claims</span>
        </button>
      )}

      {(currentUser.userType === 'COLLEGE' || currentUser.userType === 'ADMIN') && (
        <button
          onClick={() => setActiveTab('canteen')}
          className={`flex flex-col items-center gap-1 p-2 min-w-[64px] rounded-xl transition-all ${
            activeTab === 'canteen' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-5 h-5" />
          <span className="text-[10px] font-bold">Portal</span>
        </button>
      )}

      <button
        onClick={() => setActiveTab('stats')}
        className={`flex flex-col items-center gap-1 p-2 min-w-[64px] rounded-xl transition-all ${
          activeTab === 'stats' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <Sparkles className="w-5 h-5" />
        <span className="text-[10px] font-bold">Impact</span>
      </button>
    </div>
  );
};
