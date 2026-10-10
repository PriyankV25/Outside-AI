'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Lock,
  Smartphone,
  Eye,
  EyeOff,
  BellRing,
  RotateCcw,
  Sparkles,
  Award,
  ArrowRight,
  Compass,
} from 'lucide-react';
import { Mission } from '@/types/mission';
import { soundSynth } from '@/lib/soundSynthesis';
import confetti from 'canvas-confetti';

interface ScreenFreeModalProps {
  mission: Mission | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ScreenFreeModal: React.FC<ScreenFreeModalProps> = ({
  mission,
  isOpen,
  onClose,
}) => {
  const [phase, setPhase] = useState<'ritual' | 'pocket' | 'completed'>('ritual');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [totalSeconds, setTotalSeconds] = useState<number>(0);
  const [isGlancing, setIsGlancing] = useState<boolean>(false);
  const [ephemeralNote, setEphemeralNote] = useState<string>('');
  const [ritualSeconds, setRitualSeconds] = useState<number>(5);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize mission timer
  useEffect(() => {
    if (isOpen && mission) {
      setPhase('ritual');
      setRitualSeconds(5);
      const missionSecs = (mission.durationMinutes || 20) * 60;
      setTotalSeconds(missionSecs);
      setSecondsRemaining(missionSecs);
      setEphemeralNote('');
      setIsGlancing(false);
    }
  }, [isOpen, mission]);

  // Handle countdown during 'pocket' phase
  useEffect(() => {
    if (phase === 'pocket') {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            // Ring Tibetan singing bowl chime when time concludes!
            soundSynth.playSingingBowl(432);
            setPhase('completed');
            try {
              confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#528260', '#d4a373', '#cbd8cb', '#e6dac7'],
              });
            } catch {
              // Ignore confetti error
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  // Transition ritual countdown
  useEffect(() => {
    let ritualInterval: NodeJS.Timeout | null = null;
    if (phase === 'ritual') {
      ritualInterval = setInterval(() => {
        setRitualSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(ritualInterval as NodeJS.Timeout);
            startPocketMode();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (ritualInterval) clearInterval(ritualInterval);
    };
  }, [phase]);

  const startPocketMode = () => {
    // Ring Tibetan bowl to signal transition to real world
    soundSynth.playSingingBowl(528);
    setPhase('pocket');
  };

  const handleFinishEarly = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    soundSynth.playSingingBowl(432);
    setPhase('completed');
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#528260', '#d4a373', '#a3beaa'],
      });
    } catch {
      // Confetti fallback
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isOpen || !mission) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black transition-all">
      {/* PHASE 1: DISCONNECT RITUAL */}
      {phase === 'ritual' && (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#070e0a] text-[#e8efe9] overflow-hidden select-none">
          {/* Breathing ambient ring */}
          <div className="relative flex items-center justify-center mb-10">
            <div className="w-56 h-56 rounded-full border border-emerald-500/20 animate-ping absolute opacity-30" />
            <div className="w-48 h-48 rounded-full border-2 border-emerald-400/40 bg-emerald-950/20 backdrop-blur-md flex items-center justify-center animate-breathe shadow-2xl shadow-emerald-900/50">
              <span className="text-4xl font-serif text-emerald-200">
                {ritualSeconds}s
              </span>
            </div>
          </div>

          <div className="max-w-md space-y-3">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-nature-100">
              Disconnecting from the Grid
            </h2>
            <p className="text-sm text-nature-300 leading-relaxed">
              Take one slow breath. Feel the ground beneath you.
              <br />
              Tuck your phone away or turn down your display.
            </p>
            <div className="pt-2 text-xs text-emerald-400/90 font-mono">
              Mission: &ldquo;{mission.title}&rdquo; ({mission.durationMinutes}m)
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={startPocketMode}
              className="px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-medium transition-all shadow-lg shadow-emerald-950/60"
            >
              Skip Countdown & Enter Pocket Mode
            </button>
            <button
              onClick={onClose}
              className="px-5 py-3 rounded-2xl bg-nature-900/80 hover:bg-nature-800 text-nature-400 text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* PHASE 2: OLED BLACKOUT POCKET MODE */}
      {phase === 'pocket' && (
        <div className="relative w-full h-full flex flex-col items-center justify-between p-6 sm:p-10 bg-black text-neutral-400 select-none">
          {/* Top Bar: Subtle battery & time indication */}
          <div className="w-full flex items-center justify-between text-xs text-neutral-600">
            <div className="flex items-center space-x-2">
              <Lock className="w-3.5 h-3.5" />
              <span>SCREEN-FREE LOCKED</span>
            </div>
            <button
              onClick={() => soundSynth.playSingingBowl(432)}
              className="hover:text-neutral-400 transition-colors"
              title="Test Return Chime"
            >
              <BellRing className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Center: OLED Minimalist Clock & Breathing Pebble */}
          <div className="flex flex-col items-center justify-center space-y-6 my-auto">
            {/* Minimalist Breathing Pebble */}
            <div className="relative flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-emerald-950/20 border border-emerald-900/40 animate-breathe flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-emerald-500/40 blur-[1px]" />
              </div>
            </div>

            {/* Countdown */}
            <div className="text-center space-y-1">
              <div className="text-5xl sm:text-6xl font-mono tracking-wider text-neutral-200">
                {formatTime(secondsRemaining)}
              </div>
              <div className="text-xs text-neutral-600 tracking-wide">
                Time remaining outside
              </div>
            </div>

            {/* Emergency Glance Toggle */}
            <div className="pt-4">
              <button
                onClick={() => setIsGlancing(!isGlancing)}
                className="flex items-center space-x-2 px-4 py-2 rounded-full border border-neutral-800 hover:border-neutral-700 text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                {isGlancing ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{isGlancing ? 'Dim Screen' : 'Emergency Peek (Objective)'}</span>
              </button>
            </div>

            {/* Glancing Peek Card */}
            {isGlancing && (
              <div className="max-w-md p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-left text-neutral-300 space-y-2 animate-fade-in">
                <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold">
                  <Compass className="w-3.5 h-3.5" />
                  <span>{mission.suggestedHeading}</span>
                </div>
                <div className="text-sm font-medium text-neutral-100">
                  {mission.objective}
                </div>
                <div className="text-xs text-neutral-400 italic">
                  Anchor: {mission.sensoryAnchor}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Bar: Return Early / Complete */}
          <div className="w-full flex items-center justify-between text-xs pt-4 border-t border-neutral-900">
            <span className="text-neutral-600 hidden sm:inline">
              Keep phone in pocket. The bell will ring when time expires.
            </span>
            <button
              onClick={handleFinishEarly}
              className="ml-auto px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs transition-colors"
            >
              I Returned Early / End Mission
            </button>
          </div>
        </div>
      )}

      {/* PHASE 3: MISSION COMPLETE CELEBRATION */}
      {phase === 'completed' && (
        <div className="relative w-full max-w-xl p-6 sm:p-8 bg-[#0d1a13] border border-nature-700/80 rounded-3xl text-[#e8efe9] shadow-2xl mx-4 overflow-hidden animate-fade-in">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 rounded-2xl bg-emerald-900/60 border border-emerald-600/50 text-emerald-300">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-mono text-emerald-400 tracking-wider">
                Mission Completed
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-nature-100">
                Welcome Back to Screen Space
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-nature-300 leading-relaxed">
            You successfully unplugged and grounded yourself in reality for{' '}
            <strong className="text-emerald-300 font-semibold">
              {Math.max(1, Math.round((totalSeconds - secondsRemaining) / 60))} minutes
            </strong>
            . Notice how your body, eyes, and focus feel right now compared to before you stepped outside.
          </p>

          {/* Mission Recap */}
          <div className="mt-4 p-4 rounded-2xl bg-nature-950/70 border border-nature-800 text-xs space-y-1.5">
            <div className="font-semibold text-nature-200">{mission.title}</div>
            <div className="text-nature-400 italic">&ldquo;{mission.sensoryAnchor}&rdquo;</div>
          </div>

          {/* Ephemeral Reflection Prompt */}
          <div className="mt-4 space-y-2">
            <label className="block text-xs font-medium text-nature-300">
              Ephemeral Field Reflection (Never saved anywhere):
            </label>
            <textarea
              rows={2}
              placeholder="What sensory detail or texture surprised you most out there?"
              value={ephemeralNote}
              onChange={(e) => setEphemeralNote(e.target.value)}
              className="w-full p-3 rounded-xl bg-nature-950/80 border border-nature-800 text-nature-100 text-xs placeholder-nature-600 focus:outline-none focus:border-emerald-500 transition-all resize-none"
            />
            <p className="text-[11px] text-nature-500">
              * In keeping with OUTSIDE&apos;s privacy guarantee, this reflection lives only in your mind and active RAM.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 pt-4 border-t border-nature-800 flex items-center justify-between">
            <button
              onClick={() => {
                setPhase('pocket');
                setSecondsRemaining(10 * 60);
              }}
              className="flex items-center space-x-1.5 px-3 py-2 text-xs text-nature-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Extend +10 min</span>
            </button>

            <button
              onClick={onClose}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-medium transition-colors shadow-lg shadow-emerald-950/50"
            >
              <span>Back to Field Hub</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
