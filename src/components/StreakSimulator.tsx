import { useSimulatorEngine } from "@/hooks/useSimulatorEngine";
import { Camera, MessageCircle, Ghost, Brain, Heart, Hourglass, AlertCircle } from "lucide-react";

const StreakSimulator = () => {
  const { state, sendMaintenance, sendConnection, closeApp, restart } = useSimulatorEngine();

  const renderSnap = () => {
    switch (state.currentSnap) {
      case 'ceiling': return <div className="w-full h-full bg-slate-800 flex items-center justify-center text-white/10 text-9xl font-black">S</div>;
      case 'shoes': return <div className="w-full h-full bg-stone-700 flex items-center justify-center text-white/10 text-9xl font-black">S</div>;
      case 'black': return <div className="w-full h-full bg-black flex items-center justify-center text-white/10 text-9xl font-black">S</div>;
      case 'genuine': return <div className="w-full h-full bg-snap-blue/10 p-8 flex items-center justify-center text-snap-blue font-bold italic text-center text-sm">"Actually had a lot to tell you today..."</div>;
      default: return <Ghost className="w-24 h-24 text-muted-foreground/10" />;
    }
  };

  return (
    <div className={`relative flex flex-col min-h-screen max-w-md mx-auto bg-background transition-all ${state.mentalEnergy < 30 ? "grayscale brightness-75" : ""}`}>
      
      {/* SOCIAL PRESSURE BANNER  */}
      {state.activeNotification && (
        <div className={`absolute top-4 inset-x-4 z-[100] bg-white shadow-2xl rounded-2xl p-4 border-l-4 ${state.activeNotification.type === 'guilt' ? 'border-destructive' : 'border-snap-yellow'} animate-in slide-in-from-top-full`}>
          <div className="flex gap-3 text-left">
            <div className="w-10 h-10 bg-snap-yellow rounded-full flex items-center justify-center text-white font-bold text-xl">A</div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-snap-yellow uppercase leading-none">{state.activeNotification.title}</p>
              <p className="text-sm font-bold text-slate-800 mt-1 italic">"{state.activeNotification.body}"</p>
            </div>
          </div>
        </div>
      )}

      {/* HEADER WITH HOURGLASS [cite: 176] */}
      <header className="bg-snap-yellow px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-black italic"><div className="w-8 h-8 bg-white/20 rounded-full" />ALEX</div>
        <div className={`flex items-center gap-2 rounded-full px-4 py-2 ${state.timerActive ? 'bg-destructive animate-pulse' : 'bg-black/10'}`}>
          {state.timerActive && <span className="text-white font-black text-xs">{state.timeLeft}s</span>}
          <span className="text-xl">🔥</span><span className="text-white font-black text-2xl tracking-tighter">{state.streak}</span>
        </div>
      </header>

      {/* STATUS BARS  */}
      <div className="p-6 space-y-4 bg-card border-b">
        <div className="space-y-1 text-left">
          <div className="flex justify-between text-[9px] font-black uppercase text-muted-foreground">
            <span className="flex items-center gap-1"><Brain className="w-3 h-3 text-energy" /> Cognitive Exhaustion</span>
            <span>{state.mentalEnergy}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full bg-energy transition-all duration-1000" style={{ width: `${state.mentalEnergy}%` }} /></div>
        </div>
        <div className="space-y-1 text-left">
          <div className="flex justify-between text-[9px] font-black uppercase text-muted-foreground">
            <span className="flex items-center gap-1"><AlertCircle className="w-3 h-3 text-destructive" /> Perceived Obligation</span>
            <span>{state.obligation}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full bg-destructive transition-all duration-1000" style={{ width: `${state.obligation}%` }} /></div>
        </div>
      </div>

      {/* SNAP VIEWER: Seeing the "lame" interaction [cite: 1134] */}
      <div className="flex-1 flex flex-col items-center justify-center relative bg-black/5 overflow-hidden">
        {renderSnap()}
        <div className="absolute bottom-10 text-center opacity-40">
          <p className="text-[10px] font-black uppercase tracking-widest">{state.actionTakenToday ? "SYSTEM SERVICED" : "AWAITING FREQUENCY"}</p>
          <p className="text-[9px] font-bold">DAY {state.currentDay} OF 7</p>
        </div>
      </div>

      {/* RESEARCH-BASED ACTIONS [cite: 145, 1130] */}
      <div className="p-6 pb-12 bg-background border-t space-y-4 shadow-2xl">
        {!state.actionTakenToday && (
          <div className="grid grid-cols-2 gap-4">
            <button onClick={sendMaintenance} className="flex flex-col items-center gap-2 p-5 bg-snap-purple/10 border-2 border-snap-purple/20 rounded-3xl active:scale-95 transition-all">
              <Camera className="w-8 h-8 text-snap-purple" />
              <span className="text-[10px] font-black uppercase">Maintenance Snap</span>
              <span className="text-[8px] text-muted-foreground font-bold">(Chore)</span>
            </button>
            <button onClick={sendConnection} disabled={state.mentalEnergy < 35} className="flex flex-col items-center gap-2 p-5 bg-snap-blue/10 border-2 border-snap-blue/20 rounded-3xl active:scale-95 transition-all disabled:opacity-20">
              <MessageCircle className="w-8 h-8 text-snap-blue" />
              <span className="text-[10px] font-black uppercase">Genuine Talk</span>
              <span className="text-[8px] text-muted-foreground font-bold">(Intimacy)</span>
            </button>
          </div>
        )}
        <button onClick={closeApp} className="w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 border-destructive/20 text-destructive">
          {state.actionTakenToday ? `Finish Day ${state.currentDay} →` : `ABANDON 120-DAY INVESTMENT (💔)`}
        </button>
      </div>

      {/* FINAL RESEARCH SUMMARY [cite: 433, 449, 1191] */}
      {state.gameOver && (
        <div className="absolute inset-0 z-[200] bg-background p-10 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
          <span className="text-7xl mb-4">{state.streakBroken ? "💔" : "🔥"}</span>
          <h2 className="text-4xl font-black italic uppercase leading-none">{state.streakBroken ? "Broken Loop" : "System Serviced"}</h2>
          <div className="bg-card border-2 p-6 rounded-3xl w-full my-8 text-left space-y-4">
             <div className="flex justify-between"><span>Intimacy Level:</span><span className="font-black text-intimacy">{state.relationshipDepth}%</span></div>
             <p className="text-[11px] text-muted-foreground italic leading-relaxed">
               "Users spend more time than they want because of gamification[cite: 449]. You maintained a number, but did you maintain the person? [cite: 1130]"
             </p>
             <p className="text-[9px] font-bold text-snap-yellow uppercase">Average teen visits: 841/month</p>
          </div>
          <button onClick={restart} className="w-full bg-snap-yellow text-white py-5 rounded-2xl font-black uppercase shadow-xl hover:scale-105 transition-transform">Reset Compulsion</button>
        </div>
      )}
    </div>
  );
};

export default StreakSimulator;        </div>
      </div>

      {/* RESEARCH-DRIVEN ACTIONS [cite: 64, 1510] */}
      <div className="p-6 pb-12 bg-background border-t space-y-4 shadow-2xl">
        {!state.actionTakenToday && (
          <div className="grid grid-cols-2 gap-4">
            <button onClick={sendMaintenance} className="flex flex-col items-center gap-2 p-5 bg-snap-purple/10 border-2 border-snap-purple/20 rounded-3xl active:scale-95 transition-all">
              <Camera className="w-8 h-8 text-snap-purple" />
              <span className="text-[10px] font-black uppercase">Maintenance Snap</span>
              <span className="text-[8px] text-muted-foreground font-bold">(Chore) [cite: 145]</span>
            </button>
            <button onClick={sendConnection} disabled={state.mentalEnergy < 35} className="flex flex-col items-center gap-2 p-5 rounded-3xl active:scale-95 transition-all bg-snap-blue/10 border-2 border-snap-blue/20 disabled:opacity-20">
              <MessageCircle className="w-8 h-8 text-snap-blue" />
              <span className="text-[10px] font-black uppercase">Genuine Talk</span>
              <span className="text-[8px] text-muted-foreground font-bold">(Intimacy) [cite: 88]</span>
            </button>
          </div>
        )}
        <button onClick={closeApp} className="w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 border-destructive/20 text-destructive">
          {state.actionTakenToday ? `Finish Day ${state.currentDay} →` : `ABANDON 120-DAY INVESTMENT (💔) [cite: 521]`}
        </button>
      </div>

      {/* FINAL RESEARCH SUMMARY [cite: 449, 1511] */}
      {state.gameOver && (
        <div className="absolute inset-0 z-[200] bg-background p-10 flex flex-col items-center justify-center text-center animate-in zoom-in">
          <span className="text-7xl mb-4">{state.streakBroken ? "💔" : "🔥"}</span>
          <h2 className="text-4xl font-black italic uppercase leading-none">{state.streakBroken ? "Broken Loop" : "System Serviced"}</h2>
          <div className="bg-card border-2 p-6 rounded-3xl w-full my-8 text-left space-y-4">
             <div className="flex justify-between"><span>Intimacy Level:</span><span className="font-black text-intimacy">{state.relationshipDepth}%</span></div>
             <div className="flex justify-between"><span>Pressure Level:</span><span className="font-black text-destructive">{state.obligation}%</span></div>
             <p className="text-[11px] text-muted-foreground italic leading-relaxed">
               "Teenagers open this app average 841 times a month just to protect a number. By Day 7, your friendship is a metagame. You communicated about the streak, not each other." [cite: 140, 1510]
             </p>
          </div>
          <button onClick={restart} className="w-full bg-snap-yellow text-white py-5 rounded-2xl font-black uppercase shadow-xl hover:scale-105 transition-transform">Reset Compulsion</button>
        </div>
      )}
    </div>
  );
};

export default StreakSimulator;
