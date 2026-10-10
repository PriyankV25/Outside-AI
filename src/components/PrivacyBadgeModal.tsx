'use client';

import React from 'react';
import { ShieldCheck, Lock, EyeOff, Database, History, MapPin, X, CheckCircle2 } from 'lucide-react';

interface PrivacyBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyBadgeModal: React.FC<PrivacyBadgeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-nature-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0f1d16] text-[#e8efe9] border border-nature-700/60 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-nature-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-ambermoss-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start justify-between pb-4 border-b border-nature-800/80">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-nature-800/80 border border-nature-600/50 text-nature-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif tracking-tight text-nature-100">
                Privacy-First Architecture
              </h2>
              <p className="text-xs sm:text-sm text-nature-400">
                OUTSIDE is built to respect your autonomy, attention, and privacy.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-nature-400 hover:text-white hover:bg-nature-800/50 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Key Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-2xl bg-nature-900/60 border border-nature-800/70 flex items-start space-x-3">
              <Database className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-nature-200">Zero Database</h3>
                <p className="text-xs text-nature-400 mt-1 leading-relaxed">
                  There is no backend database whatsoever. No accounts, emails, passwords, or stored user profiles exist.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-nature-900/60 border border-nature-800/70 flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-nature-200">Ephemeral Location</h3>
                <p className="text-xs text-nature-400 mt-1 leading-relaxed">
                  GPS coordinates live exclusively in your browser memory for seconds to query missions, then evaporate.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-nature-900/60 border border-nature-800/70 flex items-start space-x-3">
              <History className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-nature-200">Zero History Tracking</h3>
                <p className="text-xs text-nature-400 mt-1 leading-relaxed">
                  We don&apos;t store your past missions, routes, walking speeds, or screen-free times. When you close the tab, it&apos;s gone.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-nature-900/60 border border-nature-800/70 flex items-start space-x-3">
              <EyeOff className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-nature-200">Zero Third-Party Trackers</h3>
                <p className="text-xs text-nature-400 mt-1 leading-relaxed">
                  No Google Analytics, Meta Pixel, advertising beacons, or telemetry cookies. Audio is synthesized in real-time Web Audio API.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Fuzzing Feature callout */}
          <div className="p-4 rounded-2xl bg-nature-800/40 border border-nature-700/50">
            <div className="flex items-center space-x-2 text-nature-300 font-medium text-sm mb-1.5">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Location Fuzzing & Manual Entry</span>
            </div>
            <p className="text-xs text-nature-300/90 leading-relaxed">
              Prefer not to share exact coordinates with your browser? You can toggle <strong>Privacy Fuzzing</strong> to blur your location by ~500m, or simply type a general landmark, neighborhood, or city name.
            </p>
          </div>

          {/* Groq security */}
          <div className="p-4 rounded-2xl bg-nature-900/40 border border-nature-800/50 text-xs text-nature-400 space-y-1.5">
            <div className="flex items-center space-x-1.5 text-nature-300 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Server-Side Groq API Security</span>
            </div>
            <p className="leading-relaxed">
              API requests only transmit your requested time, radius, and general vicinity to Groq open-weight models (LLaMA 3.3). Your API keys remain strictly server-side in environment variables or within your browser session.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-nature-800/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-nature-600 hover:bg-nature-500 text-white text-sm font-medium transition-colors shadow-lg shadow-nature-950/40"
          >
            Understood & Close
          </button>
        </div>
      </div>
    </div>
  );
};
