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
    body: "Real Talk builds intimacy but costs 5x more energy. This is why 15-24% of teen activity late at night is 'ghosting'—they are too tired to connect but too anxious to stop.",
    source: ""
  },
  lossAversion: {
    title: "Loss Aversion",
    body: "The pain of losing a 120-day streak is psychologically twice as powerful as the joy of starting one. This keeps you trapped in the loop.",
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

  const isBrainRotMode = state.mentalEnergy <= 0;
  const totalDays = 7;

  const sendGhost = useCallback(() => {
    if (state.actionTakenToday || state.gameOver) return;
    setState((prev) => ({
      ...prev,
      streak: prev.streak + 1,
      relationshipIntimacy: Math.max(0, prev.relationshipIntimacy - 8), // Increased penalty
      mentalEnergy: Math.max(0, prev.mentalEnergy - 10),
      actionTakenToday: true,
      currentInsight: INSIGHTS.ghost
    }));
  }, [state.actionTakenToday, state.gameOver]);

  const sendRealTalk = useCallback(() => {
    if (state.actionTakenToday || state.gameOver || isBrainRotMode) return;
    setState((prev) => ({
      ...prev,
      streak: prev.streak + 1,
      relationshipIntimacy: Math.min(100, prev.relationshipIntimacy + 15),
      mentalEnergy: Math.max(0, prev.mentalEnergy - 30), // Higher cost
      actionTakenToday: true,
      currentInsight: INSIGHTS.realTalk
    }));
  }, [state.actionTakenToday, state.gameOver, isBrainRotMode]);

  const closeApp = useCallback(() => {
    if (state.gameOver) return;
    setState((prev) => {
      const streakBroken = !prev.actionTakenToday;
      if (streakBroken && !prev.currentInsight) {
         // Optionally trigger loss aversion warning before actual break logic
      }
      const newStreak = streakBroken ? 0 : prev.streak;
      const log: DayLog = {
        day: prev.currentDay,
        action: prev.actionTakenToday ? "ghost" : null,
        streak: newStreak,
        intimacy: prev.relationshipIntimacy,
        energy: prev.mentalEnergy,
      };
      const isLastDay = prev.currentDay >= totalDays;
      return {
        ...prev,
        streak: newStreak,
        streakBroken: streakBroken || prev.streakBroken,
        currentDay: isLastDay ? prev.currentDay : prev.currentDay + 1,
        actionTakenToday: false,
        gameOver: isLastDay || streakBroken,
        showDayOverlay: !isLastDay && !streakBroken,
        history: [...prev.history, log],
      };
    });
  }, [state.gameOver]);

  const dismissInsight = useCallback(() => {
    setState((prev) => ({ ...prev, currentInsight: null }));
  }, []);

  const dismissDayOverlay = useCallback(() => {
    setState((prev) => ({ ...prev, showDayOverlay: false }));
  }, []);

  const restart = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  return {
    state,
    isBrainRotMode,
    totalDays,
    sendGhost,
    sendRealTalk,
    closeApp,
    dismissDayOverlay,
    dismissInsight,
    restart,
  };
}
