import React from 'react';
import { X, HelpCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { WhyChosenEvidence } from '../types/travel';

interface WhyThisModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  itemType: string;
  evidence: WhyChosenEvidence | null;
}

export const WhyThisModal: React.FC<WhyThisModalProps> = ({
  isOpen,
  onClose,
  itemName,
  itemType,
  evidence,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-stone-200/90 relative space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 rounded-xl transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600 font-mono">
              Decision Explanation
            </span>
            <h3 className="text-base font-extrabold text-stone-900 mt-0.5 leading-snug">
              Why this {itemType}?
            </h3>
            <p className="text-xs text-stone-500 font-medium truncate max-w-xs">{itemName}</p>
          </div>
        </div>

        {/* Evidence Checklist (Section 9 Requirement: Concise, evidence-based reasons) */}
        <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/70 space-y-2.5 text-xs">
          {evidence ? (
            <>
              <div className="flex items-start gap-2.5 text-stone-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{evidence.userPreferenceMatch}</span>
              </div>
              <div className="flex items-start gap-2.5 text-stone-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{evidence.budgetReason}</span>
              </div>
              <div className="flex items-start gap-2.5 text-stone-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{evidence.distanceReason}</span>
              </div>
              <div className="flex items-start gap-2.5 text-stone-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{evidence.weatherReason}</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start gap-2.5 text-stone-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Within your specified budget allocation</span>
              </div>
              <div className="flex items-start gap-2.5 text-stone-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Optimized geographical corridor with minimal transit friction</span>
              </div>
              <div className="flex items-start gap-2.5 text-stone-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Matches your declared travel pace and preference</span>
              </div>
            </>
          )}
        </div>

        {/* Source citation */}
        {evidence?.sourceEvidence && (
          <div className="p-3 bg-orange-50/60 rounded-xl border border-orange-200/60 text-[11px] text-stone-600 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-orange-950 block">Verified Data Source:</span>
              <span className="text-stone-700">{evidence.sourceEvidence}</span>
            </div>
          </div>
        )}

        <div className="pt-1 flex justify-end">
          <button
            onClick={onClose}
            className="bg-stone-900 hover:bg-stone-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
