import { useState } from 'react';
import { Play, Check, X, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Exercise, WorkoutLog } from '../store/app-store';
import { t, Language } from '../lib/i18n';

interface WorkoutCardProps {
  exercise: Exercise;
  language: Language;
  week: number;
  day: string;
  log?: WorkoutLog;
  onLog: (log: WorkoutLog) => void;
  onWatchVideo: (exercise: Exercise) => void;
}

export function WorkoutCard({ 
  exercise, 
  language, 
  week, 
  day, 
  log, 
  onLog,
  onWatchVideo 
}: WorkoutCardProps) {
  const [showActions, setShowActions] = useState(false);

  const handleStatus = (status: WorkoutLog['status']) => {
    onLog({
      exerciseId: exercise.id,
      week,
      day,
      status,
      date: new Date().toISOString(),
    });
    setShowActions(false);
  };

  const repsText = exercise.reps.length === 2 
    ? `${exercise.reps[0]}-${exercise.reps[1]}` 
    : exercise.reps[0];

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="truncate">{exercise.name}</h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
            <span>{exercise.sets} {t('sets', language)}</span>
            <span>{repsText} {t('reps', language)}</span>
            <span>{exercise.restSec}{t('seconds', language)} {t('rest', language)}</span>
            {exercise.targetWeightKg && (
              <span>{exercise.targetWeightKg} {t('kg', language)}</span>
            )}
          </div>
        </div>
        
        {exercise.videoUrl && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onWatchVideo(exercise)}
            className="shrink-0"
          >
            <Play className="w-4 h-4" />
          </Button>
        )}
      </div>

      {!log && !showActions && (
        <Button
          onClick={() => setShowActions(true)}
          variant="outline"
          size="sm"
          className="w-full"
        >
          {t('log_workout', language)}
        </Button>
      )}

      {showActions && !log && (
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => handleStatus('completed')}
            size="sm"
            variant="default"
            className="bg-green-600 hover:bg-green-700"
          >
            <Check className="w-4 h-4 mr-1" />
            {t('completed', language)}
          </Button>
          <Button
            onClick={() => handleStatus('skipped')}
            size="sm"
            variant="outline"
          >
            <X className="w-4 h-4 mr-1" />
            {t('skipped', language)}
          </Button>
          <Button
            onClick={() => handleStatus('too_easy')}
            size="sm"
            variant="outline"
          >
            <ThumbsUp className="w-4 h-4 mr-1" />
            {t('too_easy', language)}
          </Button>
          <Button
            onClick={() => handleStatus('too_hard')}
            size="sm"
            variant="outline"
          >
            <ThumbsDown className="w-4 h-4 mr-1" />
            {t('too_hard', language)}
          </Button>
        </div>
      )}

      {log && (
        <div className={`
          p-2 rounded-lg text-center text-sm
          ${log.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
          ${log.status === 'skipped' ? 'bg-gray-100 text-gray-600' : ''}
          ${log.status === 'too_easy' ? 'bg-blue-100 text-blue-800' : ''}
          ${log.status === 'too_hard' ? 'bg-red-100 text-red-800' : ''}
        `}>
          {t(log.status === 'completed' ? 'completed' : log.status, language)}
        </div>
      )}
    </Card>
  );
}
