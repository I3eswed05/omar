# 🏋️ Fitness & Nutrition AI Coach

A comprehensive web PWA for personalized fitness and nutrition coaching powered by AI. Supports Arabic dialects and features adaptive workout and meal plans.

## ✨ Features

### Core Functionality
- 🤖 **AI-Powered Plans**: Weekly workout and meal plans generated using OpenAI GPT-4
- 🌍 **Multi-Language**: Full Arabic RTL support with 4 dialects (Gulf, Egyptian, Levant, Maghrebi) + English
- 📱 **PWA Support**: Installable as a mobile app with offline capabilities
- 📊 **Progress Tracking**: Visual adherence tracking, streaks, and weekly analytics
- 🎥 **Video Tutorials**: Exercise demonstrations with video playback
- 📝 **Workout & Meal Logging**: Track completion, difficulty, and adherence

### Onboarding Flow
1. Welcome screen with Arabic/English support
2. Country selection (auto-detects dialect)
3. Profile setup (name, age, gender)
4. Body metrics (height, weight)
5. Experience level (beginner/intermediate/advanced)
6. Goal selection (build muscle, lose fat, maintain, recomp)
7. Diet preferences (standard, keto, vegetarian, halal)

### Main App Screens
- **Workouts**: 7-day workout plan with exercise details and logging
- **Meals**: Daily meal plans with macros and ingredient lists
- **Progress**: Adherence rings, streak tracking, weekly charts
- **Report**: AI-generated weekly feedback (Premium feature)

### Premium Features
- 🎯 Adaptive plans based on workout feedback
- 📈 Progressive overload recommendations
- 💬 Weekly AI reports in user's dialect
- 📉 Advanced analytics and charts

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand (persisted)
- **Backend**: Supabase (Auth + Database + Edge Functions)
- **AI**: OpenAI GPT-4 API
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **PWA**: Service Worker + Manifest

## 🚀 Getting Started

### Prerequisites

You need:
1. A Supabase project (already connected in this environment)
2. An OpenAI API key

### Environment Setup

The following environment variables are already configured:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side only)

**OpenAI API Key (Optional)**:
- `OPENAI_API_KEY` - Your OpenAI API key for AI-powered plan generation
- If not provided or quota exceeded, the app automatically uses demo plans
- Demo plans are fully functional and showcase all app features

### Installation

No installation needed! The app is ready to run in this environment.

### Running the App

The app should be running automatically. If not, it will start when you interact with the preview.

## 📖 How to Use

### First Time Setup
1. Open the app - you'll see the Arabic welcome screen
2. Select your country (this determines your Arabic dialect)
3. Complete the onboarding steps:
   - Enter your profile information
   - Add your body metrics
   - Choose your fitness experience level
   - Select your goal
   - Pick your diet preference
4. Wait while AI generates your personalized plans
5. Start logging workouts and meals!

### Daily Usage
- **Track Workouts**: Navigate to Workouts tab, select a day, and log each exercise
  - Mark as: Completed ✓, Skipped, Too Easy, or Too Hard
  - Watch exercise videos for proper form
- **Track Meals**: Go to Meals tab and mark meals as consumed or skipped
- **View Progress**: Check Progress tab for adherence percentages and streaks
- **Get Reports**: Premium users can generate weekly AI reports in their dialect

### Arabic Language Support
The app automatically:
- Sets RTL (right-to-left) direction for Arabic
- Uses the appropriate dialect based on your country
- Falls back to Modern Standard Arabic → English if needed

Supported dialects:
- **Gulf** (ar-Gulf): Saudi Arabia, UAE, Kuwait, Qatar, Bahrain, Oman
- **Egyptian** (ar-EG): Egypt
- **Levantine** (ar-Levant): Jordan, Lebanon, Syria, Palestine, Iraq
- **Maghrebi** (ar-Maghreb): Morocco, Algeria, Tunisia, Libya

## 🔧 Configuration

### AI Plan Generation
The AI uses your profile to generate:
- **Workouts**: 5-6 training days + 1-2 rest days per week
- **Meals**: 3 main meals + 1-2 snacks per day
- **Safety**: Minimum 1500 calories, respects diet restrictions

### Diet Types
- **Standard**: Balanced macros
- **Keto**: Max 50g carbs/day, high fat
- **Vegetarian**: No meat
- **Halal**: No pork, no alcohol

### Demo Mode
The app automatically uses demo plans when:
- No OpenAI API key is provided
- The OpenAI API key has insufficient quota/credits
- The AI generation fails for any reason

Demo plans include:
- ✅ Full 7-day workout plan with 5-6 training days
- ✅ Complete meal plans with macros and ingredients
- ✅ All logging and tracking features
- ✅ Progress charts and streak tracking
- ✅ Fully functional app experience

The demo mode is indicated by a blue banner at the top of the app that can be dismissed.

## 📱 PWA Installation

### iOS (Safari)
1. Open the app in Safari
2. Tap the Share button
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add"

### Android (Chrome)
1. Open the app in Chrome
2. Tap the menu (three dots)
3. Tap "Add to Home screen"
4. Tap "Add"

### Desktop (Chrome/Edge)
1. Look for the install icon in the address bar
2. Click "Install"

## 🏗️ Project Structure

```
/
├── App.tsx                    # Main app component with routing
├── components/
│   ├── onboarding/           # Onboarding flow screens
│   │   ├── WelcomeScreen.tsx
│   │   ├── CountrySelectScreen.tsx
│   │   └── OnboardingScreen.tsx
│   ├── home/                 # Main app screens
│   │   ├── WorkoutsScreen.tsx
│   │   ├── MealsScreen.tsx
│   │   ├── ProgressScreen.tsx
│   │   └── ReportScreen.tsx
│   ├── workout-card.tsx      # Exercise display & logging
│   ├── meal-card.tsx         # Meal display & logging
│   ├── video-player.tsx      # Video modal
│   ├── progress-ring.tsx     # Circular progress indicator
│   ├── bottom-nav.tsx        # Bottom navigation
│   └── ui/                   # shadcn components
├── lib/
│   ├── supabase.ts          # Supabase client
│   ├── api.ts               # API functions
│   ├── i18n.ts              # Translations & dialects
│   └── demo-data.ts         # Fallback demo plans
├── store/
│   └── app-store.ts         # Zustand state management
├── supabase/functions/server/
│   └── index.tsx            # Edge function with AI endpoints
├── public/
│   ├── manifest.json        # PWA manifest
│   └── sw.js                # Service worker
└── styles/
    └── globals.css          # Global styles + RTL support
```

## 🔐 Security Notes

⚠️ **Important**: This is a prototype application. For production use:
1. Implement proper user authentication with Supabase Auth
2. Set up Row Level Security (RLS) policies on Supabase tables
3. Add rate limiting to AI endpoints
4. Validate and sanitize all user inputs
5. Review data privacy compliance (GDPR, etc.)
6. Do not store sensitive health data without proper encryption

## 🐛 Troubleshooting

### Plans won't generate
- Check that your OpenAI API key is valid and has credits
- Check the browser console for errors
- Try using demo plans instead

### Arabic text not displaying correctly
- Ensure your browser supports Arabic fonts
- Check that the country was selected correctly

### PWA not installing
- Ensure you're using HTTPS
- Check that manifest.json is accessible
- Try a different browser

## 📄 License

This project is a prototype for demonstration purposes.

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- Supabase for backend infrastructure
- shadcn/ui for beautiful components
- Tailwind CSS for styling
