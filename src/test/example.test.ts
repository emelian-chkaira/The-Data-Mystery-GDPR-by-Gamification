import { describe, it, expect } from "vitest";
import { playExceptionKey } from "@/game/engine";
import { GameState } from "@/game/types";

describe("example", () => {
  it("should pass", () => {
    expect(true).toBe(true);
  });

  it("blocks Vital Interests on Political / Religious data", () => {
    const state: GameState = {
      players: [
        {
          id: "player-0",
          name: "You",
          hand: [
            {
              id: "vital-key",
              type: "exception_key",
              subType: "vital_interests",
              name: "Vital Interests",
              description: "Life-or-death emergency. Art 9.2c",
            },
          ],
          dataSets: [
            {
              sensitiveCard: {
                id: "political-data",
                type: "sensitive_data",
                subType: "political",
                name: "Political / Religious",
                description: "Voting behaviour, faith, political affiliations.",
              },
              completed: false,
            },
          ],
          completedSets: 0,
          isAI: false,
          skipNextTurn: false,
        },
        {
          id: "player-1",
          name: "AI 1",
          hand: [],
          dataSets: [],
          completedSets: 0,
          isAI: true,
          skipNextTurn: false,
        },
      ],
      currentPlayerIndex: 0,
      deck: [],
      discardPile: [],
      phase: "play",
      winner: null,
      log: [],
      started: true,
      pendingChallenge: null,
    };

    const next = playExceptionKey(state, "vital-key", 0);

    expect(next.players[0].dataSets[0].exceptionKey).toBeUndefined();
    expect(next.players[0].hand).toHaveLength(1);
    expect(next.log.at(-1)).toContain("Invalid combination");
  });

  it("blocks Publicly Disclosed on high-risk data", () => {
    const state: GameState = {
      players: [
        {
          id: "player-0",
          name: "You",
          hand: [
            {
              id: "public-key",
              type: "exception_key",
              subType: "publicly_disclosed",
              name: "Publicly Disclosed",
              description: "Subject made data public. Art 9.2e",
            },
          ],
          dataSets: [
            {
              sensitiveCard: {
                id: "biometric-data",
                type: "sensitive_data",
                subType: "biometric",
                name: "Biometric Data",
                description: "Fingerprints, facial recognition, iris scans.",
                isHighRisk: true,
              },
              completed: false,
            },
          ],
          completedSets: 0,
          isAI: false,
          skipNextTurn: false,
        },
        {
          id: "player-1",
          name: "AI 1",
          hand: [],
          dataSets: [],
          completedSets: 0,
          isAI: true,
          skipNextTurn: false,
        },
      ],
      currentPlayerIndex: 0,
      deck: [],
      discardPile: [],
      phase: "play",
      winner: null,
      log: [],
      started: true,
      pendingChallenge: null,
    };

    const next = playExceptionKey(state, "public-key", 0);

    expect(next.players[0].dataSets[0].exceptionKey).toBeUndefined();
    expect(next.players[0].hand).toHaveLength(1);
    expect(next.log.at(-1)).toContain("Invalid combination");
  });
});
