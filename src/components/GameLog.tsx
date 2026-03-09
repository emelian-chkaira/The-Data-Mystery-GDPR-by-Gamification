import { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface GameLogProps {
  log: string[];
}

export function GameLog({ log }: GameLogProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [log.length]);

  return (
    <ScrollArea className="h-32 rounded-lg border border-border bg-secondary/30 p-3">
      <div className="space-y-1">
        {log.map((entry, i) => (
          <div key={i} className="text-xs font-mono text-muted-foreground">
            {entry}
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </ScrollArea>
  );
}
