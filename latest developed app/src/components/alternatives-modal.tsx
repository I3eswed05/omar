import { Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Language, t } from '../lib/i18n';
import { Exercise, Meal } from '../store/app-store';

export interface SuggestedExercise extends Exercise {
  rationale?: string;
}

export interface SuggestedMeal extends Meal {
  rationale?: string;
}

interface BaseModalProps {
  open: boolean;
  loading: boolean;
  language: Language;
  onClose: () => void;
  error?: string | null;
}

interface ExerciseAlternativesModalProps extends BaseModalProps {
  suggestions: SuggestedExercise[];
  originalName: string;
  onSelect: (exercise: Exercise) => void;
}

interface MealAlternativesModalProps extends BaseModalProps {
  suggestions: SuggestedMeal[];
  originalName: string;
  onSelect: (meal: Meal) => void;
}

const ModalShell = ({
  open,
  language,
  onClose,
  title,
  children,
}: {
  open: boolean;
  language: Language;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-background rounded-xl shadow-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="p-4 space-y-4">
          {children}
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              {t('close', language)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ExerciseAlternativesModal = ({
  open,
  loading,
  language,
  onClose,
  suggestions,
  onSelect,
  error,
  originalName,
}: ExerciseAlternativesModalProps) => {
  return (
    <ModalShell
      open={open}
      language={language}
      onClose={onClose}
      title={`${t('alternative_title_exercise', language)} • ${originalName}`}
    >
      {loading && (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>{t('alternative_loading', language)}</span>
        </div>
      )}

      {!loading && error && (
        <div className="text-center text-destructive py-6">{t('alternative_error', language)}</div>
      )}

      {!loading && !error && suggestions.length === 0 && (
        <div className="text-center text-muted-foreground py-6">
          {t('alternative_no_options', language)}
        </div>
      )}

      {!loading && !error && suggestions.length > 0 && (
        <div className="space-y-3">
          {suggestions.map((suggestion) => (
            <Card key={suggestion.id} className="p-4">
              <div className="flex flex-wrap justify-between gap-2">
                <div>
                  <h4 className="font-semibold">{suggestion.name}</h4>
                  <div className="text-sm text-muted-foreground">
                    {suggestion.sets} {t('sets', language)} •{' '}
                    {suggestion.reps.join('-')} {t('reps', language)} •{' '}
                    {suggestion.restSec} {t('seconds', language)} {t('rest', language)}
                  </div>
                  {suggestion.targetWeightKg && (
                    <div className="text-sm text-muted-foreground">
                      {suggestion.targetWeightKg} {t('kg', language)}
                    </div>
                  )}
                  {suggestion.rationale && (
                    <p className="text-sm mt-2 text-muted-foreground">{suggestion.rationale}</p>
                  )}
                </div>
                <Button onClick={() => onSelect(suggestion)}>{t('alternative_replace', language)}</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </ModalShell>
  );
};

export const MealAlternativesModal = ({
  open,
  loading,
  language,
  onClose,
  suggestions,
  onSelect,
  error,
  originalName,
}: MealAlternativesModalProps) => {
  return (
    <ModalShell
      open={open}
      language={language}
      onClose={onClose}
      title={`${t('alternative_title_meal', language)} • ${originalName}`}
    >
      {loading && (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>{t('alternative_loading', language)}</span>
        </div>
      )}

      {!loading && error && (
        <div className="text-center text-destructive py-6">{t('alternative_error', language)}</div>
      )}

      {!loading && !error && suggestions.length === 0 && (
        <div className="text-center text-muted-foreground py-6">
          {t('alternative_no_options', language)}
        </div>
      )}

      {!loading && !error && suggestions.length > 0 && (
        <div className="space-y-3">
          {suggestions.map((suggestion) => (
            <Card key={suggestion.id} className="p-4 space-y-2">
              <div className="flex flex-wrap justify-between gap-2">
                <div>
                  <h4 className="font-semibold">{suggestion.name}</h4>
                  <div className="text-sm text-muted-foreground">{t(suggestion.type, language)}</div>
                </div>
                <Button onClick={() => onSelect(suggestion)}>
                  {t('alternative_replace', language)}
                </Button>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span>{suggestion.calories} {t('calories', language)}</span>
                <span>{t('protein', language)}: {suggestion.protein}g</span>
                <span>{t('carbs', language)}: {suggestion.carbs}g</span>
                <span>{t('fats', language)}: {suggestion.fats}g</span>
              </div>
              {suggestion.ingredients.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  {t('ingredients', language)}: {suggestion.ingredients.join(', ')}
                </div>
              )}
              {suggestion.rationale && (
                <p className="text-sm text-muted-foreground">{suggestion.rationale}</p>
              )}
            </Card>
          ))}
        </div>
      )}
    </ModalShell>
  );
};

