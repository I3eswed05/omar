import { useState } from 'react';
import { useAppStore } from '../../store/app-store';
import { t } from '../../lib/i18n';
import { MealCard } from '../meal-card';
import { MealAlternativesModal, SuggestedMeal } from '../alternatives-modal';
import { getMealImage } from '../../lib/media';
import { requestMealAlternatives } from '../../lib/api';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function MealsScreen() {
  const {
    profile,
    currentWeek,
    mealPlan,
    mealLogs,
    selectedDay,
    setSelectedDay,
    addMealLog,
    replaceMeal,
  } = useAppStore();

  const [mealAlternatives, setMealAlternatives] = useState<{
    meal: SuggestedMeal | null;
    suggestions: SuggestedMeal[];
    loading: boolean;
    error: string | null;
  }>({
    meal: null,
    suggestions: [],
    loading: false,
    error: null,
  });

  const closeMealAlternatives = () =>
    setMealAlternatives({
      meal: null,
      suggestions: [],
      loading: false,
      error: null,
    });

  const handleRequestAlternative = async (meal: SuggestedMeal) => {
    if (!profile) return;

    const reason = window.prompt(t('alternative_reason_prompt', profile.language) || '');
    if (reason === null) {
      return;
    }

    setMealAlternatives({
      meal,
      suggestions: [],
      loading: true,
      error: null,
    });

    try {
      const response = await requestMealAlternatives(profile, meal, reason.trim());
      const suggestions: SuggestedMeal[] = response.alternatives.map((item: SuggestedMeal, index: number) => ({
        ...item,
        id: item.id || `${meal.id}-alt-${index}-${Date.now()}`,
        imageUrl: getMealImage(item.name, item.type),
        ingredients: Array.isArray(item.ingredients) ? item.ingredients : [],
      }));

      setMealAlternatives({
        meal,
        suggestions,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error(err);
      setMealAlternatives({
        meal,
        suggestions: [],
        loading: false,
        error: (err as Error).message,
      });
    }
  };

  const handleUseMealAlternative = (replacement: SuggestedMeal) => {
    if (!mealAlternatives.meal) return;

    replaceMeal({
      day: selectedDay,
      mealId: mealAlternatives.meal.id,
      replacement: {
        ...replacement,
        id: replacement.id,
        imageUrl: getMealImage(replacement.name, replacement.type),
      },
    });
    closeMealAlternatives();
  };

  if (!profile) return null;

  const currentDayPlan = mealPlan.find((d) => d.day === selectedDay);
  
  const totalCalories = currentDayPlan?.meals.reduce((sum, m) => sum + m.calories, 0) || 0;
  const totalProtein = currentDayPlan?.meals.reduce((sum, m) => sum + m.protein, 0) || 0;
  const totalCarbs = currentDayPlan?.meals.reduce((sum, m) => sum + m.carbs, 0) || 0;
  const totalFats = currentDayPlan?.meals.reduce((sum, m) => sum + m.fats, 0) || 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b bg-background sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <h2>{t('meals', profile.language)}</h2>
          <span className="text-sm text-muted-foreground">
            {t('week', profile.language)} {currentWeek}
          </span>
        </div>

        {/* Day selector */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {DAYS.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`
                px-4 py-2 rounded-lg shrink-0 transition-all
                ${selectedDay === day
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
                }
              `}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Daily totals */}
        {currentDayPlan && (
          <div className="mt-3 p-3 bg-muted rounded-lg">
            <div className="flex justify-around text-sm">
              <div className="text-center">
	       <div className="text-muted-foreground">{t('total', profile.language)}</div>
                <div>{totalCalories} {t('calories', profile.language)}</div>
              </div>
              <div className="text-center">
                <div className="text-muted-foreground">{t('protein', profile.language)}</div>
                <div>{totalProtein}g</div>
              </div>
              <div className="text-center">
                <div className="text-muted-foreground">{t('carbs', profile.language)}</div>
                <div>{totalCarbs}g</div>
              </div>
              <div className="text-center">
                <div className="text-muted-foreground">{t('fats', profile.language)}</div>
                <div>{totalFats}g</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3 max-w-2xl mx-auto">
          {currentDayPlan?.meals.map((meal) => {
            const log = mealLogs.find(
              (l) =>
                l.mealId === meal.id &&
                l.week === currentWeek &&
                l.day === selectedDay
            );

            return (
              <MealCard
                key={meal.id}
                meal={meal}
                language={profile.language}
                week={currentWeek}
                day={selectedDay}
                log={log}
                onLog={addMealLog}
                onRequestAlternative={handleRequestAlternative}
              />
            );
          })}

          {(!currentDayPlan || currentDayPlan.meals.length === 0) && (
            <div className="text-center py-12 text-muted-foreground">
	    {t('no_meals', profile.language)}
            </div>
          )}
        </div>
      </div>
      <MealAlternativesModal
        open={Boolean(mealAlternatives.meal)}
        loading={mealAlternatives.loading}
        language={profile.language}
        onClose={closeMealAlternatives}
        suggestions={mealAlternatives.suggestions}
        onSelect={handleUseMealAlternative}
        error={mealAlternatives.error || undefined}
        originalName={mealAlternatives.meal?.name || ''}
      />
    </div>
  );
}
