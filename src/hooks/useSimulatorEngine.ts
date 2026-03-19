import { useState, useCallback } from "react";

export type ActionType = "ghost" | "realTalk" | "closeApp";

export interface SimState {
  streak: number;
  relationshipIntimacy: number;
  mentalEnergy: number;
  currentDay: number;
  actionTakenToday: boolean;
  gameOver: boolean;
  streakBroken: boolean;
  showDayOverlay: boolean;
  history: DayLog[];
}

export interface DayLog {
  day: number;
  action: ActionType | null;
  streak: number;
  intimacy: number;
  energy: number;
}

const INITIAL_STATE: SimState = {
  streak: 120,
  relationshipIntimacy: 50,
  mentalEnergy: 100,
  currentDay: 1,
  actionTakenToday: false,
  gameOver: false,
  streakBroken: false,
  showDayOverlay: true,
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
      relationshipIntimacy: Math.max(0, prev.relationshipIntimacy - 5),
      mentalEnergy: Math.max(0, prev.mentalEnergy - 5),
      actionTakenToday: true,
    }));
  }, [state.actionTakenToday, state.gameOver]);

  const sendRealTalk = useCallback(() => {
    if (state.actionTakenToday || state.gameOver || isBrainRotMode) return;
    setState((prev) => ({
      ...prev,
      streak: prev.streak + 1,
      relationshipIntimacy: Math.min(100, prev.relationshipIntimacy + 15),
      mentalEnergy: Math.max(0, prev.mentalEnergy - 25),
      actionTakenToday: true,
    }));
  }, [state.actionTakenToday, state.gameOver, isBrainRotMode]);

  const closeApp = useCallback(() => {
    if (state.gameOver) return;
    setState((prev) => {
      const streakBroken = !prev.actionTakenToday;
      const newStreak = streakBroken ? 0 : prev.streak;
      const log: DayLog = {
        day: prev.currentDay,
        action: prev.actionTakenToday ? (prev.history.length > 0 ? "ghost" : "ghost") : null,
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

  const dismissDayOverlay = useCallback(() => {
    setState((prev) => ({ ...prev, showDayOverlay: false }));
  }, []);

  const restart = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  // Track what action was taken for logging
  const sendGhostTracked = useCallback(() => {
    sendGhost();
    setState((prev) => ({ ...prev, _lastAction: "ghost" } as any));
  }, [sendGhost]);

  const sendRealTalkTracked = useCallback(() => {
    sendRealTalk();
    setState((prev) => ({ ...prev, _lastAction: "realTalk" } as any));
  }, [sendRealTalk]);

  return {
    state,
    isBrainRotMode,
    totalDays,
    sendGhost: sendGhostTracked,
    sendRealTalk: sendRealTalkTracked,
    closeApp,
    dismissDayOverlay,
    restart,
  };
}
