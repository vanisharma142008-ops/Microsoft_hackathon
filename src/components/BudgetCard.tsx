import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Coins,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { TripItinerary, TripRequirements } from '../types/travel';

interface BudgetCardProps {
  itinerary: TripItinerary;
  requirements: TripRequirements;
  onApplyRemedy: (remedyText: string) => void;
  isLoading: boolean;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({
  itinerary,
  requirements,
  onApplyRemedy,
  isLoading,
}) => {
  const { totalCost, costBreakdown, validation } = itinerary;
  const { budgetStatus } = validation;
  const allocated = requirements.budget.amount;
  const isOver = budgetStatus.isOverBudget;
  const remaining = allocated - totalCost;

  const stayPct = Math.round((costBreakdown.accommodation / totalCost) * 100);
  const transportPct = Math.round((costBreakdown.transport / totalCost) * 100);
  const foodPct = Math.round((costBreakdown.food / totalCost) * 100);
  const activitiesPct = Math.round((costBreakdown.activities / totalCost) * 100);
  const bufferPct = Math.round((costBreakdown.buffer / totalCost) * 100);

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-sm space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-stone-100">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 font-mono">
            Financial Validation
          </span>
          <h3 className="text-base font-extrabold text-stone-900 mt-0.5">Budget Breakdown</h3>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-stone-500 font-medium block">Total Estimated</span>
          <div className="text-base font-extrabold text-stone-900">
            <span className={isOver ? 'text-rose-600' : 'text-emerald-700'}>
              ₹{totalCost.toLocaleString('en-IN')}
            </span>
            <span className="text-stone-400 font-normal text-xs">
              {' '}
              / ₹{allocated.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* OVER BUDGET WARNING (Section 5 Requirement) */}
      {isOver ? (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-3">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wide">
                ⚠️ ₹{Math.abs(remaining).toLocaleString('en-IN')} over budget
              </h4>
              <p className="text-xs text-rose-700 mt-0.5 font-medium leading-relaxed">
                Your current plan exceeds your ₹{allocated.toLocaleString('en-IN')} target budget. Select a strategy to bring it within limits:
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-rose-200/60">
            <span className="text-xs font-bold text-rose-900 block mb-2">
              How should I reduce the cost?
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => onApplyRemedy('Switch to a budget friendly homestay or 3-star inn to reduce accommodation cost')}
                disabled={isLoading}
                className="bg-white hover:bg-rose-100 text-rose-800 border border-rose-300 px-3 py-2 rounded-xl text-xs font-bold transition text-center cursor-pointer shadow-2xs"
              >
                Cheaper Stay
              </button>
              <button
                onClick={() => onApplyRemedy('Opt for express train or shared Volvo transit instead of private cabs')}
                disabled={isLoading}
                className="bg-white hover:bg-rose-100 text-rose-800 border border-rose-300 px-3 py-2 rounded-xl text-xs font-bold transition text-center cursor-pointer shadow-2xs"
              >
                Less Travel
              </button>
              <button
                onClick={() => onApplyRemedy('Replace expensive ticketed attractions with scenic free walking trails')}
                disabled={isLoading}
                className="bg-white hover:bg-rose-100 text-rose-800 border border-rose-300 px-3 py-2 rounded-xl text-xs font-bold transition text-center cursor-pointer shadow-2xs"
              >
                Fewer Activities
              </button>
              <button
                onClick={() => onApplyRemedy('Optimize accommodation, dining, and transit to strictly stay under target budget')}
                disabled={isLoading}
                className="bg-rose-600 hover:bg-rose-500 text-white px-3 py-2 rounded-xl text-xs font-bold transition text-center cursor-pointer shadow-sm"
              >
                Optimize Everything
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-3 flex items-center justify-between text-xs text-emerald-900">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">Within Target Budget</span>
          </div>
          <span className="font-bold text-emerald-800">
            ₹{remaining.toLocaleString('en-IN')} remaining buffer
          </span>
        </div>
      )}

      {/* Visual Multi-Segment Bar */}
      <div className="space-y-2">
        <div className="h-3 w-full bg-stone-100 rounded-full overflow-hidden flex shadow-inner">
          <div
            style={{ width: `${stayPct}%` }}
            className="bg-orange-500 transition-all duration-500"
            title={`Stay: ₹${costBreakdown.accommodation.toLocaleString('en-IN')} (${stayPct}%)`}
          />
          <div
            style={{ width: `${transportPct}%` }}
            className="bg-indigo-500 transition-all duration-500"
            title={`Transport: ₹${costBreakdown.transport.toLocaleString('en-IN')} (${transportPct}%)`}
          />
          <div
            style={{ width: `${foodPct}%` }}
            className="bg-amber-500 transition-all duration-500"
            title={`Food: ₹${costBreakdown.food.toLocaleString('en-IN')} (${foodPct}%)`}
          />
          <div
            style={{ width: `${activitiesPct}%` }}
            className="bg-emerald-500 transition-all duration-500"
            title={`Activities: ₹${costBreakdown.activities.toLocaleString('en-IN')} (${activitiesPct}%)`}
          />
          <div
            style={{ width: `${bufferPct}%` }}
            className="bg-purple-500 transition-all duration-500"
            title={`Buffer: ₹${costBreakdown.buffer.toLocaleString('en-IN')} (${bufferPct}%)`}
          />
        </div>

        {/* Clean Line Items */}
        <div className="divide-y divide-stone-100 text-xs">
          <div className="py-2 flex items-center justify-between">
            <span className="text-stone-600 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Stay
            </span>
            <span className="font-bold text-stone-900">
              ₹{costBreakdown.accommodation.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="py-2 flex items-center justify-between">
            <span className="text-stone-600 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Transport
            </span>
            <span className="font-bold text-stone-900">
              ₹{costBreakdown.transport.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="py-2 flex items-center justify-between">
            <span className="text-stone-600 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Food
            </span>
            <span className="font-bold text-stone-900">
              ₹{costBreakdown.food.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="py-2 flex items-center justify-between">
            <span className="text-stone-600 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Activities
            </span>
            <span className="font-bold text-stone-900">
              ₹{costBreakdown.activities.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="py-2 flex items-center justify-between">
            <span className="text-stone-600 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Contingency Buffer
            </span>
            <span className="font-bold text-stone-900">
              ₹{costBreakdown.buffer.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
