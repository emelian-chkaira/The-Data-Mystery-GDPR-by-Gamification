import { Card } from './types';

/**
 * A Scenario scripts the exact initial hands and deck order
 * so you can demo a perfect round in class.
 */
export interface Scenario {
  id: string;
  name: string;
  description: string;
  /** Cards dealt to the human player (index 0) */
  humanHand: CardSpec[];
  /** Cards dealt to the AI player (index 1) */
  aiHand: CardSpec[];
  /** Remaining deck in exact draw order (top = index 0) */
  deckOrder: CardSpec[];
}

/** Shorthand to specify a card by type + subType */
export interface CardSpec {
  type: Card['type'];
  subType?: Card['subType'];
  isHighRisk?: boolean;
}

let scenarioCardId = 0;
export function specToCard(spec: CardSpec): Card {
  scenarioCardId++;
  const names: Record<string, string> = {
    health: 'Health Data',
    biometric: 'Biometric Data',
    genetic: 'Genetic Data',
    political: 'Political / Religious',
    explicit_consent: 'Explicit Consent',
    vital_interests: 'Vital Interests',
    publicly_disclosed: 'Publicly Disclosed',
    power_imbalance: 'Power Imbalance',
    controller_decision: "Controller's Decision",
  };
  const descs: Record<string, string> = {
    health: 'Personal health records, diagnoses, prescriptions.',
    biometric: 'Fingerprints, facial recognition, iris scans.',
    genetic: 'DNA profiles, inherited traits, genetic testing.',
    political: 'Voting behaviour, faith, political affiliations.',
    explicit_consent: 'Subject gave clear permission. Art 9.2a',
    vital_interests: 'Life-or-death emergency. Art 9.2c',
    publicly_disclosed: 'Subject made data public. Art 9.2e',
    power_imbalance: "Destroys opponent's Explicit Consent play.",
    controller_decision: 'Wild card. Acts as any Exception Key.',
  };

  const key = spec.subType || spec.type;
  return {
    id: `sc-${scenarioCardId}`,
    type: spec.type,
    subType: spec.subType,
    name: spec.type === 'dpia' ? 'DPIA Safeguard' : (names[key] || key),
    description: spec.type === 'dpia' ? 'Data Protection Impact Assessment. Art. 35' : (descs[key] || ''),
    isHighRisk: spec.isHighRisk,
  };
}

export function resetScenarioIds() {
  scenarioCardId = 0;
}

// ─── PRE-BUILT SCENARIOS ───

export const SCENARIOS: Scenario[] = [
  {
    id: 'demo-perfect',
    name: '✨ Perfect Demo Round',
    description: 'Shows a complete flow: play Health data, add Explicit Consent, then play Biometric (high-risk) with DPIA + Vital Interests to win. AI also completes one set for drama.',
    humanHand: [
      { type: 'sensitive_data', subType: 'health' },
      { type: 'exception_key', subType: 'explicit_consent' },
      { type: 'sensitive_data', subType: 'biometric', isHighRisk: true },
      { type: 'exception_key', subType: 'vital_interests' },
      { type: 'dpia' },
    ],
    aiHand: [
      { type: 'sensitive_data', subType: 'genetic', isHighRisk: true },
      { type: 'exception_key', subType: 'publicly_disclosed' },
      { type: 'dpia' },
      { type: 'sensitive_data', subType: 'political' },
      { type: 'action', subType: 'power_imbalance' },
    ],
    deckOrder: [
      // Human draw 1 (turn 2): gets nothing critical, already has what's needed
      { type: 'sensitive_data', subType: 'political' },
      // AI draw 1
      { type: 'exception_key', subType: 'explicit_consent' },
      // Human draw 2
      { type: 'action', subType: 'controller_decision' },
      // AI draw 2
      { type: 'sensitive_data', subType: 'health' },
      // Extra cards
      { type: 'dpia' },
      { type: 'sensitive_data', subType: 'genetic', isHighRisk: true },
      { type: 'exception_key', subType: 'vital_interests' },
      { type: 'action', subType: 'power_imbalance' },
    ],
  },
  {
    id: 'demo-challenge',
    name: '⚔️ Power Imbalance Demo',
    description: 'AI uses Explicit Consent which you can challenge with Power Imbalance. Shows the challenge mechanic.',
    humanHand: [
      { type: 'sensitive_data', subType: 'health' },
      { type: 'exception_key', subType: 'explicit_consent' },
      { type: 'action', subType: 'power_imbalance' },
      { type: 'sensitive_data', subType: 'political' },
      { type: 'exception_key', subType: 'vital_interests' },
    ],
    aiHand: [
      { type: 'sensitive_data', subType: 'political' },
      { type: 'exception_key', subType: 'explicit_consent' },
      { type: 'sensitive_data', subType: 'health' },
      { type: 'dpia' },
      { type: 'sensitive_data', subType: 'biometric', isHighRisk: true },
    ],
    deckOrder: [
      { type: 'sensitive_data', subType: 'genetic', isHighRisk: true },
      { type: 'dpia' },
      { type: 'exception_key', subType: 'publicly_disclosed' },
      { type: 'action', subType: 'controller_decision' },
      { type: 'exception_key', subType: 'explicit_consent' },
      { type: 'sensitive_data', subType: 'biometric', isHighRisk: true },
    ],
  },
  {
    id: 'demo-high-risk',
    name: '🔴 High-Risk DPIA Flow',
    description: 'Focuses on biometric + genetic data requiring DPIA safeguards. Great for explaining Art. 35.',
    humanHand: [
      { type: 'sensitive_data', subType: 'biometric', isHighRisk: true },
      { type: 'sensitive_data', subType: 'genetic', isHighRisk: true },
      { type: 'dpia' },
      { type: 'dpia' },
      { type: 'exception_key', subType: 'explicit_consent' },
    ],
    aiHand: [
      { type: 'sensitive_data', subType: 'health' },
      { type: 'exception_key', subType: 'vital_interests' },
      { type: 'sensitive_data', subType: 'political' },
      { type: 'exception_key', subType: 'publicly_disclosed' },
      { type: 'action', subType: 'power_imbalance' },
    ],
    deckOrder: [
      { type: 'exception_key', subType: 'vital_interests' },
      { type: 'sensitive_data', subType: 'health' },
      { type: 'action', subType: 'controller_decision' },
      { type: 'exception_key', subType: 'explicit_consent' },
      { type: 'dpia' },
      { type: 'sensitive_data', subType: 'political' },
    ],
  },
];
