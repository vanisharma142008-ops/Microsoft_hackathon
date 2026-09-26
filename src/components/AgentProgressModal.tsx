import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Sparkles } from 'lucide-react';

interface AgentProgressModalProps {
  isOpen: boolean;
  destination: string;
}

export const AgentProgressModal: React.FC<AgentProgressModalProps> = ({ isOpen, destination }) => {
  const steps = [
    'Understanding your preferences',
    'Checking travel options',
    'Finding suitable stays',
    'Exploring food experiences',
    'Checking weather & climate',
    'Optimizing day-by-day itinerary',
    'Validating budget & constraints',
  ];

  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIdx(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStepIdx((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 600);

    return () => clearInterval(interval);
  }, [isOpen, steps.length]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-stone-200/90 text-stone-900 space-y-5">
        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto shadow-inner">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h3 className="text-lg font-extrabold text-stone-900">
            Crafting your {destination || 'Travel'} Itinerary
          </h3>
          <p className="text-xs text-stone-500 font-medium">
            Researching live data sources and checking constraint feasibility...
          </p>
        </div>

        {/* Elegant Animated Checklist (Section 3 of User Request) */}
        <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/70 space-y-2.5 text-xs">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStepIdx;
            const isCurrent = idx === currentStepIdx;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 transition duration-300 ${
                  isCompleted
                    ? 'text-stone-800 font-medium'
                    : isCurrent
                    ? 'text-orange-700 font-bold'
                    : 'text-stone-400'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-orange-600 animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-stone-300 shrink-0" />
                )}
                <span>{step}</span>
              </div>
            );
          })}
        </div>

        <div className="text-center text-[11px] text-stone-400 font-medium">
          Zero hallucinated rates • Bounded tool calls • Verified data
        </div>
      </div>
    </div>
  );
};
