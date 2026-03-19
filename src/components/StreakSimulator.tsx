import { useSimulatorEngine } from "@/hooks/useSimulatorEngine";
import { useEffect, useState } from "react";
import { Camera, MessageCircle, Ghost, Brain, Heart, Hourglass, AlertCircle, Info } from "lucide-react";

const StreakSimulator = () => {
  const { state, sendGhost, sendRealTalk, closeApp, dismissDayOverlay, restart } = useSimulatorEngine();
  const [hoverAction, setHoverAction] = useState<"ghost" | "realTalk" | null>(null);

  useEffect(() => {
    if (state.showDayOverlay) {
      const timer = setTimeout(dismissDayOverlay, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.showDayOverlay, dismissDayOverlay]);

  const getEnergyLoss = () => {
    if (hoverAction === "ghost") return 10;
    if (hoverAction === "realTalk") return 25 * (1 + (state.currentDay * 0.2));
    return 0;
  };

  return (
    <div className={`relative flex flex-col min-h-screen max-w-md mx-auto bg-background transition-all duration-700 ${state.mentalEnergy < 20 ? "grayscale brightness-75" : ""}`}>
      
      {/* Narrative Notification Banner */}
      {state.notification && (
        <div className="absolute top-4 inset-x-4 z-[100] bg-white shadow-2xl rounded-2xl p-4 border-l-4 border-snap-yellow animate-in slide-in-from-top-full">
          <div className="flex gap-3 text-left">
            <div className="w-10 h-10 bg-snap-yellow rounded-full flex items-center justify-center text-white font-bold">A</div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-snap-yellow uppercase leading-none">{state.notification.title}</p>
              <p className="text-sm font-bold text-slate-800 mt-1">{state.notification.body}</p>
              <p className="text-[9px] text-muted-foreground mt-1 italic">Click an action below before time runs out...</p>
            </div>
          </div>
        </div>
      )}

      {/* Header with ticking clock */}
      <header className="bg-snap-yellow px-6 py-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-2 text-white font-black italic">
          <div className="w-8 h-8 bg-white/20 rounded-full" />
          <p>ALEX</p>
        </div>
        <div className={`flex items-center gap-2 rounded-full px-4 py-2 ${state.timerActive ? 'bg-destructive animate-pulse' : 'bg-black/10'}`}>
          {state.timerActive && <span className="text-white font-black text-xs">{state.timeLeft}s</span>}
          <span className="text-xl">🔥</span>
          <span className="text-white font-black text-2xl tracking-tighter">{state.streak}</span>
        </div>
      </header>

      {/* Predictive Status Bars */}
      <div className="p-6 space-y-4 bg-card border-b relative z-10">
        <div className="space-y-1 text-left">
          <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground">
            <span className="flex items-center gap-1"><Brain className="w-3 h-3" /> Cognitive Exhaustion</span>
            <span>{state.mentalEnergy}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden relative">
            <div className="h-full bg-energy transition-all duration-500" style={{ width: `${state.mentalEnergy}%` }} />
            {hoverAction && (
              <div className="absolute top-0 right-0 h-full bg-destructive/40 transition-all" 
                   style={{ width: `${getEnergyLoss()}%`, right: `${100 - state.mentalEnergy}%` }} />
            )}
          </div>
        </div>
        <div className="space-y-1 text-left">
          <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground">
            <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> Relationship Depth</span>
            <span>{state.relationshipIntimacy}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-intimacy transition-all duration-500" style={{ width: `${state.relationshipIntimacy}%` }} />
          </div>
        </div>
      </div>

      {/* Central Experience Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-10 text-center relative">
        {state.showDayOverlay && <div className="absolute inset-0 z-50 bg-background flex flex-col items-center justify-center animate-out fade-out duration-1000 delay-1000">
          <p className="text-snap-yellow text-8xl font-black italic">DAY {state.currentDay}</p>
          <p className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase mt-4">Average teen visits: 841/month</p>
        </div>}
        
        <Ghost className={`w-28 h-28 mb-6 ${state.timerActive ? 'text-destructive animate-bounce' : 'text-muted-foreground/10'}`} />
        <div className="space-y-2">
          <p className="text-sm font-bold leading-tight">
            {state.timerActive ? "THE LOSS AVERSION TRIGGER IS ACTIVE" : state.actionTakenToday ? "Maintenance complete. You're safe... for now." : "The silence is a nudge. Will you check in?"}
          </p>
          <p className="text-[9px] text-muted-foreground font-black italic max-w-[200px] mx-auto opacity-60">
            {state.mentalEnergy < 20 ? '"I get up and I\'m like oh my gosh, the world is spinning."' : ""}
          </p>
        </div>
      </div>

      {/* Action Panel: Connection vs. Maintenance */}
      <div className="p-6 pb-12 bg-background border-t shadow-2xl space-y-4">
        {!state.actionTakenToday && !state.gameOver && (
          <div className="grid grid-cols-2 gap-4">
            <button 
              onMouseEnter={() => setHoverAction("ghost")}
              onMouseLeave={() => setHoverAction(null)}
              onClick={sendGhost} 
              className="flex flex-col items-center gap-2 p-5 bg-snap-purple/10 border-2 border-snap-purple/20 rounded-3xl active:scale-95 transition-all"
            >
              <Camera className="w-8 h-8 text-snap-purple" />
              <span className="text-[10px] font-black uppercase">Send Ghost</span>
              <span className="text-[8px] text-muted-foreground font-bold">Maintenance Chore</span>
            </button>
            <button 
              onMouseEnter={() => setHoverAction("realTalk")}
              onMouseLeave={() => setHoverAction(null)}
              onClick={sendRealTalk} 
              disabled={state.mentalEnergy < (25 * (1 + (state.currentDay * 0.2)))}
              className="flex flex-col items-center gap-2 p-5 bg-snap-blue/10 border-2 border-snap-blue/20 rounded-3xl active:scale-95 transition-all disabled:opacity-20"
            >
              <MessageCircle className="w-8 h-8 text-snap-blue" />
              <span className="text-[10px] font-black uppercase">Real Talk</span>
              <span className="text-[8px] text-muted-foreground font-bold">Genuine Intimacy</span>
            </button>
          </div>
        )}
        {!state.gameOver && (
          <button onClick={closeApp} className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest border-2 border-destructive/20 text-destructive hover:bg-destructive/5 transition-colors">
            {state.actionTakenToday ? `Finish Day ${state.currentDay} →` : "Close App (Lose 120 Day Investment)"}
          </button>
        )}
      </div>

      {/* Final Summary: The "Aha!" Moment */}
      {state.gameOver && (
        <div className="absolute inset-0 z-[200] bg-background p-10 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
          <span className="text-6xl mb-4">{state.streakBroken ? "💔" : "🔥"}</span>
          <h2 className="text-4xl font-black italic uppercase mb-2">{state.streakBroken ? "Freedom?" : "Number Saved"}</h2>
          <div className="bg-card border-2 p-6 rounded-3xl w-full mb-8 text-left space-y-3">
             <div className="flex justify-between"><span>Intimacy Level:</span><span className="font-black">{state.relationshipIntimacy}%</span></div>
             <div className="flex justify-between"><span>Burnout Level:</span><span className="font-black">{100 - state.mentalEnergy}%</span></div>
             <p className="text-[10px] text-muted-foreground mt-4 italic leading-relaxed">"You opened the app average 841 times a month to protect a number. By Day 7, your friendship is {state.relationshipIntimacy < 30 ? 'dying' : 'stable'} but the loop is infinite."</p>
          </div>
          <button onClick={restart} className="w-full bg-snap-yellow text-white py-5 rounded-2xl font-black uppercase shadow-xl hover:scale-105 transition-transform">Reset the Loop</button>
        </div>
      )}
    </div>
  );
};

export default StreakSimulator;
