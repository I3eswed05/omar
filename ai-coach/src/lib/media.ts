const exerciseImagePatterns: Array<{ keywords: string[]; url: string }> = [
  { keywords: ['squat', 'lunge'], url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['press', 'bench'], url: 'https://images.unsplash.com/photo-1517964106626-460c5db4215c?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['deadlift', 'row'], url: 'https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['pull', 'lat', 'chin'], url: 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['curl', 'bicep'], url: 'https://images.unsplash.com/photo-1526402462314-554fa8a37df8?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['shoulder', 'raise'], url: 'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['cardio', 'run', 'bike'], url: 'https://images.unsplash.com/photo-1554284126-aa88f22d8b74?auto=format&fit=crop&w=800&q=80' },
];

const mealPlaceholderImage = '/images/meal-placeholder.svg';

const defaultExerciseImage = 'https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?auto=format&fit=crop&w=800&q=80';
const defaultExerciseVideo = 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4';

function findMatch(name: string, patterns: Array<{ keywords: string[]; url: string }>, fallback: string) {
  const lowerName = name.toLowerCase();
  for (const pattern of patterns) {
    if (pattern.keywords.some((keyword) => lowerName.includes(keyword))) {
      return pattern.url;
    }
  }
  return fallback;
}

export function getExerciseImage(name: string): string {
  return findMatch(name, exerciseImagePatterns, defaultExerciseImage);
}

export function getMealImage(_name: string, _type?: string): string {
  return mealPlaceholderImage;
}

export function getExerciseVideo(name: string): string {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('squat')) {
    return 'https://cdn.coverr.co/videos/coverr-woman-lifting-weights-1930/1080p.mp4';
  }
  if (lowerName.includes('press')) {
    return 'https://cdn.coverr.co/videos/coverr-athletic-man-doing-pushups-9980/1080p.mp4';
  }
  if (lowerName.includes('deadlift') || lowerName.includes('row')) {
    return 'https://cdn.coverr.co/videos/coverr-man-doing-deadlifts-1950/1080p.mp4';
  }
  if (lowerName.includes('pull') || lowerName.includes('chin')) {
    return 'https://cdn.coverr.co/videos/coverr-pull-ups-in-the-gym-3978/1080p.mp4';
  }
  return defaultExerciseVideo;
}
