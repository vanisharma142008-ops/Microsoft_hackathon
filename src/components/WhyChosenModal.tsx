import React from 'react';
import { X, HelpCircle, Heart, Coins, MapPin, CloudSun, ShieldCheck } from 'lucide-react';
import { WhyChosenEvidence } from '../types/travel';

interface WhyChosenModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  itemType: string;
  evidence: WhyChosenEvidence | null;
}

export const WhyChosenModal: React.FC<WhyChosenModalProps> = ({
  isOpen,
  onClose,
  itemName,
  itemType,
  evidence,
}) => {
  if (!isOpen || !evidence) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              Observable Evidence Inspector
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">
              Why was "{itemName}" chosen?
            </h3>
            <p className="text-xs text-slate-400">
              Clear, factual justification based on your preferences, budget, route, and verified live data.
            </p>
          </div>
        </div>

        {/* 5 Observable Evidence Pillars */}
        <div className="space-y-3 pt-2">
          {/* 1. User Preference */}
          <div className="flex items-start gap-3 bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl text-xs">
            <div className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20 shrink-0">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-200 block mb-0.5">User Preference Match</span>
              <p className="text-slate-400">{evidence.userPreferenceMatch}</p>
            </div>
          </div>

          {/* 2. Budget Factor */}
          <div className="flex items-start gap-3 bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl text-xs">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-200 block mb-0.5">Budget Factor</span>
              <p className="text-slate-400">{evidence.budgetReason}</p>
            </div>
          </div>

          {/* 3. Distance & Travel Time */}
          <div className="flex items-start gap-3 bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl text-xs">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-200 block mb-0.5">Route & Transit Optimization</span>
              <p className="text-slate-400">{evidence.distanceReason}</p>
            </div>
          </div>

          {/* 4. Weather Alignment */}
          <div className="flex items-start gap-3 bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl text-xs">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
              <CloudSun className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-200 block mb-0.5">Weather Condition Rationale</span>
              <p className="text-slate-400">{evidence.weatherReason}</p>
            </div>
          </div>

          {/* 5. Tool & Verified Source Evidence */}
          <div className="flex items-start gap-3 bg-amber-500/5 border border-amber-500/20 p-3 rounded-xl text-xs">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-amber-300 block mb-0.5">Verified Data Source</span>
              <p className="text-slate-300 font-mono text-[11px]">{evidence.sourceEvidence}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold transition"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
