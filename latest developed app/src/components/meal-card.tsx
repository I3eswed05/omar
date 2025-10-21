import { Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Meal, MealLog } from '../store/app-store';
import { t, Language } from '../lib/i18n';

interface MealCardProps {
  meal: Meal;
  language: Language;
  week: number;
  day: string;
  log?: MealLog;
  onLog: (log: MealLog) => void;
}

export function MealCard({ meal, language, week, day, log, onLog }: MealCardProps) {
  const handleConsumed = (consumed: boolean) => {
    onLog({
      mealId: meal.id,
      week,
      day,
      consumed,
      date: new Date().toISOString(),
    });
  };

  return (
    <Card className="p-4 space-y-3">
      <div>
        <div className="flex items-start justify-between gap-2">
          <h3>{meal.name}</h3>
          <span className="text-sm text-muted-foreground shrink-0">
            {t(meal.type, language)}
          </span>
        </div>
        
        <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
          <span>{meal.calories} {t('calories', language)}</span>
          <span>{t('protein', language)}: {meal.protein}g</span>
          <span>{t('carbs', language)}: {meal.carbs}g</span>
          <span>{t('fats', language)}: {meal.fats}g</span>
        </div>
      </div>

      <div className="text-sm">
        <div className="text-muted-foreground mb-1">Ingredients:</div>
        <div className="flex flex-wrap gap-1">
          {meal.ingredients.map((ingredient, idx) => (
            <span
              key={idx}
              className="bg-muted px-2 py-1 rounded text-xs"
            >
              {ingredient}
            </span>
          ))}
        </div>
      </div>

      {!log && (
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => handleConsumed(true)}
            size="sm"
            variant="default"
            className="bg-green-600 hover:bg-green-700"
          >
            <Check className="w-4 h-4 mr-1" />
            {t('mark_consumed', language)}
          </Button>
          <Button
            onClick={() => handleConsumed(false)}
            size="sm"
            variant="outline"
          >
            <X className="w-4 h-4 mr-1" />
            {t('mark_skipped', language)}
          </Button>
        </div>
      )}

      {log && (
        <div className={`
          p-2 rounded-lg text-center text-sm
          ${log.consumed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}
        `}>
          {log.consumed ? t('mark_consumed', language) : t('mark_skipped', language)}
        </div>
      )}
    </Card>
  );
}
