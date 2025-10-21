import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { z } from 'npm:zod';

const app = new Hono();

// Middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

app.use('*', logger(console.log));

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Schemas
const GeneratePlansSchema = z.object({
  profile: z.object({
    name: z.string(),
    age: z.number(),
    gender: z.enum(['male', 'female']),
    height: z.number(),
    weight: z.number(),
    experience: z.enum(['beginner', 'intermediate', 'advanced']),
    goal: z.enum(['build_muscle', 'lose_fat', 'maintain', 'recomp']),
    dietType: z.enum(['standard', 'keto', 'vegetarian', 'halal']),
    country: z.string(),
    language: z.string(),
  }),
  week: z.number().default(1),
});

const WeeklyReportSchema = z.object({
  profile: z.object({
    name: z.string(),
    language: z.string(),
    goal: z.string(),
  }),
  week: z.number(),
  workoutLogs: z.array(z.object({
    exerciseId: z.string(),
    status: z.string(),
  })),
  mealLogs: z.array(z.object({
    mealId: z.string(),
    consumed: z.boolean(),
  })),
});

// Helper: Generate AI plans
async function generatePlans(input: z.infer<typeof GeneratePlansSchema>) {
  const { profile, week } = input;
  
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openaiApiKey) {
    throw new Error('OPENAI_API_KEY environment variable not set');
  }

  // Build prompt based on profile
  const prompt = `You are a professional fitness and nutrition coach. Generate a 7-day workout and meal plan.

Profile:
- Name: ${profile.name}
- Age: ${profile.age}, Gender: ${profile.gender}
- Height: ${profile.height}cm, Weight: ${profile.weight}kg
- Experience: ${profile.experience}
- Goal: ${profile.goal}
- Diet: ${profile.dietType}
- Week: ${week}

Requirements:
1. Workout plan: 5-6 training days + 1-2 rest days
2. For ${profile.experience} level, use appropriate volume and intensity
3. For ${profile.goal} goal, structure workouts accordingly
4. Each exercise needs: name, sets, reps range, rest seconds, target weight in kg
5. Meal plan: 3 main meals + 1-2 snacks per day
6. Follow ${profile.dietType} diet (Keto: max 50g carbs/day, Halal: no pork/alcohol, Vegetarian: no meat)
7. Ensure minimum 1500 calories per day
8. Calculate macros: protein, carbs, fats (in grams)

Return ONLY valid JSON with this exact structure (no markdown, no explanations):
{
  "workout": {
    "week": ${week},
    "days": [
      {
        "day": "Mon",
        "exercises": [
          {
            "id": "unique-id",
            "name": "Exercise Name",
            "sets": 4,
            "reps": [8, 10],
            "restSec": 90,
            "targetWeightKg": 60
          }
        ]
      },
      {
        "day": "Tue",
        "isRestDay": true,
        "exercises": []
      }
    ]
  },
  "meals": {
    "week": ${week},
    "days": [
      {
        "day": "Mon",
        "meals": [
          {
            "id": "unique-id",
            "name": "Meal Name",
            "type": "breakfast",
            "calories": 500,
            "protein": 30,
            "carbs": 50,
            "fats": 15,
            "ingredients": ["ingredient1", "ingredient2"]
          }
        ]
      }
    ]
  }
}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional fitness and nutrition AI coach. Always respond with valid JSON only.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const plans = JSON.parse(content);

    return plans;
  } catch (error) {
    console.error('Error generating plans:', error);
    throw error;
  }
}

// Helper: Generate weekly report
async function generateWeeklyReport(input: z.infer<typeof WeeklyReportSchema>) {
  const { profile, week, workoutLogs, mealLogs } = input;
  
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openaiApiKey) {
    throw new Error('OPENAI_API_KEY environment variable not set');
  }

  const workoutAdherence = workoutLogs.filter(l => l.status === 'completed').length / Math.max(workoutLogs.length, 1) * 100;
  const mealAdherence = mealLogs.filter(l => l.consumed).length / Math.max(mealLogs.length, 1) * 100;
  const tooHard = workoutLogs.filter(l => l.status === 'too_hard').length;
  const tooEasy = workoutLogs.filter(l => l.status === 'too_easy').length;

  // Determine dialect instruction
  let dialectInstruction = 'Standard Modern Arabic';
  if (profile.language === 'ar-Gulf') {
    dialectInstruction = 'Gulf Arabic dialect (Saudi/UAE style)';
  } else if (profile.language === 'ar-EG') {
    dialectInstruction = 'Egyptian Arabic dialect';
  } else if (profile.language === 'ar-Levant') {
    dialectInstruction = 'Levantine Arabic dialect (Syrian/Lebanese/Jordanian style)';
  } else if (profile.language === 'ar-Maghreb') {
    dialectInstruction = 'Maghrebi Arabic dialect (Moroccan/Algerian style)';
  } else if (profile.language === 'en') {
    dialectInstruction = 'English';
  }

  const prompt = `You are a supportive fitness coach. Write a friendly, motivational weekly report for ${profile.name}.

Week: ${week}
Goal: ${profile.goal}
Workout Adherence: ${workoutAdherence.toFixed(0)}%
Meal Adherence: ${mealAdherence.toFixed(0)}%
Exercises Too Hard: ${tooHard}
Exercises Too Easy: ${tooEasy}

Write in ${dialectInstruction}. Keep it to 3-4 sentences. Be encouraging, specific about their progress, and give ONE actionable tip for next week.

Return ONLY valid JSON:
{
  "report": "Your report text here"
}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a friendly, motivational fitness coach who speaks in the user\'s dialect.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const result = JSON.parse(content);

    return result;
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
}

// Routes
app.post('/make-server-4e345e61/api/ai/generate-plans', async (c) => {
  try {
    const body = await c.req.json();
    const validated = GeneratePlansSchema.parse(body);
    
    console.log('Generating plans for:', validated.profile.name);
    
    const plans = await generatePlans(validated);
    
    return c.json(plans);
  } catch (error) {
    console.error('Error in generate-plans endpoint:', error);
    
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Invalid request data', details: error.errors }, 400);
    }
    
    return c.json({ 
      error: 'Failed to generate plans', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    }, 500);
  }
});

app.post('/make-server-4e345e61/api/ai/weekly-report', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken || accessToken === Deno.env.get('SUPABASE_ANON_KEY')) {
      return c.json({ error: 'Unauthorized - Premium feature requires authentication' }, 401);
    }
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized - Invalid token' }, 401);
    }
    
    const body = await c.req.json();
    const validated = WeeklyReportSchema.parse(body);
    
    console.log('Generating report for:', validated.profile.name);
    
    const result = await generateWeeklyReport(validated);
    
    return c.json(result);
  } catch (error) {
    console.error('Error in weekly-report endpoint:', error);
    
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Invalid request data', details: error.errors }, 400);
    }
    
    return c.json({ 
      error: 'Failed to generate report', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    }, 500);
  }
});

app.get('/make-server-4e345e61/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);
