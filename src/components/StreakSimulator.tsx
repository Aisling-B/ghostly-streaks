import { useSimulatorEngine } from "@/hooks/useSimulatorEngine";
import { useEffect, useState } from "react";
import { Camera, MessageCircle, X, RotateCcw, Ghost, Brain, Heart, Zap, Info, AlertTriangle } from "lucide-react";

const StreakSimulator = () => {
  const {
    state,
    isBrainRotMode,
    totalDays,
    sendGhost,
    sendRealTalk,
    closeApp,
    dismissDayOverlay,
    dismissInsight,
    restart,
  } = useSimulatorEngine();

  const [showLossWarning, setShowLossWarning] = useState(false);

  useEffect(() => {
    if (state.showDayOverlay) {
      const timer = setTimeout(dismissDayOverlay, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.showDayOverlay, state.currentDay, dismissDayOverlay]);

  const isExhausted = state.mentalEnergy <= 25;

  const handleCloseAttempt = () => {
    if (!state.actionTakenToday && !showLossWarning) {
      setShowLossWarning(true);
    } else {
      setShowLossWarning(false);
      closeApp();
    }
  };

  return (
    <div
      className={`relative flex flex-col min-h-screen max-w-md mx-auto overflow-hidden bg-background border-x transition-all duration-700 ${
        isExhausted ? "grayscale-[0.4] brightness-75" : ""
      } ${isBrainRotMode ? "animate-pulse border-destructive/50" : ""}`}
    >
      {/* Day Start Overlay */}
      {state.showDayOverlay && !state.gameOver && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-sm">
          <div className="text-center animate-in zoom-in duration-500">
            <p className="text-snap-yellow text-8xl font-black italic tracking-tighter">DAY {state.currentDay}</p>
            <p className="text-muted-foreground font-mono uppercase tracking-[0.2em] mt-2">The Loop Continues</p>
          </div>
        </div>
      )}

      {/* Psychology Insight Pop-up */}
      {state.currentInsight && (
        <div className="absolute inset-0 z-[90] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-card border-2 border-snap-yellow rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-snap-yellow" />
              <h3 className="font-black text-xl uppercase tracking-tight">{state.currentInsight.title}</h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground mb-4 italic">"{state.currentInsight.body}"</p>
            <p className="text-[10px] text-muted-foreground/50 mb-6">{state.currentInsight.source}</p>
            <button onClick={dismissInsight} className="w-full bg-snap-yellow text-primary-foreground py-3 rounded-xl font-bold uppercase tracking-widest text-xs">I Understand</button>
          </div>
        </div>
      )}

      {/* Loss Aversion Warning */}
      {showLossWarning && (
        <div className="absolute inset-x-0 top-20 z-[80] mx-4 p-4 bg-destructive rounded-2xl border-2 border-white shadow-2xl animate-bounce">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-white shrink-0" />
            <div>
              <p className="text-white font-black uppercase text-sm">Wait! Loss Aversion Detected</p>
              <p className="text-white/90 text-xs mt-1 italic">"Are you sure? You've invested 120 days into this. If you close now, the fire goes out forever."</p>
              <div className="flex gap-2 mt-4">
                <button onClick={() => setShowLossWarning(false)} className="bg-white text-destructive px-4 py-2 rounded-lg text-[10px] font-bold uppercase">Go Back</button>
                <button onClick={handleCloseAttempt} className="bg-destructive-foreground/20 text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase">Break the Streak</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Game Over / Summary Screen */}
      {state.gameOver && (
        <div className="absolute inset-0 z-[110] flex items-center justify-center bg-background/98 p-8">
           <div className="w-full max-w-sm">
             <div className="text-center mb-10">
               <span className="text-6xl">{state.streakBroken ? "💔" : "🔥"}</span>
               <h2 className={`text-4xl font-black italic mt-4 uppercase ${state.streakBroken ? 'text-destructive' : 'text-snap-yellow'}`}>
                 {state.streakBroken ? 'Streak Dead' : 'Goal Met?'}
               </h2>
               <p className="text-muted-foreground text-sm mt-2 italic">
                 {state.streakBroken ? "You chose rest. The number is gone, but your energy is returning." : "You kept the number alive, but was there any real talk?"}
               </p>
             </div>

             <div className="bg-card border-2 border-border p-6 rounded-3xl space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2"><Heart className="w-4 h-4 text-intimacy" /> Friendship Depth</span>
                  <span className={`text-xl font-black ${state.relationshipIntimacy < 20 ? 'text-destructive' : 'text-intimacy'}`}>{state.relationshipIntimacy}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2"><Brain className="w-4 h-4 text-energy" /> Mental Energy</span>
                  <span className="text-xl font-black text-energy">{state.mentalEnergy}%</span>
                </div>
             </div>

             <button onClick={restart} className="w-full mt-8 bg-snap-yellow text-primary-foreground py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all">
               <RotateCcw className="w-5 h-5" /> Restart Loop
             </button>
           </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-snap-yellow px-6 py-4 flex items-center justify-between border-b-4 border-black/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-lg">👤</div>
          <div>
            <p className="text-primary-foreground font-black text-lg leading-none italic">ALEX</p>
            <p className="text-primary-foreground/60 text-[10px] uppercase font-bold tracking-widest mt-1">Best Friend</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-black/10 rounded-full px-4 py-2 border-2 border-black/5">
          <span className="text-xl">🔥</span>
          <span className="text-primary-foreground font-black text-2xl tracking-tighter">{state.streak}</span>
        </div>
      </header>

      {/* Stats Area */}
      <div className="px-6 py-4 grid grid-cols-2 gap-4 bg-muted/30">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-muted-foreground">Brain Power</span>
            <span className="text-[10px] font-bold text-energy">{state.mentalEnergy}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden border">
            <div className="h-full bg-energy transition-all duration-500" style={{ width: `${state.mentalEnergy}%` }} />
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-muted-foreground">Intimacy</span>
            <span className="text-[10px] font-bold text-intimacy">{state.relationshipIntimacy}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden border">
            <div className="h-full bg-intimacy transition-all duration-500" style={{ width: `${state.relationshipIntimacy}%` }} />
          </div>
        </div>
      </div>

      {/* Main Visual Display */}
      <div className="flex-1 flex flex-col items-center justify-center p-10 relative">
        <div className={`text-center space-y-4 transition-all duration-1000 ${isExhausted ? "blur-[1px] opacity-70" : ""}`}>
           <div className={`relative ${isBrainRotMode ? 'animate-bounce' : ''}`}>
             <Ghost className={`w-24 h-24 mx-auto ${isExhausted ? 'text-destructive' : 'text-muted-foreground/20'}`} />
             {isBrainRotMode && <Zap className="absolute top-0 right-0 w-8 h-8 text-destructive animate-pulse" />}
           </div>
           
           <div className="max-w-[200px] mx-auto">
             <p className="text-sm font-bold leading-tight">
               {state.actionTakenToday ? "Streak saved. See you tomorrow?" : isBrainRotMode ? "You're too tired for Real Talk. Just send the snap..." : "Maintenance or Connection?"}
             </p>
             <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-2">Day {state.currentDay} of 7</p>
           </div>
        </div>
      </div>

      {/* Late Night/Brain Rot Warning */}
      {isBrainRotMode && (
        <div className="mx-6 p-4 bg-destructive text-white rounded-2xl text-center shadow-lg animate-glitch border-4 border-white/20">
          <p className="text-[10px] font-black uppercase italic tracking-widest">12:30 AM — System Burnout</p>
          <p className="text-[9px] mt-1 opacity-90 leading-tight">"You get up and you're like oh my gosh, the world is spinning."</p>
        </div>
      )}

      {/* Choice Panel */}
      <div className="p-6 pb-10 space-y-4 bg-background border-t-2 border-border shadow-2xl">
        {!state.actionTakenToday && !state.gameOver ? (
          <div className="grid grid-cols-2 gap-4">
            <button onClick={sendGhost} className="group relative flex flex-col items-center gap-3 p-5 bg-snap-purple/10 border-2 border-snap-purple/30 rounded-3xl hover:bg-snap-purple/20 transition-all active:scale-95">
              <div className="w-14 h-14 bg-snap-purple rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                <Camera className="w-7 h-7 text-white" />
              </div>
              <div className="text-center">
                <span className="block text-[11px] font-black uppercase tracking-tighter">Send Blank</span>
                <span className="block text-[9px] text-muted-foreground font-bold mt-0.5">🔥+1 💔-8 ⚡-10</span>
              </div>
            </button>

            <button 
              onClick={sendRealTalk} 
              disabled={isBrainRotMode}
              className={`group relative flex flex-col items-center gap-3 p-5 rounded-3xl transition-all active:scale-95 ${isBrainRotMode ? 'bg-muted/50 opacity-50 cursor-not-allowed grayscale' : 'bg-snap-blue/10 border-2 border-snap-blue/30 hover:bg-snap-blue/20'}`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:-rotate-6 transition-transform ${isBrainRotMode ? 'bg-muted-foreground' : 'bg-snap-blue'}`}>
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <div className="text-center">
                <span className="block text-[11px] font-black uppercase tracking-tighter">Real Talk</span>
                <span className="block text-[9px] text-muted-foreground font-bold mt-0.5">🔥+1 ❤️+15 ⚡-30</span>
              </div>
            </button>
          </div>
        ) : null}

        {!state.gameOver && (
          <button 
            onClick={handleCloseAttempt}
            className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg ${state.actionTakenToday ? 'bg-snap-yellow text-primary-foreground hover:brightness-105' : 'bg-background border-2 border-destructive/30 text-destructive hover:bg-destructive/5'}`}
          >
            {state.actionTakenToday ? `Finish Day ${state.currentDay} →` : `Close App (Resets 🔥 to 0)`}
          </button>
        )}
      </div>
    </div>
  );
};

export default StreakSimulator;
