import { DataSet } from '@/game/types';
import { GameCard } from './GameCard';
import { CheckCircle2 } from 'lucide-react';

interface DataSetDisplayProps {
  dataSets: DataSet[];
  onSelectDataSet?: (index: number) => void;
  selectedIndex?: number;
  label: string;
}

export function DataSetDisplay({ dataSets, onSelectDataSet, selectedIndex, label }: DataSetDisplayProps) {
  if (dataSets.length === 0) {
    return (
      <div className="text-muted-foreground text-xs italic">
        {label}: No data sets yet
      </div>
    );
  }

  return (
    <div>
      <div className="text-xs font-medium text-muted-foreground mb-2">{label}</div>
      <div className="flex flex-wrap gap-2">
        {dataSets.map((ds, i) => (
          <button
            key={i}
            onClick={() => onSelectDataSet?.(i)}
            className={`flex gap-1 items-center p-2 rounded-lg border transition-all ${
              selectedIndex === i ? 'border-accent bg-accent/10' : 'border-border bg-secondary/50'
            } ${ds.completed ? 'opacity-70' : ''} ${onSelectDataSet ? 'cursor-pointer hover:border-accent/50' : 'cursor-default'}`}
          >
            <GameCard card={ds.sensitiveCard} small />
            {ds.exceptionKey && <GameCard card={ds.exceptionKey} small />}
            {ds.dpiaCard && <GameCard card={ds.dpiaCard} small />}
            {ds.completed && <CheckCircle2 className="w-4 h-4 text-primary ml-1" />}
          </button>
        ))}
      </div>
    </div>
  );
}
