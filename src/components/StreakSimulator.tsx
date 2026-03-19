import { useSimulatorEngine } from "@/hooks/useSimulatorEngine";
import { Camera, MessageCircle, Ghost, Brain, Heart, Info, AlertTriangle } from "lucide-react";

const StreakSimulator = () => {
  const { state, sendMaintenance, sendConnection, closeApp, restart } = useSimulatorEngine();

  return (
    <div className={`relative flex flex-col min-h-screen max-w-md mx-auto bg-background transition-all ${state.mentalEnergy < 30 ? "grayscale brightness-75" : ""}`}>
      
      {/* Social Pressure Notification Banner [cite: 7663, 7812] */}
      {state.activeNotification && (
        <div className="absolute top-4 inset-x-4 z-[100] bg-white shadow-2xl rounded-2xl p-4 border-l-4 border-snap-yellow animate-in slide-in-from-top-full">
          <div className="flex gap-3 text-left">
            <div className="w-10 h-10 bg-snap-yellow rounded-full flex items-center justify-center text-white font-bold text-xl">A</div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-snap-yellow uppercase">{state.activeNotification.title}</p>
              <p className="text-sm font-bold text-slate-800 mt-1 italic">"{state.activeNotification.body}"</p>
            </div>
          </div>
        </div>
      )}

      {/* Header with Urgency Timer [cite: 7258, 8269] */}
      <header className="bg-snap-yellow px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-black italic text-white"><div className="w-8 h-8 bg-white/20 rounded-full" />ALEX</div>
        <div className={`flex items-center gap-2 rounded-full px-4 py-2 ${state.timerActive ? 'bg-destructive animate-pulse' : 'bg-black/10'}`}>
          {state.timerActive && <span className="text-white font-black text-xs">{state.timeLeft}s</span>}
          <span className="text-xl">🔥</span><span className="text-white font-black text-2xl tracking-tighter">{state.streak}</span>
        </div>
      </header>

      {/* Status Bars tracking the "Behavioral Chore" [cite: 7133, 7575] */}
      <div className="p-6 space-y-4 bg-card border-b">
        <div className="space-y-1 text-left">
          <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground">
            <span className="flex items-center gap-1"><Brain className="w-3 h-3" /> Cognitive Load</span>
            <span>{state.mentalEnergy}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full bg-energy transition-all" style={{ width: `${state.mentalEnergy}%` }} /></div>
        </div>
        <div className="space-y-1 text-left">
          <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground">
            <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> Relationship Intimacy</span>
            <span>{state.relationshipDepth}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full bg-intimacy transition-all" style={{ width: `${state.relationshipDepth}%` }} /></div>
        </div>
      </div>

      {/* Experience Display [cite: 7228, 7804] */}
      <div className="flex-1 flex flex-col items-center justify-center px-10 text-center relative">
        <Ghost className={`w-28 h-28 mb-6 ${state.timerActive ? 'text-destructive animate-bounce' : 'text-muted-foreground/10'}`} />
        <div className="space-y-2 uppercase italic text-muted-foreground font-bold text-sm tracking-tight">
          {state.timerActive ? "Loss Aversion Triggered" : state.actionTakenToday ? "System Serviced" : "Awaiting Metacommunication"}
        </div>
        <p className="text-[10px] text-muted-foreground/60 mt-4 uppercase tracking-widest font-black">Day {state.currentDay} of 7</p>
      </div>

      {/* Research-Driven Action Panel [cite: 7158, 7811] */}
      <div className="p-6 pb-12 bg-background border-t space-y-4 shadow-inner">
        {!state.actionTakenToday && !state.gameOver && (
          <div className="grid grid-cols-2 gap-4">
            <button onClick={sendMaintenance} className="flex flex-col items-center gap-2 p-5 bg-snap-purple/10 border-2 border-snap-purple/20 rounded-3xl active:scale-95 transition-all">
              <Camera className="w-8 h-8 text-snap-purple" /><span className="text-[10px] font-black uppercase">Maintenance Snap</span>
              <span className="text-[8px] text-muted-foreground font-bold">(Chore [cite: 7158])</span>
            </button>
            <button onClick={sendConnection} disabled={state.mentalEnergy < 35} className={`flex flex-col items-center gap-2 p-5 rounded-3xl active:scale-95 transition-all ${state.mentalEnergy < 35 ? 'opacity-20' : 'bg-snap-blue/10 border-2 border-snap-blue/20'}`}>
              <MessageCircle className="w-8 h-8 text-snap-blue" /><span className="text-[10px] font-black uppercase">Genuine Connection</span>
              <span className="text-[8px] text-muted-foreground font-bold">(Intimacy [cite: 7105])</span>
            </button>
          </div>
        )}
        <button onClick={closeApp} className="w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 border-destructive/20 text-destructive">
          {state.actionTakenToday ? `Finish Day ${state.currentDay} →` : `ABANDON 120-DAY INVESTMENT (💔)`}
        </button>
      </div>

      {/* Research Results Overlay [cite: 7527, 7836, 7804] */}
      {state.gameOver && (
        <div className="absolute inset-0 z-[200] bg-background p-10 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
          <span className="text-6xl mb-4">{state.streakBroken ? "💔" : "🔥"}</span>
          <h2 className="text-4xl font-black italic uppercase mb-2 leading-none">{state.streakBroken ? "Broken Loop" : "Goal Met?"}</h2>
          <div className="bg-card border-2 p-6 rounded-3xl w-full mb-8 text-left space-y-4">
             <div className="flex justify-between"><span>Intimacy Level:</span><span className="font-black text-intimacy">{state.relationshipDepth}%</span></div>
             <p className="text-[11px] text-muted-foreground italic leading-relaxed">
               "Users spend more time than they want because of gamification. You opened the app to protect a number, but your friendship became a maintenance chore[cite: 7158, 7606]."
             </p>
             <p className="text-[10px] font-bold text-snap-yellow uppercase">Average teen visits: 841/month [cite: 7794, 7806]</p>
          </div>
          <button onClick={restart} className="w-full bg-snap-yellow text-white py-5 rounded-2xl font-black uppercase shadow-xl hover:scale-105 transition-transform">Reset Simulation</button>
        </div>
      )}
    </div>
  );
};

export default StreakSimulator;
