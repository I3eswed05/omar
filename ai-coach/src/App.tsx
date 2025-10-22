import { useEffect, useState } from 'react';
import { useAppStore } from './store/app-store';
import type { MealDay, UserProfile, WorkoutDay } from './store/app-store';
import { isRTL, Language, t } from './lib/i18n';
import { generatePlans } from './lib/api';

// Onboarding
import { getExerciseImage, getExerciseVideo, getMealImage } from './lib/media';
import { WelcomeScreen } from './components/onboarding/WelcomeScreen';
import { CountrySelectScreen } from './components/onboarding/CountrySelectScreen';
import { OnboardingScreen } from './components/onboarding/OnboardingScreen';

// Home
import { WorkoutsScreen } from './components/home/WorkoutsScreen';
import { CalisthenicsScreen } from './components/home/CalisthenicsScreen';
import { MealsScreen } from './components/home/MealsScreen';
import { ProgressScreen } from './components/home/ProgressScreen';
import { ReportScreen } from './components/home/ReportScreen';
import { BottomNav } from './components/bottom-nav';
import { SettingsMenu } from './components/settings-menu';
import { QuickTips } from './components/quick-tips';
import { DemoBanner } from './components/demo-banner';
import { ThemeToggle } from './components/theme-toggle';
import { buildCalisthenicsPlan } from './lib/calisthenics-plan';

import './styles/globals.css';

type OnboardingStep = 'welcome' | 'country' | 'profile' | null;
type HomeTab = 'workouts' | 'calisthenics' | 'meals' | 'progress' | 'report';

const WEEK_ORDER: ReadonlyArray<string> = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function ensureProfileDefaults(profile: UserProfile): UserProfile {
  return {
    ...profile,
    injuries: profile.injuries ?? { hasIssues: false, details: null },
    trainingDaysPerWeek: profile.trainingDaysPerWeek ?? 4,
    restDays: profile.restDays ?? [],
    trainingLocation: profile.trainingLocation ?? 'gym',
    mealsPerDay: profile.mealsPerDay ?? 3,
    sleepHours: profile.sleepHours ?? 7,
    dailyMovement: profile.dailyMovement ?? 'medium',
  };
}

function cloneWorkoutPlan(plan: WorkoutDay[]): WorkoutDay[] {
  return plan.map((day) => ({
    ...day,
    exercises: day.exercises.map((exercise) => ({ ...exercise })),
  }));
}

function cloneMealPlan(plan: MealDay[]): MealDay[] {
  return plan.map((day) => ({
    ...day,
    meals: day.meals.map((meal) => ({ ...meal })),
  }));
}

function applyWorkoutPreferences(plan: WorkoutDay[], profile: UserProfile): WorkoutDay[] {
  const restDays = new Set(profile.restDays ?? []);
  const desiredTrainingDays = Math.min(Math.max(profile.trainingDaysPerWeek ?? 4, 1), WEEK_ORDER.length);
  const dayMap = new Map<string, WorkoutDay>(
    plan.map((day) => [
      day.day,
      {
        ...day,
        isRestDay: Boolean(day.isRestDay),
        exercises: day.exercises.map((exercise, index) => ({
          ...exercise,
          id: exercise.id || `${day.day}-${index}`,
        })),
      },
    ])
  );

  const ordered = WEEK_ORDER.map((day) => dayMap.get(day)).filter(Boolean) as WorkoutDay[];

  ordered.forEach((dayPlan) => {
    if (restDays.has(dayPlan.day)) {
      dayPlan.isRestDay = true;
      dayPlan.exercises = [];
    }
  });

  const activeDays = ordered.filter((day) => !day.isRestDay);
  if (activeDays.length > desiredTrainingDays) {
    activeDays.slice(desiredTrainingDays).forEach((day) => {
      if (!restDays.has(day.day)) {
        day.isRestDay = true;
        day.exercises = [];
      }
    });
  }

  const minRestDays = profile.sleepHours && profile.sleepHours < 6 ? 3 : 2;
  let restCount = ordered.filter((day) => day.isRestDay).length;
  if (restCount < minRestDays) {
    for (const dayName of WEEK_ORDER.slice().reverse()) {
      if (restCount >= minRestDays) break;
      const dayPlan = ordered.find((d) => d.day === dayName);
      if (!dayPlan || dayPlan.isRestDay || restDays.has(dayName)) continue;
      dayPlan.isRestDay = true;
      dayPlan.exercises = [];
      restCount++;
    }
  }

  if (profile.injuries?.hasIssues) {
    ordered.forEach((dayPlan) => {
      if (dayPlan.isRestDay) return;
      const hasWarmUp = dayPlan.exercises.some((exercise) =>
        exercise.id?.includes('injury-warm')
      );
      if (!hasWarmUp) {
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
      }
    });
  }

  if (profile.dailyMovement === 'low') {
    ordered.forEach((dayPlan) => {
      if (dayPlan.isRestDay) return;
      const hasTempo = dayPlan.exercises.some((exercise) =>
        exercise.id?.includes('tempo-walk')
      );
      if (!hasTempo) {
        dayPlan.exercises.push({
          id: `${dayPlan.day.toLowerCase()}-tempo-walk`,
          name: 'Tempo Walk Intervals',
          sets: 3,
          reps: [8],
          restSec: 30,
        });
      }
    });
  }

  if (profile.dailyMovement === 'high') {
    ordered.forEach((dayPlan) => {
      if (dayPlan.isRestDay) return;
      dayPlan.exercises = dayPlan.exercises.map((exercise) => ({
        ...exercise,
        sets: Math.max(2, exercise.sets - 1),
      }));
    });
  }

  return ordered;
}

function adjustMealPlan(plan: MealDay[], profile: UserProfile): MealDay[] {
  const limit = Math.max(1, Math.min(profile.mealsPerDay ?? 3, 6));
  return plan.map((day) => {
    let meals = day.meals
      .slice(0, limit)
      .map((meal, index) => ({
        ...meal,
        id: meal.id || `${day.day}-${index}-${meal.name}`,
      }));

    while (meals.length < limit) {
      meals.push({
        id: `${day.day}-hydration-${meals.length}`,
        name: 'Hydration Boost Smoothie',
        type: 'snack',
        calories: 180,
        protein: 8,
        carbs: 30,
        fats: 4,
        ingredients: ['Water', 'Citrus', 'Pink Salt'],
      });
    }

    if (profile.dailyMovement === 'low' && meals.length > 0) {
      const last = meals[meals.length - 1];
      meals[meals.length - 1] = {
        ...last,
        calories: Math.round(last.calories * 0.9),
        carbs: Math.round(last.carbs * 0.9),
        fats: Math.max(1, Math.round(last.fats * 0.9)),
      };
    }

    if (profile.dailyMovement === 'high' && meals.length > 0) {
      const last = meals[meals.length - 1];
      meals[meals.length - 1] = {
        ...last,
        name: `${last.name} + Electrolyte Sip`,
        calories: Math.round(last.calories + 80),
        carbs: Math.round(last.carbs + 15),
        fats: Math.round(last.fats + 2),
      };
    }

    return {
      ...day,
      meals,
    };
  });
}

export default function App() {
  const {
    profile,
    hasCompletedOnboarding,
    setProfile,
    setOnboardingComplete,
    setPlans,
    workoutLogs,
    theme,
  } = useAppStore();

  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('welcome');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('ar-Gulf');
  const [activeTab, setActiveTab] = useState<HomeTab>('workouts');
  const [generatingPlans, setGeneratingPlans] = useState(false);
  const [plansError, setPlansError] = useState<string | null>(null);
  const [isUsingDemoPlans, setIsUsingDemoPlans] = useState(false);
  const normalizedProfile = profile ? ensureProfileDefaults(profile) : null;
  const activeLanguage = normalizedProfile?.language || selectedLanguage;
  const defaultSkipReasonLabels = new Set([
    'No reason provided',
    'بدون سبب محدد',
    'من غير سبب محدد',
    'ماكاين حتى سبب محدد',
  ]);

  const sanitizeMediaUrl = (url: unknown): string | null => {
    if (typeof url !== 'string') return null;
    try {
      const parsed = new URL(url);
      return ['http:', 'https:'].includes(parsed.protocol) ? parsed.toString() : null;
    } catch {
      return null;
    }
  };

  const attachWorkoutMedia = (plan: WorkoutDay[]): WorkoutDay[] =>
    plan.map((day) => ({
      ...day,
      exercises: day.exercises.map((exercise) => ({
        ...exercise,
        imageUrl: getExerciseImage(exercise.name),
        videoUrl: sanitizeMediaUrl(exercise.videoUrl) || getExerciseVideo(exercise.name),
      })),
    }));

  const attachMealMedia = (plan: MealDay[]): MealDay[] =>
    plan.map((day) => ({
      ...day,
      meals: day.meals.map((meal) => ({
        ...meal,
        imageUrl: sanitizeMediaUrl(meal.imageUrl) || getMealImage(meal.name, meal.type),
      })),
    }));

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (theme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
      root.style.setProperty('color-scheme', 'dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
      root.style.setProperty('color-scheme', 'light');
    }
  }, [theme]);

  // Set RTL direction
  useEffect(() => {
    const lang = profile?.language || selectedLanguage;
    document.documentElement.dir = isRTL(lang) ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [profile?.language, selectedLanguage]);

  // Check onboarding status
  useEffect(() => {
    if (hasCompletedOnboarding && profile) {
      setOnboardingStep(null);
    }
  }, [hasCompletedOnboarding, profile]);

  // Migrate legacy profiles without the new fields
  useEffect(() => {
    if (!profile) return;
    const needsMigration =
      !('injuries' in profile) ||
      typeof (profile as UserProfile).trainingDaysPerWeek !== 'number' ||
      !Array.isArray((profile as UserProfile).restDays) ||
      !('trainingLocation' in profile) ||
      typeof (profile as UserProfile).mealsPerDay !== 'number' ||
      typeof (profile as UserProfile).sleepHours !== 'number' ||
      !('dailyMovement' in profile);
    if (needsMigration) {
      setProfile(ensureProfileDefaults(profile as UserProfile));
    }
  }, [profile, setProfile]);

  const handleCountrySelect = (country: string, language: Language) => {
    setSelectedCountry(country);
    setSelectedLanguage(language);
    setOnboardingStep('profile');
  };

  const buildPlanFeedback = () => {
    const skipReasons = Array.from(
      new Set(
        workoutLogs
          .filter((log) => log.status === 'skipped' && typeof log.reason === 'string')
          .map((log) => log.reason!.trim())
          .filter((reason) => reason && !defaultSkipReasonLabels.has(reason))
      )
    ).slice(0, 10);

    return skipReasons.length ? { skipReasons } : undefined;
  };

  const handleUseDemoPlans = async () => {
    if (!normalizedProfile) return;

    setGeneratingPlans(false);
    const { DEMO_WORKOUT_PLAN, DEMO_MEAL_PLAN } = await import('./lib/demo-data');

    const workoutBase =
      normalizedProfile.trainingLocation === 'home'
        ? buildCalisthenicsPlan(normalizedProfile)
        : applyWorkoutPreferences(cloneWorkoutPlan(DEMO_WORKOUT_PLAN), normalizedProfile);

    const mealBase = adjustMealPlan(cloneMealPlan(DEMO_MEAL_PLAN), normalizedProfile);

    const workoutWithMedia = attachWorkoutMedia(workoutBase);
    const mealsWithMedia = attachMealMedia(mealBase);

    setPlans(workoutWithMedia, mealsWithMedia, 1);
    setOnboardingComplete(true);
    setOnboardingStep(null);
    setPlansError(null);
    setIsUsingDemoPlans(normalizedProfile.trainingLocation !== 'home');
  };

  const runPlanGeneration = async (
    userProfile: typeof profile,
    options: { fallbackToDemo?: boolean } = {}
  ) => {
    if (!userProfile) return;

    const normalized = ensureProfileDefaults(userProfile);

    setGeneratingPlans(true);
    setPlansError(null);

    const mapWorkoutResponse = (days: any[]): WorkoutDay[] =>
      (days ?? []).map((day: any) => ({
        day: day.day,
        isRestDay: Boolean(day.isRestDay),
        exercises: (day.exercises ?? []).map((ex: any, index: number) => ({
          id: ex.id || `${day.day}-${ex.name || index}`,
          name: ex.name,
          sets: ex.sets,
          reps: Array.isArray(ex.reps) ? ex.reps : [ex.reps],
          restSec: ex.restSec,
          targetWeightKg: ex.targetWeightKg,
          videoUrl: ex.videoUrl,
        })),
      }));

    const mapMealResponse = (days: any[]): MealDay[] =>
      (days ?? []).map((day: any) => ({
        day: day.day,
        meals: (day.meals ?? []).map((meal: any, index: number) => ({
          id: meal.id || `${day.day}-${index}-${meal.name}`,
          name: meal.name,
          type: meal.type,
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fats: meal.fats,
          ingredients: meal.ingredients || [],
          imageUrl: meal.imageUrl,
        })),
      }));

    const finalizePlans = (workouts: WorkoutDay[], meals: MealDay[]) => {
      const workoutWithMedia = attachWorkoutMedia(workouts);
      const mealsWithMedia = attachMealMedia(meals);
      setPlans(workoutWithMedia, mealsWithMedia, 1);
      setOnboardingComplete(true);
      setOnboardingStep(null);
      setGeneratingPlans(false);
      setPlansError(null);
      setIsUsingDemoPlans(false);
    };

    try {
      if (normalized.trainingLocation === 'home') {
        const homeWorkouts = buildCalisthenicsPlan(normalized);
        let mealPlan: MealDay[] | null = null;

        try {
          const feedback = buildPlanFeedback();
          const plans = await generatePlans(normalized, 1, undefined, feedback);
          mealPlan = adjustMealPlan(mapMealResponse(plans.meals?.days ?? []), normalized);
        } catch (mealError) {
          console.log('Meal generation failed for home profile, using demo meals.', mealError);
          const { DEMO_MEAL_PLAN } = await import('./lib/demo-data');
          mealPlan = adjustMealPlan(cloneMealPlan(DEMO_MEAL_PLAN), normalized);
        }

        if (!mealPlan) {
          throw new Error('Meal plan unavailable');
        }

        finalizePlans(homeWorkouts, mealPlan);
        return;
      }

      const feedback = buildPlanFeedback();
      const plans = await generatePlans(normalized, 1, undefined, feedback);

      const workoutPlan = applyWorkoutPreferences(mapWorkoutResponse(plans.workout?.days ?? []), normalized);
      const mealPlan = adjustMealPlan(mapMealResponse(plans.meals?.days ?? []), normalized);

      finalizePlans(workoutPlan, mealPlan);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to generate plans';
      console.log('AI plan generation failed:', error);

      if (options.fallbackToDemo) {
        console.log('Falling back to demo plans.');
        await handleUseDemoPlans();
      } else {
        setGeneratingPlans(false);
        setPlansError(message);
      }
    }
  };

  const handleOnboardingComplete = async (userProfile: typeof profile) => {
    if (!userProfile) return;

    setProfile(userProfile);
    await runPlanGeneration(userProfile, { fallbackToDemo: true });
  };

  const handleRegeneratePlans = () => {
    if (!normalizedProfile || generatingPlans) return;
    runPlanGeneration(normalizedProfile, { fallbackToDemo: false });
  };

  // Loading state while generating plans
  if (generatingPlans) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
        <div className="text-center space-y-4 p-6 max-w-md">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <h2>{t('generating_plans', activeLanguage)}</h2>
          <p className="text-muted-foreground">
	  {t('generating_subtitle', activeLanguage)}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (plansError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="text-4xl">⚠️</div>
          <h2>Oops! Something went wrong</h2>
          <p className="text-muted-foreground">{plansError}</p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                setPlansError(null);
                handleRegeneratePlans();
              }}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Try Again
            </button>
            <button
              onClick={handleUseDemoPlans}
              className="px-6 py-3 bg-muted text-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Use Demo Plans
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Onboarding flow
  if (onboardingStep === 'welcome') {
    return <WelcomeScreen onNext={() => setOnboardingStep('country')} />;
  }

  if (onboardingStep === 'country') {
    return <CountrySelectScreen onNext={handleCountrySelect} />;
  }

  if (onboardingStep === 'profile') {
    return (
      <OnboardingScreen
        country={selectedCountry}
        language={selectedLanguage}
        onComplete={handleOnboardingComplete}
      />
    );
  }

  // Main app
  if (!hasCompletedOnboarding || !profile) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Demo mode banner */}
      {isUsingDemoPlans && <DemoBanner />}

      {/* Header with settings */}
      <header className="px-4 py-3 border-b bg-background flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
            🏋️
          </div>
          <span>AI Coach</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle language={profile.language} />
          <SettingsMenu onRegeneratePlans={handleRegeneratePlans} />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        {activeTab === 'workouts' && <WorkoutsScreen />}
        {activeTab === 'calisthenics' && <CalisthenicsScreen />}
        {activeTab === 'meals' && <MealsScreen />}
        {activeTab === 'progress' && <ProgressScreen />}
        {activeTab === 'report' && <ReportScreen />}
      </main>

      {/* Bottom navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} language={profile.language} />

      {/* Quick tips */}
      <QuickTips language={profile.language} />
    </div>
  );
}
