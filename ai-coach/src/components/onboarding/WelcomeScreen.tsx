import { Dumbbell } from 'lucide-react';
import { Button } from '../ui/button';
import { t } from '../../lib/i18n';
import { useAppStore } from '../../store/app-store';

interface WelcomeScreenProps {
  onNext: () => void;
}

export function WelcomeScreen({ onNext }: WelcomeScreenProps) {
  const { profile } = useAppStore();
  const lang = profile?.language || 'ar-Gulf';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-50 to-green-100">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center">
            <Dumbbell className="w-12 h-12 text-white" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-4xl">{t('welcome_title', lang)}</h1>
          <p className="text-muted-foreground text-lg">{t('welcome_subtitle', lang)}</p>
        </div>
        
        <Button 
          onClick={onNext}
          size="lg"
          className="w-full text-lg h-14"
        >
          {t('get_started', lang)}
        </Button>
      </div>
    </div>
  );
}
