'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  TreePine,
  ShieldCheck,
  Compass,
  Smartphone,
  Sun,
  Eye,
  Wind,
  Footprints,
  Leaf,
} from 'lucide-react';
import { Mission, UserLocation, MissionPreferences, GenerationResponse } from '@/types/mission';
import { Navbar } from '@/components/Navbar';
import { LocationGeofencePicker } from '@/components/LocationGeofencePicker';
import { PreferencesPanel } from '@/components/PreferencesPanel';
import { MissionCard } from '@/components/MissionCard';
import { ScreenFreeModal } from '@/components/ScreenFreeModal';
import { PrivacyBadgeModal } from '@/components/PrivacyBadgeModal';
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { generateDynamicFallbackMissions } from '@/lib/mockMissions';

export default function Home() {
  // Ephemeral State — Zero Database, Zero Persistent Storage
  const [location, setLocation] = useState<UserLocation>({
    lat: null,
    lng: null,
    accuracy: null,
    placeName: 'Your immediate neighborhood',
    isFuzzed: true,
    status: 'idle',
  });

  const [preferences, setPreferences] = useState<MissionPreferences>({
    radiusMeters: 1000,
    durationMinutes: 30,
    interests: ['nature', 'mindful', 'scavenger'],
    environmentType: 'any',
  });

  const [missions, setMissions] = useState<Mission[]>([]);
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  const [isScreenFreeOpen, setIsScreenFreeOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [customApiKey, setCustomApiKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusBanner, setStatusBanner] = useState<{
    text: string;
    type: 'groq' | 'fallback';
  } | null>(null);

  // Initialize with curated starting missions so the user immediately sees value
  useEffect(() => {
    const initialMissions = generateDynamicFallbackMissions(location, preferences);
    setMissions(initialMissions);
  }, []);

  // Call the server-side Groq route handler
  const handleGenerateMissions = async () => {
    setIsLoading(true);
    setStatusBanner(null);

    try {
      const response = await fetch('/api/generate-missions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location,
          preferences,
          customApiKey: customApiKey || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`Generation failed with status ${response.status}`);
      }

      const data: GenerationResponse = await response.json();
      if (data.missions && data.missions.length > 0) {
        setMissions(data.missions);
        setStatusBanner({
          text: data.message || 'Missions generated successfully.',
          type: data.source,
        });

        // Smooth scroll to missions grid
        const el = document.getElementById('missions-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } catch (err: unknown) {
      console.warn('Network error calling Groq API, using local engine:', err);
      const fallback = generateDynamicFallbackMissions(location, preferences);
      setMissions(fallback);
      setStatusBanner({
        text: 'Generated missions using local nature engine.',
        type: 'fallback',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartScreenFree = (mission: Mission) => {
    setActiveMission(mission);
    setIsScreenFreeOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#09130d] text-[#e6ede8]">
      {/* Navigation */}
      <Navbar
        onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        hasCustomKey={!!customApiKey}
      />

      {/* Hero Banner */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-nature-900/60">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-5 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-600/50 text-emerald-300 text-xs shadow-inner">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Digital Detox Protocol • Zero Data Footprint</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-nature-50 leading-[1.15]">
            Unplug from the screen.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
              Step into the living world.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-nature-300/90 leading-relaxed">
            OUTSIDE pairs your geofenced walking boundary and available time with Groq&apos;s LLaMA 3.3 to invent sensory, unscripted outdoor micro-missions. No user database, no location logging, no screen tracking.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-nature-400 font-mono">
            <span className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero Database</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1.5">
              <Compass className="w-4 h-4 text-teal-400" />
              <span>Ephemeral Geofencing</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1.5">
              <TreePine className="w-4 h-4 text-amber-400" />
              <span>Groq AI Powered</span>
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Hub */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Setup Flow (2-Column Grid) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
          {/* Step 1: Geofence and Ground */}
          <LocationGeofencePicker
            location={location}
            radiusMeters={preferences.radiusMeters}
            onLocationChange={setLocation}
            onRadiusChange={(r) => setPreferences({ ...preferences, radiusMeters: r })}
          />

          {/* Step 2: Time and Interests */}
          <PreferencesPanel
            preferences={preferences}
            onPreferencesChange={setPreferences}
            onGenerate={handleGenerateMissions}
            isLoading={isLoading}
          />
        </section>

        {/* Status / Model Banner */}
        {statusBanner && (
          <div
            className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-center justify-between transition-all ${
              statusBanner.type === 'groq'
                ? 'bg-emerald-950/40 border-emerald-600/50 text-emerald-200'
                : 'bg-amber-950/40 border-amber-600/50 text-amber-200'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{statusBanner.text}</span>
            </div>
            <button
              onClick={() => setIsApiKeyModalOpen(true)}
              className="underline text-[11px] hover:text-white shrink-0 ml-2"
            >
              API Key Config
            </button>
          </div>
        )}

        {/* Missions Section */}
        <section id="missions-section" className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-nature-800/80 pb-4">
            <div>
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-1">
                <Leaf className="w-3.5 h-3.5" />
                <span>Selected Field Missions</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-nature-100">
                Choose Your Disconnect Route
              </h2>
            </div>
            <p className="text-xs text-nature-400">
              Pick one mission, click &apos;Lock Screen&apos;, and put your phone away.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {missions.map((m) => (
              <MissionCard
                key={m.id}
                mission={m}
                onStartScreenFree={handleStartScreenFree}
              />
            ))}
          </div>
        </section>

        {/* The Screen-Free Manifesto & Field Principles */}
        <section className="bg-[#0b1610] border border-nature-800/80 rounded-3xl p-6 sm:p-10 text-nature-200 space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs uppercase font-mono text-emerald-400 tracking-wider">
              The Outside Philosophy
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-nature-100">
              Why We Refuse to Track You
            </h3>
            <p className="text-xs sm:text-sm text-nature-400 leading-relaxed">
              Modern apps convert your life into metrics: screen time scores, step streaks, and telemetry profiles. OUTSIDE rejects gamified surveillance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-nature-800 flex items-center justify-center text-emerald-400">
                <Eye className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-nature-100">Attention Restoration</h4>
              <p className="text-xs text-nature-400 leading-relaxed">
                Screens demand voluntary, directed attention. Natural environments trigger &ldquo;soft fascination,&rdquo; restoring cognitive reserves within 20 minutes.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-nature-800 flex items-center justify-center text-teal-400">
                <Wind className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-nature-100">Sensory Grounding</h4>
              <p className="text-xs text-nature-400 leading-relaxed">
                Digital pixels stimulate only sight and thumb swipes. Outdoor air awakens all 5 senses: temperature, scent, texture, binaural natural sounds, and horizon depth.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-nature-800 flex items-center justify-center text-amber-400">
                <Footprints className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-nature-100">Radical Ephemerality</h4>
              <p className="text-xs text-nature-400 leading-relaxed">
                Your experience belongs to you alone. There are no profiles to build, no activity history feeds, and no location archives left behind.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-nature-900 py-8 px-4 text-center text-xs text-nature-500 space-y-2">
        <div className="flex items-center justify-center space-x-2 text-nature-400">
          <Compass className="w-4 h-4 text-emerald-400" />
          <span className="font-serif font-medium text-nature-300">OUTSIDE</span>
          <span>— Open-Weight AI for Real-World Presence</span>
        </div>
        <p>
          Powered by Groq LLaMA 3.3. Zero database, zero telemetry, zero accounts.
        </p>
      </footer>

      {/* Modals */}
      <ScreenFreeModal
        mission={activeMission}
        isOpen={isScreenFreeOpen}
        onClose={() => setIsScreenFreeOpen(false)}
      />

      <PrivacyBadgeModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        customKey={customApiKey}
        onSaveKey={setCustomApiKey}
        onClearKey={() => setCustomApiKey('')}
      />
    </div>
  );
}
