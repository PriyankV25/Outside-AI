# 🌲 OUTSIDE — The Screen-Free Outdoor Exploration OS

> **A modern, privacy-first web application designed to help people disconnect from screens and reconnect with the living world.**

Built with **Next.js 14**, **Tailwind CSS**, and the **Groq API** (powered by open-weight **LLaMA 3.3 70B Versatile**), OUTSIDE crafts personalized, sensory-rich outdoor exploration missions based on your location, geofencing radius, available time, and mindful interests.

---

## 🛡️ Privacy-First Architecture

OUTSIDE was engineered with a strict **anti-surveillance, anti-addiction** philosophy:

| Pillar | Implementation |
|---|---|
| **Zero Database** | No PostgreSQL, MongoDB, SQLite, Redis, or cloud database exists. |
| **Zero Authentication** | No accounts, logins, emails, passwords, or tracking cookies. |
| **Zero Persistent Tracking** | Geolocation is read into volatile client memory (`RAM`) for seconds and evaporates on refresh. |
| **Privacy Fuzzing** | Optional jitter mechanism (~500m coordinate blur) so exact GPS coordinates are never sent. |
| **Zero Analytics & Telemetry** | No Google Analytics, Meta Pixel, tracking beacons, or third-party audio CDNs. |
| **Procedural Audio Synthesis** | Ambient soundscapes (forest breeze, rain, stream, crickets) & Tibetan Singing Bowl bells are synthesized client-side via **Web Audio API**. |

---

## 🌿 Key Features

### 1. Ephemeral Geofencing & Location Permissions
- **HTML5 Geolocation API**: Request location with clear privacy consent.
- **Privacy Fuzzing Slider**: Toggle between exact GPS, ~500m fuzzed coordinates, or manual landmark/city typing (e.g. *"Hyde Park"*, *"Kyoto Hills"*).
- **Dynamic Radius Sliders**: Geofence from `300m` (5-minute micro-loop) up to `6,000m` (neighborhood boundary excursion), with real-time walk reach and step estimators.

### 2. Available Time & Sensorial Focus
- **Time Windows**: Select 15 min (*Breather*), 30 min (*Micro-Adventure*), 45 min (*Mindful Walk*), 60 min (*Deep Unplug*), or 120 min (*Epic Trek*).
- **Sensory Themes**:
  - 🌿 *Flora & Canopy* (Old growth, leaves, botanical patterns)
  - 🧘 *Quiet Solitude* (Breath synchronization, stillness)
  - 🔍 *Sensory Scavenger* (Tactile bark, petrichor, natural odors, bird calls)
  - 🏛️ *Urban & Shadows* (Light angles, masonry, nature reclaiming concrete)
  - 🏃 *Brisk Elevation* (Stairs, inclines, kinetic strides)
  - 🌅 *Sky & Twilight* (Cloud patterns, twilight gradients, horizons)
- **Terrain Settings**: Public parks, city streets, quiet residential, water boundaries, or wild trails.

### 3. Groq API Integration (LLaMA 3.3 70B)
- Server-side route handler at `/api/generate-missions` keeping `GROQ_API_KEY` secure.
- Open-weight model: `llama-3.3-70b-versatile` with strict JSON mode formatting.
- Robust procedural fallback engine when offline or if an API key is not configured, guaranteeing seamless out-of-the-box operation.
- Ephemeral in-session API key modal for testing custom keys without modifying files.

### 4. Interactive Mission Cards
- Sensory Anchor mindfulness prompts (e.g. *"Place palm against sunlit bark for 60 seconds"*).
- Visual Compass & Bearing needle (`0° - 360°`).
- Sequential field milestone checklist with interactive completion toggles.
- Copyable **Pocket Slip** for lock screen or offline reference.

### 5. Immersive Screen-Free Mode
- **Disconnect Transition Ritual**: 5-second animated breathing circle and Tibetan singing bowl chime.
- **OLED Blackout Pocket Screen**: Pure `#000000` power-saving display with subtle breathing pebble and countdown timer.
- **Emergency Peek**: Momentary dimmer toggle if you need to glance at your objective.
- **Return Chime**: Web Audio synthesized Tibetan singing bowl chime automatically rings when your time outside completes.
- **Celebration & Reflection**: Confetti burst with 100% ephemeral reflection prompt (never stored).

---

## 🚀 Getting Started

### 1. Requirements
- Node.js 18+ (tested on Node.js v24.20 LTS)
- npm 10+

### 2. Installation
```bash
# Clone or navigate to the directory
cd C:\ABC

# Install dependencies (Next.js, Tailwind, Lucide, Canvas Confetti)
npm install
```

### 3. Configure Groq API Key (Optional)
To use live LLaMA 3.3 generation, add your Groq API key to `.env.local`:
```env
GROQ_API_KEY=gsk_your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```
> *Note: If no key is set, the application automatically uses its dynamic offline procedural mission engine.*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm run start
```

---

## 🛠️ Project Structure
```
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── generate-missions/
│   │   │       └── route.ts          # Server-side Groq handler with fallback
│   │   ├── globals.css               # Nature palette & animations
│   │   ├── layout.tsx                # Metadata & root layout
│   │   └── page.tsx                  # Main interactive hub & mission board
│   ├── components/
│   │   ├── AmbientSoundPlayer.tsx    # Procedural nature sound generator
│   │   ├── ApiKeyModal.tsx           # Ephemeral Groq key config
│   │   ├── LocationGeofencePicker.tsx# GPS, privacy fuzzing, & radius picker
│   │   ├── MissionCard.tsx           # Sensory mission display & compass
│   │   ├── Navbar.tsx                # Brand & quick controls
│   │   ├── PreferencesPanel.tsx      # Time & sensory interest selectors
│   │   ├── PrivacyBadgeModal.tsx     # Zero-database architecture explainer
│   │   └── ScreenFreeModal.tsx       # OLED pocket mode & disconnect ritual
│   ├── lib/
│   │   ├── groqClient.ts             # Groq LLaMA 3.3 API integration
│   │   ├── mockMissions.ts           # Dynamic fallback mission engine
│   │   └── soundSynthesis.ts         # Pure Web Audio API synthesizers
│   └── types/
│       └── mission.ts                # TypeScript interfaces
├── .env.local                        # Groq API configuration
├── tailwind.config.js                # Earth & moss theme palettes
└── package.json
```
