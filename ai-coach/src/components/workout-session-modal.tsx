import { useEffect, useMemo, useState } from 'react';
import { X, Check, Pause, Play, SkipForward, Timer } from 'lucide-react';
import { Button } from './ui/button';
import { Exercise, WorkoutLog } from '../store/app-store';
import { Language, t } from '../lib/i18n';

interface ExerciseSessionModalProps {
  exercise: Exercise;
  language: Language;
  week: number;
  day: string;
  isPremium: boolean;
  onClose: () => void;
  onLog: (log: WorkoutLog) => void;
}

export function ExerciseSessionModal({
  exercise,
  language,
  week,
  day,
  isPremium,
  onClose,
  onLog,
}: ExerciseSessionModalProps) {
  const restSeconds = exercise.restSec || 60;
  const [currentSet, setCurrentSet] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(restSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [awaitingNextSet, setAwaitingNextSet] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);

  useEffect(() => {
    setCurrentSet(1);
    setSecondsLeft(restSeconds);
    setIsRunning(false);
    setAwaitingNextSet(false);
    setSessionComplete(false);
  }, [exercise.id, restSeconds]);

  const formattedTimer = useMemo(() => {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [secondsLeft]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          if (currentSet >= exercise.sets) {
            setSessionComplete(true);
          } else {
            setAwaitingNextSet(true);
          }
          return restSeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, currentSet, restSeconds, exercise.sets]);

  const handleStart = () => {
    setIsRunning(true);
    setAwaitingNextSet(false);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleNextSet = () => {
    setCurrentSet((prev) => prev + 1);
    setSecondsLeft(restSeconds);
    setAwaitingNextSet(false);
    setIsRunning(true);
  };

  const handleLog = (status: WorkoutLog['status']) => {
    let reason: string | undefined;

    if (status === 'skipped') {
      const promptMessage = t('skip_reason_prompt', language) || '';
      const response = window.prompt(promptMessage);
      if (response === null) {
        return;
      }
      const trimmed = response.trim();
      reason = trimmed || t('skip_reason_default', language);
    }

    onLog({
      exerciseId: exercise.id,
      week,
      day,
      status,
      date: new Date().toISOString(),
      reason,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-background rounded-lg overflow-hidden shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">{exercise.name}</h3>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-4 p-4">
          <div className="space-y-4">
            <div className="aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center p-4 text-center text-sm text-muted-foreground">
              <div className="space-y-2">
                <Timer className="w-6 h-6 mx-auto text-primary" />
                <span>
                  {t(isPremium ? 'media_video_premium_placeholder' : 'media_video_locked_hint', language)}
                </span>
              </div>
            </div>

            <div className="text-sm text-muted-foreground space-y-1">
              <div>{exercise.sets} {t('sets', language)}</div>
              <div>{exercise.reps.join('-')} {t('reps', language)}</div>
              <div>{restSeconds} {t('seconds', language)} {t('rest', language)}</div>
              {exercise.targetWeightKg && <div>{exercise.targetWeightKg} {t('kg', language)}</div>}
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-muted">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('current_set', language)}</p>
                  <p className="text-2xl font-bold">{currentSet} / {exercise.sets}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{t('timer', language)}</p>
                  <p className="text-3xl font-bold font-mono">{formattedTimer}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                {!isRunning && !awaitingNextSet && !sessionComplete && (
                  <Button onClick={handleStart} className="col-span-2">
                    <Play className="w-4 h-4 mr-2" />
                    {t('start_timer', language)}
                  </Button>
                )}
                {isRunning && (
                  <Button onClick={handlePause} variant="secondary">
                    <Pause className="w-4 h-4 mr-2" />
                    {t('pause_timer', language)}
                  </Button>
                )}
                {!isRunning && awaitingNextSet && (
                  <Button onClick={handleNextSet} className="col-span-2">
                    <SkipForward className="w-4 h-4 mr-2" />
                    {t('next_set', language)}
                  </Button>
                )}
                {!sessionComplete && (
                  <Button onClick={() => handleLog('skipped')} variant="outline">
                    <X className="w-4 h-4 mr-2" />
                    {t('skip_exercise', language)}
                  </Button>
                )}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {t('timer_guidance', language)}
              </p>
            </div>

            {sessionComplete && (
              <div className="space-y-3">
                <h4 className="text-lg font-semibold">{t('session_feedback', language)}</h4>
                <p className="text-sm text-muted-foreground">{t('session_feedback_question', language)}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Button onClick={() => handleLog('completed')} className="bg-green-600 hover:bg-green-700">
                    <Check className="w-4 h-4 mr-2" />
                    {t('completed', language)}
                  </Button>
                  <Button onClick={() => handleLog('too_easy')} variant="outline">
                    {t('too_easy', language)}
                  </Button>
                  <Button onClick={() => handleLog('too_hard')} variant="outline">
                    {t('too_hard', language)}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
