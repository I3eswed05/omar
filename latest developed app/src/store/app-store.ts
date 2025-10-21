import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language } from '../lib/i18n';

export type Experience = 'beginner' | 'intermediate' | 'advanced';
export type Goal = 'build_muscle' | 'lose_fat' | 'maintain' | 'recomp';
export type DietType = 'standard' | 'keto' | 'vegetarian' | 'halal';
export type Gender = 'male' | 'female';

export interface UserProfile {
  name: string;
  age: number;
  gender: Gender;
  height: number;
  weight: number;
  experience: Experience;
  goal: Goal;
  dietType: DietType;
  country: string;
  language: Language;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number[];
  restSec: number;
  targetWeightKg?: number;
  videoUrl?: string;
}

export interface WorkoutDay {
  day: string;
  exercises: Exercise[];
  isRestDay?: boolean;
}

export interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  ingredients: string[];
}

export interface MealDay {
  day: string;
  meals: Meal[];
}

export interface WorkoutLog {
  exerciseId: string;
  week: number;
  day: string;
  status: 'completed' | 'skipped' | 'too_easy' | 'too_hard';
  date: string;
}

export interface MealLog {
  mealId: string;
  week: number;
  day: string;
  consumed: boolean;
  date: string;
}

interface AppState {
  // Auth
  userId: string | null;
  accessToken: string | null;
  setAuth: (userId: string | null, accessToken: string | null) => void;
  
  // User profile
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  
  // Onboarding
  hasCompletedOnboarding: boolean;
  setOnboardingComplete: (complete: boolean) => void;
  
  // Plans
  currentWeek: number;
  workoutPlan: WorkoutDay[];
  mealPlan: MealDay[];
  setPlans: (workoutPlan: WorkoutDay[], mealPlan: MealDay[], week: number) => void;
  
  // Logs
  workoutLogs: WorkoutLog[];
  mealLogs: MealLog[];
  addWorkoutLog: (log: WorkoutLog) => void;
  addMealLog: (log: MealLog) => void;
  
  // Tier
  isPremium: boolean;
  setPremium: (premium: boolean) => void;
  
  // Weekly report
  weeklyReport: string | null;
  setWeeklyReport: (report: string) => void;
  
  // UI
  selectedDay: string;
  setSelectedDay: (day: string) => void;
  
  // Clear all data
  clearAll: () => void;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Auth
      userId: null,
      accessToken: null,
      setAuth: (userId, accessToken) => set({ userId, accessToken }),
      
      // Profile
      profile: null,
      setProfile: (profile) => set({ profile }),
      
      // Onboarding
      hasCompletedOnboarding: false,
      setOnboardingComplete: (complete) => set({ hasCompletedOnboarding: complete }),
      
      // Plans
      currentWeek: 1,
      workoutPlan: [],
      mealPlan: [],
      setPlans: (workoutPlan, mealPlan, week) => 
        set({ workoutPlan, mealPlan, currentWeek: week }),
      
      // Logs
      workoutLogs: [],
      mealLogs: [],
      addWorkoutLog: (log) => 
        set((state) => ({
          workoutLogs: [...state.workoutLogs.filter(
            l => !(l.exerciseId === log.exerciseId && l.week === log.week && l.day === log.day)
          ), log]
        })),
      addMealLog: (log) => 
        set((state) => ({
          mealLogs: [...state.mealLogs.filter(
            l => !(l.mealId === log.mealId && l.week === log.week && l.day === log.day)
          ), log]
        })),
      
      // Tier
      isPremium: false,
      setPremium: (premium) => set({ isPremium: premium }),
      
      // Report
      weeklyReport: null,
      setWeeklyReport: (report) => set({ weeklyReport: report }),
      
      // UI
      selectedDay: DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1],
      setSelectedDay: (day) => set({ selectedDay: day }),
      
      // Clear
      clearAll: () => set({
        userId: null,
        accessToken: null,
        profile: null,
        hasCompletedOnboarding: false,
        currentWeek: 1,
        workoutPlan: [],
        mealPlan: [],
        workoutLogs: [],
        mealLogs: [],
        isPremium: false,
        weeklyReport: null,
      }),
    }),
    {
      name: 'fitness-coach-storage',
    }
  )
);
