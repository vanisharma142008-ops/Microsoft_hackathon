import React, { useState } from 'react';
import { MapPin, Navigation, Clock, Coins, Compass, CheckCircle2 } from 'lucide-react';
import { ItineraryDay, TripItinerary } from '../types/travel';

interface MapViewProps {
  itinerary: TripItinerary;
  selectedDayNumber: number;
  onSelectDay: (day: number) => void;
  onExplainActivity: (itemType: string, itemName: string) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  itinerary,
  selectedDayNumber,
  onSelectDay,
  onExplainActivity,
}) => {
  const [activeActivityId, setActiveActivityId] = useState<string | null>(null);

  const selectedDay =
    itinerary.days.find((d) => d.dayNumber === selectedDayNumber) || itinerary.days[0];

  // Group activities into coordinates on our stylized vector map canvas
  const canvasPoints = [
    { x: 25, y: 35 },
    { x: 55, y: 30 },
    { x: 75, y: 55 },
    { x: 45, y: 70 },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-sm space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-stone-100">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 font-mono">
            Geographic Clustering
          </span>
          <h3 className="text-base font-extrabold text-stone-900 mt-0.5">
            Itinerary Route & Geo-Corridors
          </h3>
        </div>

        {/* Day Selector Pill */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {itinerary.days.map((d) => (
            <button
              key={d.dayNumber}
              onClick={() => onSelectDay(d.dayNumber)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                d.dayNumber === selectedDayNumber
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Day {d.dayNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Stylized Vector Map Canvas */}
      <div className="relative h-72 sm:h-80 w-full bg-stone-50 rounded-2xl border border-stone-200/80 overflow-hidden p-4 shadow-inner">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle, #d6d3d1 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* SVG Route Corridor Line connecting stops */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <polyline
            points="25%,35% 55%,30% 75%,55% 45%,70%"
            fill="none"
            stroke="#ea580c"
            strokeWidth="2.5"
            strokeDasharray="6,6"
            className="animate-pulse"
          />
        </svg>

        {/* Hotel Central Base Marker */}
        <div
          style={{ left: '20%', top: '22%' }}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
        >
          <div className="bg-stone-900 text-white p-2 rounded-2xl shadow-lg flex items-center gap-1.5 border-2 border-white hover:scale-105 transition">
            <span className="text-xs">🏨</span>
            <span className="text-[11px] font-bold truncate max-w-[120px]">
              {selectedDay.hotel.name}
            </span>
          </div>
        </div>

        {/* Activity Waypoint Markers */}
        {selectedDay.activities.map((activity, idx) => {
          const pt = canvasPoints[idx % canvasPoints.length];
          const isSelected = activeActivityId === activity.id || (!activeActivityId && idx === 0);

          return (
            <div
              key={activity.id}
              style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
              onClick={() => setActiveActivityId(activity.id)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20"
            >
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl shadow-md border-2 transition-all ${
                  isSelected
                    ? 'bg-orange-600 text-white border-white scale-110 shadow-orange-600/30'
                    : 'bg-white text-stone-800 border-stone-200 hover:border-orange-400'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">
                  {idx + 1}
                </span>
                <span className="text-xs font-bold truncate max-w-[110px] sm:max-w-[150px]">
                  {activity.title}
                </span>
              </div>
            </div>
          );
        })}

        {/* Legend */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-200 text-[10px] text-stone-600 flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-orange-600" /> Planned Sequence
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-stone-900" /> Accommodation Base
          </span>
          <span className="text-emerald-700 font-semibold">Zero Backtracking Route</span>
        </div>
      </div>

      {/* Selected Stop Details Card */}
      {selectedDay.activities.map((activity, idx) => {
        const isSelected = activeActivityId === activity.id || (!activeActivityId && idx === 0);
        if (!isSelected) return null;

        return (
          <div
            key={activity.id}
            className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-800 font-mono text-[10px] font-bold">
                  Stop #{idx + 1} • {activity.timeSlot}
                </span>
                <span className="text-stone-400">|</span>
                <span className="text-stone-600 font-medium">{activity.location}</span>
              </div>
              <h4 className="font-extrabold text-stone-900 text-sm">{activity.title}</h4>
              <p className="text-stone-500 text-xs">{activity.description}</p>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
              <div className="text-right">
                <span className="text-[10px] text-stone-400 block font-mono">Cost</span>
                <span className="font-bold text-stone-900">
                  {activity.costPerPerson === 0 ? 'Free' : `₹${activity.costPerPerson}/pax`}
                </span>
              </div>

              <button
                onClick={() => onExplainActivity('activity', activity.title)}
                className="bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 px-3 py-1.5 rounded-xl font-bold transition cursor-pointer text-xs"
              >
                Why this?
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
