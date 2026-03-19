import { useState, useCallback, useEffect } from "react";

export type ActionType = "maintenance" | "connection" | "closeApp";

export interface SimState {
  streak: number;
  relationshipDepth: number;
  mentalEnergy: number;
  currentDay: number;
  actionTakenToday: boolean;
  gameOver: boolean;
  streakBroken: boolean;
  timerActive: boolean;
  timeLeft: number;
  activeNotification: { title: string; body: string } | null;
  history: any[];
}

const INITIAL_STATE: SimState = {
  streak: 120, // High starting point to trigger Sunk Cost Fallacy [cite: 7603]
  relationshipDepth: 50,
  mentalEnergy: 100,
  currentDay: 1,
  actionTakenToday: false,
  gameOver: false,
  streakBroken: false,
  timerActive: false,
  timeLeft: 20,
  activeNotification: null,
  history: [],
};

export function useSimulatorEngine() {
  const [state, setState] = useState<SimState>(INITIAL_STATE);

  // Auto-triggering Hourglass pressure on specific days [cite: 7258, 8269]
  useEffect(() => {
    let interval: any;
    if (state.timerActive && state.timeLeft > 0 && !state.actionTakenToday) {
      interval = setInterval(() => setState(s => ({ ...s, timeLeft: s.timeLeft - 1 })), 1000);
    } else if (state.timerActive && state.timeLeft === 0 && !state.actionTakenToday) {
      handleCloseApp();
    }
    return () => clearInterval(interval);
  }, [state.timerActive, state.timeLeft, state.actionTakenToday]);

  // Research-grounded Narrative Triggers [cite: 7265, 7812]
  useEffect(() => {
    if (state.actionTakenToday || state.activeNotification || state.gameOver) return;
    
    if (state.currentDay === 2) {
      setState(s => ({ 
        ...s, 
        activeNotification: { title: "ALEX 🔥", body: "Don't let our 120-day streak die! Hourglass is up! ⏳" },
        timerActive: true 
      }));
    } else if (state.currentDay === 5) {
      setState(s => ({ 
        ...s, 
        activeNotification: { title: "ALEX 💬", body: "I've had a really rough day... can we actually talk?" },
        timerActive: true,
        timeLeft: 15
      }));
    }
  }, [state.currentDay, state.actionTakenToday, state.gameOver]);

  const sendMaintenance = useCallback(() => {
    setState(s => ({
      ...s,
      streak: s.streak + 1,
      relationshipDepth: Math.max(0, s.relationshipDepth - 10), // Maintenance snaps can feel "lame" or meaningless [cite: 7804, 8216]
      mentalEnergy: Math.max(0, s.mentalEnergy - 10),
      actionTakenToday: true,
      timerActive: false,
      activeNotification: null
    }));
  }, []);

  const sendConnection = useCallback(() => {
    const fatigue = 1 + (state.currentDay * 0.15); // Pressure to respond increases fatigue [cite: 7786, 7836]
    setState(s => ({
      ...s,
      streak: s.streak + 1,
      relationshipDepth: Math.min(100, s.relationshipDepth + 15),
      mentalEnergy: Math.max(0, s.mentalEnergy - (25 * fatigue)),
      actionTakenToday: true,
      timerActive: false,
      activeNotification: null
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
        activeNotification: null,
        mentalEnergy: Math.min(100, prev.mentalEnergy + 30) // Only partial energy recovery [cite: 7571]
      };
    });
  }, []);

  return { state, sendMaintenance, sendConnection, closeApp: handleCloseApp, restart: () => setState(INITIAL_STATE) };
}
