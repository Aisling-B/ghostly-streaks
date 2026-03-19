import { useState, useCallback, useEffect } from "react";

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
  timerActive: boolean;
  timeLeft: number;
  notification: { title: string; body: string; type: 'pressure' | 'intimacy' } | null;
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
  timerActive: false,
  timeLeft: 20,
  notification: null,
};

export function useSimulatorEngine() {
  const [state, setState] = useState<SimState>(INITIAL_STATE);

  // Auto-triggering the Hourglass pressure
  useEffect(() => {
    let interval: any;
    if (state.timerActive && state.timeLeft > 0 && !state.actionTakenToday) {
      interval = setInterval(() => {
        setState(s => ({ ...s, timeLeft: s.timeLeft - 1 }));
      }, 1000);
    } else if (state.timerActive && state.timeLeft === 0 && !state.actionTakenToday) {
      handleCloseApp();
    }
    return () => clearInterval(interval);
  }, [state.timerActive, state.timeLeft, state.actionTakenToday]);

  // Narrative Triggers based on Day
  useEffect(() => {
    if (state.showDayOverlay || state.actionTakenToday || state.notification) return;

    const triggerNarrative = () => {
      if (state.currentDay === 2) {
        setState(s => ({ ...s, notification: { title: "ALEX 🔥", body: "Send a snap! My hourglass is up! ⏳", type: 'pressure' }, timerActive: true }));
      } else if (state.currentDay === 4) {
        setState(s => ({ ...s, notification: { title: "ALEX 💬", body: "Can we actually talk? I've had a rough day.", type: 'intimacy' }, timerActive: true, timeLeft: 15 }));
      }
    };

    const timeout = setTimeout(triggerNarrative, 3000);
    return () => clearTimeout(timeout);
  }, [state.currentDay, state.actionTakenToday, state.showDayOverlay, state.notification]);

  const sendGhost = useCallback(() => {
    setState(s => ({
      ...s,
      streak: s.streak + 1,
      relationshipIntimacy: Math.max(0, s.relationshipIntimacy - 10),
      mentalEnergy: Math.max(0, s.mentalEnergy - 10),
      actionTakenToday: true,
      timerActive: false,
      notification: null
    }));
  }, []);

  const sendRealTalk = useCallback(() => {
    // Cumulative fatigue: Real talk gets harder every day
    const difficultyMultiplier = 1 + (state.currentDay * 0.2); 
    setState(s => ({
      ...s,
      streak: s.streak + 1,
      relationshipIntimacy: Math.min(100, s.relationshipIntimacy + 15),
      mentalEnergy: Math.max(0, s.mentalEnergy - (25 * difficultyMultiplier)),
      actionTakenToday: true,
      timerActive: false,
      notification: null
    }));
  }, [state.currentDay]);

  const handleCloseApp = useCallback(() => {
    setState(prev => {
      const isBroken = !prev.actionTakenToday;
      const isLastDay = prev.currentDay >= 7;
      return {
        ...prev,
        streak: isBroken ? 0 : prev.streak,
        streakBroken: isBroken,
        gameOver: isLastDay || isBroken,
        currentDay: isLastDay ? prev.currentDay : prev.currentDay + 1,
        actionTakenToday: false,
        timerActive: false,
        showDayOverlay: !isLastDay && !isBroken,
        notification: null,
        mentalEnergy: Math.min(100, prev.mentalEnergy + 20) // Only partial recovery
      };
    });
  }, []);

  return { state, sendGhost, sendRealTalk, closeApp: handleCloseApp, restart: () => setState(INITIAL_STATE), dismissDayOverlay: () => setState(s => ({ ...s, showDayOverlay: false })) };
}
