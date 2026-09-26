import React, { useState } from 'react';
import {
  Calendar,
  CloudSun,
  Hotel,
  Bus,
  Utensils,
  MapPin,
  Clock,
  Sparkles,
  HelpCircle,
  TrendingDown,
  Compass,
  ArrowRight,
  Shield,
  Layers,
} from 'lucide-react';
import { ItineraryActivity, TripItinerary, TripRequirements, WhyChosenEvidence } from '../types/travel';

interface ItineraryViewProps {
  itinerary: TripItinerary | null;
  requirements: TripRequirements | null;
  onExplain: (itemType: string, itemName: string, evidence?: WhyChosenEvidence) => void;
  onQuickAdapt: (changeText: string) => void;
  isLoading: boolean;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  itinerary,
  requirements,
  onExplain,
  onQuickAdapt,
  isLoading,
}) => {
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);

  if (!itinerary || !itinerary.days || itinerary.days.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
        <Compass className="w-10 h-10 text-amber-400 mx-auto opacity-70 animate-spin" />
        <h3 className="text-base font-bold text-white">No Itinerary Generated Yet</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Provide your trip parameters in the chat or click one of the demo scenarios above. WanderWise will research live data, validate constraints, and assemble a day-by-day plan.
        </p>
      </div>
    );
  }

  const selectedDay =
    itinerary.days.find((d) => d.dayNumber === selectedDayNumber) || itinerary.days[0];
  const diff = itinerary.diffFromPrevious;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
      {/* Title & Version Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Personalized Plan v{itinerary.version}
            </span>
            <span className="text-[11px] font-mono text-slate-500">• {itinerary.days.length} Days</span>
          </div>
          <h2 className="text-lg font-extrabold text-white mt-0.5 tracking-tight">
            {itinerary.title}
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">{itinerary.summary}</p>
        </div>

        {/* Quick Adapt Actions */}
        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
          <span className="text-[11px] text-slate-500 font-medium">Quick Adapt:</span>
          <button
            onClick={() => onQuickAdapt('I don’t want early morning activities')}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition border border-slate-700/60"
          >
            ⏰ Start 10:30 AM
          </button>
          <button
            onClick={() => onQuickAdapt("It's going to rain on Day 3")}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition border border-slate-700/60"
          >
            🌧️ Rain on Day 3
          </button>
          <button
            onClick={() => onQuickAdapt('Make the trip more relaxed')}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition border border-slate-700/60"
          >
            🧘 Relax Pace
          </button>
        </div>
      </div>

      {/* RE-PLANNING DIFF BANNER (Requirement 5: Show what changed) */}
      {diff && (
        <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wide">
              <Layers className="w-4 h-4 text-amber-400" /> Adaptive Re-planning Diff (v{itinerary.version - 1} → v{itinerary.version})
            </span>
            <span className="text-[11px] font-mono text-amber-400">
              {diff.costDelta < 0 ? `Saved ₹${Math.abs(diff.costDelta).toLocaleString('en-IN')}` : `+₹${diff.costDelta.toLocaleString('en-IN')}`}
            </span>
          </div>
          <p className="text-xs text-slate-300">{diff.summary}</p>
          <div className="pt-1 text-[11px] space-y-1">
            {diff.itemizedChanges.map((change, idx) => (
              <div key={idx} className="text-amber-200/90 flex items-start gap-1.5">
                <span className="text-amber-400 mt-0.5">•</span>
                <span>{change}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Day Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {itinerary.days.map((day) => {
          const isSelected = day.dayNumber === selectedDay.dayNumber;
          const isPreserved = diff?.preservedDays.includes(day.dayNumber);
          const isModified = diff?.modifiedDays.includes(day.dayNumber);

          return (
            <button
              key={day.dayNumber}
              onClick={() => setSelectedDayNumber(day.dayNumber)}
              className={`flex flex-col items-start px-3.5 py-2 rounded-xl text-left transition shrink-0 border ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md shadow-amber-500/10'
                  : 'bg-slate-950/60 hover:bg-slate-800 text-slate-300 border-slate-800'
              }`}
            >
              <div className="flex items-center gap-1.5 w-full justify-between">
                <span className="text-xs">Day {day.dayNumber}</span>
                {isPreserved && (
                  <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Kept
                  </span>
                )}
                {isModified && (
                  <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Updated
                  </span>
                )}
              </div>
              <span className="text-[11px] opacity-80 truncate max-w-[120px] font-normal">
                {day.theme.split('&')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Day Detail Card */}
      <div className="space-y-4">
        {/* Day Header Banner with Live Weather Note */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" /> Day {selectedDay.dayNumber}: {selectedDay.theme}
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-300">
              <CloudSun className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{selectedDay.weatherNote}</span>
            </div>
          </div>

          <div className="text-right shrink-0 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
            <span className="text-[10px] text-slate-500 uppercase block">Day Estimated Spend</span>
            <span className="font-bold text-emerald-400">
              ₹{selectedDay.dayCostBreakdown.total.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Accommodation & Transportation for this Day */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Hotel Card */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 text-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                  <Hotel className="w-3.5 h-3.5 text-cyan-400" /> Accommodation
                </span>
                <span className="font-semibold text-emerald-400">
                  ₹{selectedDay.hotel.costPerNight.toLocaleString('en-IN')}/night
                </span>
              </div>
              <h4 className="font-bold text-slate-100 text-sm">{selectedDay.hotel.name}</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">{selectedDay.hotel.location}</p>
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 truncate max-w-[200px]">
                {selectedDay.hotel.whyChosen}
              </span>
              <button
                onClick={() => onExplain('hotel', selectedDay.hotel.name)}
                className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium hover:underline shrink-0"
              >
                <HelpCircle className="w-3 h-3" /> Why this stay?
              </button>
            </div>
          </div>

          {/* Transportation Card */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 text-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                  <Bus className="w-3.5 h-3.5 text-indigo-400" /> Day Transit
                </span>
                <span className="font-semibold text-emerald-400">
                  ₹{selectedDay.transportation.costTotal.toLocaleString('en-IN')}
                </span>
              </div>
              <h4 className="font-bold text-slate-100 text-sm">{selectedDay.transportation.mode}</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">{selectedDay.transportation.note}</p>
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[10px] text-slate-500">Route & schedule geo-optimized</span>
              <button
                onClick={() => onExplain('transport', selectedDay.transportation.mode)}
                className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium hover:underline shrink-0"
              >
                <HelpCircle className="w-3 h-3" /> Why this route?
              </button>
            </div>
          </div>
        </div>

        {/* Scheduled Activities Timeline */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" /> Daily Activity Schedule
          </h4>

          <div className="space-y-3">
            {selectedDay.activities.map((activity, idx) => (
              <div
                key={activity.id || idx}
                className="bg-slate-950/90 border border-slate-800/90 hover:border-slate-700 rounded-xl p-4 transition text-xs space-y-2.5 group"
              >
                {/* Top Row: Timing, Category, Cost, and Why Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 font-mono text-[11px] border border-amber-500/20 font-medium">
                      {activity.timeSlot}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] uppercase font-semibold">
                      {activity.category}
                    </span>
                    {activity.indoor && (
                      <span className="px-2 py-0.5 rounded-md bg-cyan-950/50 text-cyan-300 border border-cyan-800/50 text-[10px]">
                        ☔ Covered / Indoor
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-emerald-400">
                      {activity.costPerPerson === 0 ? 'Free Entry' : `₹${activity.costPerPerson}/pax`}
                    </span>
                    <button
                      onClick={() => onExplain('activity', activity.title, activity.whyChosen)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-amber-500 hover:text-slate-950 text-slate-300 text-[11px] font-medium transition border border-slate-700/60"
                      title="Inspect evidence & reasons why this was chosen"
                    >
                      <HelpCircle className="w-3 h-3 text-amber-400 group-hover:text-slate-950" />
                      Why this?
                    </button>
                  </div>
                </div>

                {/* Activity Details */}
                <div>
                  <h5 className="font-bold text-slate-100 text-sm group-hover:text-amber-200 transition">
                    {activity.title}
                  </h5>
                  <p className="text-slate-400 mt-1 leading-relaxed">{activity.description}</p>
                </div>

                {/* Footer Metadata: Location, Travel Time from previous, Opening Hours */}
                <div className="pt-2 border-t border-slate-800/70 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1 text-slate-400 truncate max-w-sm">
                    <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>{activity.location}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span>
                      🚗 ~{activity.travelTimeFromPreviousMin}m transit ({activity.transitModeFromPrevious})
                    </span>
                    <span>🕒 {activity.openingHours}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Curated Food Suggestions for this Day */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-amber-400" /> Curated Dining & Regional Gastronomy
            </h4>
            <span className="text-[11px] text-slate-500">Breakfast • Lunch • Dinner</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
            {/* Breakfast */}
            <div className="bg-slate-900/90 border border-slate-800/80 p-3 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-amber-400">Breakfast</span>
                <h5 className="font-bold text-slate-100 mt-0.5">
                  {selectedDay.foodSuggestions.breakfast.name}
                </h5>
                <p className="text-[11px] text-slate-400 mt-1">
                  ⭐ Must-try: {selectedDay.foodSuggestions.breakfast.specialty}
                </p>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800/80 flex justify-between text-[11px] text-slate-500">
                <span>{selectedDay.foodSuggestions.breakfast.cuisine}</span>
                <span className="text-emerald-400 font-semibold">
                  ~₹{selectedDay.foodSuggestions.breakfast.estCostPerPerson}/pax
                </span>
              </div>
            </div>

            {/* Lunch */}
            <div className="bg-slate-900/90 border border-slate-800/80 p-3 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-amber-400">Lunch</span>
                <h5 className="font-bold text-slate-100 mt-0.5">
                  {selectedDay.foodSuggestions.lunch.name}
                </h5>
                <p className="text-[11px] text-slate-400 mt-1">
                  ⭐ Must-try: {selectedDay.foodSuggestions.lunch.specialty}
                </p>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800/80 flex justify-between text-[11px] text-slate-500">
                <span>{selectedDay.foodSuggestions.lunch.cuisine}</span>
                <span className="text-emerald-400 font-semibold">
                  ~₹{selectedDay.foodSuggestions.lunch.estCostPerPerson}/pax
                </span>
              </div>
            </div>

            {/* Dinner */}
            <div className="bg-slate-900/90 border border-slate-800/80 p-3 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-amber-400">Dinner</span>
                <h5 className="font-bold text-slate-100 mt-0.5">
                  {selectedDay.foodSuggestions.dinner.name}
                </h5>
                <p className="text-[11px] text-slate-400 mt-1">
                  ⭐ Must-try: {selectedDay.foodSuggestions.dinner.specialty}
                </p>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800/80 flex justify-between text-[11px] text-slate-500">
                <span>{selectedDay.foodSuggestions.dinner.cuisine}</span>
                <span className="text-emerald-400 font-semibold">
                  ~₹{selectedDay.foodSuggestions.dinner.estCostPerPerson}/pax
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
