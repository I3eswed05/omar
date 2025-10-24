import { useState, useEffect } from 'react';
import { X, Lightbulb } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { t, Language } from '../lib/i18n';

interface QuickTipsProps {
  language: Language;
}

export function QuickTips({ language }: QuickTipsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasSeenTips, setHasSeenTips] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('hasSeenQuickTips');
    if (!seen) {
      setIsVisible(true);
    } else {
      setHasSeenTips(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setHasSeenTips(true);
    localStorage.setItem('hasSeenQuickTips', 'true');
  };

  if (!isVisible && hasSeenTips) return null;

  return (
    <>
      {/* Floating button to reopen */}
      {!isVisible && (
        <button
          onClick={() => setIsVisible(true)}
          className="fixed bottom-20 right-4 z-30 w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        >
          <Lightbulb className="w-5 h-5" />
        </button>
      )}

      {/* Tips modal */}
      {isVisible && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-background p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-primary" />
                <h3>Quick Tips</h3>
              </div>
              <button
                onClick={handleClose}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <p><strong>📋 Log Your Workouts:</strong> Mark each exercise as completed, skipped, too easy, or too hard. This helps the AI adapt your plan!</p>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <p><strong>🍽️ Track Your Meals:</strong> Log which meals you consumed. Consistency is key to reaching your goals!</p>
              </div>

              <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <p><strong>📊 Check Your Progress:</strong> View your adherence and streaks in the Progress tab. Keep that streak going!</p>
              </div>

              <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                <p><strong>👑 Premium Features:</strong> Toggle premium in Settings to try AI weekly reports and adaptive plans.</p>
              </div>

              <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                <p><strong>🎥 Watch Videos:</strong> Click the play button on exercises to see tutorial videos (when available).</p>
              </div>
            </div>

            <Button onClick={handleClose} className="w-full">
              Got it! Let's start
            </Button>
          </Card>
        </div>
      )}
    </>
  );
}
