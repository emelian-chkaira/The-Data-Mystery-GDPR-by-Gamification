import { useState } from 'react';
import { GameBoard } from '@/components/GameBoard';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Lock, Sparkles } from 'lucide-react';
import { SCENARIOS, Scenario } from '@/game/scenarios';

const Index = () => {
  const [started, setStarted] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | undefined>();
  const [withGuide, setWithGuide] = useState(false);

  if (started) return <GameBoard scenario={selectedScenario} withGuide={withGuide} />;

  return (
    <div className="min-h-screen bg-mystery flex flex-col items-center justify-center px-4 py-10 overflow-hidden relative">
      {/* Floating card images as decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src="/images/cards-row1.png"
          alt=""
          className="absolute -top-8 -left-16 w-[500px] opacity-15 rotate-[-12deg] blur-[1px]"
        />
        <img
          src="/images/cards-row2.png"
          alt=""
          className="absolute -bottom-12 -right-20 w-[520px] opacity-15 rotate-[10deg] blur-[1px]"
        />
      </div>

      <div className="max-w-3xl mx-auto text-center space-y-8 relative z-10">
        {/* Title */}
        <div className="space-y-2">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground">
            GDPR Card Game
          </p>
          <div className="flex items-center justify-center gap-3">
            <Lock className="w-8 h-8 text-accent" />
            <span className="text-xl text-muted-foreground font-medium">Article 9</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="text-gradient">The Data Mystery</span>
          </h1>
        </div>

        <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
          Someone is trying to process data they have no right to touch.
          Collect the right cards. Build the case. Complete your Data Sets before anyone else.
        </p>

        {/* Card showcase */}
        {/* <div className="flex justify-center gap-6">
          <img
            src="/images/cards-row1.png"
            alt="Sensitive Data & Exception cards"
            className="w-full max-w-sm rounded-xl border border-border/50 shadow-lg shadow-primary/5"
          />
          <img
            src="/images/cards-row2.png"
            alt="Action & DPIA cards"
            className="w-full max-w-sm rounded-xl border border-border/50 shadow-lg shadow-primary/5 hidden md:block"
          />
        </div> */}

        {/* Scenario Picker */}
        <div className="space-y-3 max-w-lg mx-auto">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-accent" />
            <span>Choose a scenario or play randomly</span>
          </div>

          <div className="grid gap-2">
            {SCENARIOS.map(sc => (
              <button
                key={sc.id}
                onClick={() => setSelectedScenario(prev => prev?.id === sc.id ? undefined : sc)}
                className={`text-left p-3 rounded-lg border transition-all ${
                  selectedScenario?.id === sc.id
                    ? 'border-accent bg-accent/10 ring-1 ring-accent'
                    : 'border-border bg-secondary/20 hover:border-primary/50'
                }`}
              >
                <div className="text-sm font-semibold">{sc.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{sc.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Guide checkbox + Start */}
        <div className="space-y-4">
          {selectedScenario && (
            <label className="flex items-center justify-center gap-2 cursor-pointer">
              <Checkbox
                checked={withGuide}
                onCheckedChange={(v) => setWithGuide(v === true)}
              />
              <span className="text-sm text-muted-foreground">Enable step-by-step guide</span>
            </label>
          )}

          <Button size="lg" onClick={() => setStarted(true)} className="text-lg px-10">
            {selectedScenario ? 'Start Scenario' : 'Start Random Game'}
          </Button>
          <p className="text-xs text-muted-foreground">
            2 Players • You vs AI • First to 2 Data Sets wins
          </p>
          <p className="text-xs text-muted-foreground/90">
            Developed by Emelian Chkaira, Data Science Master student at Parma University / Italy
          </p>
          <p className="text-xs text-muted-foreground/90">
            <a
              href="https://github.com/emelian-chkaira"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-foreground"
            >
              GitHub
            </a>
            {' • '}
            <a
              href="https://linkedin.com/in/emelianchkaira"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-foreground"
            >
              LinkedIn
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
