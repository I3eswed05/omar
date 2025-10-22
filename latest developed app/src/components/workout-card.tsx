import { CheckCircle, Clock, RefreshCcw } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Exercise, WorkoutLog } from '../store/app-store';
import { t, Language } from '../lib/i18n';

interface WorkoutCardProps {
  exercise: Exercise;
  language: Language;
  log?: WorkoutLog;
  onStartSession: (exercise: Exercise) => void;
  onRequestAlternative: (exercise: Exercise) => void;
}

export function WorkoutCard({
  exercise,
  language,
  log,
  onStartSession,
  onRequestAlternative,
}: WorkoutCardProps) {
  const repsText = exercise.reps.length === 2
    ? `${exercise.reps[0]}-${exercise.reps[1]}`
    : exercise.reps[0];

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-start gap-3">
        <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground text-center px-2">
          {t('media_photo_placeholder', language)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="truncate font-semibold">{exercise.name}</h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-2">
            <span>{exercise.sets} {t('sets', language)}</span>
            <span>{repsText} {t('reps', language)}</span>
            <span><Clock className="inline-block w-3 h-3 mx-1" />{exercise.restSec}{t('seconds', language)} {t('rest', language)}</span>
            {exercise.targetWeightKg && (
              <span>{exercise.targetWeightKg} {t('kg', language)}</span>
            )}
          </div>
        </div>
      </div>

      <Button
        onClick={() => onStartSession(exercise)}
        variant="default"
        size="sm"
        className="w-full"
      >
        <Clock className="w-4 h-4 mr-1" />
        {t('start_session', language)}
      </Button>
      <Button
        onClick={() => onRequestAlternative(exercise)}
        variant="outline"
        size="sm"
        className="w-full"
      >
        <RefreshCcw className="w-4 h-4 mr-1" />
        {t('request_alternative', language)}
      </Button>

      {log && (
        <div className={`
          p-2 rounded-lg text-center text-sm
          ${log.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
          ${log.status === 'skipped' ? 'bg-gray-100 text-gray-600' : ''}
          ${log.status === 'too_easy' ? 'bg-blue-100 text-blue-800' : ''}
          ${log.status === 'too_hard' ? 'bg-red-100 text-red-800' : ''}
        `}>
          <CheckCircle className="inline-block w-4 h-4 mr-1" />
          {t(log.status === 'completed' ? 'completed' : log.status, language)}
        </div>
      )}
    </Card>
  );
}
