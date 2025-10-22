import { useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  DietType,
  Experience,
  Gender,
  Goal,
  MovementLevel,
  TrainingLocation,
  UserProfile,
} from '../../store/app-store';
import { Language, t } from '../../lib/i18n';

interface OnboardingScreenProps {
  country: string;
  language: Language;
  onComplete: (profile: UserProfile) => void;
}

const TOTAL_STEPS = 10;
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
const TRAINING_DAY_OPTIONS = [2, 3, 4, 5, 6];
const MEAL_OPTIONS = [2, 3, 4, 5, 6];

type InjuryAnswer = '' | 'yes' | 'no';

export function OnboardingScreen({ country, language, onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'male' as Gender,
    height: '',
    weight: '',
    experience: 'beginner' as Experience,
    goal: 'build_muscle' as Goal,
    dietType: 'standard' as DietType,
    hasInjuries: '' as InjuryAnswer,
    injuryDetails: '',
    trainingDaysPerWeek: 4,
    restDays: [] as string[],
    trainingLocation: 'gym' as TrainingLocation,
    mealsPerDay: 3,
    sleepHours: '7',
    dailyMovement: 'medium' as MovementLevel,
  });

  const dayLabels = useMemo<Record<(typeof DAYS)[number], string>>(
    () => ({
      Mon: t('day_mon', language),
      Tue: t('day_tue', language),
      Wed: t('day_wed', language),
      Thu: t('day_thu', language),
      Fri: t('day_fri', language),
      Sat: t('day_sat', language),
      Sun: t('day_sun', language),
    }),
    [language]
  );

  const movementOptions = useMemo<
    Array<{ id: MovementLevel; title: string; description: string }>
  >(
    () => [
      {
        id: 'low',
        title: t('movement_low', language),
        description: t('movement_low_desc', language),
      },
      {
        id: 'medium',
        title: t('movement_medium', language),
        description: t('movement_medium_desc', language),
      },
      {
        id: 'high',
        title: t('movement_high', language),
        description: t('movement_high_desc', language),
      },
    ],
    [language]
  );

  const toggleRestDay = (day: string) => {
    setFormData((prev) => {
      const restDays = prev.restDays.includes(day)
        ? prev.restDays.filter((d) => d !== day)
        : [...prev.restDays, day];
      return { ...prev, restDays };
    });
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name.trim().length > 0 && Number(formData.age) > 0;
      case 2:
        return Number(formData.height) > 0 && Number(formData.weight) > 0;
      case 3:
        return formData.hasInjuries !== '';
      case 4:
        return formData.trainingDaysPerWeek > 0;
      case 5:
        return ['gym', 'home'].includes(formData.trainingLocation);
      case 6:
        return formData.mealsPerDay > 0 && Number(formData.sleepHours) > 0;
      case 7:
        return ['low', 'medium', 'high'].includes(formData.dailyMovement);
      case 8:
        return Boolean(formData.experience);
      case 9:
        return Boolean(formData.goal);
      case 10:
        return Boolean(formData.dietType);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    const profile: UserProfile = {
      name: formData.name.trim(),
      age: Number(formData.age) || 0,
      gender: formData.gender,
      height: Number(formData.height) || 0,
      weight: Number(formData.weight) || 0,
      experience: formData.experience,
      goal: formData.goal,
      dietType: formData.dietType,
      country,
      language,
      injuries: {
        hasIssues: formData.hasInjuries === 'yes',
        details:
          formData.hasInjuries === 'yes' && formData.injuryDetails.trim().length
            ? formData.injuryDetails.trim()
            : null,
      },
      trainingDaysPerWeek: formData.trainingDaysPerWeek,
      restDays: formData.restDays,
      trainingLocation: formData.trainingLocation,
      mealsPerDay: formData.mealsPerDay,
      sleepHours: Number(formData.sleepHours) || 0,
      dailyMovement: formData.dailyMovement,
    };

    await new Promise((resolve) => setTimeout(resolve, 1000));
    onComplete(profile);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 pt-8">
            <h2>{t('profile_title', language)}</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t('whats_your_name', language)}</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t('name_placeholder', language)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('age', language)}</Label>
                  <Input
                    type="number"
                    inputMode="numeric"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="25"
                    min={10}
                    max={90}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t('gender', language)}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setFormData({ ...formData, gender: 'male' })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.gender === 'male'
                          ? 'border-primary bg-primary/10'
                          : 'border-border'
                      }`}
                    >
                      {t('male', language)}
                    </button>
                    <button
                      onClick={() => setFormData({ ...formData, gender: 'female' })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.gender === 'female'
                          ? 'border-primary bg-primary/10'
                          : 'border-border'
                      }`}
                    >
                      {t('female', language)}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 pt-8">
            <h2>{t('body_title', language)}</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('height', language)}</Label>
                <Input
                  type="number"
                  inputMode="numeric"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  placeholder="175"
                  min={120}
                  max={230}
                />
              </div>

              <div className="space-y-2">
                <Label>{t('weight', language)}</Label>
                <Input
                  type="number"
                  inputMode="numeric"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="75"
                  min={35}
                  max={220}
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 pt-8">
            <h2>{t('injury_title', language)}</h2>
            <p className="text-muted-foreground text-sm">{t('injury_subtitle', language)}</p>

            <div className="grid grid-cols-2 gap-3">
              {(['no', 'yes'] as InjuryAnswer[]).map((option) => (
                <button
                  key={option}
                  onClick={() => setFormData({ ...formData, hasInjuries: option })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.hasInjuries === option
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/40'
                  }`}
                >
                  {option === 'yes' ? t('injury_yes', language) : t('injury_no', language)}
                </button>
              ))}
            </div>

            {formData.hasInjuries === 'yes' && (
              <div className="space-y-2">
                <Label>{t('injury_details_label', language)}</Label>
                <Textarea
                  value={formData.injuryDetails}
                  onChange={(e) => setFormData({ ...formData, injuryDetails: e.target.value })}
                  placeholder={t('injury_details_placeholder', language)}
                  rows={4}
                />
              </div>
            )}
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 pt-8">
            <h2>{t('training_days_title', language)}</h2>
            <p className="text-muted-foreground text-sm">{t('training_days_subtitle', language)}</p>

            <div className="flex gap-2 flex-wrap">
              {TRAINING_DAY_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => setFormData({ ...formData, trainingDaysPerWeek: option })}
                  className={`rounded-lg border-2 px-4 py-3 transition-all ${
                    formData.trainingDaysPerWeek === option
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/40'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <Label>{t('rest_days_label', language)}</Label>
              <div className="flex flex-wrap gap-2">
                {DAYS.map((day) => {
                  const isSelected = formData.restDays.includes(day);
                  return (
                    <button
                      key={day}
                      onClick={() => toggleRestDay(day)}
                      className={`rounded-full border px-4 py-2 text-sm transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/15 text-primary-foreground'
                          : 'border-border bg-muted/40 hover:border-primary/40'
                      }`}
                    >
                      {dayLabels[day]}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground">{t('rest_days_hint', language)}</p>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6 pt-8">
            <h2>{t('training_location_title', language)}</h2>
            <p className="text-muted-foreground text-sm">{t('training_location_subtitle', language)}</p>

            <div className="grid gap-3 md:grid-cols-2">
              {(['gym', 'home'] as TrainingLocation[]).map((location) => (
                <button
                  key={location}
                  onClick={() => setFormData({ ...formData, trainingLocation: location })}
                  className={`rounded-xl border-2 p-4 text-left transition-all ${
                    formData.trainingLocation === location
                      ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                      : 'border-border hover:border-primary/40'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="text-lg font-semibold">
                      {location === 'gym'
                        ? t('training_location_gym', language)
                        : t('training_location_home', language)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {location === 'gym'
                        ? t('training_location_gym_desc', language)
                        : t('training_location_home_desc', language)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6 pt-8">
            <h2>{t('nutrition_sleep_title', language)}</h2>
            <p className="text-muted-foreground text-sm">{t('nutrition_sleep_subtitle', language)}</p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <Label>{t('meals_per_day_label', language)}</Label>
                <div className="flex flex-wrap gap-2">
                  {MEAL_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setFormData({ ...formData, mealsPerDay: opt })}
                      className={`rounded-lg border-2 px-4 py-2 transition-all ${
                        formData.mealsPerDay === opt
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/40'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t('sleep_hours_label', language)}</Label>
                <Input
                  type="number"
                  inputMode="numeric"
                  min={3}
                  max={12}
                  step="0.5"
                  value={formData.sleepHours}
                  onChange={(e) => setFormData({ ...formData, sleepHours: e.target.value })}
                  placeholder="7"
                />
              </div>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-6 pt-8">
            <h2>{t('movement_title', language)}</h2>
            <p className="text-muted-foreground text-sm">{t('movement_subtitle', language)}</p>

            <div className="space-y-3">
              {movementOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setFormData({ ...formData, dailyMovement: option.id })}
                  className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                    formData.dailyMovement === option.id
                      ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                      : 'border-border hover:border-primary/40'
                  }`}
                >
                  <div className="text-base font-semibold">{option.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">{option.description}</div>
                </button>
              ))}
            </div>
          </div>
        );
      case 8:
        return (
          <div className="space-y-6 pt-8">
            <h2>{t('experience_title', language)}</h2>

            <div className="space-y-3">
              {(['beginner', 'intermediate', 'advanced'] as Experience[]).map((level) => (
                <button
                  key={level}
                  onClick={() => setFormData({ ...formData, experience: level })}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    formData.experience === level
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/40'
                  }`}
                >
                  <div className={formData.experience === level ? 'text-primary' : ''}>
                    {t(level, language)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t(`${level}_desc`, language)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      case 9:
        return (
          <div className="space-y-6 pt-8">
            <h2>{t('goal_title', language)}</h2>

            <div className="grid grid-cols-2 gap-3">
              {(['build_muscle', 'lose_fat', 'maintain', 'recomp'] as Goal[]).map((goalType) => (
                <button
                  key={goalType}
                  onClick={() => setFormData({ ...formData, goal: goalType })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.goal === goalType
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/40'
                  }`}
                >
                  {t(goalType, language)}
                </button>
              ))}
            </div>
          </div>
        );
      case 10:
        return (
          <div className="space-y-6 pt-8">
            <h2>{t('diet_title', language)}</h2>

            <div className="grid grid-cols-2 gap-3">
              {(['standard', 'keto', 'vegetarian', 'halal'] as DietType[]).map((diet) => (
                <button
                  key={diet}
                  onClick={() => setFormData({ ...formData, dietType: diet })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.dietType === diet
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/40'
                  }`}
                >
                  {t(diet, language)}
                </button>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background p-6">
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col space-y-6">
        <div className="pt-4">
          <div className="flex gap-1">
            {Array.from({ length: TOTAL_STEPS }, (_, index) => index + 1).map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i <= step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        {renderStep()}
      </div>

      <div className="mx-auto w-full max-w-2xl space-y-3 pt-6">
        <Button
          onClick={handleNext}
          disabled={!canProceed() || loading}
          size="lg"
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('generating_plans', language)}
            </>
          ) : step === TOTAL_STEPS ? (
            t('finish_onboarding', language)
          ) : (
            t('continue', language)
          )}
        </Button>

        {step > 1 && !loading && (
          <Button
            onClick={() => setStep((prev) => Math.max(1, prev - 1))}
            variant="outline"
            size="lg"
            className="w-full"
          >
            {t('back', language)}
          </Button>
        )}
      </div>
    </div>
  );
}
