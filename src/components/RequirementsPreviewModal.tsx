import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  Users,
  Coins,
  Sparkles,
  Gauge,
  CheckCircle2,
  Edit3,
  ArrowRight,
  X,
  AlertTriangle,
} from 'lucide-react';
import { TripRequirements } from '../types/travel';

interface RequirementsPreviewProps {
  requirements: TripRequirements;
  isOpen: boolean;
  onConfirm: () => void;
  onUpdate: (updated: Partial<TripRequirements>) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const RequirementsPreviewModal: React.FC<RequirementsPreviewProps> = ({
  requirements,
  isOpen,
  onConfirm,
  onUpdate,
  onCancel,
  isLoading,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [origin, setOrigin] = useState(requirements.origin || 'Delhi');
  const [destination, setDestination] = useState(requirements.destination || 'Jaipur');
  const [durationDays, setDurationDays] = useState(requirements.durationDays || 5);
  const [travelers, setTravelers] = useState(requirements.travelers || 2);
  const [budgetAmount, setBudgetAmount] = useState(requirements.budget.amount || 50000);
  const [travelPace, setTravelPace] = useState(requirements.travelPace || 'relaxed');
  const [interestsText, setInterestsText] = useState(requirements.interests.join(', '));

  if (!isOpen) return null;

  const handleSaveEdit = () => {
    onUpdate({
      origin,
      destination,
      durationDays: Number(durationDays),
      travelers: Number(travelers),
      budget: { amount: Number(budgetAmount), currency: requirements.budget.currency },
      travelPace: travelPace as any,
      interests: interestsText.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean),
    });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200/90 relative space-y-6">
        {/* Top Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600 font-mono">
                1. Smart Trip Understanding
              </span>
              <h3 className="text-xl font-extrabold text-stone-900">I understood your trip:</h3>
            </div>
          </div>

          <button
            onClick={onCancel}
            disabled={isLoading}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Missing field warning if destination or duration is missing */}
        {requirements.isMissingRequiredInfo && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Missing Information:</span>{' '}
              {requirements.missingFields.join(', ')}.
              <p className="mt-0.5 text-amber-800">
                Please specify your destination and duration below so we can research real data accurately.
              </p>
            </div>
          </div>
        )}

        {/* Summary Card with editable fields */}
        <div className="bg-stone-50 rounded-2xl p-4 sm:p-5 border border-stone-200/70 space-y-3.5 text-xs">
          {/* Route */}
          <div className="flex items-center justify-between pb-2.5 border-b border-stone-200/60">
            <span className="text-stone-500 font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-600" /> Route:
            </span>
            {isEditing ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="Origin"
                  className="bg-white border border-stone-300 rounded px-2 py-1 text-xs w-20 text-right"
                />
                <span className="text-stone-400">→</span>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Destination"
                  className="bg-white border border-stone-300 rounded px-2 py-1 text-xs w-24 font-bold text-orange-700"
                />
              </div>
            ) : (
              <span className="font-bold text-stone-900 text-sm">
                📍 {requirements.origin || 'Delhi'} →{' '}
                <span className="text-orange-700">{requirements.destination || 'Jaipur'}</span>
              </span>
            )}
          </div>

          {/* Duration */}
          <div className="flex items-center justify-between pb-2.5 border-b border-stone-200/60">
            <span className="text-stone-500 font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-600" /> Duration:
            </span>
            {isEditing ? (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={1}
                  max={14}
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  className="bg-white border border-stone-300 rounded px-2 py-1 text-xs w-16 text-right"
                />
                <span>days</span>
              </div>
            ) : (
              <span className="font-bold text-stone-900">📅 {requirements.durationDays} days</span>
            )}
          </div>

          {/* Travelers */}
          <div className="flex items-center justify-between pb-2.5 border-b border-stone-200/60">
            <span className="text-stone-500 font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" /> Travelers:
            </span>
            {isEditing ? (
              <input
                type="number"
                min={1}
                max={20}
                value={travelers}
                onChange={(e) => setTravelers(Number(e.target.value))}
                className="bg-white border border-stone-300 rounded px-2 py-1 text-xs w-16 text-right"
              />
            ) : (
              <span className="font-bold text-stone-900">👥 {requirements.travelers} travelers</span>
            )}
          </div>

          {/* Budget */}
          <div className="flex items-center justify-between pb-2.5 border-b border-stone-200/60">
            <span className="text-stone-500 font-medium flex items-center gap-2">
              <Coins className="w-4 h-4 text-emerald-600" /> Target Budget:
            </span>
            {isEditing ? (
              <input
                type="number"
                step={1000}
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(Number(e.target.value))}
                className="bg-white border border-stone-300 rounded px-2 py-1 text-xs w-28 text-right font-bold text-emerald-700"
              />
            ) : (
              <span className="font-bold text-emerald-700 text-sm">
                💰 ₹{requirements.budget.amount.toLocaleString('en-IN')} budget
              </span>
            )}
          </div>

          {/* Interests */}
          <div className="flex items-center justify-between pb-2.5 border-b border-stone-200/60">
            <span className="text-stone-500 font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" /> Focus Interests:
            </span>
            {isEditing ? (
              <input
                type="text"
                value={interestsText}
                onChange={(e) => setInterestsText(e.target.value)}
                placeholder="nature, food, heritage"
                className="bg-white border border-stone-300 rounded px-2 py-1 text-xs w-48 text-right"
              />
            ) : (
              <div className="flex items-center gap-1.5 font-bold text-stone-800">
                {requirements.interests.map((int) => (
                  <span
                    key={int}
                    className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[11px]"
                  >
                    #{int}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Travel Pace */}
          <div className="flex items-center justify-between">
            <span className="text-stone-500 font-medium flex items-center gap-2">
              <Gauge className="w-4 h-4 text-orange-600" /> Travel Pace:
            </span>
            {isEditing ? (
              <select
                value={travelPace}
                onChange={(e) => setTravelPace(e.target.value as any)}
                className="bg-white border border-stone-300 rounded px-2 py-1 text-xs capitalize"
              >
                <option value="relaxed">Relaxed pace</option>
                <option value="moderate">Moderate pace</option>
                <option value="packed">Packed pace</option>
              </select>
            ) : (
              <span className="font-bold text-stone-900 capitalize">
                🧘 {requirements.travelPace} pace
              </span>
            )}
          </div>
        </div>

        {/* Footer Confirmation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            {isEditing ? (
              <button
                onClick={handleSaveEdit}
                className="bg-stone-900 hover:bg-stone-800 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition cursor-pointer"
              >
                Save Edits
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 text-stone-600 hover:text-stone-900 font-semibold px-3 py-2 rounded-xl border border-stone-300 hover:bg-stone-100 text-xs transition cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Parameters</span>
              </button>
            )}
            <span className="text-xs font-semibold text-stone-500">Looks right?</span>
          </div>

          <button
            onClick={onConfirm}
            disabled={isLoading || requirements.isMissingRequiredInfo}
            className="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-orange-600/20 transition cursor-pointer disabled:opacity-50"
          >
            <span>Create Itinerary</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
