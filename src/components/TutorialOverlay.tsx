import { TutorialStep } from '@/game/tutorialSteps';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, X, BookOpen, Lightbulb, MousePointerClick } from 'lucide-react';

interface TutorialOverlayProps {
  step: TutorialStep;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
}

export function TutorialOverlay({
  step,
  onNext,
  onPrev,
  onClose,
  canGoBack,
  canGoForward,
}: TutorialOverlayProps) {
  const progress = (step.step / step.totalSteps) * 100;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4">
      <div className="rounded-xl border border-accent/40 bg-card/95 backdrop-blur-md shadow-lg shadow-accent/10 overflow-hidden">
        {/* Progress bar */}
        <Progress value={progress} className="h-1 rounded-none" />

        <div className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-accent shrink-0" />
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                Step {step.step}/{step.totalSteps}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0"
              onClick={onClose}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-foreground">{step.title}</h3>

          {/* Explanation */}
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {step.explanation}
          </p>

          {/* Concept tag */}
          {step.concept && (
            <div className="flex items-center gap-1.5 text-[11px] text-accent font-mono">
              <Lightbulb className="w-3 h-3" />
              {step.concept}
            </div>
          )}

          {/* Action instruction */}
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-primary/10 border border-primary/20">
            <MousePointerClick className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span className="text-xs font-medium text-primary-foreground/80">
              {step.action}
            </span>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onPrev}
              disabled={!canGoBack}
              className="text-xs"
            >
              <ChevronLeft className="w-3 h-3 mr-1" /> Back
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onNext}
              disabled={!canGoForward}
              className="text-xs"
            >
              {step.step === step.totalSteps ? 'Finish' : 'Next'} <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
