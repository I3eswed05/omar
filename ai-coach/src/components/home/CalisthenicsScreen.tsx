import { Move3d, Sparkles, Timer, Zap, Target, Lock } from 'lucide-react';
import { useMemo } from 'react';
import { useAppStore } from '../../store/app-store';
import { t } from '../../lib/i18n';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Badge } from '../ui/badge';

interface FlowProgram {
  id: string;
  name: string;
  level: string;
  duration: string;
  focus: string;
  highlight: string;
  palette: string;
}

interface SkillStage {
  id: string;
  title: string;
  blurb: string;
  status: 'done' | 'active' | 'next' | 'locked';
}

interface FocusSession {
  id: string;
  title: string;
  note: string;
  micro: string;
}

export function CalisthenicsScreen() {
  const { profile } = useAppStore();

  const language = profile?.language ?? 'en';

  const flowPrograms: FlowProgram[] = useMemo(
    () => [
      {
        id: 'gravity-flow',
        name: 'Zero-Gravity Flow',
        level: 'Intermediate',
        duration: '35 min',
        focus: 'Full-body power',
        highlight: 'Wave-based transitions to light up core and shoulders.',
        palette: 'from-primary/60 via-fuchsia-500/40 to-sky-500/30',
      },
      {
        id: 'kinetic-waves',
        name: 'Kinetic Waves',
        level: 'Beginner',
        duration: '22 min',
        focus: 'Mobility primer',
        highlight: 'Pulse drills for wrists, hips, and thoracic rotation.',
        palette: 'from-purple-500/60 via-blue-500/40 to-purple-500/10',
      },
      {
        id: 'orbit-circuit',
        name: 'Orbit Circuit',
        level: 'Advanced',
        duration: '42 min',
        focus: 'Static strength',
        highlight: 'Handstand prep with tempo holds and hollow body stacks.',
        palette: 'from-amber-500/40 via-primary/50 to-rose-500/40',
      },
      {
        id: 'lunar-flow',
        name: 'Lunar Flow',
        level: 'All Levels',
        duration: '18 min',
        focus: 'Evening reset',
        highlight: 'Breath-led movement arcs to unload spine and hips.',
        palette: 'from-slate-900/80 via-primary/50 to-slate-900/20',
      },
    ],
    []
  );

  const skillPath: SkillStage[] = useMemo(
    () => [
      {
        id: 'foundations',
        title: 'Foundations',
        blurb: 'Joint activation, scapular control, and tension drills.',
        status: 'done',
      },
      {
        id: 'strength-flow',
        title: 'Strength Flow',
        blurb: 'Explosive pushing patterns and power push-ups.',
        status: 'active',
      },
      {
        id: 'inversions',
        title: 'Inversions',
        blurb: 'Exit drills, fear coaching, and prep for freestanding holds.',
        status: 'next',
      },
      {
        id: 'freestyle',
        title: 'Freestyle Lab',
        blurb: 'Creative sequences generated from your training DNA.',
        status: 'locked',
      },
    ],
    []
  );

  const weeklyFocus: FocusSession[] = useMemo(
    () => [
      {
        id: 'shoulder-reset',
        title: 'Shoulder Capsule Reset',
        note: 'Loop band progressions to unlock overhead range.',
        micro: '10 min micro-session',
      },
      {
        id: 'core-waves',
        title: 'Core Wave Builders',
        note: 'Wave loading for hollow-to-arch control under fatigue.',
        micro: '12 min micro-session',
      },
      {
        id: 'flow-challenge',
        title: 'Flow Challenge: Orbit 03',
        note: 'Blend beast crawls with hang-through rotations.',
        micro: 'COMING SOON',
      },
    ],
    []
  );

  if (!profile) return null;

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="border-b bg-background p-4 shadow-sm shadow-primary/5 sticky top-0 z-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-primary/15 text-primary">
              {t('calisthenics_preview_badge', language)}
            </Badge>
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              {t('calisthenics_tagline', language)}
            </span>
          </div>
          <h2 className="text-2xl font-semibold text-foreground">{t('calisthenics', language)}</h2>
          <p className="text-sm text-muted-foreground max-w-xl">
            {t('calisthenics_intro', language)}
          </p>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 p-4 pb-16">
        <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/15 via-purple-900/30 to-slate-900/50 backdrop-blur">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-32 left-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -bottom-24 right-16 h-48 w-48 rounded-full bg-fuchsia-500/20 blur-3xl" />
          </div>
          <CardHeader className="relative z-10 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Move3d className="h-10 w-10 rounded-full bg-primary/20 p-2 text-primary" />
              <div>
                <CardTitle className="text-xl">{t('calisthenics_featured_flows', language)}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {t('calisthenics_featured_desc', language)}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid gap-4 md:grid-cols-2">
              {flowPrograms.map((flow) => (
                <div
                  key={flow.id}
                  className="relative overflow-hidden rounded-xl border border-primary/20 bg-background/60 p-5 backdrop-blur"
                >
                  <div
                    className={`absolute inset-0 -z-10 bg-gradient-to-br ${flow.palette} opacity-80`}
                  />
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{flow.name}</h3>
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        {flow.focus}
                      </p>
                    </div>
                    <Badge className="bg-white/15 text-xs text-foreground/80 backdrop-blur">
                      {t('calisthenics_session_placeholder', language)}
                    </Badge>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm">
                    <span className="inline-flex items-center gap-1 text-foreground/80">
                      <Sparkles className="h-4 w-4" />
                      {flow.level}
                    </span>
                    <span className="inline-flex items-center gap-1 text-foreground/80">
                      <Timer className="h-4 w-4" />
                      {flow.duration}
                    </span>
                    <span className="inline-flex items-center gap-1 text-foreground/80">
                      <Target className="h-4 w-4" />
                      {flow.focus}
                    </span>
                  </div>
                  <p className="mt-4 text-sm text-foreground/70">{flow.highlight}</p>
                  <div className="mt-6 flex items-center justify-between">
                    <button
                      className="pointer-events-none rounded-full bg-primary/30 px-4 py-2 text-sm font-medium text-primary/90 shadow-inner shadow-primary/20"
                      disabled
                    >
                      {t('calisthenics_launch_pill', language)}
                    </button>
                    <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      {t('calisthenics_placeholder_badge', language)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Card className="overflow-hidden border-primary/15 bg-gradient-to-br from-purple-900/40 via-primary/10 to-slate-950/60">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Zap className="h-9 w-9 rounded-full bg-primary/20 p-2 text-primary" />
                <div>
                  <CardTitle>{t('calisthenics_skill_path', language)}</CardTitle>
                  <CardDescription>{t('calisthenics_skill_path_desc', language)}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {skillPath.map((stage, index) => {
                const isLocked = stage.status === 'locked';
                const isActive = stage.status === 'active';
                const isDone = stage.status === 'done';

                return (
                  <div
                    key={stage.id}
                    className="relative flex gap-3 rounded-xl border border-white/5 bg-background/60 p-4 backdrop-blur"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full border ${
                          isDone
                            ? 'border-primary bg-primary/30 text-primary'
                            : isActive
                            ? 'border-primary/70 bg-primary/25 text-primary'
                            : 'border-white/10 bg-background text-muted-foreground'
                        }`}
                      >
                        {isLocked ? (
                          <Lock className="h-4 w-4" />
                        ) : (
                          <Sparkles className="h-4 w-4" />
                        )}
                      </div>
                      {index !== skillPath.length - 1 && (
                        <div className="h-full w-px flex-1 bg-gradient-to-b from-primary/40 via-white/5 to-transparent" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold text-foreground">{stage.title}</h3>
                        {isLocked ? (
                          <Badge variant="outline" className="border-primary/40 text-primary">
                            {t('calisthenics_locked_label', language)}
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-primary/15 text-primary">
                            {isDone
                              ? t('calisthenics_stage_done', language)
                              : isActive
                              ? t('calisthenics_stage_now', language)
                              : t('calisthenics_stage_next', language)}
                          </Badge>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-foreground/70">{stage.blurb}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
            <CardFooter className="border-t border-white/5 bg-black/20 backdrop-blur">
              <p className="text-xs text-muted-foreground">
                {t('calisthenics_skill_path_footer', language)}
              </p>
            </CardFooter>
          </Card>

          <Card className="border-primary/20 bg-gradient-to-br from-slate-900/70 via-primary/15 to-purple-900/40">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Sparkles className="h-9 w-9 rounded-full bg-primary/15 p-2 text-primary" />
                <div>
                  <CardTitle>{t('calisthenics_weekly_focus', language)}</CardTitle>
                  <CardDescription>{t('calisthenics_weekly_focus_desc', language)}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {weeklyFocus.map((focus) => (
                <div
                  key={focus.id}
                  className="rounded-xl border border-primary/20 bg-background/60 p-4 backdrop-blur"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-foreground">{focus.title}</h3>
                    <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                      {focus.micro}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-foreground/70">{focus.note}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-purple-900/50 to-slate-950/70">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="h-10 w-10 rounded-full bg-primary/20 p-2 text-primary" />
              <div>
                <CardTitle>{t('calisthenics_lab_title', language)}</CardTitle>
                <CardDescription>{t('calisthenics_lab_desc', language)}</CardDescription>
              </div>
            </div>
            <Badge className="bg-primary text-primary-foreground">
              {t('calisthenics_lab_badge', language)}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-foreground/70">
              {t('calisthenics_lab_copy', language)}
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {['Sequence Composer', 'Adaptive Tempo Coach', 'Freestyle Recorder'].map((tile) => (
                <div
                  key={tile}
                  className="rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-foreground/80 backdrop-blur"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="font-medium">{tile}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t('calisthenics_lab_tile_placeholder', language)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 border-t border-white/5 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>{t('calisthenics_lab_footer', language)}</span>
            </div>
            <button className="rounded-full border border-primary/40 bg-primary/20 px-4 py-2 text-sm font-medium text-primary">
              {t('calisthenics_waitlist', language)}
            </button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
