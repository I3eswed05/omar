import { useState } from 'react';
import { Button } from '../ui/button';
import { t, COUNTRIES, Language } from '../../lib/i18n';
import { useAppStore } from '../../store/app-store';

interface CountrySelectScreenProps {
  onNext: (country: string, language: Language) => void;
}

export function CountrySelectScreen({ onNext }: CountrySelectScreenProps) {
  const { profile } = useAppStore();
  const lang = profile?.language || 'ar-Gulf';
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedCountry) {
      const country = COUNTRIES.find(c => c.code === selectedCountry);
      if (country) {
        onNext(country.code, country.lang);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-6 bg-background">
      <div className="max-w-2xl w-full mx-auto space-y-6 flex-1">
        <div className="space-y-2 text-center pt-8">
          <h1>{t('select_country', lang)}</h1>
          <p className="text-muted-foreground">{t('country_subtitle', lang)}</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {COUNTRIES.map((country) => (
            <button
              key={country.code}
              onClick={() => setSelectedCountry(country.code)}
              className={`
                p-4 rounded-lg border-2 transition-all
                ${selectedCountry === country.code 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
                }
              `}
            >
              <div className="text-3xl mb-2">{country.flag}</div>
              <div className="text-sm">{country.name}</div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="max-w-2xl w-full mx-auto pt-6">
        <Button
          onClick={handleContinue}
          disabled={!selectedCountry}
          size="lg"
          className="w-full"
        >
          {t('continue', lang)}
        </Button>
      </div>
    </div>
  );
}
