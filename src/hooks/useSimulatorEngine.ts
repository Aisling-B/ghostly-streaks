import { useState, useCallback } from "react";

export type ActionType = "ghost" | "realTalk" | "closeApp";

export interface Insight {
  title: string;
  body: string;
  source?: string;
}

export interface SimState {
  streak: number;
  relationshipIntimacy: number;
  mentalEnergy: number;
  currentDay: number;
  actionTakenToday: boolean;
  gameOver: boolean;
  streakBroken: boolean;
  showDayOverlay: boolean;
  currentInsight: Insight | null;
  history: DayLog[];
}

export interface DayLog {
  day: number;
  action: ActionType | null;
  streak: number;
  intimacy: number;
  energy: number;
}

const INSIGHTS: Record<string, Insight> = {
  ghost: {
    title: "The Maintenance Chore",
    body: "Sending a 'blank' snap is a behavioral chore. You aren't connecting with Alex; you're just servicing a number so it doesn't disappear.",
    source: ""
  },
  realTalk: {
    title: "Connection vs. Maintenance",
    body: "Real Talk builds intimacy but costs 5x more energy. 15-24% of late-night activity is 'ghosting'—teens are often too tired to connect but too anxious to stop.",
    source: ""
  },
  lossAversion: {
    title: "Loss Aversion",
    body: "The pain of losing a 120-day streak is psychologically twice as powerful as the joy of starting one. This fear keeps you trapped in the loop.",
    source: ""
  }
};

const INITIAL_STATE: SimState = {
  streak: 120,
  relationshipIntimacy: 50,
  mentalEnergy: 100,
  currentDay: 1,
  actionTakenToday: false,
  gameOver: false,
  streakBroken: false,
  showDayOverlay: true,
  currentInsight: null,
  history: [],
};

export function useSimulatorEngine() {
  const [state, setState] = useState<SimState>(INITIAL_STATE);
  const totalDays = 7;

  const sendGhost = useCallback(() => {
    if (state.actionTakenToday || state.gameOver) return;
    setState((prev) => ({
      ...prev,
      streak: prev.streak + 1,
      relationshipIntimacy: Math.max(0, prev.relationshipIntimacy - 8),
      mentalEnergy: Math.max(0, prev.mentalEnergy - 10),
      actionTakenToday: true,
      currentInsight: INSIGHTS.ghost
    }));
  }, [state.actionTakenToday, state.gameOver]);

  const sendRealTalk = useCallback(() => {
    if (state.actionTakenToday || state.gameOver || state.mentalEnergy <= 20) return;
    setState((prev) => ({
      ...prev,
      streak: prev.streak + 1,
      relationshipIntimacy: Math.min(100, prev.relationshipIntimacy + 15),
      mentalEnergy: Math.max(0, prev.mentalEnergy - 30),
      actionTakenToday: true,
      currentInsight: INSIGHTS.realTalk
    }));
  }, [state.actionTakenToday, state.gameOver, state.mentalEnergy]);

  const closeApp = useCallback(() => {
    if (state.gameOver) return;
    setState((prev) => {
      const isBroken = !prev.actionTakenToday;
      const newStreak = isBroken ? 0 : prev.streak;
      const isLastDay = prev.currentDay >= totalDays;
      
      return {
        ...prev,
        streak: newStreak,
        streakBroken: isBroken,
        currentDay: isLastDay ? prev.currentDay : prev.currentDay + 1,
        actionTakenToday: false,
        gameOver: isLastDay || isBroken,
        showDayOverlay: !isLastDay && !isBroken,
        history: [...prev.history, { day: prev.currentDay, action: prev.actionTakenToday ? "ghost" : null, streak: newStreak, intimacy: prev.relationshipIntimacy, energy: prev.mentalEnergy }],
      };
    });
  }, [state.gameOver]);

  return {
    state,
    totalDays,
    sendGhost,
    sendRealTalk,
    closeApp,
    dismissInsight: () => setState(s => ({ ...s, currentInsight: null })),
    dismissDayOverlay: () => setState(s => ({ ...s, showDayOverlay: false })),
    restart: () => setState(INITIAL_STATE)
  };
}
