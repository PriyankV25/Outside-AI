export type MissionCategory =
  | 'nature'
  | 'mindful'
  | 'exploration'
  | 'movement'
  | 'scavenger'
  | 'architectural'
  | 'stargazing';

export type DifficultyLevel = 'Gentle Stroll' | 'Active Exploration' | 'Brisk Venture';

export interface Mission {
  id: string;
  title: string;
  tagline: string;
  category: MissionCategory;
  durationMinutes: number;
  radiusMeters: number;
  difficulty: DifficultyLevel;
  objective: string;
  sensoryAnchor: string;
  checkpoints: string[];
  suggestedHeading: string;
  bearingDegrees: number; // 0 - 360
  screenFreeTip: string;
  naturalElements: string[];
  estimatedSteps?: number;
}

export interface UserLocation {
  lat: number | null;
  lng: number | null;
  accuracy: number | null;
  placeName: string;
  isFuzzed: boolean;
  status: 'idle' | 'requesting' | 'granted' | 'denied' | 'manual';
}

export interface MissionPreferences {
  radiusMeters: number;
  durationMinutes: number;
  interests: string[];
  environmentType: 'any' | 'park' | 'urban' | 'suburban' | 'waterfront' | 'forest';
  timeOfDay?: string;
  weatherVibe?: string;
}

export interface GenerationRequest {
  location: {
    lat?: number | null;
    lng?: number | null;
    placeName?: string;
    isFuzzed?: boolean;
  };
  preferences: MissionPreferences;
  customApiKey?: string;
}

export interface GenerationResponse {
  missions: Mission[];
  source: 'groq' | 'fallback';
  modelUsed?: string;
  message?: string;
}
