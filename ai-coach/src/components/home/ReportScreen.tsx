import { useEffect, useMemo, useState } from 'react';
import { useAppStore } from '../../store/app-store';
import { t } from '../../lib/i18n';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { generateWeeklyReport } from '../../lib/api';
import { Crown, Droplets, Loader2, MoonStar, Sparkles } from 'lucide-react';
import { Input } from '../ui/input';

export function ReportScreen() {
  const {
    profile,
    currentWeek,
    workoutLogs,
    mealLogs,
    isPremium,
    weeklyReport,
    setWeeklyReport,
    accessToken,
    sleepHoursToday,
    setSleepHoursToday,
    lastWaterIntakeAt,
    logWaterIntake,
  } = useAppStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sleepInput, setSleepInput] = useState<string>(sleepHoursToday ? String(sleepHoursToday) : '');

  useEffect(() => {
    setSleepInput(sleepHoursToday !== null ? String(sleepHoursToday) : '');
  }, [sleepHoursToday]);

  if (!profile) return null;
  const language = profile.language;

  const targetWaterLiters = useMemo(() => {
    const base = profile.weight ? profile.weight * 0.033 : 2.6;
    const movementBoost =
      profile.dailyMovement === 'high' ? 0.6 : profile.dailyMovement === 'low' ? -0.2 : 0;
    const sleepModifier = profile.sleepHours && profile.sleepHours < 6 ? 0.2 : 0;
    const total = Math.max(1.8, Math.min(5.2, base + movementBoost + sleepModifier));
    return Math.round(total * 10) / 10;
  }, [profile.weight, profile.dailyMovement, profile.sleepHours]);

  const hydrationCopy = t('water_reminder_copy', language).replace(
    '{liters}',
    targetWaterLiters.toFixed(1)
  );

  const formattedLastWater =
    lastWaterIntakeAt !== null
      ? new Date(lastWaterIntakeAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : t('water_not_logged', language);

  const handleSleepBlur = () => {
    const parsed = parseFloat(sleepInput);
    if (Number.isNaN(parsed)) {
      setSleepHoursToday(null);
      return;
    }
    setSleepHoursToday(Math.max(0, Math.min(16, parsed)));
  };

  const renderSleepCard = () => (
    <Card className="p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-primary/15 p-2">
            <MoonStar className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{t('sleep_today_title', language)}</h3>
            <p className="text-sm text-muted-foreground">{t('sleep_today_hint', language)}</p>
          </div>
        </div>
        {sleepHoursToday !== null && (
          <div className="text-xs uppercase tracking-wider text-primary">
            {t('sleep_today_logged', language)} · {sleepHoursToday.toFixed(1)}h
          </div>
        )}
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          type="number"
          inputMode="decimal"
          step="0.5"
          min={0}
          max={16}
          placeholder={t('sleep_today_placeholder', language)}
          value={sleepInput}
          onChange={(e) => setSleepInput(e.target.value)}
          onBlur={handleSleepBlur}
          className="sm:max-w-[160px]"
        />
        <div className="text-xs text-muted-foreground">
          {profile.sleepHours
            ? `${t('sleep_today_logged', language)}: ${profile.sleepHours.toFixed(1)}h avg target`
            : ''}
        </div>
      </div>
    </Card>
  );

  const renderHydrationCard = () => (
    <Card className="p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-primary/15 p-2">
            <Droplets className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{t('water_reminder_title', language)}</h3>
            <p className="text-sm text-muted-foreground">{hydrationCopy}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={logWaterIntake}>
          {t('water_log_button', language)}
        </Button>
      </div>
      <div className="mt-3 text-xs text-muted-foreground">
        {t('water_last_logged', language)}: {formattedLastWater}
      </div>
    </Card>
  );

  const handleGenerateReport = async () => {
    if (!accessToken) {
      setError('Please sign in to generate reports');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const currentWeekWorkoutLogs = workoutLogs
        .filter((l) => l.week === currentWeek)
        .map((l) => ({ exerciseId: l.exerciseId, status: l.status }));

      const currentWeekMealLogs = mealLogs
        .filter((l) => l.week === currentWeek)
        .map((l) => ({ mealId: l.mealId, consumed: l.consumed }));

      const result = await generateWeeklyReport(
        {
          name: profile.name,
          language: profile.language,
          goal: profile.goal,
        },
        currentWeek,
        currentWeekWorkoutLogs,
        currentWeekMealLogs,
        accessToken
      );

      setWeeklyReport(result.report);
    } catch (err) {
      console.error('Error generating report:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  if (!isPremium) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b bg-background">
          <h2>{t('report', language)}</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
            {renderSleepCard()}
            {renderHydrationCard()}
            <Card className="p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto">
                <Crown className="w-10 h-10 text-white" />
              </div>

              <div className="space-y-2">
                <h3>{t('upgrade_premium', language)}</h3>
                <p className="text-muted-foreground">
                  {t('premium_desc', language)}
                </p>
              </div>

              <div className="space-y-2 text-left text-sm">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>AI-powered weekly reports in your dialect</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>Adaptive workout plans based on your feedback</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>Progressive overload tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>Advanced progress analytics</span>
                </div>
              </div>

              <Button size="lg" className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                {t('upgrade', language)}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-background">
        <div className="flex items-center justify-between">
          <h2>{t('weekly_report', language)}</h2>
          <div className="flex items-center gap-2 text-sm">
            <Crown className="w-4 h-4 text-yellow-500" />
            <span className="text-muted-foreground">{t('premium_tier', language)}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {renderSleepCard()}
          {renderHydrationCard()}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3>
                {t('week', language)} {currentWeek}
              </h3>
              <Button
                onClick={handleGenerateReport}
                disabled={loading}
                size="sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Report
                  </>
                )}
              </Button>
            </div>

            {error && (
              <div className="p-4 bg-destructive/10 text-destructive rounded-lg mb-4">
                {error}
              </div>
            )}

            {weeklyReport ? (
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap leading-relaxed">{weeklyReport}</p>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Click "Generate Report" to get your personalized AI coaching feedback
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
