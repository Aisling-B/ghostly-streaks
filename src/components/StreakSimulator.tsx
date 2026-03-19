import { useSimulatorEngine } from "@/hooks/useSimulatorEngine";
import { useEffect, useState } from "react";
import { Camera, MessageCircle, RotateCcw, Ghost, Brain, Heart, Zap, Info, AlertTriangle, Hourglass } from "lucide-react";

const StreakSimulator = () => {
  const { state, totalDays, sendGhost, sendRealTalk, closeApp, dismissDayOverlay, dismissInsight, restart } = useSimulatorEngine();
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
      
      {/* 1. Day Start Overlay */}
      {state.showDayOverlay && !state.gameOver && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-sm">
          <div className="text-center animate-in zoom-in duration-500">
            <p className="text-snap-yellow text-8xl font-black italic tracking-tighter">DAY {state.currentDay}</p>
            <p className="text-muted-foreground font-mono uppercase tracking-widest mt-2">Maintenance Loop</p>
          </div>
        </div>
      )}

      {/* 2. Loss Aversion Modal */}
      {showLossModal && (
        <div className="absolute inset-0 z-[110] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="bg-card border-2 border-destructive rounded-3xl p-8 text-center shadow-2xl animate-in fade-in scale-95 duration-300">
            <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h3 className="text-2xl font-black uppercase mb-2">Wait! Streak at Risk</h3>
            <p className="text-sm text-muted-foreground mb-6 italic">"You've invested 120 days. If you stop now, that effort is deleted forever. Are you sure?"</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => setShowLossModal(false)} className="w-full bg-snap-yellow text-primary-foreground py-4 rounded-xl font-black uppercase tracking-widest">Go Back & Save It</button>
              <button onClick={() => { setShowLossModal(false); closeApp(); }} className="w-full text-destructive text-xs font-bold uppercase opacity-60">I'm done with the number</button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Psychology Insight Pop-up */}
      {state.currentInsight && (
        <div className="absolute inset-0 z-[90] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-card border-2 border-snap-yellow rounded-3xl p-6 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex items-center gap-2 mb-4"><Info className="w-5 h-5 text-snap-yellow" /><h3 className="font-black text-xl uppercase tracking-tight">{state.currentInsight.title}</h3></div>
            <p className="text-sm text-muted-foreground mb-4 italic leading-relaxed">"{state.currentInsight.body}"</p>
            <p className="text-[10px] text-muted-foreground/40 mb-6">{state.currentInsight.source}</p>
            <button onClick={dismissInsight} className="w-full bg-snap-yellow text-primary-foreground py-3 rounded-xl font-bold uppercase text-xs">I See the Trap</button>
          </div>
        </div>
      )}

      {/* 4. Final Research Summary */}
      {state.gameOver && (
        <div className="absolute inset-0 z-[120] flex flex-col items-center bg-background p-8 overflow-y-auto">
          <h2 className="text-4xl font-black italic text-snap-yellow uppercase mb-6 text-center">Research Summary</h2>
          <div className="w-full space-y-6">
            <div className="bg-card border-2 border-border p-5 rounded-3xl">
              <h4 className="text-xs font-black uppercase text-muted-foreground mb-2">Final Social Health</h4>
              <p className="text-3xl font-black text-intimacy">{state.relationshipIntimacy}%</p>
              <p className="text-[10px] mt-2 opacity-70">"Maintaining a frequency doesn't maintain an intimacy."</p>
            </div>
            <div className="bg-card border-2 border-border p-5 rounded-3xl">
              <h4 className="text-xs font-black uppercase text-muted-foreground mb-2">Digital Fatigue Data</h4>
              <p className="text-[11px] leading-relaxed"><strong>15-24%</strong> of teen activity happens late at night. You ended with <strong>{state.mentalEnergy}%</strong> energy.</p>
            </div>
            <button onClick={restart} className="w-full bg-snap-yellow text-primary-foreground py-5 rounded-2xl font-black uppercase shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2">
              <RotateCcw className="w-5 h-5" /> Restart Simulation
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-snap-yellow px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3"><div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-lg">👤</div><p className="text-primary-foreground font-black text-lg italic uppercase leading-none">Alex</p></div>
        <div className="flex items-center gap-2 bg-black/10 rounded-full px-4 py-2">
          {!state.actionTakenToday && <Hourglass className="w-4 h-4 text-white animate-spin-slow" />}
          <span className="text-xl">🔥</span><span className="text-primary-foreground font-black text-2xl tracking-tighter">{state.streak}</span>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="px-6 py-4 grid grid-cols-2 gap-4 bg-muted/20 border-b">
        <div className="space-y-1"><span className="text-[9px] font-black uppercase text-muted-foreground block">Cognitive Energy</span><div className="h-1.5 bg-muted rounded-full overflow-hidden border"><div className="h-full bg-energy transition-all duration-700" style={{ width: `${state.mentalEnergy}%` }} /></div></div>
        <div className="space-y-1"><span className="text-[9px] font-black uppercase text-muted-foreground block">Relationship Depth</span><div className="h-1.5 bg-muted rounded-full overflow-hidden border"><div className="h-full bg-intimacy transition-all duration-700" style={{ width: `${state.relationshipIntimacy}%` }} /></div></div>
      </div>

      {/* Main Experience Display */}
      <div className="flex-1 flex flex-col items-center justify-center p-10">
        <div className={`text-center space-y-6 transition-all duration-1000 ${isExhausted ? "blur-[0.5px] opacity-60" : ""}`}>
           <Ghost className={`w-28 h-28 mx-auto ${isExhausted ? 'text-destructive' : 'text-muted-foreground/10'}`} />
           <p className="text-sm font-bold max-w-[180px] mx-auto leading-tight">
             {state.actionTakenToday ? "Streak protected. Tomorrow will be harder." : isExhausted ? "The world is spinning. Just send the ghost." : "Maintaining a number or a person?"}
           </p>
        </div>
      </div>

      {/* Action Choice Panel */}
      <div className="p-6 pb-12 bg-background border-t shadow-2xl space-y-4">
        {!state.actionTakenToday && !state.gameOver && (
          <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-bottom-4 duration-500">
            <button onClick={sendGhost} className="flex flex-col items-center gap-3 p-5 bg-snap-purple/10 border-2 border-snap-purple/20 rounded-3xl active:scale-95 transition-all">
              <Camera className="w-8 h-8 text-snap-purple" /><span className="text-[10px] font-black uppercase tracking-tighter">Send Ghost</span>
            </button>
            <button onClick={sendRealTalk} disabled={state.mentalEnergy <= 20} className={`flex flex-col items-center gap-3 p-5 rounded-3xl active:scale-95 transition-all ${state.mentalEnergy <= 20 ? 'opacity-30 grayscale cursor-not-allowed' : 'bg-snap-blue/10 border-2 border-snap-blue/20'}`}>
              <MessageCircle className="w-8 h-8 text-snap-blue" /><span className="text-[10px] font-black uppercase tracking-tighter">Real Talk</span>
            </button>
          </div>
        )}
        <button onClick={state.actionTakenToday ? closeApp : () => setShowLossModal(true)} className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${state.actionTakenToday ? 'bg-snap-yellow text-primary-foreground shadow-lg' : 'text-destructive border border-destructive/20 hover:bg-destructive/5'}`}>
          {state.actionTakenToday ? `Go to Sleep →` : `Close App (Resets 🔥 to 0)`}
        </button>
      </div>
    </div>
  );
};

export default StreakSimulator;
