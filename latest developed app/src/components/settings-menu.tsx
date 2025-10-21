import { useState } from 'react';
import { Settings, Crown, LogOut, User, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useAppStore } from '../store/app-store';
import { t } from '../lib/i18n';

interface SettingsMenuProps {
  onRegeneratePlans?: () => void;
}

export function SettingsMenu({ onRegeneratePlans }: SettingsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { profile, isPremium, setPremium, clearAll } = useAppStore();

  if (!profile) return null;

  const handleSignOut = () => {
    if (confirm('Are you sure you want to sign out? This will clear all your data.')) {
      clearAll();
      window.location.reload();
    }
  };

  const handleRegenerate = () => {
    if (onRegeneratePlans) {
      setIsOpen(false);
      onRegeneratePlans();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-muted rounded-lg transition-colors"
      >
        <Settings className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4">
          <Card className="w-full max-w-md bg-background p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3>Settings</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {/* Profile info */}
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <User className="w-8 h-8" />
                  <div>
                    <div>{profile.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {profile.age} years • {profile.height}cm • {profile.weight}kg
                    </div>
                  </div>
                </div>
              </div>

              {/* Premium toggle (for testing) */}
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-yellow-500" />
                    <span>{t(isPremium ? 'premium_tier' : 'free_tier', profile.language)}</span>
                  </div>
                  <button
                    onClick={() => setPremium(!isPremium)}
                    className={`
                      px-3 py-1 rounded text-sm transition-colors
                      ${isPremium 
                        ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                        : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                      }
                    `}
                  >
                    {isPremium ? 'Premium' : 'Toggle Premium'}
                  </button>
                </div>
                {!isPremium && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Click to enable premium features for testing
                  </p>
                )}
              </div>

              {/* App info */}
              <div className="text-sm text-muted-foreground">
                <div>Language: {profile.language}</div>
                <div>Country: {profile.country}</div>
                <div>Goal: {t(profile.goal, profile.language)}</div>
                <div>Diet: {t(profile.dietType, profile.language)}</div>
              </div>

              {/* Regenerate plans */}
              {onRegeneratePlans && (
                <Button
                  onClick={handleRegenerate}
                  variant="outline"
                  className="w-full"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try AI Plans Again
                </Button>
              )}

              {/* Sign out */}
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="w-full"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {t('sign_out', profile.language)}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
