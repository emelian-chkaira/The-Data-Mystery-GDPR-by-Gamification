/**
 * Tutorial steps are matched to game state conditions.
 * Each step has a trigger (when to show) and guidance text.
 */

export interface TutorialStep {
  id: string;
  /** Title shown in the overlay */
  title: string;
  /** Explanation for the audience */
  explanation: string;
  /** What the presenter should do */
  action: string;
  /** GDPR concept being demonstrated */
  concept?: string;
  /** Condition to auto-advance: matched against game log or phase */
  triggerPhase?: string;
  /** Step number for progress indicator */
  step: number;
  totalSteps: number;
}

export interface ScenarioTutorial {
  scenarioId: string;
  steps: Omit<TutorialStep, 'step' | 'totalSteps'>[];
}

const TUTORIALS: ScenarioTutorial[] = [
  {
    scenarioId: 'demo-perfect',
    steps: [
      {
        id: 'welcome',
        title: 'Welcome to Article 9',
        explanation:
          'Article 9 of the GDPR prohibits processing "special category" data unless a specific legal exception applies. In this game, you must build complete Data Sets by pairing Sensitive Data cards with the correct Exception Keys.',
        action: 'Press "Draw Card" to begin your first turn.',
        concept: 'Art. 9 — Special Categories of Personal Data',
      },
      {
        id: 'play-health',
        title: 'Play Sensitive Data',
        explanation:
          'Health data (diagnoses, prescriptions, medical records) is a special category under Art. 9. It cannot be processed without a legal basis. By playing this card, you start a Data Set that needs an Exception Key to be completed.',
        action: 'Select the "Health Data" card from your hand, then press "Play Card".',
        concept: 'Art. 9.1 — Health data as special category',
      },
      {
        id: 'end-turn-1',
        title: 'End Your Turn',
        explanation:
          'After playing a card, the Challenge phase begins. Other players could challenge your play (e.g. with Power Imbalance). Since the AI has no challenge, we proceed.',
        action: 'Press "End Turn" to let the AI take its turn.',
        concept: 'Challenge Phase — Art. 9 compliance checks',
      },
      {
        id: 'wait-ai-1',
        title: 'AI Takes Its Turn',
        explanation:
          'The AI opponent also collects data. Watch the game log — the AI will draw a card and try to build its own Data Set. In a real scenario, multiple data controllers may compete to process data.',
        action: 'Wait for the AI to finish, then draw your next card.',
      },
      {
        id: 'add-consent',
        title: 'Add an Exception Key',
        explanation:
          'Explicit Consent (Art. 9.2a) is one of the strongest legal bases. The data subject must give clear, specific, informed, and unambiguous consent. Select the "Explicit Consent" card, then select the Health Data set below to attach it.',
        action: 'Select "Explicit Consent", choose the Health Data set, then press "Play Card".',
        concept: 'Art. 9.2(a) — Explicit Consent',
      },
      {
        id: 'set-complete-1',
        title: '✅ First Data Set Complete!',
        explanation:
          'Health Data + Explicit Consent = a lawfully completed Data Set. The data can now be processed. Note: Health Data is NOT high-risk in this scenario, so no DPIA is required.',
        action: 'Press "End Turn" to continue.',
        concept: 'Lawful basis established under Art. 9.2',
      },
      {
        id: 'draw-for-biometric',
        title: 'Prepare for High-Risk Data',
        explanation:
          'Next we\'ll handle Biometric Data — fingerprints, facial recognition, iris scans. This is marked as HIGH RISK, meaning under Article 35, a Data Protection Impact Assessment (DPIA) is mandatory before processing.',
        action: 'Draw a card, then play "Biometric Data" from your hand.',
        concept: 'Art. 35 — Data Protection Impact Assessment',
      },
      {
        id: 'play-dpia',
        title: 'Apply DPIA Safeguard',
        explanation:
          'A DPIA is required when processing is "likely to result in a high risk" to data subjects. It must be done BEFORE processing begins. The DPIA card represents completing this assessment.',
        action: 'Select the "DPIA Safeguard" card, choose the Biometric Data set, then play it.',
        concept: 'Art. 35 — When is a DPIA required?',
      },
      {
        id: 'play-vital',
        title: 'Add Exception Key to High-Risk Set',
        explanation:
          'Vital Interests (Art. 9.2c) applies in life-or-death situations where the data subject cannot give consent. Combined with the DPIA, this completes the high-risk Data Set lawfully.',
        action: 'Select "Vital Interests", choose the Biometric set, then play it.',
        concept: 'Art. 9.2(c) — Vital Interests',
      },
      {
        id: 'victory',
        title: '🎉 You Win — Case Closed!',
        explanation:
          'You completed 2 Data Sets lawfully:\n• Health Data + Explicit Consent (standard)\n• Biometric Data + DPIA + Vital Interests (high-risk)\n\nThis demonstrates the full Art. 9 compliance flow, including when Art. 35 DPIA safeguards apply.',
        action: 'Discussion time! Ask the audience about other exception types.',
        concept: 'Full Art. 9 + Art. 35 compliance',
      },
    ],
  },
  {
    scenarioId: 'demo-challenge',
    steps: [
      {
        id: 'welcome',
        title: 'Challenge Mechanic Demo',
        explanation:
          'This scenario shows what happens when consent is obtained under duress. The "Power Imbalance" card lets you challenge an opponent\'s Explicit Consent — a key GDPR concept (Recital 43).',
        action: 'Press "Draw Card" to begin.',
        concept: 'Recital 43 — Power Imbalance in Consent',
      },
      {
        id: 'play-data',
        title: 'Start Building Your Case',
        explanation:
          'Play a Sensitive Data card to start your Data Set. Meanwhile, observe the AI — it will also build a set using Explicit Consent, which you can later challenge.',
        action: 'Select and play "Health Data", then end your turn.',
        concept: 'Art. 9.1 — Processing prohibition',
      },
      {
        id: 'wait-ai-consent',
        title: 'Watch the AI Use Explicit Consent',
        explanation:
          'The AI plays Sensitive Data and adds Explicit Consent. But was this consent truly freely given? In employer-employee or government-citizen relationships, consent may not be valid due to power imbalance.',
        action: 'Wait for the AI, then draw your next card.',
        concept: 'Recital 43 — Freely given consent',
      },
      {
        id: 'challenge',
        title: '⚔️ Challenge with Power Imbalance!',
        explanation:
          'Power Imbalance destroys the opponent\'s Explicit Consent play and their entire Data Set. This represents a DPA ruling that consent was not freely given — the processing must stop.',
        action: 'Use the Power Imbalance card to challenge the AI\'s consent.',
        concept: 'Art. 7.4 + Recital 43 — Invalid consent',
      },
      {
        id: 'continue',
        title: 'Complete Your Own Sets',
        explanation:
          'With the AI\'s set destroyed, continue building your own lawful Data Sets to win. This shows that invalid consent has serious consequences — all processing based on it must cease.',
        action: 'Continue playing to complete 2 Data Sets and win.',
        concept: 'Art. 17 — Right to erasure after unlawful processing',
      },
    ],
  },
  {
    scenarioId: 'demo-high-risk',
    steps: [
      {
        id: 'welcome',
        title: 'High-Risk Processing & DPIA',
        explanation:
          'This scenario focuses on Article 35: when processing involves high-risk data (biometric, genetic), a DPIA must be conducted BEFORE processing begins. Without it, the Data Set cannot be completed.',
        action: 'Press "Draw Card" to begin.',
        concept: 'Art. 35 — DPIA requirement',
      },
      {
        id: 'play-biometric',
        title: 'Play High-Risk Data',
        explanation:
          'Biometric data (🔴 HIGH RISK) requires both an Exception Key AND a DPIA. Notice the red indicator — this data needs extra protection under Art. 35.',
        action: 'Play "Biometric Data" from your hand.',
        concept: 'Art. 9.1 + Art. 35.3 — High-risk processing',
      },
      {
        id: 'add-dpia-1',
        title: 'Conduct the DPIA',
        explanation:
          'The DPIA must assess: necessity, proportionality, risks to data subjects, and mitigation measures. Playing this card represents successfully completing the impact assessment.',
        action: 'Select "DPIA Safeguard", choose the Biometric set, then play.',
        concept: 'Art. 35.7 — DPIA content requirements',
      },
      {
        id: 'add-key-1',
        title: 'Add Exception Key',
        explanation:
          'Even with a DPIA, you still need a valid legal basis under Art. 9.2. The DPIA is an additional safeguard, not a replacement for the legal exception.',
        action: 'Add "Explicit Consent" to the Biometric Data set.',
        concept: 'Art. 9.2 + Art. 35 — Cumulative requirements',
      },
      {
        id: 'second-set',
        title: 'Complete a Second High-Risk Set',
        explanation:
          'Now handle Genetic Data — DNA profiles, inherited traits. Also high-risk. You need another DPIA + Exception Key combination. Each high-risk processing activity needs its own assessment.',
        action: 'Play Genetic Data, then add DPIA + an Exception Key.',
        concept: 'Art. 35.1 — Per-processing DPIA requirement',
      },
      {
        id: 'victory',
        title: '🎉 Full DPIA Compliance!',
        explanation:
          'Both high-risk Data Sets completed with proper DPIAs. Key takeaway: Art. 35 is triggered by "high risk" — systematic processing of biometric/genetic data always qualifies.',
        action: 'Discuss: When should organisations consult the DPA? (Art. 36)',
        concept: 'Art. 36 — Prior consultation with supervisory authority',
      },
    ],
  },
];

export function getTutorialForScenario(scenarioId: string): TutorialStep[] | null {
  const tutorial = TUTORIALS.find(t => t.scenarioId === scenarioId);
  if (!tutorial) return null;

  const total = tutorial.steps.length;
  return tutorial.steps.map((s, i) => ({
    ...s,
    step: i + 1,
    totalSteps: total,
  }));
}
