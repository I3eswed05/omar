import { useAppStore } from '../../store/app-store';
import { t } from '../../lib/i18n';
import { ProgressRing } from '../progress-ring';
import { Card } from '../ui/card';
import { Flame } from 'lucide-react';

export function ProgressScreen() {
  const { profile, currentWeek, workoutLogs, mealLogs } = useAppStore();

  if (!profile) return null;

  // Calculate adherence for current week
  const currentWeekWorkoutLogs = workoutLogs.filter((l) => l.week === currentWeek);
  const currentWeekMealLogs = mealLogs.filter((l) => l.week === currentWeek);

  const workoutAdherence =
    currentWeekWorkoutLogs.length > 0
      ? (currentWeekWorkoutLogs.filter((l) => l.status === 'completed').length /
          currentWeekWorkoutLogs.length) *
        100
      : 0;

  const mealAdherence =
    currentWeekMealLogs.length > 0
      ? (currentWeekMealLogs.filter((l) => l.consumed).length /
          currentWeekMealLogs.length) *
        100
      : 0;

  // Calculate streak (consecutive days with at least one completed workout or meal)
  const calculateStreak = () => {
    const allLogs = [
      ...workoutLogs.filter((l) => l.status === 'completed'),
      ...mealLogs.filter((l) => l.consumed),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (allLogs.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < 30; i++) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const hasActivity = allLogs.some((log) => log.date.startsWith(dateStr));

      if (hasActivity) {
        streak++;
      } else if (streak > 0) {
        break;
      }

      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
  };

  const streak = calculateStreak();

  // Weekly data for simple visualization
  const weeklyData = Array.from({ length: currentWeek }, (_, i) => {
    const week = i + 1;
    const weekWorkoutLogs = workoutLogs.filter((l) => l.week === week);
    const weekMealLogs = mealLogs.filter((l) => l.week === week);

    return {
      week,
      workoutAdherence:
        weekWorkoutLogs.length > 0
          ? (weekWorkoutLogs.filter((l) => l.status === 'completed').length /
              weekWorkoutLogs.length) *
            100
          : 0,
      mealAdherence:
        weekMealLogs.length > 0
          ? (weekMealLogs.filter((l) => l.consumed).length / weekMealLogs.length) *
            100
          : 0,
    };
  });

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="p-4 border-b bg-background sticky top-0 z-10">
        <h2>{t('progress', profile.language)}</h2>
      </div>

      <div className="p-4 space-y-6 max-w-2xl mx-auto w-full">
        {/* Current week adherence */}
        <Card className="p-6">
          <h3 className="mb-4">
            {t('week', profile.language)} {currentWeek}
          </h3>
          <div className="flex justify-around">
            <ProgressRing
              percentage={workoutAdherence}
              label={t('workout_adherence', profile.language)}
            />
            <ProgressRing
              percentage={mealAdherence}
              label={t('meal_adherence', profile.language)}
              color="#f59e0b"
            />
          </div>
        </Card>

        {/* Streak */}
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <Flame className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <div className="text-3xl">
                {streak} {t('days', profile.language)}
              </div>
              <div className="text-sm text-muted-foreground">
                {t('current_streak', profile.language)}
              </div>
            </div>
          </div>
        </Card>

        {/* Weekly progress chart */}
        {weeklyData.length > 0 && (
          <Card className="p-6">
            <h3 className="mb-4">{t('weekly_progress', profile.language)}</h3>
            <div className="space-y-3">
              {weeklyData.map((data) => (
                <div key={data.week} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>
                      {t('week', profile.language)} {data.week}
                    </span>
                    <span className="text-muted-foreground">
                      {Math.round((data.workoutAdherence + data.mealAdherence) / 2)}%
                    </span>
                  </div>
                  <div className="flex gap-1 h-2">
                    <div
                      className="bg-primary rounded"
                      style={{ width: `${data.workoutAdherence}%` }}
                    />
                    <div
                      className="bg-orange-500 rounded"
                      style={{ width: `${data.mealAdherence}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
