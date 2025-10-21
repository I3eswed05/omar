import { projectId, publicAnonKey } from '../utils/supabase/info';
import { UserProfile } from '../store/app-store';

const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-4e345e61`;

export async function generatePlans(profile: UserProfile, week: number = 1, accessToken?: string) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken || publicAnonKey}`,
  };

  const response = await fetch(`${SERVER_URL}/api/ai/generate-plans`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      profile: {
        name: profile.name,
        age: profile.age,
        gender: profile.gender,
        height: profile.height,
        weight: profile.weight,
        experience: profile.experience,
        goal: profile.goal,
        dietType: profile.dietType,
        country: profile.country,
        language: profile.language,
      },
      week,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Failed to generate plans:', error);
    throw new Error(error.message || 'Failed to generate plans');
  }

  return response.json();
}

export async function generateWeeklyReport(
  profile: { name: string; language: string; goal: string },
  week: number,
  workoutLogs: Array<{ exerciseId: string; status: string }>,
  mealLogs: Array<{ mealId: string; consumed: boolean }>,
  accessToken: string
) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
  };

  const response = await fetch(`${SERVER_URL}/api/ai/weekly-report`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      profile,
      week,
      workoutLogs,
      mealLogs,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Failed to generate report:', error);
    throw new Error(error.message || 'Failed to generate report');
  }

  return response.json();
}
