import { Dumbbell, Sparkles, UtensilsCrossed, TrendingUp, FileText } from 'lucide-react';
import { t, Language } from '../lib/i18n';

interface BottomNavProps {
  activeTab: 'workouts' | 'calisthenics' | 'meals' | 'progress' | 'report';
  onTabChange: (tab: 'workouts' | 'calisthenics' | 'meals' | 'progress' | 'report') => void;
  language: Language;
}

export function BottomNav({ activeTab, onTabChange, language }: BottomNavProps) {
  const tabs = [
    { id: 'workouts' as const, icon: Dumbbell, label: t('workouts', language) },
    { id: 'calisthenics' as const, icon: Sparkles, label: t('calisthenics', language) },
    { id: 'meals' as const, icon: UtensilsCrossed, label: t('meals', language) },
    { id: 'progress' as const, icon: TrendingUp, label: t('progress', language) },
    { id: 'report' as const, icon: FileText, label: t('report', language) },
  ];

  return (
    <nav className="border-t bg-background">
      <div className="flex">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex-1 flex flex-col items-center gap-1 py-3 transition-colors
                ${isActive ? 'text-primary' : 'text-muted-foreground'}
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
