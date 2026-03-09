import { Card } from './types';

let cardId = 0;
const makeId = () => `card-${++cardId}`;

function createSensitiveCards(): Card[] {
  const cards: Card[] = [];

  // Health - 10 cards (Standard Risk)
  for (let i = 0; i < 10; i++) {
    cards.push({
      id: makeId(), type: 'sensitive_data', subType: 'health',
      name: 'Health Data', description: 'Personal health records, diagnoses, prescriptions.',
    });
  }

  // Biometric - 10 cards (HIGH RISK)
  for (let i = 0; i < 10; i++) {
    cards.push({
      id: makeId(), type: 'sensitive_data', subType: 'biometric',
      name: 'Biometric Data', description: 'Fingerprints, facial recognition, iris scans.',
      isHighRisk: true,
    });
  }

  // Genetic - 10 cards (HIGH RISK)
  for (let i = 0; i < 10; i++) {
    cards.push({
      id: makeId(), type: 'sensitive_data', subType: 'genetic',
      name: 'Genetic Data', description: 'DNA profiles, inherited traits, genetic testing.',
      isHighRisk: true,
    });
  }

  // Political/Religious - 10 cards (Standard Risk)
  for (let i = 0; i < 10; i++) {
    cards.push({
      id: makeId(), type: 'sensitive_data', subType: 'political',
      name: 'Political / Religious', description: 'Voting behaviour, faith, political affiliations.',
    });
  }

  return cards;
}

function createExceptionKeys(): Card[] {
  const cards: Card[] = [];
  for (let i = 0; i < 4; i++) {
    cards.push({
      id: makeId(), type: 'exception_key', subType: 'explicit_consent',
      name: 'Explicit Consent', description: 'Subject gave clear permission. Art 9.2a',
    });
  }
  for (let i = 0; i < 3; i++) {
    cards.push({
      id: makeId(), type: 'exception_key', subType: 'vital_interests',
      name: 'Vital Interests', description: 'Life-or-death emergency. Art 9.2c',
    });
  }
  for (let i = 0; i < 3; i++) {
    cards.push({
      id: makeId(), type: 'exception_key', subType: 'publicly_disclosed',
      name: 'Publicly Disclosed', description: 'Subject made data public. Art 9.2e',
    });
  }
  return cards;
}

function createDPIACards(): Card[] {
  const cards: Card[] = [];
  for (let i = 0; i < 6; i++) {
    cards.push({
      id: makeId(), type: 'dpia',
      name: 'DPIA Safeguard', description: 'Data Protection Impact Assessment. Art. 35',
    });
  }
  return cards;
}

function createActionCards(): Card[] {
  const cards: Card[] = [];
  for (let i = 0; i < 4; i++) {
    cards.push({
      id: makeId(), type: 'action', subType: 'power_imbalance',
      name: 'Power Imbalance', description: 'Destroys opponent\'s Explicit Consent play.',
    });
  }
  for (let i = 0; i < 4; i++) {
    cards.push({
      id: makeId(), type: 'action', subType: 'controller_decision',
      name: "Controller's Decision", description: 'Wild card. Acts as any Exception Key.',
    });
  }
  return cards;
}

export function createDeck(): Card[] {
  cardId = 0;
  return shuffle([
    ...createSensitiveCards(),
    ...createExceptionKeys(),
    ...createDPIACards(),
    ...createActionCards(),
  ]);
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
