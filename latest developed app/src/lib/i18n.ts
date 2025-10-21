export type Language = 'en' | 'ar-Gulf' | 'ar-EG' | 'ar-Levant' | 'ar-Maghreb';

export const COUNTRIES = [
  { code: 'SA', name: 'Saudi Arabia', lang: 'ar-Gulf' as Language, flag: '🇸🇦' },
  { code: 'AE', name: 'UAE', lang: 'ar-Gulf' as Language, flag: '🇦🇪' },
  { code: 'KW', name: 'Kuwait', lang: 'ar-Gulf' as Language, flag: '🇰🇼' },
  { code: 'QA', name: 'Qatar', lang: 'ar-Gulf' as Language, flag: '🇶🇦' },
  { code: 'BH', name: 'Bahrain', lang: 'ar-Gulf' as Language, flag: '🇧🇭' },
  { code: 'OM', name: 'Oman', lang: 'ar-Gulf' as Language, flag: '🇴🇲' },
  { code: 'EG', name: 'Egypt', lang: 'ar-EG' as Language, flag: '🇪🇬' },
  { code: 'JO', name: 'Jordan', lang: 'ar-Levant' as Language, flag: '🇯🇴' },
  { code: 'LB', name: 'Lebanon', lang: 'ar-Levant' as Language, flag: '🇱🇧' },
  { code: 'SY', name: 'Syria', lang: 'ar-Levant' as Language, flag: '🇸🇾' },
  { code: 'PS', name: 'Palestine', lang: 'ar-Levant' as Language, flag: '🇵🇸' },
  { code: 'IQ', name: 'Iraq', lang: 'ar-Levant' as Language, flag: '🇮🇶' },
  { code: 'MA', name: 'Morocco', lang: 'ar-Maghreb' as Language, flag: '🇲🇦' },
  { code: 'DZ', name: 'Algeria', lang: 'ar-Maghreb' as Language, flag: '🇩🇿' },
  { code: 'TN', name: 'Tunisia', lang: 'ar-Maghreb' as Language, flag: '🇹🇳' },
  { code: 'LY', name: 'Libya', lang: 'ar-Maghreb' as Language, flag: '🇱🇾' },
  { code: 'US', name: 'United States', lang: 'en' as Language, flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', lang: 'en' as Language, flag: '🇬🇧' },
];

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Welcome
    welcome_title: 'Welcome to AI Fitness Coach',
    welcome_subtitle: 'Your personalized workout and nutrition companion',
    get_started: 'Get Started',
    
    // Country
    select_country: 'Select Your Country',
    country_subtitle: 'This helps us personalize your experience',
    continue: 'Continue',
    
    // Onboarding
    profile_title: 'Tell us about yourself',
    whats_your_name: "What's your name?",
    name_placeholder: 'Enter your name',
    age: 'Age',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    
    body_title: 'Body Metrics',
    height: 'Height (cm)',
    weight: 'Weight (kg)',
    
    experience_title: 'Fitness Experience',
    beginner: 'Beginner',
    beginner_desc: 'New to fitness',
    intermediate: 'Intermediate',
    intermediate_desc: '6-12 months experience',
    advanced: 'Advanced',
    advanced_desc: '1+ years experience',
    
    goal_title: 'What is your goal?',
    build_muscle: 'Build Muscle',
    lose_fat: 'Lose Fat',
    maintain: 'Maintain',
    recomp: 'Recomposition',
    
    diet_title: 'Dietary Preferences',
    standard: 'Standard',
    keto: 'Keto',
    vegetarian: 'Vegetarian',
    halal: 'Halal',
    
    generating_plans: 'Generating your personalized plans...',
    
    // Navigation
    workouts: 'Workouts',
    meals: 'Meals',
    progress: 'Progress',
    report: 'Report',
    
    // Workouts
    week: 'Week',
    rest_day: 'Rest Day',
    sets: 'sets',
    reps: 'reps',
    rest: 'rest',
    seconds: 's',
    kg: 'kg',
    watch_video: 'Watch Tutorial',
    log_workout: 'How was this exercise?',
    completed: 'Completed ✓',
    skipped: 'Skipped',
    too_easy: 'Too Easy',
    too_hard: 'Too Hard',
    
    // Meals
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snack: 'Snack',
    calories: 'kcal',
    protein: 'P',
    carbs: 'C',
    fats: 'F',
    mark_consumed: 'Mark as Consumed',
    mark_skipped: 'Mark as Skipped',
    
    // Progress
    workout_adherence: 'Workout Adherence',
    meal_adherence: 'Meal Adherence',
    current_streak: 'Current Streak',
    days: 'days',
    weekly_progress: 'Weekly Progress',
    
    // Report
    weekly_report: 'Weekly Report',
    upgrade_premium: 'Upgrade to Premium',
    premium_desc: 'Get AI-powered weekly reports and adaptive plans',
    
    // Tier
    free_tier: 'Free',
    premium_tier: 'Premium',
    upgrade: 'Upgrade',
    
    // Auth
    sign_in: 'Sign In',
    sign_up: 'Sign Up',
    sign_out: 'Sign Out',
    email: 'Email',
    password: 'Password',
    name: 'Name',
    
    // Errors
    error: 'Error',
    try_again: 'Try Again',
  },
  
  'ar-Gulf': {
    welcome_title: 'مرحباً في مدرب اللياقة الذكي',
    welcome_subtitle: 'برنامجك الشخصي للتمارين والتغذية',
    get_started: 'ابدأ الآن',
    
    select_country: 'اختر بلدك',
    country_subtitle: 'هذا يساعدنا نخصص تجربتك',
    continue: 'استمر',
    
    profile_title: 'عرفنا على نفسك',
    whats_your_name: 'شو اسمك؟',
    name_placeholder: 'اكتب اسمك',
    age: 'العمر',
    gender: 'الجنس',
    male: 'ذكر',
    female: 'أنثى',
    
    body_title: 'قياسات الجسم',
    height: 'الطول (سم)',
    weight: 'الوزن (كجم)',
    
    experience_title: 'خبرتك في اللياقة',
    beginner: 'مبتدئ',
    beginner_desc: 'جديد في اللياقة',
    intermediate: 'متوسط',
    intermediate_desc: 'عندك خبرة ٦-١٢ شهر',
    advanced: 'متقدم',
    advanced_desc: 'عندك خبرة سنة وأكثر',
    
    goal_title: 'شو هدفك؟',
    build_muscle: 'بناء العضلات',
    lose_fat: 'حرق الدهون',
    maintain: 'الحفاظ',
    recomp: 'إعادة التكوين',
    
    diet_title: 'نظامك الغذائي',
    standard: 'عادي',
    keto: 'كيتو',
    vegetarian: 'نباتي',
    halal: 'حلال',
    
    generating_plans: 'نجهز لك برامجك الشخصية...',
    
    workouts: 'التمارين',
    meals: 'الوجبات',
    progress: 'التقدم',
    report: 'التقرير',
    
    week: 'الأسبوع',
    rest_day: 'يوم راحة',
    sets: 'مجموعات',
    reps: 'تكرار',
    rest: 'راحة',
    seconds: 'ث',
    kg: 'كجم',
    watch_video: 'شاهد الشرح',
    log_workout: 'كيف كان التمرين؟',
    completed: 'مكتمل ✓',
    skipped: 'متروك',
    too_easy: 'سهل جداً',
    too_hard: 'صعب جداً',
    
    breakfast: 'الفطور',
    lunch: 'الغداء',
    dinner: 'العشاء',
    snack: 'وجبة خفيفة',
    calories: 'سعرة',
    protein: 'ب',
    carbs: 'ك',
    fats: 'د',
    mark_consumed: 'سجل كمأكول',
    mark_skipped: 'سجل كمتروك',
    
    workout_adherence: 'الالتزام بالتمارين',
    meal_adherence: 'الالتزام بالوجبات',
    current_streak: 'السلسلة الحالية',
    days: 'يوم',
    weekly_progress: 'التقدم الأسبوعي',
    
    weekly_report: 'التقرير الأسبوعي',
    upgrade_premium: 'ترقية للمميز',
    premium_desc: 'احصل على تقارير ذكية وبرامج متكيفة',
    
    free_tier: 'مجاني',
    premium_tier: 'مميز',
    upgrade: 'ترقية',
    
    sign_in: 'تسجيل الدخول',
    sign_up: 'إنشاء حساب',
    sign_out: 'تسجيل الخروج',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    name: 'الاسم',
    
    error: 'خطأ',
    try_again: 'حاول مرة أخرى',
  },
  
  'ar-EG': {
    welcome_title: 'أهلاً بيك في كوتش اللياقة الذكي',
    welcome_subtitle: 'برنامجك الشخصي للتمارين والأكل',
    get_started: 'ابدأ دلوقتي',
    
    select_country: 'اختار بلدك',
    country_subtitle: 'ده هيساعدنا نخصصلك التجربة',
    continue: 'كمل',
    
    profile_title: 'عرفنا على نفسك',
    whats_your_name: 'اسمك ايه؟',
    name_placeholder: 'اكتب اسمك',
    age: 'السن',
    gender: 'النوع',
    male: 'راجل',
    female: 'ست',
    
    body_title: 'قياسات الجسم',
    height: 'الطول (سم)',
    weight: 'الوزن (كجم)',
    
    experience_title: 'خبرتك في اللياقة',
    beginner: 'مبتدئ',
    beginner_desc: 'جديد في اللياقة',
    intermediate: 'متوسط',
    intermediate_desc: 'عندك خبرة من ٦ لـ١٢ شهر',
    advanced: 'متقدم',
    advanced_desc: 'عندك خبرة سنة وأكتر',
    
    goal_title: 'هدفك ايه؟',
    build_muscle: 'بناء عضلات',
    lose_fat: 'حرق دهون',
    maintain: 'المحافظة',
    recomp: 'إعادة التكوين',
    
    diet_title: 'نظامك الغذائي',
    standard: 'عادي',
    keto: 'كيتو',
    vegetarian: 'نباتي',
    halal: 'حلال',
    
    generating_plans: 'بنجهزلك برامجك الشخصية...',
    
    workouts: 'التمارين',
    meals: 'الوجبات',
    progress: 'التقدم',
    report: 'التقرير',
    
    week: 'الأسبوع',
    rest_day: 'يوم راحة',
    sets: 'مجموعات',
    reps: 'عدات',
    rest: 'راحة',
    seconds: 'ث',
    kg: 'كجم',
    watch_video: 'اتفرج على الشرح',
    log_workout: 'التمرين كان عامل ايه؟',
    completed: 'اتعمل ✓',
    skipped: 'متسيب',
    too_easy: 'سهل أوي',
    too_hard: 'صعب أوي',
    
    breakfast: 'الفطار',
    lunch: 'الغدا',
    dinner: 'العشا',
    snack: 'سناك',
    calories: 'سعرة',
    protein: 'ب',
    carbs: 'ك',
    fats: 'د',
    mark_consumed: 'سجل كمأكول',
    mark_skipped: 'سجل كمتسيب',
    
    workout_adherence: 'الالتزام بالتمارين',
    meal_adherence: 'الالتزام بالأكل',
    current_streak: 'السلسلة دلوقتي',
    days: 'يوم',
    weekly_progress: 'التقدم الأسبوعي',
    
    weekly_report: 'التقرير الأسبوعي',
    upgrade_premium: 'ارتقي للمميز',
    premium_desc: 'اجيب تقارير ذكية وبرامج متكيفة',
    
    free_tier: 'مجاني',
    premium_tier: 'مميز',
    upgrade: 'ارتقي',
    
    sign_in: 'دخول',
    sign_up: 'حساب جديد',
    sign_out: 'خروج',
    email: 'الإيميل',
    password: 'الباسورد',
    name: 'الاسم',
    
    error: 'غلط',
    try_again: 'حاول تاني',
  },
  
  'ar-Levant': {
    welcome_title: 'مرحبا فيك بمدرب اللياقة الذكي',
    welcome_subtitle: 'برنامجك الشخصي للتمارين والأكل',
    get_started: 'ابلش هلأ',
    
    select_country: 'اختار بلدك',
    country_subtitle: 'هيدا بساعدنا نخصصلك التجربة',
    continue: 'كمل',
    
    profile_title: 'عرفنا عنك',
    whats_your_name: 'شو اسمك؟',
    name_placeholder: 'اكتب اسمك',
    age: 'العمر',
    gender: 'الجنس',
    male: 'ذكر',
    female: 'أنثى',
    
    body_title: 'قياسات الجسم',
    height: 'الطول (سم)',
    weight: 'الوزن (كغم)',
    
    experience_title: 'خبرتك باللياقة',
    beginner: 'مبتدئ',
    beginner_desc: 'جديد عاللياقة',
    intermediate: 'متوسط',
    intermediate_desc: 'عندك خبرة ٦-١٢ شهر',
    advanced: 'متقدم',
    advanced_desc: 'عندك خبرة سنة وأكتر',
    
    goal_title: 'شو هدفك؟',
    build_muscle: 'بناء عضلات',
    lose_fat: 'حرق دهون',
    maintain: 'المحافظة',
    recomp: 'إعادة التكوين',
    
    diet_title: 'نظامك الغذائي',
    standard: 'عادي',
    keto: 'كيتو',
    vegetarian: 'نباتي',
    halal: 'حلال',
    
    generating_plans: 'عم نجهزلك برامجك الشخصية...',
    
    workouts: 'التمارين',
    meals: 'الوجبات',
    progress: 'التقدم',
    report: 'التقرير',
    
    week: 'الأسبوع',
    rest_day: 'يوم راحة',
    sets: 'مجموعات',
    reps: 'تكرار',
    rest: 'راحة',
    seconds: 'ث',
    kg: 'كغم',
    watch_video: 'شوف الشرح',
    log_workout: 'كيف كان التمرين؟',
    completed: 'انعمل ✓',
    skipped: 'متروك',
    too_easy: 'سهل كتير',
    too_hard: 'صعب كتير',
    
    breakfast: 'الفطور',
    lunch: 'الغدا',
    dinner: 'العشا',
    snack: 'سناك',
    calories: 'سعرة',
    protein: 'ب',
    carbs: 'ك',
    fats: 'د',
    mark_consumed: 'سجل كمأكول',
    mark_skipped: 'سجل كمتروك',
    
    workout_adherence: 'الالتزام بالتمارين',
    meal_adherence: 'الالتزام بالوجبات',
    current_streak: 'السلسلة الحالية',
    days: 'يوم',
    weekly_progress: 'التقدم الأسبوعي',
    
    weekly_report: 'التقرير الأسبوعي',
    upgrade_premium: 'ترقية للمميز',
    premium_desc: 'اجيب تقارير ذكية وبرامج متكيفة',
    
    free_tier: 'مجاني',
    premium_tier: 'مميز',
    upgrade: 'ترقي',
    
    sign_in: 'دخول',
    sign_up: 'حساب جديد',
    sign_out: 'خروج',
    email: 'الإيميل',
    password: 'كلمة السر',
    name: 'الاسم',
    
    error: 'غلط',
    try_again: 'حاول مرة تانية',
  },
  
  'ar-Maghreb': {
    welcome_title: 'مرحبا بيك في كوتش اللياقة الذكي',
    welcome_subtitle: 'برنامجك الشخصي للتمارين والماكلة',
    get_started: 'ابدا دابا',
    
    select_country: 'اختار بلادك',
    country_subtitle: 'هادشي غادي يعاونا نخصصو ليك التجربة',
    continue: 'كمل',
    
    profile_title: 'عرفنا عليك',
    whats_your_name: 'شنو سميتك؟',
    name_placeholder: 'كتب سميتك',
    age: 'العمر',
    gender: 'الجنس',
    male: 'راجل',
    female: 'مرا',
    
    body_title: 'قياسات الجسم',
    height: 'الطول (سم)',
    weight: 'الوزن (كغم)',
    
    experience_title: 'خبرتك في اللياقة',
    beginner: 'مبتدئ',
    beginner_desc: 'جديد في اللياقة',
    intermediate: 'متوسط',
    intermediate_desc: 'عندك خبرة من ٦ لـ١٢ شهر',
    advanced: 'متقدم',
    advanced_desc: 'عندك خبرة عام وكثر',
    
    goal_title: 'شنو هدفك؟',
    build_muscle: 'بناء العضلات',
    lose_fat: 'حرق الدهون',
    maintain: 'المحافظة',
    recomp: 'إعادة التكوين',
    
    diet_title: 'نظامك الغذائي',
    standard: 'عادي',
    keto: 'كيتو',
    vegetarian: 'نباتي',
    halal: 'حلال',
    
    generating_plans: 'كنجهزو ليك برامجك الشخصية...',
    
    workouts: 'التمارين',
    meals: 'الماكلة',
    progress: 'التقدم',
    report: 'التقرير',
    
    week: 'الأسبوع',
    rest_day: 'نهار راحة',
    sets: 'مجموعات',
    reps: 'تكرار',
    rest: 'راحة',
    seconds: 'ث',
    kg: 'كغم',
    watch_video: 'شوف الشرح',
    log_workout: 'كيفاش كان التمرين؟',
    completed: 'تدار ✓',
    skipped: 'متروك',
    too_easy: 'ساهل بزاف',
    too_hard: 'صعيب بزاف',
    
    breakfast: 'الفطور',
    lunch: 'الغدا',
    dinner: 'العشا',
    snack: 'سناك',
    calories: 'سعرة',
    protein: 'ب',
    carbs: 'ك',
    fats: 'د',
    mark_consumed: 'سجل كماكول',
    mark_skipped: 'سجل كمتروك',
    
    workout_adherence: 'الالتزام بالتمارين',
    meal_adherence: 'الالتزام بالماكلة',
    current_streak: 'السلسلة دابا',
    days: 'نهار',
    weekly_progress: 'التقدم الأسبوعي',
    
    weekly_report: 'التقرير الأسبوعي',
    upgrade_premium: 'ارتقي للمميز',
    premium_desc: 'جيب تقارير ذكية وبرامج متكيفة',
    
    free_tier: 'مجاني',
    premium_tier: 'مميز',
    upgrade: 'ارتقي',
    
    sign_in: 'دخول',
    sign_up: 'حساب جديد',
    sign_out: 'خروج',
    email: 'الإيميل',
    password: 'كلمة السر',
    name: 'الاسم',
    
    error: 'غلط',
    try_again: 'حاول مرة أخرى',
  },
};

export function t(key: string, lang: Language = 'en'): string {
  return translations[lang]?.[key] || translations['en']?.[key] || key;
}

export function isRTL(lang: Language): boolean {
  return lang.startsWith('ar');
}
