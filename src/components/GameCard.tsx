import { Card } from '@/game/types';
import { cn } from '@/lib/utils';
import { Shield, Key, FileWarning, Zap, Heart, Fingerprint, Dna, Vote } from 'lucide-react';

interface GameCardProps {
  card: Card;
  onClick?: () => void;
  selected?: boolean;
  small?: boolean;
  faceDown?: boolean;
}

const typeColors: Record<string, string> = {
  health: 'border-game-health card-glow-health',
  biometric: 'border-game-biometric card-glow-biometric',
  genetic: 'border-game-genetic card-glow-genetic',
  political: 'border-game-political card-glow-political',
  exception_key: 'border-game-exception card-glow-exception',
  explicit_consent: 'border-game-exception card-glow-exception',
  vital_interests: 'border-game-exception card-glow-exception',
  publicly_disclosed: 'border-game-exception card-glow-exception',
  dpia: 'border-game-dpia card-glow-dpia',
  action: 'border-game-action card-glow-action',
  power_imbalance: 'border-game-action card-glow-action',
  controller_decision: 'border-game-action card-glow-action',
};

const typeBgColors: Record<string, string> = {
  health: 'bg-game-health/10',
  biometric: 'bg-game-biometric/10',
  genetic: 'bg-game-genetic/10',
  political: 'bg-game-political/10',
  explicit_consent: 'bg-game-exception/10',
  vital_interests: 'bg-game-exception/10',
  publicly_disclosed: 'bg-game-exception/10',
  dpia: 'bg-game-dpia/10',
  power_imbalance: 'bg-game-action/10',
  controller_decision: 'bg-game-action/10',
};

const iconMap: Record<string, React.ReactNode> = {
  health: <Heart className="w-5 h-5" />,
  biometric: <Fingerprint className="w-5 h-5" />,
  genetic: <Dna className="w-5 h-5" />,
  political: <Vote className="w-5 h-5" />,
  explicit_consent: <Key className="w-5 h-5" />,
  vital_interests: <Key className="w-5 h-5" />,
  publicly_disclosed: <Key className="w-5 h-5" />,
  dpia: <Shield className="w-5 h-5" />,
  power_imbalance: <Zap className="w-5 h-5" />,
  controller_decision: <FileWarning className="w-5 h-5" />,
};

export function GameCard({ card, onClick, selected, small, faceDown }: GameCardProps) {
  const colorKey = card.subType || card.type;
  const glowClass = typeColors[colorKey] || 'border-border';
  const bgClass = typeBgColors[colorKey] || 'bg-card';

  if (faceDown) {
    return (
      <div className={cn(
        'rounded-lg border-2 border-primary/30 bg-secondary flex items-center justify-center transition-all',
        small ? 'w-12 h-16' : 'w-28 h-40',
      )}>
        <Shield className="w-6 h-6 text-primary/40" />
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-lg border-2 flex flex-col items-start p-2 transition-all duration-200',
        glowClass,
        bgClass,
        small ? 'w-14 h-20 text-[10px] p-1' : 'w-28 h-40',
        selected && 'ring-2 ring-accent scale-105',
        onClick && 'hover:scale-105 cursor-pointer',
        !onClick && 'cursor-default',
      )}
    >
      <div className="flex items-center gap-1 mb-1">
        {iconMap[colorKey]}
        {card.isHighRisk && <span className="text-destructive text-[10px] font-bold">⚠</span>}
      </div>
      {!small && (
        <>
          <span className="font-semibold text-xs leading-tight">{card.name}</span>
          <span className="text-muted-foreground text-[10px] mt-1 leading-tight">{card.description}</span>
        </>
      )}
      {small && <span className="text-[8px] leading-tight font-medium">{card.name}</span>}
    </button>
  );
}
