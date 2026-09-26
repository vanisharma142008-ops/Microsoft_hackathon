import React, { useState } from 'react';
import { Sparkles, ArrowRight, MapPin, Calendar, Compass, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface LandingHeroProps {
  onSubmitPrompt: (prompt: string) => void;
  isLoading: boolean;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onSubmitPrompt, isLoading }) => {
  const [inputText, setInputText] = useState(
    '5 days from Delhi for 2 people under ₹50,000, focused on nature and food, with a relaxed itinerary.'
  );

  const chips = [
    { label: '🏔️ Adventure', textAdd: ', with alpine adventure and scenic trails' },
    { label: '🍜 Foodie', textAdd: ', focused on authentic local culinary tours and street food' },
    { label: '🌿 Nature', textAdd: ', focused on lush nature and pine forests' },
    { label: '🧘 Relaxed', textAdd: ', with a very relaxed and slow pace' },
    { label: '💕 Couple', textAdd: ' for a couple' },
    { label: '👨‍👩‍👧 Family', textAdd: ' for a family of 3' },
  ];

  const destinationCards = [
    {
      title: 'Manali Alpine Haven',
      route: 'Delhi → Manali',
      badge: 'Nature & Pine Escapes',
      budget: '₹45,000 for 2',
      duration: '5 Days',
      img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
      prompt:
        'Plan a 5-day trip from Delhi to Manali for 2 people under ₹50,000, focused on nature and food, with a relaxed itinerary.',
    },
    {
      title: 'Jaipur Royal Heritage',
      route: 'Delhi → Jaipur',
      badge: 'Palaces & Rajasthani Thali',
      budget: '₹25,000 for 2',
      duration: '3 Days',
      img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',
      prompt:
        'Plan a 3-day trip from Delhi to Jaipur for 2 people under ₹25,000, focused on heritage and food.',
    },
    {
      title: 'Goa Coastal Serenity',
      route: 'Mumbai → Goa',
      badge: 'Palms & Coastal Seafood',
      budget: '₹40,000 for 2',
      duration: '4 Days',
      img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
      prompt:
        'Plan a 4-day trip from Mumbai to Goa for 2 people under ₹40,000, focused on relaxation and coastal food.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSubmitPrompt(inputText.trim());
  };

  const handleChipClick = (chip: { label: string; textAdd: string }) => {
    if (!inputText.includes(chip.label)) {
      setInputText((prev) => prev.trim() + chip.textAdd);
    }
  };

  return (
    <div className="space-y-12 py-4">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/80 border border-orange-200/80 text-orange-800 text-xs font-bold tracking-wide shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-orange-600" />
          <span>The Next-Generation Travel Agent</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight leading-[1.15]">
          Your trip, <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">planned intelligently.</span>
        </h1>

        <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto leading-relaxed">
          Tell us where you want to go, what you love, and what you want to spend. Your AI travel agent researches live data, respects strict constraints, and dynamically re-plans when your mind changes.
        </p>
      </div>

      {/* Prominent Input Card */}
      <div className="max-w-3xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-4 sm:p-5 shadow-xl shadow-stone-200/60 border border-stone-200/90 space-y-4 relative transition hover:border-orange-300"
        >
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 font-mono">
              Plan My Trip...
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
              rows={3}
              placeholder="e.g. 5 days from Delhi for 2 people under ₹50,000, focused on nature and food, with a relaxed itinerary."
              className="w-full bg-stone-50 text-stone-900 placeholder-stone-400 text-sm sm:text-base font-medium rounded-2xl p-3.5 sm:p-4 border border-stone-200/90 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition resize-none leading-relaxed"
            />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-xs font-semibold text-stone-400 mr-1">Quick Add:</span>
            {chips.map((chip, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => handleChipClick(chip)}
                className="bg-stone-100 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 text-stone-600 text-xs font-semibold px-3 py-1.5 rounded-full border border-stone-200/70 transition cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Bottom Submit bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-stone-100">
            <div className="flex items-center gap-4 text-xs text-stone-500 font-medium">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Live Weather
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified Stays
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Strict Budget Guard
              </span>
            </div>

            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-extrabold px-6 py-3 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-600/25 transition cursor-pointer disabled:opacity-50"
            >
              <span>{isLoading ? 'Researching Live Data...' : 'Plan My Trip'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Destination Inspiration Grid */}
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-stone-900">Featured Demo Journeys</h3>
            <p className="text-xs text-stone-500">
              One-click preset journeys with pre-verified routes and factual budget bounds.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {destinationCards.map((card, i) => (
            <div
              key={i}
              onClick={() => {
                setInputText(card.prompt);
                onSubmitPrompt(card.prompt);
              }}
              className="group bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={card.img}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent" />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-stone-800 shadow-xs">
                  {card.badge}
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center gap-1.5 text-xs text-orange-200 font-semibold mb-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{card.route}</span>
                  </div>
                  <h4 className="text-base font-bold text-white tracking-tight">{card.title}</h4>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between text-xs text-stone-600 bg-white">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block font-mono">
                    Budget Target
                  </span>
                  <span className="font-bold text-stone-900">{card.budget}</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block font-mono">
                    Duration
                  </span>
                  <span className="font-bold text-stone-900">{card.duration}</span>
                </div>

                <span className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white flex items-center justify-center transition">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
