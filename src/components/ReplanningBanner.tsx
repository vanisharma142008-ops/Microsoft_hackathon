import React from 'react';
import { Layers, CheckCircle2, ArrowRight, Sparkles, X } from 'lucide-react';
import { ItineraryDiff, TripItinerary, TripRequirements } from '../types/travel';

interface ReplanningBannerProps {
  diff: ItineraryDiff;
  itinerary: TripItinerary;
  requirements: TripRequirements;
  onDismiss: () => void;
  onScrollToPlan: () => void;
}

export const ReplanningBanner: React.FC<ReplanningBannerProps> = ({
  diff,
  itinerary,
  requirements,
  onDismiss,
  onScrollToPlan,
}) => {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50/70 border-2 border-orange-300 rounded-3xl p-5 sm:p-6 shadow-lg shadow-orange-500/10 space-y-4 animate-fade-in relative">
      {/* Dismiss Button */}
      <button
        onClick={onDismiss}
        className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 rounded-xl transition cursor-pointer"
        title="Dismiss diff alert"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Top Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-600/30">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-orange-700 font-mono">
            Adaptive Re-Planning Engine
          </span>
          <h3 className="text-xl font-extrabold text-stone-900 tracking-tight">Trip Updated</h3>
        </div>
      </div>

      {/* Trigger & Summary */}
      <div className="text-xs font-semibold text-stone-700">
        Trigger: <span className="text-orange-800">{diff.triggerChange}</span>
      </div>

      {/* Two-Column Comparison: Changes vs Preserved */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* Changes Column */}
        <div className="bg-white rounded-2xl p-4 border border-orange-200/80 shadow-xs space-y-2">
          <span className="font-bold text-orange-950 uppercase tracking-wider text-[11px] font-mono block">
            What Changed:
          </span>
          <div className="space-y-1.5 text-stone-700">
            {diff.itemizedChanges.map((change, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                <span>{change}</span>
              </div>
            ))}
            {diff.modifiedDays.length > 0 && (
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                <span>Adjusted schedules for Days [{diff.modifiedDays.join(', ')}]</span>
              </div>
            )}
          </div>
        </div>

        {/* Preserved Column */}
        <div className="bg-white rounded-2xl p-4 border border-emerald-200/80 shadow-xs space-y-2">
          <span className="font-bold text-emerald-950 uppercase tracking-wider text-[11px] font-mono block">
            What Stayed Preserved:
          </span>
          <div className="space-y-1.5 text-stone-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{requirements.durationDays} days duration</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{requirements.travelers} travelers</span>
            </div>
            {requirements.interests.map((int) => (
              <div key={int} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="capitalize">{int} preferences</span>
              </div>
            ))}
            {diff.preservedDays.length > 0 && (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Days [{diff.preservedDays.join(', ')}] completely untouched</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Estimated Cost Banner & CTA */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-orange-200/60">
        <div>
          <span className="text-[11px] text-stone-500 font-medium block">Updated Financial Total:</span>
          <span className="text-lg font-extrabold text-stone-900">
            New Estimated Cost: <span className="text-orange-700">₹{itinerary.totalCost.toLocaleString('en-IN')}</span>
          </span>
        </div>

        <button
          onClick={onScrollToPlan}
          className="bg-orange-600 hover:bg-orange-500 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-orange-600/20 transition cursor-pointer"
        >
          <span>View Updated Plan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
