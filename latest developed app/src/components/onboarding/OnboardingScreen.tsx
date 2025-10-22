import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { t, Language } from '../../lib/i18n';
import { UserProfile, Experience, Goal, DietType, Gender } from '../../store/app-store';
import { Loader2 } from 'lucide-react';

interface OnboardingScreenProps {
  country: string;
  language: Language;
  onComplete: (profile: UserProfile) => void;
}

export function OnboardingScreen({ country, language, onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'male' as Gender,
    height: '',
    weight: '',
    experience: 'beginner' as Experience,
    goal: 'build_muscle' as Goal,
    dietType: 'standard' as DietType,
  });

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    const profile: UserProfile = {
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender,
      height: parseInt(formData.height),
      weight: parseInt(formData.weight),
      experience: formData.experience,
      goal: formData.goal,
      dietType: formData.dietType,
      country,
      language,
    };
    
    // Simulate a delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onComplete(profile);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return formData.name.length > 0 && formData.age.length > 0;
      case 2: return formData.height.length > 0 && formData.weight.length > 0;
      case 3: return true;
      case 4: return true;
      case 5: return true;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-6 bg-background">
      <div className="max-w-xl w-full mx-auto space-y-6 flex-1">
        {/* Progress bar */}
        <div className="pt-4">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i <= step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Profile */}
        {step === 1 && (
          <div className="space-y-6 pt-8">
            <h2>{t('profile_title', language)}</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t('whats_your_name', language)}</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t('name_placeholder', language)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('age', language)}</Label>
                  <Input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="25"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>{t('gender', language)}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setFormData({ ...formData, gender: 'male' })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.gender === 'male'
                          ? 'border-primary bg-primary/5'
                          : 'border-border'
                      }`}
                    >
                      {t('male', language)}
                    </button>
                    <button
                      onClick={() => setFormData({ ...formData, gender: 'female' })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.gender === 'female'
                          ? 'border-primary bg-primary/5'
                          : 'border-border'
                      }`}
                    >
                      {t('female', language)}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Body Metrics */}
        {step === 2 && (
          <div className="space-y-6 pt-8">
            <h2>{t('body_title', language)}</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('height', language)}</Label>
                <Input
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  placeholder="175"
                />
              </div>
              
              <div className="space-y-2">
                <Label>{t('weight', language)}</Label>
                <Input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="75"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Experience */}
        {step === 3 && (
          <div className="space-y-6 pt-8">
            <h2>{t('experience_title', language)}</h2>
            
            <div className="space-y-3">
              {(['beginner', 'intermediate', 'advanced'] as Experience[]).map((level) => (
                <button
                  key={level}
                  onClick={() => setFormData({ ...formData, experience: level })}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    formData.experience === level
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className={formData.experience === level ? 'text-primary' : ''}>
                      {t(level, language)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t(`${level}_desc`, language)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Goal */}
        {step === 4 && (
          <div className="space-y-6 pt-8">
            <h2>{t('goal_title', language)}</h2>
            
            <div className="grid grid-cols-2 gap-3">
              {(['build_muscle', 'lose_fat', 'maintain', 'recomp'] as Goal[]).map((goalType) => (
                <button
                  key={goalType}
                  onClick={() => setFormData({ ...formData, goal: goalType })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.goal === goalType
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {t(goalType, language)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Diet */}
        {step === 5 && (
          <div className="space-y-6 pt-8">
            <h2>{t('diet_title', language)}</h2>
            
            <div className="grid grid-cols-2 gap-3">
              {(['standard', 'keto', 'vegetarian', 'halal'] as DietType[]).map((diet) => (
                <button
                  key={diet}
                  onClick={() => setFormData({ ...formData, dietType: diet })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.dietType === diet
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {t(diet, language)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="max-w-xl w-full mx-auto space-y-3 pt-6">
        <Button
          onClick={handleNext}
          disabled={!canProceed() || loading}
          size="lg"
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t('generating_plans', language)}
            </>
          ) : (
            t('continue', language)
          )}
        </Button>
        
        {step > 1 && !loading && (
          <Button
            onClick={() => setStep(step - 1)}
            variant="outline"
            size="lg"
            className="w-full"
          >
            {t('back', language)}
          </Button>
        )}
      </div>
    </div>
  );
}
