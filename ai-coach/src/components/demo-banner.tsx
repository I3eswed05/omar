import { useState } from 'react';
import { Info, X } from 'lucide-react';

export function DemoBanner() {
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem('demoBannerDismissed') === 'true';
  });

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('demoBannerDismissed', 'true');
  };

  if (isDismissed) return null;

  return (
    <div className="bg-blue-50 dark:bg-blue-950 border-b border-blue-200 dark:border-blue-800 px-4 py-3">
      <div className="flex items-center justify-between gap-3 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Demo Mode:</strong> Using sample workout and meal plans. Connect your OpenAI API key to generate personalized AI plans.
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 shrink-0"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
