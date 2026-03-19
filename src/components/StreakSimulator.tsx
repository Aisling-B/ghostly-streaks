import { useSimulatorEngine } from "@/hooks/useSimulatorEngine";
import { useEffect } from "react";
import { Camera, MessageCircle, X, RotateCcw, Ghost, Brain, Heart, Zap } from "lucide-react";
const StreakSimulator = () => {
  const {
    state,
    isBrainRotMode,
    totalDays,
    sendGhost,
    sendRealTalk,
    closeApp,
    dismissDayOverlay,
    restart,
  } = useSimulatorEngine();
  useEffect(() => {
    if (state.showDayOverlay) {
      const timer = setTimeout(dismissDayOverlay, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.showDayOverlay, state.currentDay, dismissDayOverlay]);
  const energyPct = state.mentalEnergy / 100;
  const isExhausted = state.mentalEnergy <= 20;
  return (
    <div
      className={`relative flex flex-col min-h-screen max-w-md mx-auto overflow-hidden ${
        isExhausted ? "grayscale-exhausted" : ""
      } ${isBrainRotMode ? "animate-flicker" : ""}`}
    >
      {/* Day Overlay */}
      {state.showDayOverlay && !state.gameOver && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/95">
          <div className="animate-day-overlay text-center">
            <p className="text-snap-yellow text-7xl font-bold tracking-tight">
              DAY {state.currentDay}
            </p>
            <p className="text-muted-foreground text-lg mt-2">OF {totalDays}</p>
          </div>
        </div>
      )}
      {/* Game Over Screen */}
      {state.gameOver && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/98">
          <div className="text-center px-8 animate-slide-up">
            {state.streakBroken ? (
              <>
                <p className="text-6xl mb-4">💔</p>
                <h2 className="text-destructive text-3xl font-bold mb-2">STREAK LOST</h2>
                <p className="text-muted-foreground mb-6">
                  You chose rest over the number. The 🔥 is gone.
                </p>
              </>
            ) : (
              <>
                <p className="text-6xl mb-4">🔥</p>
                <h2 className="text-snap-yellow text-3xl font-bold mb-2">
                  {state.streak}-DAY STREAK
                </h2>
                <p className="text-muted-foreground mb-2">But at what cost?</p>
              </>
            )}
            <div className="bg-card rounded-lg p-6 mt-6 space-y-4 text-left">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Heart className="w-4 h-4 text-intimacy" /> Relationship
                </span>
                <span className={`font-bold text-lg ${
                  state.relationshipIntimacy <= 20 ? "text-destructive" : "text-intimacy"
                }`}>
                  {state.relationshipIntimacy}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Brain className="w-4 h-4 text-energy" /> Mental Energy
                </span>
                <span className={`font-bold text-lg ${
                  state.mentalEnergy <= 20 ? "text-destructive" : "text-energy"
                }`}>
                  {state.mentalEnergy}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-2">
                  🔥 Streak
                </span>
                <span className="font-bold text-lg text-snap-yellow">
                  {state.streak} days
                </span>
              </div>
            </div>
            {!state.streakBroken && state.relationshipIntimacy <= 20 && (
              <p className="text-destructive text-sm mt-4 italic">
                "127-day streak. 0% real connection. Was it worth it?"
              </p>
            )}
            <button
              onClick={restart}
              className="mt-8 flex items-center gap-2 mx-auto bg-snap-yellow text-primary-foreground px-6 py-3 rounded-full font-bold text-lg hover:opacity-90 transition-opacity"
            >
              <RotateCcw className="w-5 h-5" /> Try Again
            </button>
          </div>
        </div>
      )}
      {/* Header - Snapchat style */}
      <header className="bg-snap-yellow px-4 py-3 flex items-center justify-between">
        <button className="text-primary-foreground">
          <X className="w-6 h-6" />
        </button>
        <div className="text-center">
          <p className="text-primary-foreground font-bold text-lg">Alex 👻</p>
          <p className="text-primary-foreground/70 text-xs">Tap to chat</p>
        </div>
        <div className="flex items-center gap-1 bg-primary-foreground/20 rounded-full px-3 py-1">
          <span className="text-lg">🔥</span>
          <span className="text-primary-foreground font-bold text-xl">{state.streak}</span>
        </div>
      </header>
      {/* Status Bars */}
      <div className="px-4 py-3 space-y-2 bg-card">
        <div className="flex items-center gap-3">
          <Brain className="w-4 h-4 text-energy shrink-0" />
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${state.mentalEnergy}%`,
                backgroundColor: state.mentalEnergy > 40
                  ? "hsl(var(--energy-green))"
                  : state.mentalEnergy > 20
                  ? "hsl(59 100% 50%)"
                  : "hsl(var(--destructive))",
              }}
            />
          </div>
          <span className="text-xs text-muted-foreground w-8">{state.mentalEnergy}%</span>
        </div>
        <div className="flex items-center gap-3">
          <Heart className="w-4 h-4 text-intimacy shrink-0" />
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${state.relationshipIntimacy}%`,
                backgroundColor: state.relationshipIntimacy > 40
                  ? "hsl(var(--intimacy-pink))"
                  : "hsl(var(--destructive))",
              }}
            />
          </div>
          <span className="text-xs text-muted-foreground w-8">{state.relationshipIntimacy}%</span>
        </div>
      </div>
      {/* Brain Rot Warning */}
      {isBrainRotMode && (
        <div className="mx-4 mt-2 bg-destructive/20 border border-destructive/40 rounded-lg p-3 animate-glitch">
          <p className="text-destructive text-sm font-bold text-center flex items-center justify-center gap-2">
            <Zap className="w-4 h-4" /> BRAIN ROT MODE — Real Talk disabled
          </p>
        </div>
      )}
      {/* Chat Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className={`text-center transition-all duration-700 ${isExhausted ? "animate-glitch" : ""}`}>
          <Ghost className="w-20 h-20 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">
            {state.actionTakenToday
              ? "✅ Streak maintained for today."
              : isBrainRotMode
              ? "You're exhausted. Just send the snap..."
              : "What will you send Alex today?"}
          </p>
          <p className="text-muted-foreground/50 text-xs mt-2">
            Day {state.currentDay} of {totalDays}
          </p>
        </div>
      </div>
      {/* Action Bar */}
      <div className="p-4 pb-8 bg-card border-t border-border space-y-3">
        {!state.actionTakenToday && !state.gameOver ? (
          <div className="flex gap-3">
            {/* Send Ghost */}
            <button
              onClick={sendGhost}
              className="flex-1 flex flex-col items-center gap-2 bg-snap-purple/20 border border-snap-purple/40 rounded-2xl py-4 px-3 hover:bg-snap-purple/30 transition-colors active:scale-95"
            >
              <div className="w-12 h-12 bg-snap-purple rounded-lg flex items-center justify-center">
                <Camera className="w-6 h-6 text-foreground" />
              </div>
              <span className="text-xs font-semibold text-foreground">Send Ghost</span>
              <span className="text-[10px] text-muted-foreground">🔥+1 · 💔-5 · ⚡-5</span>
            </button>
            {/* Real Talk */}
            <button
              onClick={sendRealTalk}
              disabled={isBrainRotMode}
              className={`flex-1 flex flex-col items-center gap-2 rounded-2xl py-4 px-3 transition-colors active:scale-95 ${
                isBrainRotMode
                  ? "bg-muted/30 border border-muted opacity-40 cursor-not-allowed"
                  : "bg-snap-blue/20 border border-snap-blue/40 hover:bg-snap-blue/30"
              }`}
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                isBrainRotMode ? "bg-muted" : "bg-snap-blue"
              }`}>
                <MessageCircle className="w-6 h-6 text-foreground" />
              </div>
              <span className="text-xs font-semibold text-foreground">Real Talk</span>
              <span className="text-[10px] text-muted-foreground">🔥+1 · ❤️+15 · ⚡-25</span>
            </button>
          </div>
        ) : null}
        {/* Close App / Next Day */}
        {!state.gameOver && (
          <button
            onClick={closeApp}
            className={`w-full py-3 rounded-full font-bold text-sm transition-all ${
              state.actionTakenToday
                ? "bg-snap-yellow text-primary-foreground hover:opacity-90"
                : "bg-destructive/20 text-destructive border border-destructive/40 hover:bg-destructive/30"
            }`}
          >
            {state.actionTakenToday
              ? `End Day ${state.currentDay} →`
              : `Close App (💔 Lose ${state.streak}-day streak)`}
          </button>
        )}
      </div>
    </div>
  );
};
export default StreakSimulator;
