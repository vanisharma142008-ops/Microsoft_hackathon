import React, { useState } from 'react';
import { Sparkles, X, ArrowRight, CornerDownLeft } from 'lucide-react';
import { TripRequirements } from '../types/travel';

interface AdaptTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyChange: (changePrompt: string) => void;
  requirements: TripRequirements | null;
  isLoading: boolean;
}

export const AdaptTripModal: React.FC<AdaptTripModalProps> = ({
  isOpen,
  onClose,
  onApplyChange,
  requirements,
  isLoading,
}) => {
  const [customPrompt, setCustomPrompt] = useState('');

  if (!isOpen) return null;

  const currentBudget = requirements?.budget.amount || 50000;
  const targetReduced = Math.max(15000, Math.round(currentBudget * 0.7));

  const quickActions = [
    {
      icon: '💰',
      label: 'Reduce budget',
      prompt: `Reduce my budget to ₹${targetReduced.toLocaleString('en-IN')}`,
      desc: `Drop target to ₹${targetReduced.toLocaleString('en-IN')}`,
    },
    {
      icon: '🧘',
      label: 'Make it more relaxed',
      prompt: 'Make the trip more relaxed with fewer daily stops and leisurely cafe breaks',
      desc: 'Limit to 1-2 activities/day',
    },
    {
      icon: '🍜',
      label: 'More food',
      prompt: 'Add more authentic culinary food stops and local market street tastings',
      desc: 'Highlight local gastronomy',
    },
    {
      icon: '🌿',
      label: 'More nature',
      prompt: 'Focus heavily on nature walks, viewpoints, and scenic green trails',
      desc: 'Scenic pine forests & valleys',
    },
    {
      icon: '⏰',
      label: 'Avoid early mornings',
      prompt: 'I do not want early morning activities; please start daily tours after 10:30 AM',
      desc: 'Starts after 10:30 AM',
    },
    {
      icon: '➕',
      label: 'Add a day',
      prompt: 'Add one more day to the trip and preserve previous days',
      desc: `Extend to ${(requirements?.durationDays || 5) + 1} days`,
    },
    {
      icon: '➖',
      label: 'Remove a day',
      prompt: 'Shorten the trip by one day and keep the best highlights',
      desc: `Reduce to ${Math.max(1, (requirements?.durationDays || 5) - 1)} days`,
    },
    {
      icon: '🌧️',
      label: 'Rain contingency on Day 3',
      prompt: "It's going to rain on Day 3, switch outdoor treks to indoor cultural venues",
      desc: 'Covered / indoor venues',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim() || isLoading) return;
    onApplyChange(customPrompt.trim());
    onClose();
  };

  const handleSelectQuickAction = (prompt: string) => {
    if (isLoading) return;
    onApplyChange(prompt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-stone-200/90 relative space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600 font-mono">
                Adaptive Re-Planning Engine
              </span>
              <h3 className="text-xl font-extrabold text-stone-900">Change My Trip</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-stone-500 leading-relaxed">
          The agent detects exactly what changed, modifies affected parts, preserves unaffected days, and recalculates the budget.
        </p>

        {/* Quick Actions Grid (Section 6 Requirement) */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 font-mono block">
            Popular Adjustments
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {quickActions.map((qa, i) => (
              <button
                key={i}
                onClick={() => handleSelectQuickAction(qa.prompt)}
                disabled={isLoading}
                className="bg-stone-50 hover:bg-orange-50/80 hover:border-orange-300 border border-stone-200/80 text-left p-3 rounded-2xl transition flex items-start gap-2.5 cursor-pointer group"
              >
                <span className="text-lg shrink-0 mt-0.5">{qa.icon}</span>
                <div className="min-w-0">
                  <span className="font-bold text-xs text-stone-900 group-hover:text-orange-950 block">
                    {qa.label}
                  </span>
                  <span className="text-[11px] text-stone-500 truncate block">{qa.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Natural Language Prompt */}
        <form onSubmit={handleSubmit} className="space-y-2 pt-2 border-t border-stone-100">
          <label className="block text-xs font-bold text-stone-700">
            Or describe your changes in plain English:
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              disabled={isLoading}
              placeholder='e.g. "Make Day 3 less hectic" or "Reduce budget to ₹35,000"'
              className="w-full bg-stone-50 text-stone-900 placeholder-stone-400 text-xs font-medium rounded-xl pl-3.5 pr-20 py-2.5 border border-stone-300 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
            />
            <button
              type="submit"
              disabled={!customPrompt.trim() || isLoading}
              className="absolute right-1.5 bg-orange-600 hover:bg-orange-500 disabled:opacity-40 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center gap-1 shadow-sm"
            >
              <span>Adapt</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
