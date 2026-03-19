import { useSimulatorEngine } from "@/hooks/useSimulatorEngine";
import { useEffect, useState } from "react";
import { Camera, MessageCircle, X, RotateCcw, Ghost, Brain, Heart, Zap, Info, AlertTriangle, Hourglass } from "lucide-react";

const StreakSimulator = () => {
  const { state, sendGhost, sendRealTalk, closeApp, dismissDayOverlay, dismissInsight, dismissNotification, restart } = useSimulatorEngine();
  const [showLossModal, setShowLossModal] = useState(false);

  useEffect(() => {
    if (state.showDayOverlay) {
      const timer = setTimeout(dismissDayOverlay, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.showDayOverlay, dismissDayOverlay]);

  const isExhausted = state.mentalEnergy <= 25;

  return (
    <div className={`relative flex flex-col min-h-screen max-w-md mx-auto overflow-hidden bg-background transition-all duration-700 ${isExhausted ? "grayscale-[0.5] brightness-75" : ""}`}>
      
      {/* 1. Push Notification */}
      {state.currentNotification && (
        <div className="absolute top-4 inset-x-4 z-[150] bg-white/95 backdrop-blur shadow-2xl rounded-2xl p-4 border-l-4 border-snap-yellow animate-in slide-in-from-top-full duration-500">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-snap-yellow rounded-lg flex items-center justify-center text-xs">👻</div>
            <div className="flex-1 text-left">
              <p className="text-[10px] font-black uppercase text-snap-yellow leading-none">{state.currentNotification.title}</p>
              <p className="text-xs font-bold text-slate-800 mt-1">{state.currentNotification.body}</p>
            </div>
            <button onClick={dismissNotification}><X className="w-4 h-4 text-slate-400" /></button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-snap-yellow px-6 py-4 flex items-center justify-between shadow-md z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-lg">👤</div>
          <p className="text-primary-foreground font-black text-lg italic uppercase leading-none">Alex</p>
        </div>
        <div className={`flex items-center gap-2 rounded-full px-4 py-2 transition-colors ${state.timerActive ? 'bg-destructive animate-pulse' : 'bg-black/10'}`}>
          {state.timerActive && <span className="text-white font-black text-xs">{state.timeLeft}s</span>}
          <span className="text-xl">🔥</span>
          <span className="text-primary-foreground font-black text-2xl tracking-tighter">{state.streak}</span>
        </div>
      </header>

      {/* STATUS BARS: Moved outside of transitions to ensure visibility */}
      <div className="px-6 py-4 grid grid-cols-2 gap-4 bg-muted/20 border-b z-10">
        <div className="space-y-1 text-left">
          <span className="text-[9px] font-black uppercase text-muted-foreground block">Cognitive Energy</span>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden border">
            <div className="h-full bg-energy transition-all duration-700" style={{ width: `${state.mentalEnergy}%` }} />
          </div>
        </div>
        <div className="space-y-1 text-left">
          <span className="text-[9px] font-black uppercase text-muted-foreground block">Relationship Depth</span>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden border">
            <div className="h-full bg-intimacy transition-all duration-700" style={{ width: `${state.relationshipIntimacy}%` }} />
          </div>
        </div>
      </div>

      <div className="flex-1 relative flex flex-col items-center justify-center p-10">
        {/* Day Overlay */}
        {state.showDayOverlay && !state.gameOver && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/95">
            <p className="text-snap-yellow text-8xl font-black italic">DAY {state.currentDay}</p>
          </div>
        )}

        {/* Psychology Insight */}
        {state.currentInsight && (
          <div className="absolute inset-0 z-40 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
            <div className="bg-card border-2 border-snap-yellow rounded-3xl p-6 shadow-2xl animate-in zoom-in duration-300">
              <div className="flex items-center gap-2 mb-4"><Info className="w-5 h-5 text-snap-yellow" /><h3 className="font-black text-xl uppercase tracking-tight">{state.currentInsight.title}</h3></div>
              <p className="text-sm text-muted-foreground mb-6 italic leading-relaxed">"{state.currentInsight.body}"</p>
              <button onClick={dismissInsight} className="w-full bg-snap-yellow text-primary-foreground py-3 rounded-xl font-bold uppercase text-xs">Close</button>
            </div>
          </div>
        )}
        
        <Ghost className={`w-28 h-28 mx-auto mb-6 ${state.timerActive ? 'text-destructive animate-bounce' : 'text-muted-foreground/10'}`} />
        
        <div className="text-center space-y-2">
           <p className="text-sm font-bold max-w-[200px] mx-auto leading-tight">
             {state.timerActive ? "THE HOURGLASS IS TICKING! DECIDE NOW!" : state.actionTakenToday ? "Streak protected. Tomorrow will be harder." : "Maintaining a number or a person?"}
           </p>
           {state.timerActive && <div className="flex justify-center gap-1"><Hourglass className="w-4 h-4 text-destructive animate-spin-slow" /></div>}
        </div>
      </div>

      {/* Choice Panel */}
      <div className="p-6 pb-12 bg-background border-t shadow-2xl space-y-4">
        {!state.actionTakenToday && !state.gameOver && (
          <div className="grid grid-cols-2 gap-4">
            <button onClick={sendGhost} className="flex flex-col items-center gap-3 p-5 bg-snap-purple/10 border-2 border-snap-purple/20 rounded-3xl active:scale-95 transition-all">
              <Camera className="w-8 h-8 text-snap-purple" /><span className="text-[10px] font-black uppercase tracking-tighter">Send Ghost</span>
            </button>
            <button onClick={sendRealTalk} disabled={state.mentalEnergy <= 20} className={`flex flex-col items-center gap-3 p-5 rounded-3xl active:scale-95 transition-all ${state.mentalEnergy <= 20 ? 'opacity-30 grayscale' : 'bg-snap-blue/10 border-2 border-snap-blue/20'}`}>
              <MessageCircle className="w-8 h-8 text-snap-blue" /><span className="text-[10px] font-black uppercase tracking-tighter">Real Talk</span>
            </button>
          </div>
        )}
        {!state.gameOver && (
          <button onClick={state.actionTakenToday ? closeApp : () => setShowLossModal(true)} className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${state.actionTakenToday ? 'bg-snap-yellow text-primary-foreground shadow-lg' : 'text-destructive border border-destructive/20 hover:bg-destructive/5'}`}>
            {state.actionTakenToday ? `Finish Day ${state.currentDay} →` : `Close App (Resets 🔥 to 0)`}
          </button>
        )}
      </div>

      {/* Loss Aversion Warning */}
      {showLossModal && (
        <div className="absolute inset-0 z-[110] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="bg-card border-2 border-destructive rounded-3xl p-8 text-center animate-in zoom-in duration-300">
            <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h3 className="text-2xl font-black uppercase mb-2">Wait! Streak at Risk</h3>
            <p className="text-sm text-muted-foreground mb-6 italic">"You've invested 120 days. If you stop now, that effort is deleted forever. Are you sure?"</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => setShowLossModal(false)} className="w-full bg-snap-yellow text-primary-foreground py-4 rounded-xl font-black uppercase tracking-widest">Go Back & Save It</button>
              <button onClick={() => { setShowLossModal(false); closeApp(); }} className="w-full text-destructive text-xs font-bold uppercase opacity-60">Break the Streak</button>
            </div>
          </div>
        </div>
      )}

      {/* Results Overlay */}
      {state.gameOver && (
        <div className="absolute inset-0 z-[200] flex flex-col items-center justify-center bg-background p-8 text-center">
          <p className="text-6xl mb-4">{state.streakBroken ? "💔" : "🔥"}</p>
          <h2 className="text-4xl font-black italic uppercase mb-2">{state.streakBroken ? "Streak Dead" : "Goal Met?"}</h2>
          <div className="bg-card border-2 p-6 rounded-3xl w-full mb-8">
            <p className="text-xs font-bold uppercase text-muted-foreground mb-4">Research Summary</p>
            <div className="flex justify-between items-center mb-2 text-left"><span>Intimacy</span><span className="font-black">{state.relationshipIntimacy}%</span></div>
            <div className="flex justify-between items-center text-left"><span>Energy</span><span className="font-black">{state.mentalEnergy}%</span></div>
          </div>
          <button onClick={restart} className="w-full bg-snap-yellow text-primary-foreground py-5 rounded-2xl font-black uppercase shadow-xl">Restart Simulation</button>
        </div>
      )}
    </div>
  );
};

export default StreakSimulator;
