import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  Users,
  Coins,
  Sparkles,
  Gauge,
  Hotel,
  Bus,
  AlertTriangle,
  Edit2,
  Check,
  X,
} from 'lucide-react';
import { TripRequirements } from '../types/travel';

interface TripRequirementsCardProps {
  requirements: TripRequirements | null;
  onUpdateRequirements: (updated: Partial<TripRequirements>) => void;
  isLoading: boolean;
}

export const TripRequirementsCard: React.FC<TripRequirementsCardProps> = ({
  requirements,
  onUpdateRequirements,
  isLoading,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [budgetVal, setBudgetVal] = useState(requirements?.budget.amount || 50000);
  const [paceVal, setPaceVal] = useState(requirements?.travelPace || 'moderate');
  const [travelersVal, setTravelersVal] = useState(requirements?.travelers || 2);

  if (!requirements) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 text-center">
        <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-2 opacity-80" />
        <h3 className="text-sm font-semibold text-slate-200">No Active Trip Requirements</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Type your natural-language request below or pick a demo scenario to begin smart trip planning.
        </p>
      </div>
    );
  }

  const handleSave = () => {
    onUpdateRequirements({
      budget: { amount: Number(budgetVal), currency: requirements.budget.currency },
      travelPace: paceVal as any,
      travelers: Number(travelersVal),
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Active Trip State & Extracted Constraints
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-2.5 py-1 rounded text-xs transition"
              >
                <Check className="w-3 h-3" /> Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-1 bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs hover:bg-slate-700 transition"
              >
                <X className="w-3 h-3" />
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setBudgetVal(requirements.budget.amount);
                setPaceVal(requirements.travelPace);
                setTravelersVal(requirements.travelers);
                setIsEditing(true);
              }}
              className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1 transition"
            >
              <Edit2 className="w-3 h-3" /> Edit
            </button>
          )}
        </div>
      </div>

      {/* Missing information callout */}
      {requirements.isMissingRequiredInfo && (
        <div className="mt-3 bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200">
            <span className="font-bold">Missing Required Fields:</span>{' '}
            {requirements.missingFields.join(', ')}.
            <p className="mt-0.5 text-amber-300/80">
              The agent will not invent fake parameters; please provide them in the chat.
            </p>
          </div>
        </div>
      )}

      {/* Grid of Extracted Constraints */}
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        {/* Origin & Destination */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Route</span>
          </div>
          <div className="font-semibold text-slate-100 truncate">
            {requirements.origin || 'Delhi'} →{' '}
            <span className="text-amber-300">{requirements.destination || 'Unspecified'}</span>
          </div>
        </div>

        {/* Duration */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>Duration</span>
          </div>
          <div className="font-semibold text-slate-100">
            {requirements.durationDays > 0 ? `${requirements.durationDays} Days` : 'Not specified'}
          </div>
        </div>

        {/* Travelers */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span>Travelers</span>
          </div>
          {isEditing ? (
            <input
              type="number"
              min={1}
              max={20}
              value={travelersVal}
              onChange={(e) => setTravelersVal(Number(e.target.value))}
              className="w-full bg-slate-800 text-white rounded px-2 py-0.5 text-xs border border-slate-700"
            />
          ) : (
            <div className="font-semibold text-slate-100">{requirements.travelers} Persons</div>
          )}
        </div>

        {/* Budget */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
            <Coins className="w-3.5 h-3.5 text-emerald-400" />
            <span>Target Budget</span>
          </div>
          {isEditing ? (
            <input
              type="number"
              step={1000}
              value={budgetVal}
              onChange={(e) => setBudgetVal(Number(e.target.value))}
              className="w-full bg-slate-800 text-white rounded px-2 py-0.5 text-xs border border-slate-700"
            />
          ) : (
            <div className="font-semibold text-emerald-400">
              ₹{requirements.budget.amount.toLocaleString('en-IN')}
            </div>
          )}
        </div>
      </div>

      {/* Secondary Tags: Pace, Interests, Constraints */}
      <div className="mt-2.5 pt-2.5 border-t border-slate-800/70 flex flex-wrap items-center gap-2 text-xs">
        {/* Pace */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-300">
          <Gauge className="w-3 h-3 text-amber-400" />
          <span>Pace:</span>
          {isEditing ? (
            <select
              value={paceVal}
              onChange={(e) => setPaceVal(e.target.value as any)}
              className="bg-slate-900 text-white text-xs rounded border border-slate-700 ml-1 py-0.5 px-1"
            >
              <option value="relaxed">Relaxed</option>
              <option value="moderate">Moderate</option>
              <option value="packed">Packed</option>
            </select>
          ) : (
            <span className="font-semibold capitalize text-amber-300">{requirements.travelPace}</span>
          )}
        </div>

        {/* Hotel Tier */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-300">
          <Hotel className="w-3 h-3 text-cyan-400" />
          <span>Stay:</span>
          <span className="font-semibold capitalize text-slate-200">{requirements.accommodationPreference}</span>
        </div>

        {/* Transport */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-300">
          <Bus className="w-3 h-3 text-indigo-400" />
          <span>Transit:</span>
          <span className="font-semibold capitalize text-slate-200">{requirements.transportationPreference}</span>
        </div>

        {/* Interests */}
        {requirements.interests.map((int) => (
          <span
            key={int}
            className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-medium text-[11px]"
          >
            #{int}
          </span>
        ))}

        {/* Special Constraints */}
        {requirements.specialConstraints.map((sc, i) => (
          <span
            key={i}
            className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-medium text-[11px]"
          >
            ⚡ {sc}
          </span>
        ))}
      </div>
    </div>
  );
};
