import { GameState, Player, Card, DataSet } from './types';
import { createDeck } from './deck';

function getExceptionCompatibilityError(ds: DataSet, card: Card): string | null {
  if (card.type === 'action' && card.subType === 'controller_decision') {
    return null;
  }

  if (card.type !== 'exception_key') {
    return 'Only Exception Keys can be attached to a Data Set.';
  }

  if (ds.sensitiveCard.subType === 'political' && card.subType === 'vital_interests') {
    return 'Vital Interests cannot be used with Political / Religious data.';
  }

  if (ds.sensitiveCard.isHighRisk && card.subType === 'publicly_disclosed') {
    return 'Publicly Disclosed cannot be used with high-risk data.';
  }

  return null;
}

export function initGame(playerCount: number = 2): GameState {
  const deck = createDeck();
  const players: Player[] = [];

  for (let i = 0; i < playerCount; i++) {
    const hand = deck.splice(0, 5);
    players.push({
      id: `player-${i}`,
      name: i === 0 ? 'You' : `AI ${i}`,
      hand,
      dataSets: [],
      completedSets: 0,
      isAI: i !== 0,
      skipNextTurn: false,
    });
  }

  return {
    players,
    currentPlayerIndex: 0,
    deck,
    discardPile: [],
    phase: 'draw',
    winner: null,
    log: ['🔒 Article 9: The Data Mystery begins!'],
    started: true,
    pendingChallenge: null,
  };
}

export function drawCard(state: GameState): GameState {
  const s = structuredClone(state);
  const player = s.players[s.currentPlayerIndex];

  if (s.deck.length === 0) {
    s.log.push('Deck is empty! Shuffling discard pile.');
    s.deck = [...s.discardPile];
    s.discardPile = [];
  }

  if (s.deck.length > 0 && player.hand.length < 7) {
    const card = s.deck.pop()!;
    player.hand.push(card);
    s.log.push(`${player.name} drew a card.`);
  }

  s.phase = 'play';
  return s;
}

export function playSensitiveData(state: GameState, cardId: string): GameState {
  const s = structuredClone(state);
  const player = s.players[s.currentPlayerIndex];
  const cardIdx = player.hand.findIndex(c => c.id === cardId);
  if (cardIdx === -1) return s;

  const card = player.hand[cardIdx];
  if (card.type !== 'sensitive_data') return s;

  player.hand.splice(cardIdx, 1);
  player.dataSets.push({ sensitiveCard: card, completed: false });
  s.log.push(`${player.name} played ${card.name}.`);
  s.phase = 'challenge';
  return s;
}

export function playExceptionKey(state: GameState, cardId: string, dataSetIndex: number): GameState {
  const s = structuredClone(state);
  const player = s.players[s.currentPlayerIndex];
  const cardIdx = player.hand.findIndex(c => c.id === cardId);
  if (cardIdx === -1) return s;

  const card = player.hand[cardIdx];
  if (card.type !== 'exception_key' && !(card.type === 'action' && card.subType === 'controller_decision')) return s;

  const ds = player.dataSets[dataSetIndex];
  if (!ds || ds.exceptionKey) return s;

  const incompatibilityError = getExceptionCompatibilityError(ds, card);
  if (incompatibilityError) {
    s.log.push(`Invalid combination: ${incompatibilityError}`);
    return s;
  }

  player.hand.splice(cardIdx, 1);
  ds.exceptionKey = card;
  s.log.push(`${player.name} added ${card.name} to ${ds.sensitiveCard.name}.`);

  // Check completion
  checkDataSetCompletion(ds, player);

  s.phase = 'challenge';
  return s;
}

export function playDPIA(state: GameState, cardId: string, dataSetIndex: number): GameState {
  const s = structuredClone(state);
  const player = s.players[s.currentPlayerIndex];
  const cardIdx = player.hand.findIndex(c => c.id === cardId);
  if (cardIdx === -1) return s;

  const card = player.hand[cardIdx];
  if (card.type !== 'dpia') return s;

  const ds = player.dataSets[dataSetIndex];
  if (!ds || ds.dpiaCard || !ds.sensitiveCard.isHighRisk) return s;

  player.hand.splice(cardIdx, 1);
  ds.dpiaCard = card;
  s.log.push(`${player.name} added DPIA to ${ds.sensitiveCard.name}.`);

  checkDataSetCompletion(ds, player);

  s.phase = 'challenge';
  return s;
}

function checkDataSetCompletion(ds: DataSet, player: Player) {
  if (!ds.exceptionKey) return;
  if (ds.sensitiveCard.isHighRisk && !ds.dpiaCard) return;
  ds.completed = true;
  player.completedSets++;
}

export function passTurn(state: GameState): GameState {
  const s = structuredClone(state);
  s.phase = 'challenge';
  return s;
}

export function endTurn(state: GameState): GameState {
  const s = structuredClone(state);
  const player = s.players[s.currentPlayerIndex];

  // Check win
  if (player.completedSets >= 2) {
    s.winner = player.id;
    s.log.push(`🎉 ${player.name} wins with 2 completed Data Sets!`);
    return s;
  }

  // Next player
  let next = (s.currentPlayerIndex + 1) % s.players.length;
  s.currentPlayerIndex = next;

  const nextPlayer = s.players[next];
  if (nextPlayer.skipNextTurn) {
    s.log.push(`${nextPlayer.name} skips their turn.`);
    nextPlayer.skipNextTurn = false;
    next = (next + 1) % s.players.length;
    s.currentPlayerIndex = next;
  }

  s.phase = 'draw';
  s.pendingChallenge = null;
  return s;
}

export function challengeWithPowerImbalance(
  state: GameState,
  challengerIndex: number,
  targetPlayerIndex: number,
  targetDataSetIndex: number,
  powerImbalanceCardId: string
): GameState {
  const s = structuredClone(state);
  const challenger = s.players[challengerIndex];
  const target = s.players[targetPlayerIndex];
  const ds = target.dataSets[targetDataSetIndex];

  if (!ds || !ds.exceptionKey || ds.exceptionKey.subType !== 'explicit_consent') return s;

  const piIdx = challenger.hand.findIndex(c => c.id === powerImbalanceCardId);
  if (piIdx === -1) return s;

  // Check if target has Controller's Decision to counter
  const cdIdx = target.hand.findIndex(c => c.type === 'action' && c.subType === 'controller_decision');

  if (cdIdx !== -1) {
    // Counter! The exception key switches
    const cdCard = target.hand.splice(cdIdx, 1)[0];
    ds.exceptionKey = cdCard;
    challenger.hand.splice(piIdx, 1);
    s.log.push(`${challenger.name} played Power Imbalance but ${target.name} countered with Controller's Decision!`);
  } else {
    // Challenge succeeds
    challenger.hand.splice(piIdx, 1);
    s.discardPile.push(ds.sensitiveCard, ds.exceptionKey);
    target.dataSets.splice(targetDataSetIndex, 1);
    target.skipNextTurn = true;
    s.log.push(`${challenger.name} destroyed ${target.name}'s Data Set with Power Imbalance!`);
  }

  return s;
}

// Simple AI logic
export function aiTurn(state: GameState): GameState {
  let s = drawCard(state);
  const player = s.players[s.currentPlayerIndex];

  // Try to play DPIA on incomplete high-risk sets
  for (let i = 0; i < player.dataSets.length; i++) {
    const ds = player.dataSets[i];
    if (ds.sensitiveCard.isHighRisk && !ds.dpiaCard && ds.exceptionKey) {
      const dpiaCard = player.hand.find(c => c.type === 'dpia');
      if (dpiaCard) {
        s = playDPIA(s, dpiaCard.id, i);
        return endTurn(s);
      }
    }
  }

  // Try to add exception key to existing data set
  for (let i = 0; i < player.dataSets.length; i++) {
    const ds = player.dataSets[i];
    if (!ds.exceptionKey) {
      const key = player.hand.find(c => {
        const isExceptionCard = c.type === 'exception_key' || (c.type === 'action' && c.subType === 'controller_decision');
        if (!isExceptionCard) return false;
        return getExceptionCompatibilityError(ds, c) === null;
      });
      if (key) {
        s = playExceptionKey(s, key.id, i);
        return endTurn(s);
      }
    }
  }

  // Try to play a sensitive data card
  const sensitiveCard = player.hand.find(c => c.type === 'sensitive_data');
  if (sensitiveCard) {
    s = playSensitiveData(s, sensitiveCard.id);
    return endTurn(s);
  }

  s = passTurn(s);
  return endTurn(s);
}
