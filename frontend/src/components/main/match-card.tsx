import { Clock, Trophy, TrendingUp } from "lucide-react";
import type { Match } from "@/constants/dummy";
import { useBetslipStore } from "@/store";

interface MatchCardProps {
  match: Match;
}

export default function MatchCard({ match }: MatchCardProps) {
  const { addBet, isBetInSlip } = useBetslipStore();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = () => {
    switch (match.status) {
      case "live":
        return (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-500/20 text-red-500 text-[10px] font-semibold font-space">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            LIVE
          </div>
        );
      case "finished":
        return (
          <div className="px-2 py-1 rounded-full bg-muted/60 text-muted text-[10px] font-semibold font-space">
            FT
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-semibold font-space">
            <Clock size={10} />
            {match.time}
          </div>
        );
    }
  };

  const getBetLabel = (type: "straightWin" | "doubleChance", option: string): string => {
    if (type === "straightWin") {
      if (option === "home") return `${match.homeTeam.name} Win`;
      if (option === "draw") return "Draw";
      return `${match.awayTeam.name} Win`;
    }
    // doubleChance
    if (option === "1X") return `${match.homeTeam.name} or Draw`;
    if (option === "12") return `${match.homeTeam.name} or ${match.awayTeam.name}`;
    return `Draw or ${match.awayTeam.name}`;
  };

  const getBetOdds = (type: "straightWin" | "doubleChance", option: string): number => {
    if (type === "straightWin") {
      return match.odds.straightWin[option as keyof typeof match.odds.straightWin];
    }
    return match.odds.doubleChance[option as keyof typeof match.odds.doubleChance];
  };

  const handleBetClick = (type: "straightWin" | "doubleChance", option: string) => {
    const odds = getBetOdds(type, option);
    const label = getBetLabel(type, option);
    
    addBet({
      id: `${match.id}-${type}-${option}-${Date.now()}`,
      matchId: match.id,
      match,
      betType: type,
      option,
      odds,
      label,
    });
  };

  return (
    <article className="group relative overflow-hidden rounded-xl border border-line bg-secondary/80 transition-all hover:border-primary/60 shadow-lg">
      {/* League Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-foreground/60 border-b border-line">
        <div className="flex items-center gap-2">
         
          <span className="text-[10px] font-medium text-muted">
            {match.league.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge()}
          <span className="text-[10px] text-muted">{formatDate(match.date)}</span>
        </div>
      </div>

      {/* Teams and Score */}
      <div className="px-4 py-4 space-y-4">
        <div className="grid grid-cols-3 items-center gap-3">
          {/* Home Team */}
          <div className="flex items-center gap-2 min-w-0">
           
            <p className="text-xs md:text-sm font-medium truncate">
              {match.homeTeam.name}
            </p>
          </div>

          {/* Score */}
          <div className="flex items-center justify-center">
            {match.score ? (
              <div className="flex items-center gap-1 px-3 py-1.5 bg-foreground rounded-full">
                <span className="text-base md:text-lg font-space font-bold">
                  {match.score.home}
                </span>
                <span className="text-muted">-</span>
                <span className="text-base md:text-lg font-space font-bold">
                  {match.score.away}
                </span>
              </div>
            ) : (
              <span className="text-xs text-muted font-medium">VS</span>
            )}
          </div>

          {/* Away Team */}
          <div className="flex items-center gap-2 min-w-0 justify-end">
            <p className="text-xs md:text-sm font-medium truncate text-right">
              {match.awayTeam.name}
            </p>
           
          </div>
        </div>

        {/* Straight Win Betting Options */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 mb-2">
            <TrendingUp size={12} className="text-primary" />
            <span className="text-[10px] font-semibold text-muted uppercase tracking-wide">
              Straight Win
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleBetClick("straightWin", "home")}
              className={`px-3 py-2 rounded-lg border transition-all text-xs font-space font-semibold ${
                isBetInSlip(match.id, "straightWin", "home")
                  ? "bg-primary text-white border-primary shadow-md"
                  : "bg-foreground/60 border-line hover:border-primary/60 hover:bg-primary/10"
              }`}
            >
              <div className="text-[10px] text-main/50 mb-0.5">1</div>
              <div className="text-sm">{match.odds.straightWin.home.toFixed(2)}</div>
            </button>
            <button
              type="button"
              onClick={() => handleBetClick("straightWin", "draw")}
              className={`px-3 py-2 rounded-lg border transition-all text-xs font-space font-semibold ${
                isBetInSlip(match.id, "straightWin", "draw")
                  ? "bg-primary text-white border-primary shadow-md"
                  : "bg-foreground/60 border-line hover:border-primary/60 hover:bg-primary/10"
              }`}
            >
              <div className="text-[10px] text-main/50 mb-0.5">X</div>
              <div className="text-sm">{match.odds.straightWin.draw.toFixed(2)}</div>
            </button>
            <button
              type="button"
              onClick={() => handleBetClick("straightWin", "away")}
              className={`px-3 py-2 rounded-lg border transition-all text-xs font-space font-semibold ${
                isBetInSlip(match.id, "straightWin", "away")
                  ? "bg-primary text-white border-primary shadow-md"
                  : "bg-foreground/60 border-line hover:border-primary/60 hover:bg-primary/10"
              }`}
            >
              <div className="text-[10px] text-main/50 mb-0.5">2</div>
              <div className="text-sm">{match.odds.straightWin.away.toFixed(2)}</div>
            </button>
          </div>
        </div>

        {/* Double Chance Betting Options */}
        <div className="space-y-2 pt-2 border-t border-line">
          <div className="flex items-center gap-1.5 mb-2">
            <Trophy size={12} className="text-primary" />
            <span className="text-[10px] font-semibold text-muted uppercase tracking-wide">
              Double Chance
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleBetClick("doubleChance", "1X")}
              className={`px-2 py-2 rounded-lg border transition-all text-xs font-space font-semibold ${
                isBetInSlip(match.id, "doubleChance", "1X")
                  ? "bg-primary text-white border-primary shadow-md"
                  : "bg-foreground/60 border-line hover:border-primary/60 hover:bg-primary/10"
              }`}
            >
              <div className="text-[10px] text-main/50 mb-0.5">1X</div>
              <div className="text-sm">{match.odds.doubleChance["1X"].toFixed(2)}</div>
            </button>
            <button
              type="button"
              onClick={() => handleBetClick("doubleChance", "12")}
              className={`px-2 py-2 rounded-lg border transition-all text-xs font-space font-semibold ${
                isBetInSlip(match.id, "doubleChance", "12")
                  ? "bg-primary text-white border-primary shadow-md"
                  : "bg-foreground/60 border-line hover:border-primary/60 hover:bg-primary/10"
              }`}
            >
              <div className="text-[10px] text-main/50 mb-0.5">12</div>
              <div className="text-sm">{match.odds.doubleChance["12"].toFixed(2)}</div>
            </button>
            <button
              type="button"
              onClick={() => handleBetClick("doubleChance", "X2")}
              className={`px-2 py-2 rounded-lg border transition-all text-xs font-space font-semibold ${
                isBetInSlip(match.id, "doubleChance", "X2")
                  ? "bg-primary text-white border-primary shadow-md"
                  : "bg-foreground/60 border-line hover:border-primary/60 hover:bg-primary/10"
              }`}
            >
              <div className="text-[10px] text-main/50 mb-0.5">X2</div>
              <div className="text-sm">{match.odds.doubleChance["X2"].toFixed(2)}</div>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
