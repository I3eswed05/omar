import { useEffect, useState } from 'react';
import { Bot, Sparkles, X } from 'lucide-react';
import { useAppStore } from '../store/app-store';
import { Language, t } from '../lib/i18n';

interface ChatMentorTeaserProps {
  language: Language;
}

export function ChatMentorTeaser({ language }: ChatMentorTeaserProps) {
  const isPremium = useAppStore((state) => state.isPremium);
  const [isOpen, setIsOpen] = useState(false);
  const [hasSeenMessage, setHasSeenMessage] = useState(false);

  useEffect(() => {
    if (!isPremium) return;

    const stored = localStorage.getItem('mentorTeaserSeen');
    if (!stored) {
      setIsOpen(true);
      return;
    }
    setHasSeenMessage(true);
  }, [isPremium]);

  if (!isPremium) return null;

  const handleToggle = () => {
    if (!hasSeenMessage) {
      localStorage.setItem('mentorTeaserSeen', 'true');
      setHasSeenMessage(true);
    }
    setIsOpen((prev) => !prev);
  };

  const handleDismiss = () => {
    localStorage.setItem('mentorTeaserSeen', 'true');
    setHasSeenMessage(true);
    setIsOpen(false);
  };

  return (
    <div className="pointer-events-none fixed bottom-32 right-4 z-40 flex flex-col items-end gap-3 sm:bottom-36">
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-label={`${t('mentor_teaser_title', language)} teaser`}
        className="pointer-events-auto group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary via-primary to-secondary text-primary-foreground shadow-2xl transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/60"
      >
        <Bot className="h-6 w-6 drop-shadow-md" />
        {!hasSeenMessage && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
          </span>
        )}
      </button>

      {isOpen && (
        <div className="pointer-events-auto max-w-xs rounded-2xl border border-border/60 bg-card/95 p-4 shadow-2xl backdrop-blur-lg">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1 space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold leading-tight text-foreground">
                  {t('mentor_teaser_title', language)}
                </h3>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {t('mentor_teaser_exclusive', language)}
                </span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {t('mentor_teaser_subtitle', language)}
              </p>
              <p className="text-xs font-medium uppercase tracking-wide text-secondary-foreground/80">
                {t('mentor_teaser_cta', language)}
              </p>
            </div>
            <button
              type="button"
              onClick={handleDismiss}
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Dismiss mentor teaser"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
