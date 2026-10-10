'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Wind, CloudRain, Waves, BellRing, Sparkles } from 'lucide-react';
import { soundSynth } from '@/lib/soundSynthesis';

export const AmbientSoundPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundType, setSoundType] = useState<'breeze' | 'rain' | 'stream' | 'crickets'>('breeze');
  const [volume, setVolume] = useState(0.25);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    return () => {
      soundSynth.stopAmbient();
    };
  }, []);

  const togglePlayback = () => {
    if (isPlaying) {
      soundSynth.stopAmbient();
      setIsPlaying(false);
    } else {
      soundSynth.startAmbient(soundType, volume);
      setIsPlaying(true);
    }
  };

  const changeSound = (type: 'breeze' | 'rain' | 'stream' | 'crickets') => {
    setSoundType(type);
    if (isPlaying) {
      soundSynth.startAmbient(type, volume);
    }
  };

  const ringSingingBowl = () => {
    soundSynth.playSingingBowl(432);
  };

  return (
    <div className="relative">
      {/* Floating or collapsed sound button */}
      <div className="flex items-center space-x-2 bg-nature-900/80 backdrop-blur-md border border-nature-700/60 p-1.5 rounded-2xl shadow-xl">
        <button
          onClick={togglePlayback}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
            isPlaying
              ? 'bg-emerald-600/90 text-white shadow-md shadow-emerald-950/40'
              : 'text-nature-300 hover:text-white hover:bg-nature-800/60'
          }`}
          title={isPlaying ? 'Pause ambient soundscape' : 'Play ambient soundscape'}
        >
          {isPlaying ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
          <span className="hidden sm:inline capitalize">{isPlaying ? soundType : 'Nature Soundscape'}</span>
        </button>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-xl text-nature-400 hover:text-white hover:bg-nature-800/60 transition-colors"
          title="Sound settings"
        >
          <Sparkles className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={ringSingingBowl}
          className="p-1.5 rounded-xl text-amber-300/90 hover:text-amber-200 hover:bg-nature-800/60 transition-colors"
          title="Strike Tibetan Singing Bowl (Mindfulness Chime)"
        >
          <BellRing className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Expanded Sound Menu */}
      {isExpanded && (
        <div className="absolute top-12 right-0 w-64 bg-[#0d1a13] border border-nature-700/70 rounded-2xl p-4 shadow-2xl z-40 space-y-3 animate-fade-in text-xs text-nature-200">
          <div className="flex items-center justify-between pb-2 border-b border-nature-800">
            <span className="font-semibold text-nature-100">Ambient Synthesis</span>
            <span className="text-[10px] text-nature-400 font-mono">Web Audio API</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => changeSound('breeze')}
              className={`flex items-center space-x-2 p-2 rounded-xl transition-all ${
                soundType === 'breeze'
                  ? 'bg-emerald-700/60 text-white border border-emerald-500/50'
                  : 'bg-nature-900/60 text-nature-300 hover:bg-nature-800'
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              <span>Forest Breeze</span>
            </button>

            <button
              onClick={() => changeSound('rain')}
              className={`flex items-center space-x-2 p-2 rounded-xl transition-all ${
                soundType === 'rain'
                  ? 'bg-emerald-700/60 text-white border border-emerald-500/50'
                  : 'bg-nature-900/60 text-nature-300 hover:bg-nature-800'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5" />
              <span>Gentle Rain</span>
            </button>

            <button
              onClick={() => changeSound('stream')}
              className={`flex items-center space-x-2 p-2 rounded-xl transition-all ${
                soundType === 'stream'
                  ? 'bg-emerald-700/60 text-white border border-emerald-500/50'
                  : 'bg-nature-900/60 text-nature-300 hover:bg-nature-800'
              }`}
            >
              <Waves className="w-3.5 h-3.5" />
              <span>River Stream</span>
            </button>

            <button
              onClick={() => changeSound('crickets')}
              className={`flex items-center space-x-2 p-2 rounded-xl transition-all ${
                soundType === 'crickets'
                  ? 'bg-emerald-700/60 text-white border border-emerald-500/50'
                  : 'bg-nature-900/60 text-nature-300 hover:bg-nature-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Crickets</span>
            </button>
          </div>

          <div className="pt-2 border-t border-nature-800 flex items-center justify-between">
            <span className="text-[11px] text-nature-400">Volume</span>
            <input
              type="range"
              min="0.05"
              max="0.6"
              step="0.05"
              value={volume}
              onChange={(e) => {
                const newVol = parseFloat(e.target.value);
                setVolume(newVol);
                if (isPlaying) {
                  soundSynth.startAmbient(soundType, newVol);
                }
              }}
              className="w-28 accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
};
