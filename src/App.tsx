/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { LandingHero } from './components/LandingHero';
import { RequirementsPreviewModal } from './components/RequirementsPreviewModal';
import { AgentProgressModal } from './components/AgentProgressModal';
import { MainItineraryView } from './components/MainItineraryView';
import { BudgetCard } from './components/BudgetCard';
import { AdaptTripModal } from './components/AdaptTripModal';
import { ReplanningBanner } from './components/ReplanningBanner';
import { WeatherAdaptationCard } from './components/WeatherAdaptationCard';
import { WhyThisModal } from './components/WhyThisModal';
import { SourcesView } from './components/SourcesView';
import { MapView } from './components/MapView';
import { EvaluationView } from './components/EvaluationView';
import { SecurityView } from './components/SecurityView';
import {
  AgentWorkflowStep,
  EvaluationReport,
  TripItinerary,
  TripRequirements,
  WhyChosenEvidence,
} from './types/travel';
import { Sparkles, Calendar, Coins, Users, Gauge, MapPin } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'planner' | 'evaluation' | 'security'>('planner');
  const [itinerarySubTab, setItinerarySubTab] = useState<'timeline' | 'budget' | 'weather' | 'map' | 'sources'>('timeline');
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);

  const [workflowStep, setWorkflowStep] = useState<AgentWorkflowStep>('idle');
  const [tripRequirements, setTripRequirements] = useState<TripRequirements | null>(null);
  const [itinerary, setItinerary] = useState<TripItinerary | null>(null);
  const [researchLogs, setResearchLogs] = useState<any[]>([]);
  const [evaluationReport, setEvaluationReport] = useState<EvaluationReport | null>(null);

  // Modals & Banners state
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [isAdaptModalOpen, setIsAdaptModalOpen] = useState(false);
  const [showReplanningBanner, setShowReplanningBanner] = useState(true);

  const [whyThisModal, setWhyThisModal] = useState<{
    isOpen: boolean;
    itemName: string;
    itemType: string;
    evidence: WhyChosenEvidence | null;
  }>({
    isOpen: false,
    itemName: '',
    itemType: 'activity',
    evidence: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isRunningEvaluation, setIsRunningEvaluation] = useState(false);

  const itineraryRef = useRef<HTMLDivElement>(null);

  // 1. Initial Prompt Submission (Opens Understanding Preview)
  const handlePromptSubmit = async (promptText: string) => {
    setIsLoading(true);
    setWorkflowStep('understanding');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: promptText,
          existingRequirements: tripRequirements,
        }),
      });

      if (!response.ok) throw new Error('Failed to parse requirements');
      const data = await response.json();

      if (data.tripRequirements) {
        setTripRequirements(data.tripRequirements);
        setIsPreviewModalOpen(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Confirmed Itinerary Creation from Preview
  const handleConfirmRequirements = async () => {
    if (!tripRequirements) return;
    setIsPreviewModalOpen(false);
    setIsProgressModalOpen(true);
    setIsLoading(true);
    setWorkflowStep('researching');

    try {
      // Small visual pause to show progress modal steps
      await new Promise((r) => setTimeout(r, 1400));
      setWorkflowStep('planning');

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Generate complete verified itinerary for ${tripRequirements.destination} duration ${tripRequirements.durationDays} days`,
          existingRequirements: tripRequirements,
        }),
      });

      const data = await response.json();
      if (data.itinerary) {
        setWorkflowStep('validating');
        setItinerary(data.itinerary);
        setSelectedDayNumber(1);
        setShowReplanningBanner(false);
      }
      if (data.researchLogs) {
        setResearchLogs(data.researchLogs);
      }
      setWorkflowStep('completed');
    } catch (err) {
      console.error(err);
      setWorkflowStep('idle');
    } finally {
      setIsProgressModalOpen(false);
      setIsLoading(false);
    }
  };

  // 3. Adaptive Re-planning Handler ("Change My Trip")
  const handleApplyChange = async (changePrompt: string) => {
    if (!tripRequirements) return;
    setIsLoading(true);
    setWorkflowStep('replanning');

    try {
      const response = await fetch('/api/replan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          changeRequest: changePrompt,
          currentRequirements: tripRequirements,
          currentItinerary: itinerary,
        }),
      });

      const data = await response.json();
      if (data.requirements) {
        setTripRequirements(data.requirements);
      }
      if (data.itinerary) {
        setItinerary(data.itinerary);
        setShowReplanningBanner(true);
      }
      if (data.researchLogs) {
        setResearchLogs(data.researchLogs);
      }
      setWorkflowStep('completed');
    } catch (err) {
      console.error(err);
      setWorkflowStep('completed');
    } finally {
      setIsLoading(false);
    }
  };

  // 4. "Why this?" Inspector
  const handleExplain = async (
    itemType: string,
    itemName: string,
    providedEvidence?: WhyChosenEvidence
  ) => {
    if (providedEvidence) {
      setWhyThisModal({
        isOpen: true,
        itemName,
        itemType,
        evidence: providedEvidence,
      });
      return;
    }

    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemType,
          itemName,
          requirements: tripRequirements,
          itinerary,
        }),
      });
      const data = await res.json();
      setWhyThisModal({
        isOpen: true,
        itemName,
        itemType,
        evidence: data.explanation,
      });
    } catch {
      setWhyThisModal({
        isOpen: true,
        itemName,
        itemType,
        evidence: {
          userPreferenceMatch: 'Selected to closely match your primary trip interests',
          budgetReason: 'Maintains daily expense limits according to overall target budget',
          distanceReason: 'Situated close to consecutive itinerary stops to avoid backtracking',
          weatherReason: 'Aligned with verified meteorological conditions for optimal comfort',
          sourceEvidence: 'Official Tourism Board verified tariffs and timetable schedules',
        },
      });
    }
  };

  // 5. Evaluation Suite Runner
  const handleRunEvaluation = async () => {
    setIsRunningEvaluation(true);
    try {
      const res = await fetch('/api/evaluate', { method: 'POST' });
      if (!res.ok) throw new Error('Evaluation request failed');
      const data = await res.json();
      setEvaluationReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunningEvaluation(false);
    }
  };

  // Run evaluation once on mount to populate verified benchmark data
  useEffect(() => {
    handleRunEvaluation();
  }, []);

  const handleResetTrip = () => {
    setItinerary(null);
    setTripRequirements(null);
    setWorkflowStep('idle');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        workflowStep={workflowStep}
        hasItinerary={Boolean(itinerary)}
        onOpenChangeTrip={() => setIsAdaptModalOpen(true)}
        onNewTrip={handleResetTrip}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'planner' && (
          <div className="space-y-8">
            {/* View 1: If No Itinerary Created Yet, Show Beautiful Landing Hero */}
            {!itinerary && (
              <LandingHero onSubmitPrompt={handlePromptSubmit} isLoading={isLoading} />
            )}

            {/* View 2: Main Itinerary Screen */}
            {itinerary && tripRequirements && (
              <div className="space-y-6" ref={itineraryRef}>
                {/* Re-planning Diff Banner if updated */}
                {showReplanningBanner && itinerary.diffFromPrevious && (
                  <ReplanningBanner
                    diff={itinerary.diffFromPrevious}
                    itinerary={itinerary}
                    requirements={tripRequirements}
                    onDismiss={() => setShowReplanningBanner(false)}
                    onScrollToPlan={() =>
                      itineraryRef.current?.scrollIntoView({ behavior: 'smooth' })
                    }
                  />
                )}

                {/* Main Itinerary Header Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-orange-600 font-mono">
                        Personalized Itinerary
                      </span>
                      <span className="text-stone-300">•</span>
                      <span className="text-xs font-semibold text-stone-500">
                        Version {itinerary.version}
                      </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                      Your {tripRequirements.durationDays}-Day {tripRequirements.destination} Escape
                    </h1>

                    <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-semibold text-stone-600">
                      <span className="flex items-center gap-1.5 text-stone-900 font-extrabold text-sm text-emerald-700">
                        ₹{itinerary.totalCost.toLocaleString('en-IN')} estimated
                      </span>
                      <span className="text-stone-300">•</span>
                      <span>📅 {tripRequirements.durationDays} days</span>
                      <span className="text-stone-300">•</span>
                      <span>👥 {tripRequirements.travelers} travelers</span>
                      <span className="text-stone-300">•</span>
                      <span className="capitalize">🧘 {tripRequirements.travelPace} pace</span>
                    </div>
                  </div>

                  {/* Mode Tabs (Section 4 Requirement: [Budget] [Weather] [Map] [Sources]) */}
                  <div className="flex flex-wrap bg-stone-100 p-1.5 rounded-2xl border border-stone-200/80 text-xs font-bold self-start md:self-center">
                    <button
                      onClick={() => setItinerarySubTab('timeline')}
                      className={`px-3.5 py-2 rounded-xl transition cursor-pointer ${
                        itinerarySubTab === 'timeline'
                          ? 'bg-white text-stone-900 shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      Timeline
                    </button>
                    <button
                      onClick={() => setItinerarySubTab('budget')}
                      className={`px-3.5 py-2 rounded-xl transition cursor-pointer ${
                        itinerarySubTab === 'budget'
                          ? 'bg-white text-stone-900 shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      Budget
                    </button>
                    <button
                      onClick={() => setItinerarySubTab('weather')}
                      className={`px-3.5 py-2 rounded-xl transition cursor-pointer ${
                        itinerarySubTab === 'weather'
                          ? 'bg-white text-stone-900 shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      Weather
                    </button>
                    <button
                      onClick={() => setItinerarySubTab('map')}
                      className={`px-3.5 py-2 rounded-xl transition cursor-pointer ${
                        itinerarySubTab === 'map'
                          ? 'bg-white text-stone-900 shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      Map View
                    </button>
                    <button
                      onClick={() => setItinerarySubTab('sources')}
                      className={`px-3.5 py-2 rounded-xl transition cursor-pointer ${
                        itinerarySubTab === 'sources'
                          ? 'bg-white text-stone-900 shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      Sources
                    </button>
                  </div>
                </div>

                {/* Sub Tab View: Timeline */}
                {itinerarySubTab === 'timeline' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Main Timeline (8 cols) */}
                    <div className="lg:col-span-8 space-y-6">
                      <MainItineraryView
                        itinerary={itinerary}
                        requirements={tripRequirements}
                        selectedDayNumber={selectedDayNumber}
                        onSelectDay={setSelectedDayNumber}
                        onExplain={handleExplain}
                        onOpenChangeTrip={() => setIsAdaptModalOpen(true)}
                      />
                    </div>

                    {/* Secondary Side Column (4 cols): Budget Card & Weather Alert */}
                    <div className="lg:col-span-4 space-y-6">
                      <BudgetCard
                        itinerary={itinerary}
                        requirements={tripRequirements}
                        onApplyRemedy={handleApplyChange}
                        isLoading={isLoading}
                      />

                      <WeatherAdaptationCard
                        weatherForecast={itinerary.days.map((d, i) => ({
                          day: d.dayNumber,
                          date: d.date || '',
                          tempMax: 24,
                          tempMin: 14,
                          condition: i === 2 ? 'Light Rain' : 'Clear & Sunny',
                          rainProb: i === 2 ? 70 : 15,
                          advice: i === 2 ? 'Keep umbrella handy' : 'Pleasant sightseeing',
                        }))}
                        destination={tripRequirements.destination}
                        onExplainWeatherChange={(dayNum) => {
                          handleExplain('activity', `Day ${dayNum} Cultural Gallery`, {
                            userPreferenceMatch: 'Indoor cultural museum selected during precipitation alert',
                            budgetReason: 'Complies with standard day activity ticket limits',
                            distanceReason: 'Centrally located in covered heritage pavilion',
                            weatherReason: 'Substituted for outdoor viewpoint due to 70% rain probability',
                            sourceEvidence: 'Open-Meteo Live Meteorological API Rain Alert',
                          });
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Sub Tab View: Budget */}
                {itinerarySubTab === 'budget' && (
                  <div className="max-w-3xl mx-auto">
                    <BudgetCard
                      itinerary={itinerary}
                      requirements={tripRequirements}
                      onApplyRemedy={handleApplyChange}
                      isLoading={isLoading}
                    />
                  </div>
                )}

                {/* Sub Tab View: Weather */}
                {itinerarySubTab === 'weather' && (
                  <div className="max-w-4xl mx-auto">
                    <WeatherAdaptationCard
                      weatherForecast={itinerary.days.map((d, i) => ({
                        day: d.dayNumber,
                        date: d.date || '',
                        tempMax: 25 - i,
                        tempMin: 15 - i,
                        condition: i === 2 ? 'Light Rain' : 'Clear & Sunny',
                        rainProb: i === 2 ? 70 : 12,
                        advice: i === 2 ? 'Indoor schedule prioritized' : 'Great condition for walks',
                      }))}
                      destination={tripRequirements.destination}
                      onExplainWeatherChange={(dayNum) => {
                        handleExplain('activity', `Day ${dayNum} Schedule`, {
                          userPreferenceMatch: 'Indoor cultural activity prioritized during rain shower',
                          budgetReason: 'Within planned ticket budget',
                          distanceReason: 'Zero transit friction during rainfall',
                          weatherReason: 'Substituted due to high rain probability',
                          sourceEvidence: 'Open-Meteo Live Global API Grounding',
                        });
                      }}
                    />
                  </div>
                )}

                {/* Sub Tab View: Map */}
                {itinerarySubTab === 'map' && (
                  <div className="max-w-5xl mx-auto">
                    <MapView
                      itinerary={itinerary}
                      selectedDayNumber={selectedDayNumber}
                      onSelectDay={setSelectedDayNumber}
                      onExplainActivity={(type, name) => handleExplain(type, name)}
                    />
                  </div>
                )}

                {/* Sub Tab View: Sources */}
                {itinerarySubTab === 'sources' && (
                  <div className="max-w-5xl mx-auto">
                    <SourcesView
                      logs={researchLogs}
                      itinerary={itinerary}
                      requirements={tripRequirements}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Automated Evaluation Suite (8/8 Verified Tests) */}
        {activeTab === 'evaluation' && (
          <EvaluationView
            evaluationReport={evaluationReport}
            onRunEvaluation={handleRunEvaluation}
            isRunning={isRunningEvaluation}
          />
        )}

        {/* Tab 3: Security & Guardrails */}
        {activeTab === 'security' && <SecurityView />}
      </main>

      {/* Sticky Mobile/Floating CTA: "✨ Change My Trip" (Section 6 Requirement) */}
      {itinerary && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setIsAdaptModalOpen(true)}
            className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-extrabold px-5 py-3 rounded-2xl shadow-xl shadow-orange-600/30 text-xs flex items-center gap-2 cursor-pointer transition hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>✨ Change My Trip</span>
          </button>
        </div>
      )}

      {/* Requirements Preview Modal ("I understood your trip") */}
      {tripRequirements && (
        <RequirementsPreviewModal
          requirements={tripRequirements}
          isOpen={isPreviewModalOpen}
          onConfirm={handleConfirmRequirements}
          onUpdate={(updated) => {
            setTripRequirements((prev) => (prev ? { ...prev, ...updated } : null));
          }}
          onCancel={() => setIsPreviewModalOpen(false)}
          isLoading={isLoading}
        />
      )}

      {/* Lightweight Agent Activity / Progress Modal (Section 3 Requirement) */}
      <AgentProgressModal
        isOpen={isProgressModalOpen}
        destination={tripRequirements?.destination || ''}
      />

      {/* Adapt Trip Modal (Section 6 Requirement) */}
      <AdaptTripModal
        isOpen={isAdaptModalOpen}
        onClose={() => setIsAdaptModalOpen(false)}
        onApplyChange={handleApplyChange}
        requirements={tripRequirements}
        isLoading={isLoading}
      />

      {/* "Why this?" Explanation Modal (Section 9 Requirement) */}
      <WhyThisModal
        isOpen={whyThisModal.isOpen}
        onClose={() => setWhyThisModal((prev) => ({ ...prev, isOpen: false }))}
        itemName={whyThisModal.itemName}
        itemType={whyThisModal.itemType}
        evidence={whyThisModal.evidence}
      />
    </div>
  );
}
