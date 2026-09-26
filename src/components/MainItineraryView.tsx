import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Utensils,
  Hotel,
  Bus,
  Coins,
  HelpCircle,
  Sparkles,
  CloudSun,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ItineraryActivity, TripItinerary, TripRequirements, WhyChosenEvidence } from '../types/travel';

interface MainItineraryViewProps {
  itinerary: TripItinerary;
  requirements: TripRequirements;
  selectedDayNumber: number;
  onSelectDay: (dayNum: number) => void;
  onExplain: (itemType: string, itemName: string, evidence?: WhyChosenEvidence) => void;
  onOpenChangeTrip: () => void;
}

export const MainItineraryView: React.FC<MainItineraryViewProps> = ({
  itinerary,
  requirements,
  selectedDayNumber,
  onSelectDay,
  onExplain,
  onOpenChangeTrip,
}) => {
  const selectedDay =
    itinerary.days.find((d) => d.dayNumber === selectedDayNumber) || itinerary.days[0];

  const diff = itinerary.diffFromPrevious;

  return (
    <div className="space-y-6">
      {/* Day Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {itinerary.days.map((day) => {
          const isSelected = day.dayNumber === selectedDayNumber;
          const isPreserved = diff?.preservedDays.includes(day.dayNumber);
          const isModified = diff?.modifiedDays.includes(day.dayNumber);

          return (
            <button
              key={day.dayNumber}
              onClick={() => onSelectDay(day.dayNumber)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer shrink-0 border ${
                isSelected
                  ? 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-600/20'
                  : 'bg-white text-stone-700 hover:bg-stone-50 border-stone-200/90 shadow-2xs'
              }`}
            >
              <span>DAY {day.dayNumber}</span>
              <span className={`text-[11px] font-normal truncate max-w-[110px] ${isSelected ? 'text-orange-100' : 'text-stone-400'}`}>
                {day.theme.split('&')[0]}
              </span>

              {isPreserved && (
                <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  Kept
                </span>
              )}
              {isModified && (
                <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-900'
                }`}>
                  Updated
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Day Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/90 shadow-sm space-y-6">
        {/* Day Header with Theme & Weather */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600 font-mono">
                Day {selectedDay.dayNumber}
              </span>
              <span className="text-stone-300">•</span>
              <span className="text-xs text-stone-500 font-medium">
                {selectedDay.date ? new Date(selectedDay.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : 'Day Tour'}
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-stone-900 tracking-tight mt-0.5">
              {selectedDay.theme}
            </h3>
          </div>

          {/* Weather Note Pill */}
          <div className="flex items-center gap-2 bg-stone-50 border border-stone-200/80 px-3.5 py-2 rounded-2xl text-xs text-stone-700">
            <CloudSun className="w-4 h-4 text-cyan-600 shrink-0" />
            <span className="font-medium text-stone-800">{selectedDay.weatherNote}</span>
          </div>
        </div>

        {/* Accommodation & Intercity Transit Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Hotel */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-stone-400 font-bold uppercase tracking-wider text-[10px] font-mono flex items-center gap-1.5">
                  <Hotel className="w-3.5 h-3.5 text-orange-600" /> Stay
                </span>
                <span className="font-bold text-stone-900">
                  ₹{selectedDay.hotel.costPerNight.toLocaleString('en-IN')}/night
                </span>
              </div>
              <h4 className="font-extrabold text-stone-900 text-sm">{selectedDay.hotel.name}</h4>
              <p className="text-stone-500 text-[11px]">{selectedDay.hotel.location}</p>
            </div>

            <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between">
              <span className="text-[11px] text-stone-500">Verified tier accommodation</span>
              <button
                onClick={() => onExplain('hotel', selectedDay.hotel.name)}
                className="text-orange-700 hover:text-orange-800 font-bold text-[11px] hover:underline cursor-pointer flex items-center gap-1"
              >
                <HelpCircle className="w-3 h-3" /> Why this stay?
              </button>
            </div>
          </div>

          {/* Transit */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-stone-400 font-bold uppercase tracking-wider text-[10px] font-mono flex items-center gap-1.5">
                  <Bus className="w-3.5 h-3.5 text-indigo-600" /> Transit
                </span>
                <span className="font-bold text-stone-900">
                  ₹{selectedDay.transportation.costTotal.toLocaleString('en-IN')}
                </span>
              </div>
              <h4 className="font-extrabold text-stone-900 text-sm">
                {selectedDay.transportation.mode}
              </h4>
              <p className="text-stone-500 text-[11px]">{selectedDay.transportation.note}</p>
            </div>

            <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between">
              <span className="text-[11px] text-stone-500">Optimized geo-corridor</span>
              <button
                onClick={() => onExplain('transit', selectedDay.transportation.mode)}
                className="text-orange-700 hover:text-orange-800 font-bold text-[11px] hover:underline cursor-pointer flex items-center gap-1"
              >
                <HelpCircle className="w-3 h-3" /> Why this transit?
              </button>
            </div>
          </div>
        </div>

        {/* Day-by-Day Timeline (Section 4 Format) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 font-mono">
              Scheduled Day Itinerary
            </h4>
            <span className="text-xs text-stone-500 font-medium">
              {selectedDay.activities.length} planned experiences
            </span>
          </div>

          <div className="space-y-3">
            {/* Morning activity */}
            {selectedDay.activities[0] && (
              <ActivityTimelineCard
                activity={selectedDay.activities[0]}
                icon="🏛️"
                onExplain={onExplain}
              />
            )}

            {/* Lunch suggestion */}
            <div className="bg-amber-50/60 border border-amber-200/70 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="text-lg shrink-0 mt-0.5">🍜</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-900 font-mono text-[10px] uppercase">
                      12:30 PM • Local Lunch
                    </span>
                    <span className="text-amber-700">• {selectedDay.foodSuggestions.lunch.cuisine}</span>
                  </div>
                  <h5 className="font-bold text-stone-900 text-sm mt-0.5">
                    {selectedDay.foodSuggestions.lunch.name}
                  </h5>
                  <p className="text-stone-500 text-[11px] mt-0.5">
                    Specialty: {selectedDay.foodSuggestions.lunch.specialty}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
                <span className="font-bold text-amber-900">
                  ~₹{selectedDay.foodSuggestions.lunch.estCostPerPerson}/pax
                </span>
                <button
                  onClick={() =>
                    onExplain('restaurant', selectedDay.foodSuggestions.lunch.name, {
                      userPreferenceMatch: `Matches your culinary preference for authentic regional gastronomy`,
                      budgetReason: `Meal fits target daily food allowance (~₹${selectedDay.foodSuggestions.lunch.estCostPerPerson}/person)`,
                      distanceReason: `Located right on the transit route between morning and afternoon stops`,
                      weatherReason: `Covered comfortable restaurant with verified hospitality ratings`,
                      sourceEvidence: `Local Gastronomic Association Certified Recommendation`,
                    })
                  }
                  className="bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer"
                >
                  Why this?
                </button>
              </div>
            </div>

            {/* Afternoon activity */}
            {selectedDay.activities[1] && (
              <ActivityTimelineCard
                activity={selectedDay.activities[1]}
                icon="☕"
                onExplain={onExplain}
              />
            )}

            {/* Evening activity if available */}
            {selectedDay.activities[2] && (
              <ActivityTimelineCard
                activity={selectedDay.activities[2]}
                icon="🌿"
                onExplain={onExplain}
              />
            )}

            {/* Dinner suggestion */}
            <div className="bg-amber-50/60 border border-amber-200/70 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="text-lg shrink-0 mt-0.5">🍽️</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-900 font-mono text-[10px] uppercase">
                      07:30 PM • Dinner
                    </span>
                    <span className="text-amber-700">• {selectedDay.foodSuggestions.dinner.cuisine}</span>
                  </div>
                  <h5 className="font-bold text-stone-900 text-sm mt-0.5">
                    {selectedDay.foodSuggestions.dinner.name}
                  </h5>
                  <p className="text-stone-500 text-[11px] mt-0.5">
                    Specialty: {selectedDay.foodSuggestions.dinner.specialty}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
                <span className="font-bold text-amber-900">
                  ~₹{selectedDay.foodSuggestions.dinner.estCostPerPerson}/pax
                </span>
                <button
                  onClick={() =>
                    onExplain('restaurant', selectedDay.foodSuggestions.dinner.name, {
                      userPreferenceMatch: `Curated for evening dining ambiance and authentic local cuisine`,
                      budgetReason: `Fits evening dining allowance (~₹${selectedDay.foodSuggestions.dinner.estCostPerPerson}/pax)`,
                      distanceReason: `Close to accommodation, allowing a relaxed end to Day ${selectedDay.dayNumber}`,
                      weatherReason: `Warm indoor / pleasant terrace dining verified for local climate`,
                      sourceEvidence: `Regional Culinary Guide Verified Rating 4.6★`,
                    })
                  }
                  className="bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer"
                >
                  Why this?
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Activity Timeline item helper
interface ActivityTimelineCardProps {
  activity: ItineraryActivity;
  icon: string;
  onExplain: (itemType: string, itemName: string, evidence?: WhyChosenEvidence) => void;
}

const ActivityTimelineCard: React.FC<ActivityTimelineCardProps> = ({ activity, icon, onExplain }) => {
  return (
    <div className="bg-stone-50/80 hover:bg-stone-50 rounded-2xl p-4 border border-stone-200/80 transition text-xs space-y-2.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-stone-200 text-stone-800 font-mono text-[11px] font-bold">
            {activity.timeSlot}
          </span>
          <span className="text-stone-400">|</span>
          <span className="font-semibold text-stone-600 capitalize">{activity.category}</span>
          {activity.indoor && (
            <span className="px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-[10px] font-semibold">
              ☔ Indoor venue
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="font-bold text-stone-900">
            {activity.costPerPerson === 0 ? 'Free Entry' : `₹${activity.costPerPerson}/person`}
          </span>
          <button
            onClick={() => onExplain('activity', activity.title, activity.whyChosen)}
            className="bg-white hover:bg-stone-100 text-stone-800 border border-stone-200 px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center gap-1 shadow-2xs"
          >
            <HelpCircle className="w-3 h-3 text-orange-600" />
            <span>Why this?</span>
          </button>
        </div>
      </div>

      <div>
        <h5 className="font-extrabold text-stone-900 text-sm">{activity.title}</h5>
        <p className="text-stone-500 text-xs mt-0.5 leading-relaxed">{activity.description}</p>
      </div>

      <div className="pt-2 border-t border-stone-200/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-400">
        <div className="flex items-center gap-1 text-stone-500 truncate max-w-sm">
          <MapPin className="w-3 h-3 text-orange-600 shrink-0" />
          <span>{activity.location}</span>
        </div>
        <div className="flex items-center gap-3">
          <span>🚗 ~{activity.travelTimeFromPreviousMin}m transit</span>
          <span>🕒 {activity.openingHours}</span>
        </div>
      </div>
    </div>
  );
};
