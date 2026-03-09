export type SensitiveDataType = 'health' | 'biometric' | 'genetic' | 'political';
export type ExceptionKeyType = 'explicit_consent' | 'vital_interests' | 'publicly_disclosed';
export type ActionCardType = 'power_imbalance' | 'controller_decision';

export type CardType = 'sensitive_data' | 'exception_key' | 'dpia' | 'action';

export interface Card {
  id: string;
  type: CardType;
  subType?: SensitiveDataType | ExceptionKeyType | ActionCardType;
  name: string;
  description: string;
  isHighRisk?: boolean;
}

export interface DataSet {
  sensitiveCard: Card;
  exceptionKey?: Card;
  dpiaCard?: Card;
  completed: boolean;
}

export interface Player {
  id: string;
  name: string;
  hand: Card[];
  dataSets: DataSet[];
  completedSets: number;
  isAI: boolean;
  skipNextTurn: boolean;
}

export type TurnPhase = 'draw' | 'play' | 'challenge' | 'end';

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  deck: Card[];
  discardPile: Card[];
  phase: TurnPhase;
  winner: string | null;
  log: string[];
  started: boolean;
  pendingChallenge: {
    targetPlayerIndex: number;
    dataSetIndex: number;
  } | null;
}
