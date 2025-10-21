import { useState } from 'react';
import { useAppStore } from '../../store/app-store';
import { t } from '../../lib/i18n';
import { WorkoutCard } from '../workout-card';
import { VideoPlayer } from '../video-player';
import type { Exercise } from '../../store/app-store';

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
  } = useAppStore();

  const [videoExercise, setVideoExercise] = useState<Exercise | null>(null);

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
                  week={currentWeek}
                  day={selectedDay}
                  log={log}
                  onLog={addWorkoutLog}
                  onWatchVideo={setVideoExercise}
                />
              );
            })}

            {(!currentDayPlan || currentDayPlan.exercises.length === 0) && (
              <div className="text-center py-12 text-muted-foreground">
                No exercises planned for today
              </div>
            )}
          </div>
        )}
      </div>

      {/* Video modal */}
      {videoExercise && (
        <VideoPlayer
          exercise={videoExercise}
          onClose={() => setVideoExercise(null)}
        />
      )}
    </div>
  );
}
