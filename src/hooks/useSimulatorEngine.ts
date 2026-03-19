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
  notification: { title: string; body: string; type: ActionType } | null;
  history: any[];
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
  timeLeft: 30,
  notification: null,
  history: [],
};

export function useSimulatorEngine() {
  const [state, setState] = useState<SimState>(INITIAL_STATE);

  // Timer Logic: Auto-break streak if time runs out
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

  // Story Trigger: Random urgency notifications
  useEffect(() => {
    if (state.showDayOverlay || state.actionTakenToday || state.notification) return;
    
    const triggerStory = () => {
      const stories = [
        { title: "ALEX 👻", body: "Sending my streaks! Don't let it die! ⏳", type: "ghost" as ActionType },
        { title: "ALEX 💬", body: "I've had a really bad day, can we talk?", type: "realTalk" as ActionType }
      ];
      const selected = stories[Math.floor(Math.random() * stories.length)];
      setState(s => ({ ...s, notification: selected, timerActive: true, timeLeft: 20 }));
    };

    const timeout = setTimeout(triggerStory, 3000);
    return () => clearTimeout(timeout);
  }, [state.currentDay, state.actionTakenToday, state.showDayOverlay, state.notification]);

  const sendGhost = useCallback(() => {
    setState(s => ({
      ...s,
      streak: s.streak + 1,
      relationshipIntimacy: Math.max(0, s.relationshipIntimacy - 5),
      mentalEnergy: Math.max(0, s.mentalEnergy - 10),
      actionTakenToday: true,
      timerActive: false,
      notification: null
    }));
  }, []);

  const sendRealTalk = useCallback(() => {
    setState(s => ({
      ...s,
      streak: s.streak + 1,
      relationshipIntimacy: Math.min(100, s.relationshipIntimacy + 15),
      mentalEnergy: Math.max(0, s.mentalEnergy - 30),
      actionTakenToday: true,
      timerActive: false,
      notification: null
    }));
  }, []);

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
        notification: null
      };
    });
  }, []);

  return { state, sendGhost, sendRealTalk, closeApp: handleCloseApp, restart: () => setState(INITIAL_STATE), dismissDayOverlay: () => setState(s => ({ ...s, showDayOverlay: false })) };
}
