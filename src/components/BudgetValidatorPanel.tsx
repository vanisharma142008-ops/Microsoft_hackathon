import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Clock,
  Navigation,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { TripItinerary, TripRequirements } from '../types/travel';

interface BudgetValidatorPanelProps {
  itinerary: TripItinerary | null;
  requirements: TripRequirements | null;
  onApplyRemedy: (remedyText: string) => void;
  isLoading: boolean;
}

export const BudgetValidatorPanel: React.FC<BudgetValidatorPanelProps> = ({
  itinerary,
  requirements,
  onApplyRemedy,
  isLoading,
}) => {
  if (!itinerary || !requirements) return null;

  const { validation, costBreakdown, totalCost } = itinerary;
  const { budgetStatus, pacingStatus, travelTimeStatus, preferenceMatchScore } = validation;
  const isOver = budgetStatus.isOverBudget;
  const allocated = requirements.budget.amount;

  const accommodationPct = Math.round((costBreakdown.accommodation / totalCost) * 100);
  const activitiesPct = Math.round((costBreakdown.activities / totalCost) * 100);
  const foodPct = Math.round((costBreakdown.food / totalCost) * 100);
  const transportPct = Math.round((costBreakdown.transport / totalCost) * 100);
  const bufferPct = Math.round((costBreakdown.buffer / totalCost) * 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header & Status Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          {isOver ? (
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
          ) : (
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          )}
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Budget & Constraint Validation Engine
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold border ${
                  isOver
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }`}
              >
                {isOver ? 'Deficit Detected' : 'Validated Feasible'}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Rigorous pre-flight checks: Budget limits, transit feasibility, pacing, and opening hours.
            </p>
          </div>
        </div>

        {/* Total vs Allocated pill */}
        <div className="flex items-center gap-3 bg-slate-950/70 border border-slate-800 px-3.5 py-1.5 rounded-xl text-xs">
          <div>
            <span className="text-[10px] text-slate-500 block uppercase">Allocated</span>
            <span className="font-semibold text-slate-200">₹{allocated.toLocaleString('en-IN')}</span>
          </div>
          <span className="text-slate-600">vs</span>
          <div>
            <span className="text-[10px] text-slate-500 block uppercase">Estimated</span>
            <span
              className={`font-bold ${isOver ? 'text-rose-400' : 'text-emerald-400'}`}
            >
              ₹{totalCost.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* OVER BUDGET ALERT & REMEDIES (Requirement 4: Do not silently ignore!) */}
      {isOver && (
        <div className="bg-rose-950/30 border border-rose-800/60 rounded-xl p-4 space-y-3">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-rose-200 uppercase tracking-wide">
                Budget Deficit Warning
              </h4>
              <p className="text-xs text-rose-300 mt-0.5 font-medium leading-relaxed">
                {budgetStatus.message}
              </p>
            </div>
          </div>

          {/* Actionable Remedies */}
          {budgetStatus.remedies.length > 0 && (
            <div className="pt-2 border-t border-rose-900/40">
              <span className="text-[11px] font-semibold text-rose-300 uppercase tracking-wider block mb-2">
                Recommended Actions to Fit Budget:
              </span>
              <div className="space-y-1.5">
                {budgetStatus.remedies.map((remedy, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-900/80 border border-rose-900/30 p-2.5 rounded-lg text-xs"
                  >
                    <span className="text-slate-300">💡 {remedy}</span>
                    <button
                      onClick={() => onApplyRemedy(remedy)}
                      disabled={isLoading}
                      className="shrink-0 inline-flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 px-2.5 py-1 rounded text-[11px] font-semibold transition border border-amber-500/30"
                    >
                      Apply Remedy <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cost Breakdown Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-slate-400 font-medium">
          <span>Cost Allocation by Category</span>
          <span className="text-slate-300">
            {isOver ? (
              <span className="text-rose-400 flex items-center gap-1 inline-flex">
                <TrendingUp className="w-3 h-3" /> +₹{Math.abs(budgetStatus.diff).toLocaleString('en-IN')} over
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1 inline-flex">
                <TrendingDown className="w-3 h-3" /> ₹{budgetStatus.diff.toLocaleString('en-IN')} buffer safe
              </span>
            )}
          </span>
        </div>

        {/* Multi-segment bar */}
        <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
          <div
            style={{ width: `${accommodationPct}%` }}
            className="bg-cyan-500 hover:brightness-110 transition relative group"
            title={`Stay: ₹${costBreakdown.accommodation.toLocaleString('en-IN')} (${accommodationPct}%)`}
          />
          <div
            style={{ width: `${foodPct}%` }}
            className="bg-amber-500 hover:brightness-110 transition relative group"
            title={`Food: ₹${costBreakdown.food.toLocaleString('en-IN')} (${foodPct}%)`}
          />
          <div
            style={{ width: `${activitiesPct}%` }}
            className="bg-emerald-500 hover:brightness-110 transition relative group"
            title={`Activities: ₹${costBreakdown.activities.toLocaleString('en-IN')} (${activitiesPct}%)`}
          />
          <div
            style={{ width: `${transportPct}%` }}
            className="bg-indigo-500 hover:brightness-110 transition relative group"
            title={`Transit: ₹${costBreakdown.transport.toLocaleString('en-IN')} (${transportPct}%)`}
          />
          <div
            style={{ width: `${bufferPct}%` }}
            className="bg-purple-500 hover:brightness-110 transition relative group"
            title={`Contingency Buffer: ₹${costBreakdown.buffer.toLocaleString('en-IN')} (${bufferPct}%)`}
          />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
            <span>Stay: ₹{costBreakdown.accommodation.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Food: ₹{costBreakdown.food.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Activities: ₹{costBreakdown.activities.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span>Transit: ₹{costBreakdown.transport.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span>Buffer: ₹{costBreakdown.buffer.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Secondary Feasibility Checks */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
        {/* Preference Match */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Preference Fit
            </span>
            <span className="font-bold text-emerald-400">{preferenceMatchScore}%</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Matched: {validation.matchedInterests.join(', ') || 'General sights'}
          </p>
        </div>

        {/* Pacing & Feasibility */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" /> Pace Density
            </span>
            <span className="font-bold text-slate-200">{pacingStatus.avgActivitiesPerDay} acts/day</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Pace: <span className="capitalize">{pacingStatus.pace}</span> ({pacingStatus.isFeasible ? 'Optimal' : 'Heavy'})
          </p>
        </div>

        {/* Travel Time & Backtracking */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-slate-400 flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5 text-indigo-400" /> Transit Routing
            </span>
            <span className="font-bold text-slate-200">{travelTimeStatus.totalTransitHours}h total</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Peak transit: {travelTimeStatus.maxDailyTransitMin} min/day (No major backtracking)
          </p>
        </div>
      </div>
    </div>
  );
};
