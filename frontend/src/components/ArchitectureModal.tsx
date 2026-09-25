import React from 'react';
import { 
  X, 
  BookOpen, 
  Terminal, 
  Database, 
  Lock, 
  Layers, 
  Radio, 
  Server, 
  ShieldCheck, 
  CheckCircle2,
  GitBranch
} from 'lucide-react';

interface ArchitectureModalProps {
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border border-slate-200 my-8 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Foodlink System Architecture & Concurrency Specs</h2>
              <p className="text-xs text-slate-400">
                Full-stack technical blueprint, atomic claiming logic, and deployment guide
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto text-xs text-slate-700 leading-relaxed">
          {/* Section 1: PostgreSQL Concurrency Safe Claiming Engine */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b pb-2">
              <Database className="w-4 h-4 text-emerald-600" />
              <span>1. Local PostgreSQL Database & Concurrency-Safe Transactions</span>
            </div>
            <p>
              Foodlink runs on a <strong>Local PostgreSQL relational database engine</strong> with native ACID guarantees, relational tables, foreign key constraints, indexes, and transaction serialization:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>
                <strong>Relational PostgreSQL Schema:</strong> Fully structured tables for <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-emerald-800">users</code>, <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-emerald-800">food_posts</code>, <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-emerald-800">claims</code>, and <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-emerald-800">notifications</code> with foreign keys, check constraints, and B-tree indexes.
              </li>
              <li>
                <strong>PostgreSQL Row-Level Locking (SELECT ... FOR UPDATE):</strong> Every claim request initiates a transactional <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">BEGIN; SELECT * FROM food_posts WHERE id = $1 FOR UPDATE;</code> to lock the target food record against concurrent writes.
              </li>
              <li>
                <strong>Atomic Claim Verification:</strong> The first request acquires the lock, sets status to <code className="bg-amber-100 text-amber-900 px-1 py-0.5 rounded font-mono font-bold">CLAIMED</code>, assigns the claimant user ID, records the reservation in <code className="font-mono text-slate-800">claims</code>, and commits. All concurrent requests arriving within milliseconds read the updated status and are immediately rejected with <strong>HTTP 409 Conflict: "Sorry, this food has already been claimed by another user."</strong>
              </li>
              <li>
                <strong>Instant SSE Broadcast:</strong> A Server-Sent Events (SSE) notification is immediately dispatched to all active connections so all other student browsers update their claim buttons in real time without refreshing.
              </li>
            </ul>
          </div>

          {/* Section 2: Food Status State Machine */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b pb-2">
              <GitBranch className="w-4 h-4 text-emerald-600" />
              <span>2. State Machine Transition Flow</span>
            </div>
            <div className="p-4 bg-slate-900 rounded-xl text-white font-mono text-xs space-y-2">
              <div className="text-emerald-400 font-bold">Primary Happy Path:</div>
              <div className="pl-4 text-slate-300">
                🟢 AVAILABLE ➔ 🟠 CLAIMED ➔ 🔵 COLLECTED (Handover Verified)
              </div>
              <div className="text-amber-400 font-bold mt-2">Alternative Transitions:</div>
              <div className="pl-4 text-slate-300">
                🟢 AVAILABLE ➔ ⚪ EXPIRED (Automated deadline background worker)
              </div>
              <div className="pl-4 text-slate-300">
                🟢 AVAILABLE ➔ 🔴 CANCELLED (Canteen staff cancels batch)
              </div>
              <div className="pl-4 text-slate-300">
                🟠 CLAIMED ➔ 🟢 AVAILABLE (Student unclaims / releases claim)
              </div>
            </div>
          </div>

          {/* Section 3: Project Structure */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b pb-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>3. Project File Tree Structure</span>
            </div>
            <pre className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-800 overflow-x-auto">
{`├── server.ts                       # Express server + Postgres transaction handlers + SSE stream
├── server/
│   └── db.ts                       # Local PostgreSQL engine (PGlite), schemas & seeders
├── src/
│   ├── components/
│   │   ├── Navbar.tsx              # Navigation, user switcher, campus filter
│   │   ├── FoodCard.tsx            # Meal card with urgent countdown timer
│   │   ├── FoodDetailsModal.tsx    # Modal with pickup pass and confirmation
│   │   ├── MyClaimsView.tsx        # Student digital meal voucher & pickup history
│   │   ├── CollegeDashboard.tsx    # Canteen analytics & collection verification
│   │   ├── PostFoodModal.tsx       # Surplus meal publisher with presets
│   │   ├── NotificationsDropdown.tsx# Real-time notification panel
│   │   ├── ConcurrencyTesterModal.tsx# Live 5-request Postgres race simulation test
│   │   ├── ArchitectureModal.tsx   # System blueprint & documentation
│   │   └── LandingPage.tsx         # Welcome hero & registration forms
│   ├── services/
│   │   └── api.ts                  # REST API client & SSE consumer
│   ├── types/
│   │   └── index.ts                # TypeScript domain models & schemas
│   ├── utils/
│   │   └── helpers.ts              # Timers, preset images, formatting
│   ├── App.tsx                     # Top-level state coordinator & SSE listener
│   ├── main.tsx                    # React root entry
│   └── index.css                   # Tailwind CSS styling
├── data/
│   └── pgdata/                     # Local persistent PostgreSQL database directory
└── package.json`}
            </pre>
          </div>

          {/* Section 4: Instructions for Local Run & Deployment */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b pb-2">
              <Terminal className="w-4 h-4 text-emerald-600" />
              <span>4. Instructions for Running Locally & Deploying</span>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-slate-800">Local Development:</p>
              <pre className="bg-slate-900 text-emerald-300 p-3 rounded-lg font-mono text-[11px]">
{`# 1. Install dependencies
npm install

# 2. Run local full-stack server (port 3000)
npm run dev

# 3. Open in browser: http://localhost:3000`}
              </pre>

              <p className="font-semibold text-slate-800 pt-2">Production Build & Deployment:</p>
              <pre className="bg-slate-900 text-emerald-300 p-3 rounded-lg font-mono text-[11px]">
{`# 1. Build Vite frontend bundle
npm run build

# 2. Start full-stack Express production server
npm run start`}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
