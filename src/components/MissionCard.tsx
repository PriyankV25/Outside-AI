'use client';

import React, { useState } from 'react';
import {
  Compass,
  Clock,
  MapPin,
  CheckCircle2,
  Circle,
  Eye,
  Sparkles,
  SmartphoneNfc,
  Footprints,
  Copy,
  Check,
} from 'lucide-react';
import { Mission } from '@/types/mission';

interface MissionCardProps {
  mission: Mission;
  onStartScreenFree: (mission: Mission) => void;
}

export const MissionCard: React.FC<MissionCardProps> = ({ mission, onStartScreenFree }) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);

  const toggleStep = (index: number) => {
    if (completedSteps.includes(index)) {
      setCompletedSteps(completedSteps.filter((i) => i !== index));
    } else {
      setCompletedSteps([...completedSteps, index]);
    }
  };

  const copyFieldSlip = () => {
    const slipText = `🌲 OUTSIDE MISSION: ${mission.title}
Objective: ${mission.objective}
Sensory Anchor: ${mission.sensoryAnchor}
Heading: ${mission.suggestedHeading}
Checkpoints:
${mission.checkpoints.map((c, i) => `  ${i + 1}. ${c}`).join('\n')}
💡 Offline tip: ${mission.screenFreeTip}`;

    navigator.clipboard?.writeText(slipText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryColor = (cat: Mission['category']) => {
    switch (cat) {
      case 'nature':
        return 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300';
      case 'mindful':
        return 'bg-teal-950/80 border-teal-500/50 text-teal-300';
      case 'scavenger':
        return 'bg-amber-950/80 border-amber-500/50 text-amber-300';
      case 'architectural':
        return 'bg-stone-900 border-stone-600 text-stone-300';
      case 'movement':
        return 'bg-orange-950/80 border-orange-500/50 text-orange-300';
      case 'stargazing':
        return 'bg-indigo-950/80 border-indigo-500/50 text-indigo-300';
      default:
        return 'bg-nature-900 border-nature-600 text-nature-300';
    }
  };

  return (
    <div className="relative group bg-gradient-to-b from-[#13231a] to-[#0c1711] border border-nature-700/70 hover:border-emerald-500/60 rounded-3xl p-6 sm:p-7 shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Background ambient texture */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />

      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span
            className={`text-xs uppercase font-mono px-3 py-1 rounded-full border ${getCategoryColor(
              mission.category
            )}`}
          >
            {mission.category}
          </span>

          <div className="flex items-center space-x-2 text-xs text-nature-400">
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-nature-500" />
              <span>{mission.durationMinutes}m</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-nature-500" />
              <span>{mission.radiusMeters >= 1000 ? `${(mission.radiusMeters / 1000).toFixed(1)}km` : `${mission.radiusMeters}m`}</span>
            </span>
          </div>
        </div>

        {/* Title & Tagline */}
        <h3 className="text-xl sm:text-2xl font-serif font-bold text-nature-100 tracking-tight leading-snug">
          {mission.title}
        </h3>
        <p className="text-xs sm:text-sm text-nature-400 mt-1 italic leading-relaxed">
          &ldquo;{mission.tagline}&rdquo;
        </p>

        {/* The Objective */}
        <div className="mt-4 p-4 rounded-2xl bg-nature-950/70 border border-nature-800/80">
          <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 mb-1 flex items-center space-x-1.5">
            <Footprints className="w-3.5 h-3.5" />
            <span>The Ground Mission</span>
          </div>
          <p className="text-xs sm:text-sm text-nature-200 leading-relaxed">
            {mission.objective}
          </p>
        </div>

        {/* Sensory Anchor Callout */}
        <div className="mt-3.5 p-3.5 rounded-2xl bg-amber-950/30 border border-amber-700/40 flex items-start space-x-3">
          <Eye className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-[11px] font-semibold text-amber-300 uppercase tracking-wide">
              Sensory Anchor
            </div>
            <p className="text-xs text-amber-200/90 mt-0.5 leading-relaxed">
              {mission.sensoryAnchor}
            </p>
          </div>
        </div>

        {/* Direction & Bearing Compass */}
        <div className="mt-3.5 flex items-center justify-between p-3 rounded-2xl bg-nature-950/50 border border-nature-800/60 text-xs">
          <div className="flex items-center space-x-2 text-nature-300">
            <div
              className="w-5 h-5 rounded-full border border-emerald-500/50 flex items-center justify-center transition-transform"
              style={{ transform: `rotate(${mission.bearingDegrees}deg)` }}
              title={`Heading ${mission.bearingDegrees}°`}
            >
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="text-nature-300 font-medium">Bearing: {mission.bearingDegrees}°</span>
          </div>
          <span className="text-nature-400 text-[11px] truncate max-w-[180px] sm:max-w-none">
            {mission.suggestedHeading}
          </span>
        </div>

        {/* Sequential Checkpoints Checklist */}
        <div className="mt-4 space-y-2">
          <div className="text-xs font-semibold text-nature-300 flex items-center justify-between">
            <span>Milestones ({completedSteps.length}/{mission.checkpoints.length})</span>
            <span className="text-[10px] text-nature-500 font-normal">Check off as you discover</span>
          </div>

          <div className="space-y-1.5">
            {mission.checkpoints.map((step, idx) => {
              const isChecked = completedSteps.includes(idx);
              return (
                <button
                  key={idx}
                  onClick={() => toggleStep(idx)}
                  className={`w-full text-left flex items-start space-x-2.5 p-2.5 rounded-xl border transition-all text-xs ${
                    isChecked
                      ? 'bg-emerald-950/40 border-emerald-600/50 text-emerald-200 line-through opacity-80'
                      : 'bg-nature-950/40 border-nature-800/60 text-nature-300 hover:bg-nature-900/60 hover:text-white'
                  }`}
                >
                  <span className="shrink-0 mt-0.5">
                    {isChecked ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-nature-500" />
                    )}
                  </span>
                  <span className="leading-snug">{step}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Screen-Free Tip */}
        <div className="mt-3.5 flex items-center space-x-2 text-[11px] text-nature-400/90 italic">
          <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
          <span>{mission.screenFreeTip}</span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-6 pt-4 border-t border-nature-800/80 flex items-center justify-between gap-2">
        <button
          onClick={copyFieldSlip}
          className="flex items-center space-x-1.5 px-3 py-2.5 rounded-xl text-xs bg-nature-950/60 hover:bg-nature-900 text-nature-400 hover:text-nature-200 border border-nature-800 transition-colors"
          title="Copy pocket slip for quick reference"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{copied ? 'Copied Slip' : 'Pocket Slip'}</span>
        </button>

        <button
          onClick={() => onStartScreenFree(mission)}
          className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-nature-600 hover:from-emerald-500 hover:to-nature-500 text-white text-xs sm:text-sm font-medium tracking-wide shadow-lg shadow-emerald-950/60 border border-emerald-400/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <SmartphoneNfc className="w-4 h-4 text-emerald-200" />
          <span>Lock Screen & Step Outside</span>
        </button>
      </div>
    </div>
  );
};
