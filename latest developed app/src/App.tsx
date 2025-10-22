import { useEffect, useState } from 'react';
import { useAppStore } from './store/app-store';
import { isRTL, Language, t } from './lib/i18n';
import { generatePlans } from './lib/api';

// Onboarding
import { getExerciseImage, getExerciseVideo, getMealImage } from './lib/media';
import { WelcomeScreen } from './components/onboarding/WelcomeScreen';
import { CountrySelectScreen } from './components/onboarding/CountrySelectScreen';
import { OnboardingScreen } from './components/onboarding/OnboardingScreen';

// Home
import { WorkoutsScreen } from './components/home/WorkoutsScreen';
import { MealsScreen } from './components/home/MealsScreen';
import { ProgressScreen } from './components/home/ProgressScreen';
import { ReportScreen } from './components/home/ReportScreen';
import { BottomNav } from './components/bottom-nav';
import { SettingsMenu } from './components/settings-menu';
import { QuickTips } from './components/quick-tips';
import { DemoBanner } from './components/demo-banner';
import { ThemeToggle } from './components/theme-toggle';

import './styles/globals.css';

type OnboardingStep = 'welcome' | 'country' | 'profile' | null;
type HomeTab = 'workouts' | 'meals' | 'progress' | 'report';

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
  const activeLanguage = profile?.language || selectedLanguage;
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

  // Apply theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
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
    setGeneratingPlans(false);
    const { DEMO_WORKOUT_PLAN, DEMO_MEAL_PLAN } = await import('./lib/demo-data');
    const workoutWithMedia = DEMO_WORKOUT_PLAN.map((day) => ({
      ...day,
      exercises: day.exercises.map((exercise) => ({
        ...exercise,
        imageUrl: getExerciseImage(exercise.name),
        videoUrl: sanitizeMediaUrl(exercise.videoUrl) || getExerciseVideo(exercise.name),
      })),
    }));
    const mealsWithMedia = DEMO_MEAL_PLAN.map((day) => ({
      ...day,
      meals: day.meals.map((meal) => ({
        ...meal,
        imageUrl: getMealImage(meal.name, meal.type),
      })),
    }));
    setPlans(workoutWithMedia, mealsWithMedia, 1);
    setOnboardingComplete(true);
    setOnboardingStep(null);
    setPlansError(null);
    setIsUsingDemoPlans(true);
  };

  const runPlanGeneration = async (
    userProfile: typeof profile,
    options: { fallbackToDemo?: boolean } = {}
  ) => {
    if (!userProfile) return;

    setGeneratingPlans(true);
    setPlansError(null);

    try {
      const feedback = buildPlanFeedback();
      const plans = await generatePlans(userProfile, 1, undefined, feedback);

      const workoutPlan = plans.workout.days.map((day: any) => ({
        day: day.day,
        isRestDay: day.isRestDay || false,
        exercises: day.exercises.map((ex: any) => ({
          id: ex.id || `${day.day}-${ex.name}`,
          name: ex.name,
          sets: ex.sets,
          reps: Array.isArray(ex.reps) ? ex.reps : [ex.reps],
          restSec: ex.restSec,
          targetWeightKg: ex.targetWeightKg,
          imageUrl: getExerciseImage(ex.name),
          videoUrl: sanitizeMediaUrl(ex.videoUrl) || getExerciseVideo(ex.name),
        })),
      }));

      const mealPlan = plans.meals.days.map((day: any) => ({
        day: day.day,
        meals: day.meals.map((meal: any) => ({
          id: meal.id || `${day.day}-${meal.name}`,
          name: meal.name,
          type: meal.type,
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fats: meal.fats,
          ingredients: meal.ingredients || [],
          imageUrl: sanitizeMediaUrl(meal.imageUrl) || getMealImage(meal.name, meal.type),
        })),
      }));

      setPlans(workoutPlan, mealPlan, 1);
      setOnboardingComplete(true);
      setOnboardingStep(null);
      setGeneratingPlans(false);
      setIsUsingDemoPlans(false);
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
    if (!profile || generatingPlans) return;
    runPlanGeneration(profile, { fallbackToDemo: false });
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
        {activeTab === 'meals' && <MealsScreen />}
        {activeTab === 'progress' && <ProgressScreen />}
        {activeTab === 'report' && <ReportScreen />}
      </main>

      {/* Bottom navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        language={profile.language}
      />

      {/* Quick tips */}
      <QuickTips language={profile.language} />
    </div>
  );
}
