import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Exercise, Meal, UserProfile } from '../store/app-store';

const FUNCTION_BASE_URL = `https://${projectId}.functions.supabase.co/make-server-4e345e61`;

type PlanFeedback = {
  skipReasons: string[];
};

export async function generatePlans(
  profile: UserProfile,
  week: number = 1,
  accessToken?: string,
  feedback?: PlanFeedback
) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken || publicAnonKey}`,
  };

  const payload: Record<string, unknown> = {
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
      injuries: profile.injuries,
      trainingDaysPerWeek: profile.trainingDaysPerWeek,
      restDays: profile.restDays,
      trainingLocation: profile.trainingLocation,
      mealsPerDay: profile.mealsPerDay,
      sleepHours: profile.sleepHours,
      dailyMovement: profile.dailyMovement,
    },
    week,
  };

  if (feedback && Array.isArray(feedback.skipReasons) && feedback.skipReasons.length > 0) {
    payload.feedback = {
      skipReasons: feedback.skipReasons.slice(0, 10),
    };
  }

  const response = await fetch(`${FUNCTION_BASE_URL}/api/ai/generate-plans`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = 'Failed to generate plans';
    try {
      const error = await response.json();
      console.error('Failed to generate plans:', error);
      message = error.message || error.error || message;
    } catch (parseError) {
      const text = await response.text();
      console.error('Failed to generate plans (text):', text, parseError);
      if (text) message = text;
    }
    throw new Error(message);
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

  const response = await fetch(`${FUNCTION_BASE_URL}/api/ai/weekly-report`, {
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

export async function requestExerciseAlternatives(
  profile: UserProfile,
  exercise: Exercise,
  reason: string
) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`,
  };

  const response = await fetch(`${FUNCTION_BASE_URL}/api/ai/exercise-alternatives`, {
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
      injuries: profile.injuries,
      trainingDaysPerWeek: profile.trainingDaysPerWeek,
      restDays: profile.restDays,
      trainingLocation: profile.trainingLocation,
      mealsPerDay: profile.mealsPerDay,
      sleepHours: profile.sleepHours,
      dailyMovement: profile.dailyMovement,
    },
      exercise: {
        name: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps,
        restSec: exercise.restSec,
        targetWeightKg: exercise.targetWeightKg ?? null,
      },
      reason,
    }),
  });

  if (!response.ok) {
    let message = 'Failed to load alternatives';
    try {
      const error = await response.clone().json();
      message = error.message || error.error || message;
    } catch {
      const text = await response.text();
      if (text.trim()) {
        message = text.trim();
      }
    }
    throw new Error(message);
  }

  return response.json();
}

export async function requestMealAlternatives(
  profile: UserProfile,
  meal: Meal,
  reason: string
) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`,
  };

  const response = await fetch(`${FUNCTION_BASE_URL}/api/ai/meal-alternatives`, {
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
      injuries: profile.injuries,
      trainingDaysPerWeek: profile.trainingDaysPerWeek,
      restDays: profile.restDays,
      trainingLocation: profile.trainingLocation,
      mealsPerDay: profile.mealsPerDay,
      sleepHours: profile.sleepHours,
      dailyMovement: profile.dailyMovement,
    },
      meal: {
        name: meal.name,
        type: meal.type,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fats: meal.fats,
        ingredients: meal.ingredients,
      },
      reason,
    }),
  });

  if (!response.ok) {
    let message = 'Failed to load alternatives';
    try {
      const error = await response.clone().json();
      message = error.message || error.error || message;
    } catch {
      const text = await response.text();
      if (text.trim()) {
        message = text.trim();
      }
    }
    throw new Error(message);
  }

  return response.json();
}
