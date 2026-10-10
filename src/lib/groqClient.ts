import { Mission, GenerationRequest } from '@/types/mission';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

export async function requestGroqMissions(
  requestData: GenerationRequest,
  apiKeyOverride?: string
): Promise<{ missions: Mission[]; modelUsed: string }> {
  const apiKey = apiKeyOverride || process.env.GROQ_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    throw new Error('NO_API_KEY');
  }

  const { location, preferences } = requestData;
  const radius = preferences.radiusMeters || 1000;
  const duration = preferences.durationMinutes || 30;
  const place = location.placeName || (location.lat ? `${location.lat.toFixed(3)}, ${location.lng?.toFixed(3)}` : 'your local neighborhood');
  const interests = preferences.interests.length > 0 ? preferences.interests.join(', ') : 'nature, mindful awareness, outdoor discovery';
  const environment = preferences.environmentType || 'any outdoor setting';
  const timeOfDay = preferences.timeOfDay || 'current daylight';

  const systemPrompt = `You are OUTSIDE AI, an intentional guide crafted to liberate human beings from digital screens, notifications, and algorithms, guiding them into raw, sensory, real-world outdoor explorations.

Your task is to generate 3 to 4 distinct, immersive, highly engaging outdoor activity missions.
Constraints:
- All missions must be tailored to the user's geofenced radius (${radius} meters) and available duration (${duration} minutes).
- General location: ${place}.
- Environment context: ${environment}.
- Time of day: ${timeOfDay}.
- Focus interests: ${interests}.
- Privacy guarantee: No personal tracking is retained.
- SCREEN-FREE PHILOSOPHY: Each mission must prioritize getting the person to put their phone deep into their pocket or backpack. Every mission must have concrete physical sensory anchors (smell, touch, hearing, temperature, natural patterns) and sequential observational checkpoints.

Return your answer strictly as a valid JSON object matching this exact format:
{
  "missions": [
    {
      "id": "string (unique kebab-case)",
      "title": "string (evocative, poetic yet clear outdoor mission title)",
      "tagline": "string (one captivating sentence)",
      "category": "nature" | "mindful" | "exploration" | "movement" | "scavenger" | "architectural" | "stargazing",
      "durationMinutes": number,
      "radiusMeters": number,
      "difficulty": "Gentle Stroll" | "Active Exploration" | "Brisk Venture",
      "objective": "string (clear, inspiring physical action in the real world)",
      "sensoryAnchor": "string (tangible physical/tactile/auditory mindfulness action)",
      "checkpoints": ["string", "string", "string", "string"],
      "suggestedHeading": "string (compass-based orientation clue)",
      "bearingDegrees": number (integer between 0 and 360),
      "screenFreeTip": "string (encouragement to tuck away the device)",
      "naturalElements": ["string", "string", "string"],
      "estimatedSteps": number
    }
  ]
}`;

  const userPrompt = `Generate 3 to 4 rich outdoor unplugging missions for a ${duration}-minute exploration within ${radius}m of ${place}. Interests: ${interests}. Return strictly valid JSON.`;

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey.trim()}`,
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.75,
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Groq API Error status:', response.status, errorText);
    throw new Error(`Groq API returned ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const rawContent = data.choices?.[0]?.message?.content;

  if (!rawContent) {
    throw new Error('Groq returned empty response');
  }

  const parsed = JSON.parse(rawContent);
  if (!parsed.missions || !Array.isArray(parsed.missions)) {
    throw new Error('Invalid JSON structure: missions array missing');
  }

  return {
    missions: parsed.missions,
    modelUsed: DEFAULT_MODEL,
  };
}
