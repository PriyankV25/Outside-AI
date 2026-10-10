import { NextRequest, NextResponse } from 'next/server';
import { GenerationRequest, GenerationResponse } from '@/types/mission';
import { requestGroqMissions } from '@/lib/groqClient';
import { generateDynamicFallbackMissions } from '@/lib/mockMissions';

export async function POST(req: NextRequest) {
  try {
    const body: GenerationRequest = await req.json();
    const { location, preferences, customApiKey } = body;

    const apiKey = customApiKey || process.env.GROQ_API_KEY;

    if (apiKey && apiKey.trim().length > 0) {
      try {
        const { missions, modelUsed } = await requestGroqMissions(body, apiKey);
        const responseData: GenerationResponse = {
          missions,
          source: 'groq',
          modelUsed,
          message: `Generated freshly by Groq AI (${modelUsed}) for your exact geofence.`
        };
        return NextResponse.json(responseData);
      } catch (groqError: unknown) {
        console.warn('Groq generation failed, falling back to local procedural engine:', (groqError as Error)?.message);
        
        // Graceful fallback if Groq API key is rate-limited, expired, or invalid
        const fallbackMissions = generateDynamicFallbackMissions(location, preferences);
        const responseData: GenerationResponse = {
          missions: fallbackMissions,
          source: 'fallback',
          message: `Groq connection encountered an issue (${(groqError as Error)?.message?.slice(0, 80)}...). Loaded our local outdoor field generator.`
        };
        return NextResponse.json(responseData);
      }
    }

    // Zero API key configured: Provide instant dynamic local missions without breaking
    const localMissions = generateDynamicFallbackMissions(location, preferences);
    const responseData: GenerationResponse = {
      missions: localMissions,
      source: 'fallback',
      message: 'Running in zero-config offline mode. Add a Groq API key to activate live LLaMA 3.3 generation.'
    };
    return NextResponse.json(responseData);

  } catch (err: unknown) {
    console.error('Unhandled mission generation error:', err);
    return NextResponse.json(
      { error: 'Failed to process mission generation request', details: (err as Error)?.message },
      { status: 500 }
    );
  }
}
