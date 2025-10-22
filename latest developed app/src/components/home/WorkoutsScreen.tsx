import { useState } from 'react';
import { useAppStore } from '../../store/app-store';
import { t } from '../../lib/i18n';
import { WorkoutCard } from '../workout-card';
import { ExerciseSessionModal } from '../workout-session-modal';
import type { Exercise } from '../../store/app-store';
import { ExerciseAlternativesModal, SuggestedExercise } from '../alternatives-modal';
import { getExerciseImage, getExerciseVideo } from '../../lib/media';
import { requestExerciseAlternatives } from '../../lib/api';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function WorkoutsScreen() {
  const {
    profile,
    currentWeek,
    workoutPlan,
    workoutLogs,
    selectedDay,
    setSelectedDay,
    addWorkoutLog,
    replaceExercise,
    isPremium,
  } = useAppStore();

  const [sessionExercise, setSessionExercise] = useState<Exercise | null>(null);
  const [exerciseAlternatives, setExerciseAlternatives] = useState<{
    exercise: Exercise | null;
    suggestions: SuggestedExercise[];
    loading: boolean;
    error: string | null;
  }>({
    exercise: null,
    suggestions: [],
    loading: false,
    error: null,
  });

  const closeExerciseAlternatives = () =>
    setExerciseAlternatives({
      exercise: null,
      suggestions: [],
      loading: false,
      error: null,
    });

  const handleRequestAlternative = async (exercise: Exercise) => {
    if (!profile) return;

    const reason = window.prompt(t('alternative_reason_prompt', profile.language) || '');
    if (reason === null) {
      return;
    }

    setExerciseAlternatives({
      exercise,
      suggestions: [],
      loading: true,
      error: null,
    });

    try {
      const response = await requestExerciseAlternatives(profile, exercise, reason.trim());
      const suggestions: SuggestedExercise[] = response.alternatives.map((item: SuggestedExercise, index: number) => ({
        ...item,
        id: item.id || `${exercise.id}-alt-${index}-${Date.now()}`,
        reps: Array.isArray(item.reps) ? item.reps : [item.reps],
        imageUrl: getExerciseImage(item.name),
        videoUrl: getExerciseVideo(item.name),
      }));

      setExerciseAlternatives({
        exercise,
        suggestions,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error(err);
      setExerciseAlternatives({
        exercise,
        suggestions: [],
        loading: false,
        error: (err as Error).message,
      });
    }
  };

  const handleUseExerciseAlternative = (replacement: SuggestedExercise) => {
    if (!exerciseAlternatives.exercise) return;

    replaceExercise({
      day: selectedDay,
      exerciseId: exerciseAlternatives.exercise.id,
      replacement: {
        ...replacement,
        id: replacement.id,
        imageUrl: getExerciseImage(replacement.name),
        videoUrl: getExerciseVideo(replacement.name),
      },
    });
    closeExerciseAlternatives();
  };

  if (!profile) return null;

  const currentDayPlan = workoutPlan.find((d) => d.day === selectedDay);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b bg-background sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <h2>{t('workouts', profile.language)}</h2>
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
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {currentDayPlan?.isRestDay ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-2">
              <div className="text-4xl">😴</div>
              <p className="text-muted-foreground">{t('rest_day', profile.language)}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 max-w-2xl mx-auto">
            {currentDayPlan?.exercises.map((exercise) => {
              const log = workoutLogs.find(
                (l) =>
                  l.exerciseId === exercise.id &&
                  l.week === currentWeek &&
                  l.day === selectedDay
              );

              return (
                <WorkoutCard
                  key={exercise.id}
                  exercise={exercise}
                  language={profile.language}
                  log={log}
                  onStartSession={setSessionExercise}
                  onRequestAlternative={handleRequestAlternative}
                />
              );
            })}

            {(!currentDayPlan || currentDayPlan.exercises.length === 0) && (
              <div className="text-center py-12 text-muted-foreground">
                {t('no_exercises', profile.language)}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Video modal */}
      {sessionExercise && (
        <ExerciseSessionModal
          exercise={sessionExercise}
          language={profile.language}
          week={currentWeek}
          day={selectedDay}
          isPremium={isPremium}
          onClose={() => setSessionExercise(null)}
          onLog={addWorkoutLog}
        />
      )}
      <ExerciseAlternativesModal
        open={Boolean(exerciseAlternatives.exercise)}
        loading={exerciseAlternatives.loading}
        language={profile.language}
        onClose={closeExerciseAlternatives}
        suggestions={exerciseAlternatives.suggestions}
        onSelect={handleUseExerciseAlternative}
        error={exerciseAlternatives.error || undefined}
        originalName={exerciseAlternatives.exercise?.name || ''}
      />
    </div>
  );
}
