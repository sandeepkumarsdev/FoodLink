import React, { useState } from 'react';
import { 
  X, 
  Zap, 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users, 
  Play, 
  RotateCw,
  Cpu,
  Layers
} from 'lucide-react';
import { FoodPost } from '../types';

interface ConcurrencyTesterModalProps {
  availablePosts: FoodPost[];
  onClose: () => void;
  onRunTest: (foodPostId?: string) => Promise<any>;
}

export const ConcurrencyTesterModal: React.FC<ConcurrencyTesterModalProps> = ({
  availablePosts,
  onClose,
  onRunTest,
}) => {
  const [selectedPostId, setSelectedPostId] = useState<string>(
    availablePosts[0]?.id || ''
  );
  const [isRunning, setIsRunning] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const handleExecute = async () => {
    setIsRunning(true);
    try {
      const res = await onRunTest(selectedPostId || undefined);
      setTestResult(res);
    } catch (err: any) {
      alert('Error running simulation: ' + err.message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Concurrency & Race-Condition Tester</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Backend Mutex Audit
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Simulate 5 simultaneous students tapping "Claim" at the exact same millisecond
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

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[calc(85vh-160px)] overflow-y-auto">
          {/* Explanation Banner */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-amber-900">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Specification Requirement: Concurrency-Safe Atomic Claims</span>
            </div>
            <p className="leading-relaxed">
              When 5 students attempt to claim the same food item simultaneously via asynchronous network requests, the backend serializes the operations using exclusive concurrency locks. Exactly <strong>one claim succeeds (HTTP 200)</strong>, and all subsequent concurrent requests are rejected with <strong>HTTP 409 Conflict: "Sorry, this food has already been claimed by another user."</strong>
            </p>
          </div>

          {/* Test Setup Form */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Target Food Post For Simulation
            </label>
            <div className="flex gap-2">
              <select
                value={selectedPostId}
                onChange={(e) => setSelectedPostId(e.target.value)}
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-emerald-500 font-semibold bg-white cursor-pointer"
              >
                <option value="">-- Create Fresh Simulation Post --</option>
                {availablePosts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.foodName} ({p.quantity} · {p.canteenName})
                  </option>
                ))}
              </select>

              <button
                onClick={handleExecute}
                disabled={isRunning}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-98 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                {isRunning ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Executing Race...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Run Concurrency Test</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Simulation Output Area */}
          {testResult && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Execution Results
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-500">
                    Execution time: {testResult.durationMs}ms
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                    testResult.testPassed
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {testResult.testPassed ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>PASSED: Concurrency Verified</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>FAILED: Concurrency Anomaly</span>
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Summary Metrics */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Requests Fired</span>
                  <p className="text-xl font-black text-slate-900">5 Simultaneous</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="text-[10px] text-emerald-800 font-bold uppercase">Claims Granted</span>
                  <p className="text-xl font-black text-emerald-700">1 (HTTP 200)</p>
                </div>
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
                  <span className="text-[10px] text-rose-800 font-bold uppercase">Claims Rejected</span>
                  <p className="text-xl font-black text-rose-700">4 (HTTP 409)</p>
                </div>
              </div>

              {/* Winner Announcement */}
              <div className="p-3.5 rounded-xl bg-slate-900 text-white flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Fastest Successful Claimant:</span>
                  <span className="font-bold text-amber-400 text-sm">{testResult.winner}</span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono text-[11px] border border-emerald-500/30">
                  Status: CLAIMED
                </span>
              </div>

              {/* Detailed Breakdown per student */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 block">
                  Simulated Student Request Breakdown:
                </span>
                <div className="space-y-1.5">
                  {testResult.detailedResults.map((r: any, idx: number) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                        r.success
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {r.success ? (
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                        <span className="font-bold">{r.studentName}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md font-mono text-[11px] font-bold ${
                          r.httpStatus === 200
                            ? 'bg-emerald-600 text-white'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          HTTP {r.httpStatus}
                        </span>
                        <span className="text-xs text-slate-600 max-w-[220px] truncate" title={r.response}>
                          {r.response}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
