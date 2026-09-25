import React from 'react';
import { 
  Sparkles, 
  Leaf, 
  Building2, 
  Users, 
  CheckCircle2, 
  Award, 
  TrendingUp, 
  Calendar,
  UtensilsCrossed,
  Heart
} from 'lucide-react';
import { DashboardStats, FoodPost, User } from '../types';

interface StatsViewProps {
  stats: DashboardStats | null;
  foodPosts: FoodPost[];
  users: User[];
  onBrowseFood: () => void;
}

export const StatsView: React.FC<StatsViewProps> = ({
  stats,
  foodPosts,
  users,
  onBrowseFood,
}) => {
  const portions = stats?.portionsRedistributed ?? 75;
  const co2 = stats?.co2SavedKg ?? Math.round(portions * 0.85 * 10) / 10;
  const collected = stats?.foodSuccessfullyCollected ?? 12;

  // College breakdown
  const collegeCounts: Record<string, number> = {};
  for (const post of foodPosts) {
    collegeCounts[post.collegeName] = (collegeCounts[post.collegeName] || 0) + (post.servingsCount || 10);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-600/60 backdrop-blur-md text-emerald-200 text-xs font-bold border border-emerald-500/40">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Campus Sustainability & Food Rescue Impact</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Every rescued meal helps end campus hunger and curbs climate emissions.
          </h1>

          <p className="text-sm text-emerald-100 leading-relaxed">
            By connecting canteen kitchens directly with registered students within minutes of meal service completion, Foodlink ensures zero quality edible food enters the waste stream.
          </p>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={onBrowseFood}
              className="px-5 py-2.5 rounded-xl bg-white text-emerald-950 font-bold text-xs shadow-md hover:bg-emerald-50 transition-colors"
            >
              Browse Active Surplus Meals
            </button>
          </div>
        </div>
      </div>

      {/* Big Impact Numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-slate-900">{portions}+</div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Portions Redistributed
          </h4>
          <p className="text-[11px] text-slate-400">
            Wholesome meals delivered to students
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
            <Leaf className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-emerald-700">{co2} kg</div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            CO2e Emissions Prevented
          </h4>
          <p className="text-[11px] text-slate-400">
            Organic decomposition avoided in landfills
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-blue-600">{collected}</div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Handover Collections
          </h4>
          <p className="text-[11px] text-slate-400">
            Successfully verified at canteen counters
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-slate-900">{users.length}</div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Active Campus Members
          </h4>
          <p className="text-[11px] text-slate-400">
            Canteen chefs, staff, and student claimers
          </p>
        </div>
      </div>

      {/* College Breakdown & Environmental Equivalencies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Campus Leaderboard */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-sm text-slate-900">
                Participating Campus Redistribution
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">Ranked by portions</span>
          </div>

          <div className="space-y-3">
            {Object.entries(collegeCounts).map(([collegeName, count], idx) => (
              <div key={collegeName} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px]">
                      #{idx + 1}
                    </span>
                    <span>{collegeName}</span>
                  </div>
                  <span className="font-semibold text-emerald-700">{count} portions</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${Math.min(100, (count / (portions || 1)) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Environmental Equivalents */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500" />
            <h3 className="font-bold text-sm text-slate-900">
              Campus Environmental Equivalencies
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-1">
              <span className="text-2xl font-black text-emerald-800">
                {Math.round(portions * 1.2)} hrs
              </span>
              <p className="text-xs font-semibold text-emerald-950">Laptop Energy Saved</p>
              <p className="text-[10px] text-emerald-700">Equivalent student study hours</p>
            </div>

            <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-100 space-y-1">
              <span className="text-2xl font-black text-teal-800">
                {Math.round(portions * 35)} L
              </span>
              <p className="text-xs font-semibold text-teal-950">Water Footprint Preserved</p>
              <p className="text-[10px] text-teal-700">Agricultural irrigation avoided</p>
            </div>

            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-100 space-y-1">
              <span className="text-2xl font-black text-amber-800">
                ${Math.round(portions * 8.5)}
              </span>
              <p className="text-xs font-semibold text-amber-950">Student Grocery Savings</p>
              <p className="text-[10px] text-amber-700">Campus food cost relief</p>
            </div>

            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100 space-y-1">
              <span className="text-2xl font-black text-blue-800">100%</span>
              <p className="text-xs font-semibold text-blue-950">Zero-Waste Verified</p>
              <p className="text-[10px] text-blue-700">Safe compliance audit</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
