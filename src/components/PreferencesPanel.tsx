'use client';

import React from 'react';
import {
  Clock,
  Sparkles,
  TreePine,
  HeartHandshake,
  Building2,
  Eye,
  Activity,
  MoonStar,
  Sun,
  Flame,
} from 'lucide-react';
import { MissionPreferences } from '@/types/mission';

interface PreferencesPanelProps {
  preferences: MissionPreferences;
  onPreferencesChange: (prefs: MissionPreferences) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export const PreferencesPanel: React.FC<PreferencesPanelProps> = ({
  preferences,
  onPreferencesChange,
  onGenerate,
  isLoading,
}) => {
  const timeOptions = [
    { value: 15, label: '15m', desc: 'Breather' },
    { value: 30, label: '30m', desc: 'Micro-Adventure' },
    { value: 45, label: '45m', desc: 'Mindful Walk' },
    { value: 60, label: '60m', desc: 'Deep Unplug' },
    { value: 120, label: '2 hrs', desc: 'Epic Trek' },
  ];

  const interestOptions = [
    {
      id: 'nature',
      label: 'Flora & Canopy',
      icon: TreePine,
      desc: 'Old growth, botany, trees, leaf patterns',
    },
    {
      id: 'mindful',
      label: 'Quiet Solitude',
      icon: HeartHandshake,
      desc: 'Breath sync, zero distractions, stillness',
    },
    {
      id: 'scavenger',
      label: 'Sensory Scavenger',
      icon: Eye,
      desc: 'Tactile bark, aromas, bird calls, micro-details',
    },
    {
      id: 'architectural',
      label: 'Urban & Shadows',
      icon: Building2,
      desc: 'Masonry textures, light angles, human-nature borders',
    },
    {
      id: 'movement',
      label: 'Brisk Elevation',
      icon: Activity,
      desc: 'Stairs, unpaved inclines, kinetic energy',
    },
    {
      id: 'stargazing',
      label: 'Sky & Twilight',
      icon: MoonStar,
      desc: 'Cloud formations, horizon gradients, dusk stars',
    },
  ];

  const environmentOptions: Array<{ id: MissionPreferences['environmentType']; label: string }> = [
    { id: 'any', label: 'Any Outdoor Ground' },
    { id: 'park', label: 'Public Park & Common' },
    { id: 'forest', label: 'Trails & Canopy' },
    { id: 'urban', label: 'City & Alleys' },
    { id: 'suburban', label: 'Quiet Neighborhood' },
    { id: 'waterfront', label: 'Canal / Lake / Coast' },
  ];

  const toggleInterest = (id: string) => {
    const current = preferences.interests;
    if (current.includes(id)) {
      onPreferencesChange({
        ...preferences,
        interests: current.filter((i) => i !== id),
      });
    } else {
      onPreferencesChange({
        ...preferences,
        interests: [...current, id],
      });
    }
  };

  const setDuration = (minutes: number) => {
    onPreferencesChange({
      ...preferences,
      durationMinutes: minutes,
    });
  };

  const setEnvironment = (env: MissionPreferences['environmentType']) => {
    onPreferencesChange({
      ...preferences,
      environmentType: env,
    });
  };

  return (
    <div className="bg-[#0f1d16]/80 backdrop-blur-md border border-nature-800/80 rounded-3xl p-5 sm:p-7 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-amber-950/80 border border-amber-700/50 text-amber-300">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-serif font-semibold text-nature-100">
              2. Available Time & Senses
            </h2>
            <p className="text-xs text-nature-400">
              How much time do you want away from your screen today?
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-1 px-3 py-1 rounded-xl bg-nature-950/60 border border-nature-800 text-[11px] text-nature-300">
          <Sun className="w-3.5 h-3.5 text-amber-400" />
          <span>Optimal screen-free window</span>
        </div>
      </div>

      {/* Duration Pills */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-nature-300 block">
          Select Screen-Free Window:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {timeOptions.map((opt) => {
            const active = preferences.durationMinutes === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setDuration(opt.value)}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  active
                    ? 'bg-amber-900/60 border-amber-500/70 text-amber-100 shadow-md shadow-amber-950/50 font-semibold'
                    : 'bg-nature-950/40 border-nature-800/70 text-nature-300 hover:bg-nature-900/60 hover:text-white'
                }`}
              >
                <div className="text-base font-bold">{opt.label}</div>
                <div className="text-[10px] text-nature-400 mt-0.5">{opt.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sensory & Interest Themes */}
      <div className="space-y-2 pt-2 border-t border-nature-800/60">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-nature-300">
            Sensorial Focus & Interests:
          </label>
          <span className="text-[11px] text-nature-400">
            {preferences.interests.length} selected
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {interestOptions.map((item) => {
            const active = preferences.interests.includes(item.id);
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => toggleInterest(item.id)}
                className={`flex items-start space-x-3 p-3 rounded-2xl border text-left transition-all ${
                  active
                    ? 'bg-emerald-900/50 border-emerald-500/60 text-white shadow-sm'
                    : 'bg-nature-950/40 border-nature-800/70 text-nature-300 hover:bg-nature-900/60 hover:text-white'
                }`}
              >
                <div
                  className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                    active ? 'bg-emerald-700/60 text-emerald-200' : 'bg-nature-900 text-nature-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-semibold">{item.label}</div>
                  <div className="text-[10px] text-nature-400 leading-snug mt-0.5">
                    {item.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Environment Terrain */}
      <div className="space-y-2 pt-2 border-t border-nature-800/60">
        <label className="text-xs font-medium text-nature-300 block">
          Terrain Setting:
        </label>
        <div className="flex flex-wrap gap-2">
          {environmentOptions.map((env) => {
            const active = preferences.environmentType === env.id;
            return (
              <button
                key={env.id}
                onClick={() => setEnvironment(env.id)}
                className={`px-3 py-1.5 rounded-xl text-xs border transition-all ${
                  active
                    ? 'bg-nature-700/80 border-nature-400 text-white font-medium'
                    : 'bg-nature-950/50 border-nature-800 text-nature-400 hover:text-nature-200'
                }`}
              >
                {env.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Big Action CTA Button */}
      <div className="pt-4">
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="w-full relative group overflow-hidden px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-600 hover:from-emerald-500 hover:to-amber-500 text-white font-serif font-bold text-base sm:text-lg tracking-wide shadow-2xl shadow-emerald-950/70 border border-emerald-400/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
        >
          <div className="flex items-center justify-center space-x-3">
            {isLoading ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin text-amber-200" />
                <span>Generating Geofenced Missions with Groq AI...</span>
              </>
            ) : (
              <>
                <Flame className="w-5 h-5 text-amber-300 animate-bounce" />
                <span>Generate Outdoor Missions & Disconnect</span>
              </>
            )}
          </div>
        </button>
      </div>
    </div>
  );
};
