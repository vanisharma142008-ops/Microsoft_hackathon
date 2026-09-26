import React from 'react';
import { Compass, Sparkles, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { AgentWorkflowStep } from '../types/travel';

interface HeaderProps {
  activeTab: 'planner' | 'evaluation' | 'security';
  setActiveTab: (tab: 'planner' | 'evaluation' | 'security') => void;
  workflowStep: AgentWorkflowStep;
  hasItinerary: boolean;
  onOpenChangeTrip: () => void;
  onNewTrip: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  workflowStep,
  hasItinerary,
  onOpenChangeTrip,
  onNewTrip,
}) => {
  const steps: { key: AgentWorkflowStep; label: string }[] = [
    { key: 'understanding', label: 'Understand' },
    { key: 'researching', label: 'Research' },
    { key: 'planning', label: 'Plan' },
    { key: 'validating', label: 'Validate' },
    { key: 'replanning', label: 'Adapt' },
  ];

  return (
    <header className="border-b border-stone-200/80 bg-[#FAF8F5]/90 backdrop-blur-md sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={onNewTrip}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center shadow-md shadow-orange-500/20 text-white font-bold group-hover:scale-105 transition">
                <Compass className="w-5 h-5 text-white stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight text-stone-900 group-hover:text-orange-600 transition">
                    WanderWise
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200/60">
                    AI Travel Agent
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 font-medium">
                  Constraint-Aware • Real-Data Research • Adaptive Re-planning
                </p>
              </div>
            </button>

            {/* View Mode Tabs */}
            <div className="flex bg-stone-200/70 p-1 rounded-xl border border-stone-300/60 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('planner')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeTab === 'planner'
                    ? 'bg-white text-stone-900 shadow-sm font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Trip Planner
              </button>
              <button
                onClick={() => setActiveTab('evaluation')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                  activeTab === 'evaluation'
                    ? 'bg-white text-stone-900 shadow-sm font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Eval Suite (8/8)
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                  activeTab === 'security'
                    ? 'bg-white text-stone-900 shadow-sm font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-stone-700" />
                Security
              </button>
            </div>
          </div>

          {/* Center Pipeline / Status */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs bg-stone-100/90 border border-stone-200 px-3.5 py-1.5 rounded-xl">
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 mr-1 font-mono">
              Engine:
            </span>
            {steps.map((st, idx) => {
              const isActive = workflowStep === st.key;
              const isPast =
                workflowStep === 'completed' ||
                (workflowStep === 'replanning' && idx < 4) ||
                (workflowStep === 'validating' && idx < 3) ||
                (workflowStep === 'planning' && idx < 2) ||
                (workflowStep === 'researching' && idx < 1);

              return (
                <div key={st.key} className="flex items-center gap-1">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition ${
                      isActive
                        ? 'bg-orange-600 text-white shadow-sm animate-pulse'
                        : isPast
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                        : 'text-stone-400'
                    }`}
                  >
                    {st.label}
                  </span>
                  {idx < steps.length - 1 && <span className="text-stone-300">→</span>}
                </div>
              );
            })}
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            {hasItinerary && (
              <button
                onClick={onOpenChangeTrip}
                className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm shadow-orange-600/20 transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>✨ Change My Trip</span>
              </button>
            )}

            {hasItinerary && (
              <button
                onClick={onNewTrip}
                className="bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-700 font-semibold px-3 py-1.5 rounded-xl text-xs transition cursor-pointer"
              >
                New Trip
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
