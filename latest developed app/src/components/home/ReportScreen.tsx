import { useState } from 'react';
import { useAppStore } from '../../store/app-store';
import { t } from '../../lib/i18n';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { generateWeeklyReport } from '../../lib/api';
import { Crown, Loader2, Sparkles } from 'lucide-react';

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
  } = useAppStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!profile) return null;

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
          <h2>{t('report', profile.language)}</h2>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="p-8 max-w-md text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto">
              <Crown className="w-10 h-10 text-white" />
            </div>

            <div className="space-y-2">
              <h3>{t('upgrade_premium', profile.language)}</h3>
              <p className="text-muted-foreground">
                {t('premium_desc', profile.language)}
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
              {t('upgrade', profile.language)}
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-background">
        <div className="flex items-center justify-between">
          <h2>{t('weekly_report', profile.language)}</h2>
          <div className="flex items-center gap-2 text-sm">
            <Crown className="w-4 h-4 text-yellow-500" />
            <span className="text-muted-foreground">{t('premium_tier', profile.language)}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3>
                {t('week', profile.language)} {currentWeek}
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
