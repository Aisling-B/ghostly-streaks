import { useState, useCallback, useEffect } from "react";

export type ActionType = "maintenance" | "connection" | "closeApp";

export interface SimState {
  streak: number;
  relationshipDepth: number;
  obligation: number; // Research: Perceived obligation to maintain streaks [cite: 445]
  mentalEnergy: number;
  currentDay: number;
  actionTakenToday: boolean;
  gameOver: boolean;
  streakBroken: boolean;
  timerActive: boolean;
  timeLeft: number;
  activeNotification: { title: string; body: string; type: 'pressure' | 'guilt' } | null;
  currentSnap: 'ceiling' | 'shoes' | 'black' | 'genuine' | null;
}

const INITIAL_STATE: SimState = {
  streak: 120, // Starting high to trigger immediate Sunk Cost Fallacy [cite: 521]
  relationshipDepth: 50,
  obligation: 30,
  mentalEnergy: 100,
  currentDay: 1,
  actionTakenToday: false,
  gameOver: false,
  streakBroken: false,
  timerActive: false,
  timeLeft: 20,
  activeNotification: null,
  currentSnap: null,
};

export function useSimulatorEngine() {
  const [state, setState] = useState<SimState>(INITIAL_STATE);

  // Hourglass Timer: Auto-breaks streak at 0 [cite: 176, 1187]
  useEffect(() => {
    let interval: any;
    if (state.timerActive && state.timeLeft > 0 && !state.actionTakenToday) {
      interval = setInterval(() => setState(s => ({ ...s, timeLeft: s.timeLeft - 1 })), 1000);
    } else if (state.timerActive && state.timeLeft === 0 && !state.actionTakenToday) {
      handleCloseApp();
    }
    return () => clearInterval(interval);
  }, [state.timerActive, state.timeLeft, state.actionTakenToday]);

  // Social Pressure Triggers [cite: 580, 581]
  useEffect(() => {
    if (state.actionTakenToday || state.activeNotification || state.gameOver) return;
    
    if (state.currentDay === 3) {
      setState(s => ({ 
        ...s, 
        activeNotification: { title: "ALEX 🔥", body: "DUDE, hourglass is up! Don't let 120 days die! ⏳", type: 'pressure' },
        timerActive: true 
      }));
    }
  }, [state.currentDay, state.actionTakenToday]);

  const sendMaintenance = useCallback(() => {
    const images: ('ceiling' | 'shoes' | 'black')[] = ['ceiling', 'shoes', 'black'];
    const randomImg = images[Math.floor(Math.random() * images.length)];
    
    setState(s => ({
      ...s,
      streak: s.streak + 1,
      relationshipDepth: Math.max(0, s.relationshipDepth - 10), // Research: Content adds no value [cite: 1129, 1130]
      obligation: Math.min(100, s.obligation + 15), // Becomes a "behavioral chore"
      mentalEnergy: Math.max(0, s.mentalEnergy - 10),
      actionTakenToday: true,
      timerActive: false,
      activeNotification: null,
      currentSnap: randomImg
    }));
  }, []);

  const sendConnection = useCallback(() => {
    // Cognitive load: Real talk costs more when obligation is high [cite: 342]
    const fatigueMultiplier = 1 + (state.obligation / 100);
    setState(s => ({
      ...s,
      streak: s.streak + 1,
      relationshipDepth: Math.min(100, s.relationshipDepth + 15),
      obligation: Math.max(0, s.obligation - 10),
      mentalEnergy: Math.max(0, s.mentalEnergy - (25 * fatigueMultiplier)),
      actionTakenToday: true,
      timerActive: false,
      activeNotification: null,
      currentSnap: 'genuine'
    }));
  }, [state.obligation]);

  const handleCloseApp = useCallback(() => {
    if (!state.actionTakenToday && !state.activeNotification) {
      setState(s => ({ 
        ...s, 
        activeNotification: { title: "ALEX 💬", body: "You're really going to let 120 days go to waste? 💔", type: 'guilt' },
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
        activeNotification: null,
        currentSnap: null,
        mentalEnergy: Math.min(100, prev.mentalEnergy + 30) // Only partial rest
      };
    });
  }, [state.actionTakenToday, state.activeNotification]);

  return { state, sendMaintenance, sendConnection, closeApp: handleCloseApp, restart: () => setState(INITIAL_STATE) };
}
