import { useState, useCallback, useEffect } from "react";

export type ActionType = "maintenance" | "connection" | "closeApp";

export interface SimState {
  streak: number;
  relationshipDepth: number;
  obligation: number;
  mentalEnergy: number;
  currentDay: number;
  actionTakenToday: boolean;
  gameOver: boolean;
  streakBroken: boolean;
  timerActive: boolean;
  timeLeft: number;
  notification: { title: string; body: string; type: 'guilt' | 'nudge' } | null;
  activeSnap: string | null;
}

const INITIAL_STATE: SimState = {
  streak: 120, // Research: Starting high triggers Sunk Cost Fallacy
  relationshipDepth: 50,
  obligation: 30, // Perceived pressure to maintain the loop
  mentalEnergy: 100,
  currentDay: 1,
  actionTakenToday: false,
  gameOver: false,
  streakBroken: false,
  timerActive: false,
  timeLeft: 25,
  notification: null,
  activeSnap: null,
};

export function useSimulatorEngine() {
  const [state, setState] = useState<SimState>(INITIAL_STATE);

  // Hourglass Timer: Auto-breaks streak if time runs out
  useEffect(() => {
    let interval: any;
    if (state.timerActive && state.timeLeft > 0 && !state.actionTakenToday) {
      interval = setInterval(() => setState(s => ({ ...s, timeLeft: s.timeLeft - 1 })), 1000);
    } else if (state.timerActive && state.timeLeft === 0 && !state.actionTakenToday) {
      handleCloseApp();
    }
    return () => clearInterval(interval);
  }, [state.timerActive, state.timeLeft, state.actionTakenToday]);

  // Social Pressure Triggers
  useEffect(() => {
    if (state.actionTakenToday || state.notification || state.gameOver) return;
    
    if (state.currentDay === 2) {
      setState(s => ({ 
        ...s, 
        notification: { title: "ALEX 🔥", body: "DUDE, hourglass is up! Don't let 120 days die! ⏳", type: 'nudge' },
        timerActive: true 
      }));
    }
  }, [state.currentDay, state.actionTakenToday]);

  const sendMaintenance = useCallback(() => {
    const snaps = ["ceiling", "shoes", "floor"];
    const randomSnap = snaps[Math.floor(Math.random() * snaps.length)];
    
    setState(s => ({
      ...s,
      streak: s.streak + 1,
      relationshipDepth: Math.max(0, s.relationshipDepth - 8), // Research: Meaningless content
      obligation: Math.min(100, s.obligation + 10), // Increases digital stress
      mentalEnergy: Math.max(0, s.mentalEnergy - 5),
      actionTakenToday: true,
      timerActive: false,
      notification: null,
      activeSnap: randomSnap
    }));
  }, []);

  const sendConnection = useCallback(() => {
    const difficultyMultiplier = 1 + (state.obligation / 100); 
    setState(s => ({
      ...s,
      streak: s.streak + 1,
      relationshipDepth: Math.min(100, s.relationshipDepth + 15),
      obligation: Math.max(0, s.obligation - 5),
      mentalEnergy: Math.max(0, s.mentalEnergy - (25 * difficultyMultiplier)),
      actionTakenToday: true,
      timerActive: false,
      notification: null,
      activeSnap: "genuine"
    }));
  }, [state.obligation]);

  const handleCloseApp = useCallback(() => {
    if (!state.actionTakenToday && !state.notification) {
      setState(s => ({ 
        ...s, 
        notification: { title: "ALEX 💬", body: "You're really going to let 120 days go to waste? 💔", type: 'guilt' },
        timerActive: true,
        timeLeft: 10
      }));
      return;
    }

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
        notification: null,
        activeSnap: null,
        mentalEnergy: Math.min(100, prev.mentalEnergy + 30)
      };
    });
  }, [state.actionTakenToday, state.notification]);

  return { state, sendMaintenance, sendConnection, closeApp: handleCloseApp, restart: () => setState(INITIAL_STATE) };
}
