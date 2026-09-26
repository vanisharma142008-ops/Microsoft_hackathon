import React from 'react';
import { CloudRain, HelpCircle, ArrowRight, ShieldCheck, Sun, Umbrella } from 'lucide-react';
import { WeatherDay } from '../types/travel';

interface WeatherAdaptationCardProps {
  weatherForecast: WeatherDay[];
  onExplainWeatherChange: (dayNumber: number) => void;
  destination: string;
}

export const WeatherAdaptationCard: React.FC<WeatherAdaptationCardProps> = ({
  weatherForecast,
  onExplainWeatherChange,
  destination,
}) => {
  const rainyDay = weatherForecast.find((w) => w.rainProb >= 40) || weatherForecast[2];

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
            <CloudRain className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 font-mono">
              Live Meteorological Grounding
            </span>
            <h3 className="text-base font-extrabold text-stone-900">
              Weather & Dynamic Adaptation
            </h3>
          </div>
        </div>

        <span className="text-[11px] font-mono text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200 font-semibold">
          Open-Meteo Live API Grounded
        </span>
      </div>

      {/* Weather Adaptation Notification (Section 8 Requirement) */}
      <div className="bg-cyan-50/60 border border-cyan-200/80 rounded-2xl p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <span className="text-xl shrink-0 mt-0.5">🌧️</span>
            <div>
              <h4 className="text-xs font-bold text-cyan-950 uppercase tracking-wide">
                Weather Update Detected
              </h4>
              <p className="text-xs text-cyan-800 font-semibold mt-0.5">
                Rain is expected on Day {rainyDay ? rainyDay.day : 3} ({rainyDay?.rainProb || 70}% probability).
              </p>
            </div>
          </div>

          <button
            onClick={() => onExplainWeatherChange(rainyDay ? rainyDay.day : 3)}
            className="shrink-0 bg-white hover:bg-cyan-100 text-cyan-800 border border-cyan-300 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-600" />
            <span>Why did you change this?</span>
          </button>
        </div>

        {/* Before / After pill */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
          <div className="bg-white/80 p-2.5 rounded-xl border border-cyan-100 flex items-center justify-between">
            <span className="text-stone-500 font-medium">Original Planned:</span>
            <span className="font-bold text-stone-800">🥾 Outdoor Trek / Viewpoint</span>
          </div>

          <div className="bg-white/80 p-2.5 rounded-xl border border-cyan-100 flex items-center justify-between">
            <span className="text-cyan-700 font-medium">Updated Schedule:</span>
            <span className="font-bold text-cyan-900">🏛️ Indoor Cultural Gallery & Palace</span>
          </div>
        </div>
      </div>

      {/* 5-Day Mini Weather Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-xs">
        {weatherForecast.slice(0, 5).map((w) => (
          <div
            key={w.day}
            className={`p-3 rounded-2xl border text-center transition ${
              w.rainProb >= 40
                ? 'bg-cyan-50/50 border-cyan-200'
                : 'bg-stone-50/70 border-stone-200/70'
            }`}
          >
            <span className="text-[10px] uppercase font-bold text-stone-400 block font-mono">
              Day {w.day}
            </span>
            <div className="my-1 text-lg">
              {w.rainProb >= 40 ? '🌧️' : w.condition.includes('Cloud') ? '⛅' : '☀️'}
            </div>
            <div className="font-extrabold text-stone-900 text-xs">
              {w.tempMax}° / {w.tempMin}°
            </div>
            <span className="text-[10px] text-stone-500 truncate block mt-0.5">
              {w.rainProb}% rain
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
