'use client';

import React from 'react';
import { Compass, ShieldCheck, Key } from 'lucide-react';
import { AmbientSoundPlayer } from '@/components/AmbientSoundPlayer';

interface NavbarProps {
  onOpenPrivacyModal: () => void;
  onOpenApiKeyModal: () => void;
  hasCustomKey: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenPrivacyModal,
  onOpenApiKeyModal,
  hasCustomKey,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-nature-950/70 border-b border-nature-800/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-nature-800 text-white shadow-lg shadow-emerald-950/50 border border-emerald-500/30">
            <Compass className="w-5 h-5 text-emerald-200 animate-spin-slow" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-serif font-bold tracking-wider text-nature-100 uppercase">
                OUTSIDE
              </h1>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-full bg-emerald-900/60 border border-emerald-700/50 text-emerald-300">
                Screen-Free OS
              </span>
            </div>
            <p className="text-[11px] text-nature-400 hidden sm:block">
              Get off screens and into the living world
            </p>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Privacy certified badge */}
          <button
            onClick={onOpenPrivacyModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs bg-nature-900/80 hover:bg-nature-800 border border-nature-700/60 text-emerald-300 transition-colors shadow-sm"
            title="View Zero-Database Privacy Guarantee"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden md:inline font-medium">Zero-Database • Ephemeral</span>
            <span className="md:hidden font-medium">Privacy</span>
          </button>

          {/* Soundscape Synthesizer */}
          <AmbientSoundPlayer />

          {/* Groq Key trigger */}
          <button
            onClick={onOpenApiKeyModal}
            className={`p-2 rounded-xl text-xs border transition-colors ${
              hasCustomKey
                ? 'bg-amber-950/40 border-amber-600/60 text-amber-300 hover:bg-amber-900/40'
                : 'bg-nature-900/80 border-nature-700/60 text-nature-300 hover:text-white hover:bg-nature-800'
            }`}
            title="Groq API Key Settings"
          >
            <Key className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
