import { Mission, MissionPreferences, UserLocation } from '@/types/mission';

export function generateDynamicFallbackMissions(
  location: Partial<UserLocation>,
  preferences: MissionPreferences
): Mission[] {
  const { radiusMeters = 1000, durationMinutes = 30, interests = [] } = preferences;
  const place = location.placeName || 'your immediate surroundings';

  const baseMissions: Mission[] = [
    {
      id: 'mission-canopy-stillness',
      title: 'The Canopy Micro-Sanctuary',
      tagline: 'Locate the oldest living organism within walking range.',
      category: 'nature',
      durationMinutes: Math.min(durationMinutes, 25),
      radiusMeters: Math.min(radiusMeters, 800),
      difficulty: 'Gentle Stroll',
      objective: `Walk outward from ${place} until you discover the tallest or most weathered tree within your ${radiusMeters}m radius.`,
      sensoryAnchor: 'Place your palm firmly against the bark for 60 seconds. Notice the temperature difference between the sunlit side and shadow.',
      checkpoints: [
        'Walk without looking at street signs or digital navigation for the first 5 minutes.',
        'Locate a tree with exposed root flare or moss accumulation on its north flank.',
        'Stand beneath its canopy, look directly vertical, and watch how the wind moves the highest leaves.',
        'Find a fallen leaf, inspect its vein geometry, and leave it resting on a clean patch of earth.'
      ],
      suggestedHeading: 'Head toward the quietest open horizon or green corridor',
      bearingDegrees: 45,
      screenFreeTip: 'Put your phone in your pocket on Do Not Disturb. Let your ears navigate.',
      naturalElements: ['Old growth bark', 'Canopy light filters', 'Leaf geometry'],
      estimatedSteps: Math.round(durationMinutes * 95)
    },
    {
      id: 'mission-sensory-audit',
      title: 'The 5-Scent Field Safari',
      tagline: 'Map your territory entirely through olfactory and auditory cues.',
      category: 'scavenger',
      durationMinutes: Math.min(durationMinutes, 35),
      radiusMeters: radiusMeters,
      difficulty: 'Active Exploration',
      objective: `Navigate through ${place} and catalog five completely distinct organic scents carried on the breeze.`,
      sensoryAnchor: 'Pause at every street or trail corner and close your eyes for 3 deep diaphragmatic breaths.',
      checkpoints: [
        'Detect petrichor, damp grass, or wet pavement.',
        'Isolate an herbal or blooming floral aroma drifting from a garden or verge.',
        'Spot a bird species perching above your eye line before it takes flight.',
        'Find a textured stone or natural cobblestone; trace its grain with your fingertips.'
      ],
      suggestedHeading: 'Follow whichever direction the wind is blowing against your face',
      bearingDegrees: 280,
      screenFreeTip: 'Slip your device into a zipped pocket. Your eyes and nose are the high-res sensor.',
      naturalElements: ['Wind current', 'Organic scents', 'Bird flight paths'],
      estimatedSteps: Math.round(durationMinutes * 110)
    },
    {
      id: 'mission-architectural-shadows',
      title: 'Shadow Geometry & Sundial Walk',
      tagline: 'Track how natural light sculpts the built environment.',
      category: 'architectural',
      durationMinutes: Math.min(durationMinutes, 45),
      radiusMeters: Math.min(radiusMeters, 1500),
      difficulty: 'Gentle Stroll',
      objective: `Explore the boundary where human structures meet sky and soil, documenting the longest casts of shadow.`,
      sensoryAnchor: 'Identify a sharp shadow boundary line on the sidewalk or grass and step directly across it.',
      checkpoints: [
        'Notice where plants or weeds break through concrete fissures—nature reclaiming space.',
        'Observe how reflective glass or metal mirrors the sky back to the earth.',
        'Find three different masonry or brick patterns crafted before the year 2000.',
        'Rest on a public bench or low stone wall and watch pedestrians without evaluating them.'
      ],
      suggestedHeading: 'Follow the angle of the sun toward the golden angle',
      bearingDegrees: 195,
      screenFreeTip: 'Take a mental snapshot instead of a camera photo. Memorize three vivid colors.',
      naturalElements: ['Sun angle', 'Shadow gradients', 'Wild growth in stone'],
      estimatedSteps: Math.round(durationMinutes * 105)
    },
    {
      id: 'mission-threshold-pilgrimage',
      title: 'The Silent Perimeter Walk',
      tagline: 'A mindful decompression route designed to quiet cognitive chatter.',
      category: 'mindful',
      durationMinutes: Math.max(durationMinutes, 20),
      radiusMeters: radiusMeters,
      difficulty: 'Gentle Stroll',
      objective: `Establish an unbroken silence with the outside world. Walk with relaxed shoulders and an open gaze.`,
      sensoryAnchor: 'Count 10 consecutive footsteps in sync with your inhale, and 10 footsteps with your exhale.',
      checkpoints: [
        'Begin by leaving your doorstep without checking notifications or glance back.',
        'Walk slowly enough that your breathing remains entirely effortless.',
        'Tune your hearing to the quietest sound present in the environment (rustling leaves, distant water).',
        'Pause at the farthest boundary point of your walk for 2 uninterrupted minutes of standing stillness.'
      ],
      suggestedHeading: 'Take three left turns at quiet intersections',
      bearingDegrees: 120,
      screenFreeTip: 'Switch your phone to Airplane Mode before stepping outside.',
      naturalElements: ['Ambient breeze', 'Rhythm of footfalls', 'Sky horizon'],
      estimatedSteps: Math.round(durationMinutes * 85)
    },
    {
      id: 'mission-strides-tempo',
      title: 'The Unpaved Earth Traverse',
      tagline: 'Seek terrain beneath your soles that isn\'t asphalt or concrete.',
      category: 'movement',
      durationMinutes: durationMinutes,
      radiusMeters: Math.max(radiusMeters, 1200),
      difficulty: 'Brisk Venture',
      objective: `Find grass, gravel, dirt, or woodchips to tread upon within ${radiusMeters}m of ${place}.`,
      sensoryAnchor: 'Notice the immediate softening in your stride and knee impact the moment you touch real soil.',
      checkpoints: [
        'Maintain a brisk, heart-opening pace until you break a slight healthy glow.',
        'Seek out a gradual incline or flight of outdoor steps to elevate your perspective.',
        'Identify two non-human creatures sharing your trail (insects, birds, squirrels, dogs).',
        'Perform 5 overhead shoulder stretches under open sky at your turnaround mark.'
      ],
      suggestedHeading: 'Wander toward the nearest park, public common, or earthen pathway',
      bearingDegrees: 330,
      screenFreeTip: 'No headphones. Listen to the true percussion of your sneakers on the earth.',
      naturalElements: ['Soil and gravel', 'Muscle engagement', 'Open air current'],
      estimatedSteps: Math.round(durationMinutes * 130)
    }
  ];

  // Prioritize based on selected interests if any
  if (interests.length > 0) {
    const interestSet = new Set(interests.map((i) => i.toLowerCase()));
    return baseMissions.sort((a, b) => {
      const aMatches = interestSet.has(a.category.toLowerCase()) ? -1 : 1;
      const bMatches = interestSet.has(b.category.toLowerCase()) ? -1 : 1;
      return aMatches - bMatches;
    });
  }

  return baseMissions;
}
