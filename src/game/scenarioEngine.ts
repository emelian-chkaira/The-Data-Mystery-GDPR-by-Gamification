import { GameState, Player } from './types';
import { Scenario, specToCard, resetScenarioIds } from './scenarios';

/**
 * Initialize a game from a scripted scenario instead of a random deck.
 */
export function initScenarioGame(scenario: Scenario): GameState {
  resetScenarioIds();

  const humanHand = scenario.humanHand.map(specToCard);
  const aiHand = scenario.aiHand.map(specToCard);
  const deck = scenario.deckOrder.map(specToCard);

  const players: Player[] = [
    {
      id: 'player-0',
      name: 'You',
      hand: humanHand,
      dataSets: [],
      completedSets: 0,
      isAI: false,
      skipNextTurn: false,
    },
    {
      id: 'player-1',
      name: 'AI 1',
      hand: aiHand,
      dataSets: [],
      completedSets: 0,
      isAI: true,
      skipNextTurn: false,
    },
  ];

  return {
    players,
    currentPlayerIndex: 0,
    deck,
    discardPile: [],
    phase: 'draw',
    winner: null,
    log: [`🔒 Article 9: The Data Mystery begins! (Scenario: ${scenario.name})`],
    started: true,
    pendingChallenge: null,
  };
}
