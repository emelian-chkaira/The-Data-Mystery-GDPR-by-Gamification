import { useState, useCallback, useEffect } from 'react';
import { GameState, Card } from '@/game/types';
import {
  initGame, drawCard, playSensitiveData, playExceptionKey,
  playDPIA, passTurn, endTurn, aiTurn, challengeWithPowerImbalance,
} from '@/game/engine';
import { Scenario } from '@/game/scenarios';
import { initScenarioGame } from '@/game/scenarioEngine';
import { getTutorialForScenario, TutorialStep } from '@/game/tutorialSteps';
import { GameCard } from './GameCard';
import { DataSetDisplay } from './DataSetDisplay';
import { GameLog } from './GameLog';
import { TutorialOverlay } from './TutorialOverlay';
import { Button } from '@/components/ui/button';
import { Lock, RotateCcw, SkipForward, BookOpen } from 'lucide-react';

interface GameBoardProps {
  scenario?: Scenario;
  withGuide?: boolean;
}

export function GameBoard({ scenario, withGuide = false }: GameBoardProps) {
  const [game, setGame] = useState<GameState>(
    scenario ? initScenarioGame(scenario) : initGame(2)
  );
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [selectedDataSet, setSelectedDataSet] = useState<number | null>(null);
  const [aiThinking, setAiThinking] = useState(false);

  // Tutorial state
  const tutorialSteps = scenario ? getTutorialForScenario(scenario.id) : null;
  const [tutorialIndex, setTutorialIndex] = useState(0);
  const [tutorialActive, setTutorialActive] = useState(withGuide && !!tutorialSteps);
  const currentTutorialStep = tutorialActive && tutorialSteps ? tutorialSteps[tutorialIndex] : null;

  const currentPlayer = game.players[game.currentPlayerIndex];
  const humanPlayer = game.players[0];
  const isHumanTurn = game.currentPlayerIndex === 0;

  const handleDraw = useCallback(() => {
    if (game.phase !== 'draw' || !isHumanTurn) return;
    setGame(drawCard(game));
  }, [game, isHumanTurn]);

  const handlePlayCard = useCallback(() => {
    if (!selectedCard || !isHumanTurn) return;
    const card = humanPlayer.hand.find(c => c.id === selectedCard);
    if (!card) return;

    let newState = game;

    if (card.type === 'sensitive_data') {
      newState = playSensitiveData(game, card.id);
    } else if (card.type === 'exception_key' || (card.type === 'action' && card.subType === 'controller_decision')) {
      if (selectedDataSet === null) return;
      newState = playExceptionKey(game, card.id, selectedDataSet);
    } else if (card.type === 'dpia') {
      if (selectedDataSet === null) return;
      newState = playDPIA(game, card.id, selectedDataSet);
    } else if (card.type === 'action' && card.subType === 'power_imbalance') {
      const targetDataSetIndex = game.players[1].dataSets.findIndex(ds => ds.exceptionKey?.subType === 'explicit_consent');
      if (targetDataSetIndex === -1) {
        newState = structuredClone(game);
        newState.log.push('No valid target for Power Imbalance. Opponent needs a Data Set with Explicit Consent.');
      } else {
        newState = challengeWithPowerImbalance(game, 0, 1, targetDataSetIndex, card.id);
      }
    }

    setSelectedCard(null);
    setSelectedDataSet(null);
    setGame(newState);
  }, [selectedCard, selectedDataSet, game, humanPlayer, isHumanTurn]);

  const handlePass = useCallback(() => {
    if (!isHumanTurn || game.phase !== 'play') return;
    const s = passTurn(game);
    setGame(s);
  }, [game, isHumanTurn]);

  const handleEndTurn = useCallback(() => {
    if (game.phase !== 'challenge') return;
    const s = endTurn(game);
    setGame(s);
  }, [game]);

  // AI turn
  useEffect(() => {
    if (game.winner || !game.started) return;
    if (game.currentPlayerIndex !== 0 && game.phase === 'draw') {
      setAiThinking(true);
      const timer = setTimeout(() => {
        setGame(prev => aiTurn(prev));
        setAiThinking(false);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [game.currentPlayerIndex, game.phase, game.winner, game.started]);

  const handleRestart = () => {
    setGame(scenario ? initScenarioGame(scenario) : initGame(2));
    setSelectedCard(null);
    setSelectedDataSet(null);
    setTutorialIndex(0);
    if (tutorialSteps && withGuide) setTutorialActive(true);
  };

  const selectedCardObj = humanPlayer.hand.find(c => c.id === selectedCard);
  const needsDataSet = selectedCardObj && (
    selectedCardObj.type === 'exception_key' ||
    selectedCardObj.type === 'dpia' ||
    (selectedCardObj.type === 'action' && selectedCardObj.subType === 'controller_decision')
  );
  const isPowerImbalanceSelected = selectedCardObj?.type === 'action' && selectedCardObj.subType === 'power_imbalance';

  return (
    <div className="min-h-screen bg-mystery flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-bold">Article 9: The Data Mystery</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground font-mono">
            Deck: {game.deck.length} | Turn: {currentPlayer.name}
          </span>
          {tutorialSteps && (
            <Button
              variant={tutorialActive ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTutorialActive(prev => !prev)}
            >
              <BookOpen className="w-3 h-3 mr-1" /> Guide
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleRestart}>
            <RotateCcw className="w-3 h-3 mr-1" /> Restart
          </Button>
        </div>
      </header>

      {/* Winner overlay */}
      {game.winner && (
        <div className="fixed inset-0 z-50 bg-background/80 flex items-center justify-center">
          <div className="text-center space-y-4 p-8 rounded-xl border border-primary card-glow bg-card">
            <h2 className="text-3xl font-bold text-gradient">
              {game.players.find(p => p.id === game.winner)?.name} Wins!
            </h2>
            <p className="text-muted-foreground">2 Data Sets completed. Case closed.</p>
            <Button onClick={handleRestart} size="lg">Play Again</Button>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col p-4 gap-4 max-w-6xl mx-auto w-full">
        {/* Opponent area */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-muted-foreground">
              {game.players[1].name} — Hand: {game.players[1].hand.length} cards
              {game.players[1].completedSets > 0 && ` | ✅ ${game.players[1].completedSets} sets`}
            </span>
            {aiThinking && <span className="text-xs text-primary animate-pulse">Thinking...</span>}
          </div>
          <div className="flex gap-1">
            {game.players[1].hand.map((_, i) => (
              <GameCard key={i} card={{} as Card} faceDown small />
            ))}
          </div>
          <DataSetDisplay dataSets={game.players[1].dataSets} label="AI Data Sets" />
        </div>

        {/* Game log */}
        <GameLog log={game.log} />

        {/* Action bar */}
        {isHumanTurn && !game.winner && (
          <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-secondary/30">
            <span className="text-xs font-mono text-primary uppercase tracking-wider">
              Phase: {game.phase}
            </span>

            {game.phase === 'draw' && (
              <Button onClick={handleDraw} size="sm">Draw Card</Button>
            )}

            {game.phase === 'play' && (
              <>
                {selectedCard && (
                  <Button
                    onClick={handlePlayCard}
                    size="sm"
                    disabled={needsDataSet && selectedDataSet === null}
                  >
                    Play Card
                  </Button>
                )}
                <Button onClick={handlePass} variant="outline" size="sm">
                  <SkipForward className="w-3 h-3 mr-1" /> Pass
                </Button>
                {needsDataSet && (
                  <span className="text-xs text-accent">← Select a Data Set below to attach this card</span>
                )}
                {isPowerImbalanceSelected && (
                  <span className="text-xs text-accent">Targets the first AI Data Set that uses Explicit Consent</span>
                )}
              </>
            )}

            {game.phase === 'challenge' && (
              <Button onClick={handleEndTurn} size="sm">End Turn</Button>
            )}
          </div>
        )}

        {/* Player area */}
        <div className="space-y-3">
          <DataSetDisplay
            dataSets={humanPlayer.dataSets}
            onSelectDataSet={needsDataSet ? setSelectedDataSet : undefined}
            selectedIndex={selectedDataSet ?? undefined}
            label={`Your Data Sets (${humanPlayer.completedSets}/2 completed)`}
          />

          <div className="text-sm font-semibold text-foreground">Your Hand</div>
          <div className="flex flex-wrap gap-2">
            {humanPlayer.hand.map(card => (
              <GameCard
                key={card.id}
                card={card}
                selected={selectedCard === card.id}
                onClick={game.phase === 'play' && isHumanTurn ? () => {
                  setSelectedCard(prev => prev === card.id ? null : card.id);
                  setSelectedDataSet(null);
                } : undefined}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Tutorial overlay */}
      {currentTutorialStep && (
        <TutorialOverlay
          step={currentTutorialStep}
          onNext={() => {
            if (tutorialIndex < (tutorialSteps?.length ?? 1) - 1) {
              setTutorialIndex(i => i + 1);
            } else {
              setTutorialActive(false);
            }
          }}
          onPrev={() => setTutorialIndex(i => Math.max(0, i - 1))}
          onClose={() => setTutorialActive(false)}
          canGoBack={tutorialIndex > 0}
          canGoForward={true}
        />
      )}
    </div>
  );
}
