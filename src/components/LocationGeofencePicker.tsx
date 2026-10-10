'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Crosshair,
  Sliders,
  Shield,
  Search,
  CheckCircle2,
  AlertCircle,
  Footprints,
  Compass,
} from 'lucide-react';
import { UserLocation } from '@/types/mission';

interface LocationGeofencePickerProps {
  location: UserLocation;
  radiusMeters: number;
  onLocationChange: (loc: UserLocation) => void;
  onRadiusChange: (radius: number) => void;
}

export const LocationGeofencePicker: React.FC<LocationGeofencePickerProps> = ({
  location,
  radiusMeters,
  onLocationChange,
  onRadiusChange,
}) => {
  const [manualInput, setManualInput] = useState(location.placeName || '');
  const [isFuzzingEnabled, setIsFuzzingEnabled] = useState(location.isFuzzed);
  const [geoError, setGeoError] = useState<string | null>(null);

  // Request browser geolocation
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    setGeoError(null);
    onLocationChange({
      ...location,
      status: 'requesting',
    });

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        let lat = pos.coords.latitude;
        let lng = pos.coords.longitude;

        // Apply privacy fuzzing if active (jitter by ~350-500 meters)
        if (isFuzzingEnabled) {
          const jitterLat = (Math.random() - 0.5) * 0.007;
          const jitterLng = (Math.random() - 0.5) * 0.007;
          lat += jitterLat;
          lng += jitterLng;
        }

        const approximateLabel = isFuzzingEnabled
          ? `Fuzzed Area (~${lat.toFixed(2)}, ${lng.toFixed(2)})`
          : `Current Coordinates (${lat.toFixed(3)}, ${lng.toFixed(3)})`;

        onLocationChange({
          lat,
          lng,
          accuracy: pos.coords.accuracy,
          placeName: approximateLabel,
          isFuzzed: isFuzzingEnabled,
          status: 'granted',
        });
      },
      (err) => {
        let message = 'Unable to retrieve location.';
        if (err.code === err.PERMISSION_DENIED) {
          message = 'Location access was declined. You can type any place manually below.';
        }
        setGeoError(message);
        onLocationChange({
          ...location,
          status: 'denied',
        });
      },
      { enableHighAccuracy: !isFuzzingEnabled, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;

    onLocationChange({
      lat: null,
      lng: null,
      accuracy: null,
      placeName: manualInput.trim(),
      isFuzzed: true,
      status: 'manual',
    });
  };

  const toggleFuzzing = () => {
    const nextFuzz = !isFuzzingEnabled;
    setIsFuzzingEnabled(nextFuzz);
    if (location.lat && location.lng) {
      onLocationChange({
        ...location,
        isFuzzed: nextFuzz,
      });
    }
  };

  // Human metrics
  const estimatedWalkMinutes = Math.round(radiusMeters / 80);
  const estimatedSteps = Math.round(radiusMeters * 1.3);

  const radiusPresets = [
    { label: '500m', value: 500, desc: 'Quick block loop' },
    { label: '1 km', value: 1000, desc: 'Neighborhood walk' },
    { label: '2.5 km', value: 2500, desc: 'Extended roam' },
    { label: '5 km', value: 5000, desc: 'Full territory' },
  ];

  return (
    <div className="bg-[#0f1d16]/80 backdrop-blur-md border border-nature-800/80 rounded-3xl p-5 sm:p-7 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-emerald-950/80 border border-emerald-700/50 text-emerald-300">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-serif font-semibold text-nature-100">
              1. Ground Anchor & Geofence
            </h2>
            <p className="text-xs text-nature-400">
              Define your physical exploration boundary. Stored only in RAM.
            </p>
          </div>
        </div>

        {/* Privacy Fuzzing Pill */}
        <button
          onClick={toggleFuzzing}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs border transition-all ${
            isFuzzingEnabled
              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
              : 'bg-nature-900/60 border-nature-700/60 text-nature-400 hover:text-nature-200'
          }`}
          title="Fuzz GPS coordinates by ~500m so exact home coordinates are never sent"
        >
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>Fuzz Coordinates (~500m)</span>
          <span className={`w-2 h-2 rounded-full ${isFuzzingEnabled ? 'bg-emerald-400' : 'bg-nature-600'}`} />
        </button>
      </div>

      {/* Location Acquisition Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Detect Button */}
        <div className="md:col-span-5">
          <button
            onClick={handleDetectLocation}
            disabled={location.status === 'requesting'}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-800 to-nature-700 hover:from-emerald-700 hover:to-nature-600 text-white text-sm font-medium transition-all shadow-md shadow-emerald-950/40 border border-emerald-600/40 disabled:opacity-50"
          >
            <Crosshair className={`w-4 h-4 ${location.status === 'requesting' ? 'animate-spin' : ''}`} />
            <span>
              {location.status === 'requesting'
                ? 'Requesting Browser GPS...'
                : location.status === 'granted'
                ? 'Refresh GPS Coordinates'
                : 'Detect Current Ground (GPS)'}
            </span>
          </button>
        </div>

        {/* Manual Fallback Input */}
        <form onSubmit={handleManualSubmit} className="md:col-span-7 flex space-x-2">
          <div className="relative flex-1">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-nature-500" />
            <input
              type="text"
              placeholder="Or type place (e.g. Central Park, Kyoto Hills, Berlin Mitte)..."
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-nature-950/80 border border-nature-700/80 text-nature-100 text-xs sm:text-sm placeholder-nature-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-3 rounded-2xl bg-nature-800 hover:bg-nature-700 text-nature-200 text-xs sm:text-sm font-medium transition-colors border border-nature-600/50 shrink-0"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Feedback & Current Location Status */}
      {location.status !== 'idle' && (
        <div className="flex items-center justify-between p-3 rounded-2xl bg-nature-950/60 border border-nature-800/80 text-xs">
          <div className="flex items-center space-x-2">
            {location.status === 'granted' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : location.status === 'manual' ? (
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span className="text-nature-200">
              Active Anchor:{' '}
              <strong className="text-emerald-300 font-medium">
                {location.placeName || 'Unknown vicinity'}
              </strong>
            </span>
          </div>

          <div className="text-[11px] text-nature-400 font-mono hidden sm:block">
            {location.isFuzzed ? 'Protected (Fuzzed)' : 'High Accuracy GPS'}
          </div>
        </div>
      )}

      {geoError && (
        <div className="p-3 rounded-2xl bg-rose-950/30 border border-rose-800/40 text-rose-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{geoError}</span>
        </div>
      )}

      {/* Geofence Radius Selector */}
      <div className="space-y-3 pt-2 border-t border-nature-800/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span className="text-xs sm:text-sm font-medium text-nature-200">
              Geofence Radius: <strong className="text-emerald-300 font-bold">{radiusMeters >= 1000 ? `${(radiusMeters / 1000).toFixed(1)} km` : `${radiusMeters} m`}</strong>
            </span>
          </div>

          <div className="flex items-center space-x-3 text-xs text-nature-400">
            <span className="flex items-center space-x-1">
              <Footprints className="w-3.5 h-3.5 text-nature-500" />
              <span>~{estimatedSteps.toLocaleString()} steps</span>
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline text-nature-300">
              ~{estimatedWalkMinutes} min walk reach
            </span>
          </div>
        </div>

        {/* Preset chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {radiusPresets.map((preset) => {
            const active = radiusMeters === preset.value;
            return (
              <button
                key={preset.value}
                onClick={() => onRadiusChange(preset.value)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  active
                    ? 'bg-emerald-900/60 border-emerald-500/70 text-white shadow-md shadow-emerald-950/50'
                    : 'bg-nature-950/40 border-nature-800/70 text-nature-300 hover:bg-nature-900/60 hover:text-white'
                }`}
              >
                <div className="text-sm font-semibold">{preset.label}</div>
                <div className="text-[10px] text-nature-400 mt-0.5">{preset.desc}</div>
              </button>
            );
          })}
        </div>

        {/* Continuous Range Slider */}
        <input
          type="range"
          min="300"
          max="6000"
          step="100"
          value={radiusMeters}
          onChange={(e) => onRadiusChange(parseInt(e.target.value, 10))}
          className="w-full accent-emerald-500 h-2 bg-nature-950 rounded-lg cursor-pointer"
        />
      </div>
    </div>
  );
};
