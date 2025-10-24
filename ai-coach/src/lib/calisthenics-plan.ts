import type { Exercise, UserProfile, WorkoutDay } from '../store/app-store';

const ORDER: ReadonlyArray<WorkoutDay['day']> = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const DEFAULT_REST_DAYS = new Set<string>(['Wed', 'Sun']);

const BLUEPRINT: Record<
  WorkoutDay['day'],
  Array<Omit<Exercise, 'imageUrl' | 'videoUrl'>>
> = {
  Mon: [
    { id: 'mon-primal-warm', name: 'Primal Flow Warm-Up', sets: 2, reps: [12], restSec: 30 },
    { id: 'mon-push-wave', name: 'Push-Up Wave Ladder', sets: 4, reps: [10], restSec: 45 },
    { id: 'mon-ring-row', name: 'Suspension Rows', sets: 4, reps: [12], restSec: 60 },
    { id: 'mon-core-hold', name: 'Hollow Body Hold', sets: 3, reps: [45], restSec: 30 },
  ],
  Tue: [
    { id: 'tue-cossack', name: 'Cossack Squat Flow', sets: 3, reps: [10], restSec: 45 },
    { id: 'tue-pistol-prep', name: 'Pistol Squat Prep', sets: 4, reps: [6], restSec: 60 },
    { id: 'tue-glute-bridge', name: 'Single-Leg Glute Bridge Pulse', sets: 3, reps: [14], restSec: 45 },
    { id: 'tue-calf-wave', name: 'Calf Wave Raises', sets: 3, reps: [20], restSec: 30 },
  ],
  Wed: [
    { id: 'wed-mobilize', name: 'Flow Mobility Sequence', sets: 2, reps: [8], restSec: 30 },
    { id: 'wed-breath', name: 'Box Breathing Reset', sets: 3, reps: [5], restSec: 60 },
    { id: 'wed-shoulder', name: 'Scapular Circles', sets: 3, reps: [12], restSec: 30 },
  ],
  Thu: [
    { id: 'thu-planche', name: 'Pseudo Planche Push-Up', sets: 4, reps: [8], restSec: 60 },
    { id: 'thu-dip', name: 'Straight Bar Dips', sets: 4, reps: [10], restSec: 60 },
    { id: 'thu-archer', name: 'Archer Rows', sets: 3, reps: [8], restSec: 60 },
    { id: 'thu-pike', name: 'Pike Pulse Holds', sets: 3, reps: [30], restSec: 45 },
  ],
  Fri: [
    { id: 'fri-leg-drag', name: 'Dragon Squat Flow', sets: 3, reps: [6], restSec: 60 },
    { id: 'fri-nordic', name: 'Nordic Curl Eccentrics', sets: 3, reps: [6], restSec: 75 },
    { id: 'fri-core-wave', name: 'Core Wave Complex', sets: 4, reps: [12], restSec: 45 },
    { id: 'fri-reach', name: 'Jefferson Curls', sets: 3, reps: [10], restSec: 60 },
  ],
  Sat: [
    { id: 'sat-handstand', name: 'Wall Handstand Hover', sets: 5, reps: [30], restSec: 60 },
    { id: 'sat-press', name: 'Straddle Press Negative', sets: 3, reps: [5], restSec: 75 },
    { id: 'sat-lsit', name: 'L-Sit to Tuck Flow', sets: 4, reps: [12], restSec: 45 },
    { id: 'sat-flow', name: 'Beast to Crab Switch', sets: 3, reps: [16], restSec: 45 },
  ],
  Sun: [
    { id: 'sun-mobility', name: 'Spinal Wave Mobility', sets: 2, reps: [10], restSec: 30 },
    { id: 'sun-hip', name: '90/90 Breath Holds', sets: 3, reps: [8], restSec: 45 },
    { id: 'sun-soft-tissue', name: 'Soft Tissue Release', sets: 2, reps: [12], restSec: 45 },
  ],
};

function cloneExercises(exercises: Array<Omit<Exercise, 'imageUrl' | 'videoUrl'>>): Exercise[] {
  return exercises.map((exercise, index) => ({
    ...exercise,
    id: exercise.id || `${exercise.name}-${index}`,
  }));
}

export function buildCalisthenicsPlan(profile: UserProfile): WorkoutDay[] {
  const restDaysFromProfile = new Set(profile.restDays ?? []);
  const desiredTrainingDays = Math.min(Math.max(profile.trainingDaysPerWeek || 4, 1), ORDER.length);
  const plan: WorkoutDay[] = ORDER.map((day) => {
    const baseExercises = BLUEPRINT[day] ?? [];
    const defaultRest = DEFAULT_REST_DAYS.has(day);
    const shouldRest = defaultRest || restDaysFromProfile.has(day);

    return {
      day,
      isRestDay: shouldRest,
      exercises: shouldRest ? [] : cloneExercises(baseExercises),
    };
  });

  // Reactivate days if user wants more sessions and day is not forced rest.
  let activeCount = plan.filter((d) => !d.isRestDay).length;
  if (activeCount < desiredTrainingDays) {
    for (const day of ORDER) {
      if (activeCount >= desiredTrainingDays) break;
      const dayPlan = plan.find((d) => d.day === day);
      if (!dayPlan || !dayPlan.isRestDay || restDaysFromProfile.has(day)) continue;
      const blueprintExercises = BLUEPRINT[day] ?? [];
      if (blueprintExercises.length === 0) continue;
      dayPlan.isRestDay = false;
      dayPlan.exercises = cloneExercises(blueprintExercises);
      activeCount++;
    }
  }

  // Trim extra active days if user prefers fewer sessions.
  if (activeCount > desiredTrainingDays) {
    for (const day of ORDER.slice().reverse()) {
      if (activeCount <= desiredTrainingDays) break;
      const dayPlan = plan.find((d) => d.day === day);
      if (!dayPlan || dayPlan.isRestDay || restDaysFromProfile.has(day)) continue;
      dayPlan.isRestDay = true;
      dayPlan.exercises = [];
      activeCount--;
    }
  }

  // Guarantee minimum rest days based on sleep.
  const minRestDays = profile.sleepHours && profile.sleepHours < 6 ? 3 : 2;
  let currentRestDays = plan.filter((d) => d.isRestDay).length;
  if (currentRestDays < minRestDays) {
    for (const day of ORDER.slice().reverse()) {
      if (currentRestDays >= minRestDays) break;
      const dayPlan = plan.find((d) => d.day === day);
      if (!dayPlan || dayPlan.isRestDay || restDaysFromProfile.has(day)) continue;
      dayPlan.isRestDay = true;
      dayPlan.exercises = [];
      currentRestDays++;
    }
  }

  // Injury-aware warm-up
  if (profile.injuries?.hasIssues) {
    plan.forEach((dayPlan) => {
      if (dayPlan.isRestDay) return;
      dayPlan.exercises = [
        {
          id: `${dayPlan.day.toLowerCase()}-injury-warm`,
          name: 'Joint Mobility Reset',
          sets: 2,
          reps: [12],
          restSec: 45,
        },
        ...dayPlan.exercises,
      ];
    });
  }

  // Movement adjustments
  if (profile.dailyMovement === 'low') {
    plan.forEach((dayPlan) => {
      if (dayPlan.isRestDay) return;
      dayPlan.exercises.push({
        id: `${dayPlan.day.toLowerCase()}-tempo-walk`,
        name: 'Tempo Walk Intervals',
        sets: 3,
        reps: [8],
        restSec: 30,
      });
    });
  }

  if (profile.dailyMovement === 'high') {
    plan.forEach((dayPlan) => {
      if (dayPlan.isRestDay) return;
      dayPlan.exercises = dayPlan.exercises.map((exercise) => ({
        ...exercise,
        sets: Math.max(2, exercise.sets - 1),
      }));
    });
  }

  return plan;
}
