import { useSimulatorEngine } from "@/hooks/useSimulatorEngine";
import { useEffect } from "react";
import { Camera, MessageCircle, X, Ghost, Brain, Heart, Hourglass, AlertCircle } from "lucide-react";

const StreakSimulator = () => {
  const { state, sendGhost, sendRealTalk, closeApp, dismissDayOverlay, restart } = useSimulatorEngine();

  useEffect(() => {
    if (state.showDayOverlay) {
      const timer = setTimeout(dismissDayOverlay, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.showDayOverlay, dismissDayOverlay]);

  return (
    <div className={`relative flex flex-col min-h-screen max-w-md mx-auto bg-background transition-all duration-500 ${state.mentalEnergy < 30 ? "grayscale-[0.5]" : ""}`}>
      
      {/* 1. Notification Story */}
      {state.notification && (
        <div className="absolute top-4 inset-x-4 z-[100] bg-white shadow-2xl rounded-2xl p-4 border-l-4 border-snap-yellow animate-in slide-in-from-top-full">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-snap-yellow rounded-full flex items-center justify-center text-white font-bold">A</div>
            <div className="flex-1">
              <p className="text-xs font-black text-snap-yellow uppercase leading-none">{state.notification.title}</p>
              <p className="text-sm font-bold text-slate-800 mt-1">{state.notification.body}</p>
            </div>
          </div>
        </div>
      )}

      {/* Header with ticking clock */}
      <header className="bg-snap-yellow px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-full" />
          <p className="text-white font-black italic">ALEX</p>
        </div>
        <div className={`flex items-center gap-2 rounded-full px-4 py-2 ${state.timerActive ? 'bg-destructive animate-pulse' : 'bg-black/10'}`}>
          {state.timerActive && <span className="text-white font-black text-xs">{state.timeLeft}s</span>}
          <span className="text-xl">🔥</span>
          <span className="text-white font-black text-2xl tracking-tighter">{state.streak}</span>
        </div>
      </header>

      {/* Status Bars with Cost Preview */}
      <div className="p-6 space-y-4">
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground">
            <span className="flex items-center gap-1"><Brain className="w-3 h-3" /> Mental Energy</span>
            <span>{state.mentalEnergy}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-energy transition-all" style={{ width: `${state.mentalEnergy}%` }} />
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground">
            <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> Relationship</span>
            <span>{state.relationshipIntimacy}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-intimacy transition-all" style={{ width: `${state.relationshipIntimacy}%` }} />
          </div>
        </div>
      </div>

      {/* Experience Display */}
      <div className="flex-1 flex flex-col items-center justify-center px-10 text-center">
        {state.showDayOverlay && <div className="absolute inset-0 z-50 bg-background flex items-center justify-center text-snap-yellow text-8xl font-black italic">DAY {state.currentDay}</div>}
        
        <Ghost className={`w-24 h-24 mb-6 ${state.timerActive ? 'text-destructive animate-bounce' : 'text-muted-foreground/10'}`} />
        <div className="space-y-2">
          <p className="text-sm font-bold leading-tight">
            {state.timerActive ? "THE HOURGLASS IS TICKING!" : state.actionTakenToday ? "You saved the streak. But at what cost?" : "Wait for Alex..."}
          </p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Day {state.currentDay} of 7</p>
        </div>
      </div>

      {/* Actions with Tooltips/Costs */}
      <div className="p-6 pb-12 bg-card border-t space-y-4">
        {!state.actionTakenToday && (
          <div className="grid grid-cols-2 gap-4">
            <button onClick={sendGhost} className="group relative flex flex-col items-center gap-2 p-4 bg-snap-purple/10 border-2 border-snap-purple/20 rounded-2xl active:scale-95 transition-all">
              <Camera className="w-6 h-6 text-snap-purple" />
              <span className="text-[10px] font-black uppercase">Send Ghost</span>
              <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-black text-white text-[8px] px-2 py-1 rounded">Energy: -10 | Intimacy: -5</div>
            </button>
            <button onClick={sendRealTalk} disabled={state.mentalEnergy < 30} className="group relative flex flex-col items-center gap-2 p-4 bg-snap-blue/10 border-2 border-snap-blue/20 rounded-2xl active:scale-95 transition-all disabled:opacity-30">
              <MessageCircle className="w-6 h-6 text-snap-blue" />
              <span className="text-[10px] font-black uppercase">Real Talk</span>
              <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-black text-white text-[8px] px-2 py-1 rounded">Energy: -30 | Intimacy: +15</div>
            </button>
          </div>
        )}
        <button onClick={closeApp} className="w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest border-2 border-destructive/20 text-destructive">
          {state.actionTakenToday ? "Sleep and Reset Energy" : "Ignore Alex (Lose Streak)"}
        </button>
      </div>
      
      {state.gameOver && (
        <div className="absolute inset-0 z-[200] bg-background p-10 flex flex-col items-center justify-center text-center">
          <span className="text-6xl mb-4">{state.streakBroken ? "💔" : "🔥"}</span>
          <h2 className="text-4xl font-black italic uppercase mb-2">{state.streakBroken ? "Streak Dead" : "Goal Met?"}</h2>
          <p className="text-xs text-muted-foreground mb-10 leading-relaxed italic">"Teenagers open this app average 841 times a month. You maintained a number, but did you maintain the person?"</p>
          <button onClick={restart} className="w-full bg-snap-yellow text-white py-5 rounded-2xl font-black uppercase shadow-xl">Restart Simulation</button>
        </div>
      )}
    </div>
  );
};

export default StreakSimulator;
