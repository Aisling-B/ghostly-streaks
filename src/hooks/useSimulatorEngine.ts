import { useState, useCallback, useEffect } from "react";

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
  currentNotification: { title: string; body: string } | null;
  timerActive: boolean;
  timeLeft: number;
  history: any[];
}

const INSIGHTS: Record<string, Insight> = {
  ghost: {
    title: "The Maintenance Chore",
    body: "Sending a 'blank' snap is a behavioral chore. You aren't connecting with Alex; you're just servicing a number so it doesn't disappear.",
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
  currentNotification: null,
  timerActive: false,
  timeLeft: 30,
  history: [],
};

export function useSimulatorEngine() {
  const [state, setState] = useState<SimState>(INITIAL_STATE);
  const totalDays = 7;

  // Real-time Timer Logic
  useEffect(() => {
    let interval: any;
    if (state.timerActive && state.timeLeft > 0 && !state.actionTakenToday && !state.gameOver) {
      interval = setInterval(() => {
        setState(s => ({ ...s, timeLeft: s.timeLeft - 1 }));
      }, 1000);
    } else if (state.timerActive && state.timeLeft === 0 && !state.actionTakenToday && !state.gameOver) {
      // Auto-fail the day if timer hits zero
      handleCloseApp();
    }
    return () => clearInterval(interval);
  }, [state.timerActive, state.timeLeft, state.actionTakenToday, state.gameOver]);

  // Social Pressure Triggers on specific days
  useEffect(() => {
    const triggerDays = [2, 5, 7];
    if (triggerDays.includes(state.currentDay) && !state.actionTakenToday && !state.timerActive && !state.showDayOverlay && !state.gameOver) {
      setState(s => ({
        ...s,
        timerActive: true,
        timeLeft: 30, 
        currentNotification: {
          title: "ALEX 👻",
          body: "DUDE the hourglass is up! Don't let it die! ⏳"
        }
      }));
    }
  }, [state.currentDay, state.actionTakenToday, state.timerActive, state.showDayOverlay, state.gameOver]);

  const sendGhost = useCallback(() => {
    setState(prev => ({
      ...prev,
      streak: prev.streak + 1,
      relationshipIntimacy: Math.max(0, prev.relationshipIntimacy - 8),
      mentalEnergy: Math.max(0, prev.mentalEnergy - 10),
      actionTakenToday: true,
      currentInsight: INSIGHTS.ghost,
      currentNotification: null,
      timerActive: false
    }));
  }, []);

  const sendRealTalk = useCallback(() => {
    setState(prev => ({
      ...prev,
      streak: prev.streak + 1,
      relationshipIntimacy: Math.min(100, prev.relationshipIntimacy + 15),
      mentalEnergy: Math.max(0, prev.mentalEnergy - 30),
      actionTakenToday: true,
      currentNotification: null,
      timerActive: false
    }));
  }, []);

  const handleCloseApp = useCallback(() => {
    setState(prev => {
      const isBroken = !prev.actionTakenToday;
      const isLastDay = prev.currentDay >= totalDays;
      return {
        ...prev,
        streak: isBroken ? 0 : prev.streak,
        streakBroken: isBroken,
        gameOver: isLastDay || isBroken,
        currentDay: isLastDay ? prev.currentDay : prev.currentDay + 1,
        actionTakenToday: false,
        timerActive: false,
        showDayOverlay: !isLastDay && !isBroken,
        currentNotification: null,
        currentInsight: isBroken ? INSIGHTS.lossAversion : null
      };
    });
  }, []);

  return {
    state,
    totalDays,
    sendGhost,
    sendRealTalk,
    closeApp: handleCloseApp,
    dismissInsight: () => setState(s => ({ ...s, currentInsight: null })),
    dismissNotification: () => setState(s => ({ ...s, currentNotification: null })),
    dismissDayOverlay: () => setState(s => ({ ...s, showDayOverlay: false })),
    restart: () => setState(INITIAL_STATE)
  };
}
