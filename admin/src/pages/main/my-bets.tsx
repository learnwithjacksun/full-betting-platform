import { useState } from "react";
import { useBetsStore } from "@/store";
import { Ticket, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import useBets from "@/hooks/useBets";

type BetFilter = "all" | "pending" | "won" | "lost";

// Simple date formatter (fallback if date-fns is not available)
const formatDistanceToNow = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
};

export default function MyBets() {
 
  const { bets } = useBetsStore();
  const [activeFilter, setActiveFilter] = useState<BetFilter>("all");
  const { useBetsQuery, cancelBet, isCancellingBet } = useBets();
  
  // Fetch bets from server
  const { data: serverBets, isLoading, error } = useBetsQuery(
    activeFilter === "all" ? undefined : activeFilter
  );

  const filters: { id: BetFilter; label: string }[] = [
    { id: "all", label: "All Bets" },
    { id: "pending", label: "Pending" },
    { id: "won", label: "Won" },
    { id: "lost", label: "Lost" },
  ];

  // Use server data if available, otherwise fall back to store
  const displayedBets = serverBets || bets;
  
  const getFilteredBets = () => {
    if (activeFilter === "all") return displayedBets;
    return displayedBets.filter((bet) => bet.status === activeFilter);
  };
  
  const handleCancelBet =  (betId: string) => {
     cancelBet(betId);
    
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-600 text-[10px] font-semibold">
            <Clock size={10} />
            Pending
          </div>
        );
      case "won":
        return (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/20 text-green-600 text-[10px] font-semibold">
            <CheckCircle2 size={10} />
            Won
          </div>
        );
      case "lost":
        return (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-500/20 text-red-600 text-[10px] font-semibold">
            <XCircle size={10} />
            Lost
          </div>
        );
      case "cancelled":
        return (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted/60 text-muted text-[10px] font-semibold">
            <AlertCircle size={10} />
            Cancelled
          </div>
        );
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString));
    } catch {
      return "Recently";
    }
  };

  const filteredBets = getFilteredBets();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-bold font-space mb-2">My Bets</h1>
          <p className="text-sm text-muted">
            Track and manage all your placed bets
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs md:text-sm font-medium transition-all ${
                activeFilter === filter.id
                  ? "bg-primary text-white border-primary shadow-md"
                  : "bg-secondary/80 text-muted border-line hover:border-primary/40 hover:text-main"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-foreground flex items-center justify-center mb-4">
            <Ticket size={40} className="text-muted animate-pulse" />
          </div>
          <p className="text-lg font-semibold text-main mb-2">Loading bets...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-foreground flex items-center justify-center mb-4">
            <AlertCircle size={40} className="text-red-500" />
          </div>
          <p className="text-lg font-semibold text-main mb-2">Failed to load bets</p>
          <p className="text-sm text-muted">Please try refreshing the page</p>
        </div>
      )}

      {/* Bets List */}
      {!isLoading && !error && filteredBets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-foreground flex items-center justify-center mb-4">
            <Ticket size={40} className="text-muted" />
          </div>
          <p className="text-lg font-semibold text-main mb-2">No bets found</p>
          <p className="text-sm text-muted">
            {activeFilter === "all"
              ? "You haven't placed any bets yet"
              : `You don't have any ${activeFilter} bets`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBets.map((bet) => (
            <div
              key={bet.id}
              className="bg-secondary rounded-xl border border-line p-4 md:p-6 space-y-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Ticket size={16} className="text-primary" />
                      <span className="text-xs text-muted font-medium">
                        Bet ID: {bet.betId || bet.id.slice(-8).toUpperCase()}
                      </span>
                    </div>
                    {bet.status === "pending" && (
                      <button
                        onClick={() => handleCancelBet(bet.id)}
                        disabled={isCancellingBet}
                        className="text-xs text-red-500 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-muted">
                    Placed {formatDate(bet.placedAt)}
                  </p>
                </div>
                {getStatusBadge(bet.status)}
              </div>

              {/* Bet Details */}
              <div className="space-y-3 pt-3 border-t border-line">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted mb-1">Stake</p>
                    <p className="font-semibold font-space">₦{bet.stake.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted mb-1">Total Odds</p>
                    <p className="font-semibold font-space">{bet.totalOdds.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted mb-1">Potential Win</p>
                    <p className="font-semibold font-space text-primary">
                      ₦{bet.potentialWin.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted mb-1">Selections</p>
                    <p className="font-semibold font-space">{bet.selections.length}</p>
                  </div>
                </div>

                {/* Bet Selections */}
                <div className="space-y-2 pt-2">
                  <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">
                    Selections
                  </p>
                  {bet.selections.map((selection) => (
                    <div
                      key={selection.id}
                      className="bg-foreground/60 rounded-lg border border-line p-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            <img
                              src={selection.match.league.icon}
                              alt={selection.match.league.name}
                              className="w-3 h-3 object-contain"
                            />
                            <span className="text-[10px] text-muted">
                              {selection.match.league.name}
                            </span>
                          </div>
                          <p className="text-xs font-medium mb-1">
                            {selection.match.homeTeam.name} vs{" "}
                            {selection.match.awayTeam.name}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] px-2 py-0.5 bg-primary/20 text-primary rounded-full font-semibold">
                              {selection.betType === "straightWin"
                                ? selection.option === "home"
                                  ? "1"
                                  : selection.option === "draw"
                                  ? "X"
                                  : "2"
                                : selection.option}
                            </span>
                            <span className="text-xs text-muted">{selection.label}</span>
                          </div>
                        </div>
                        <span className="text-sm font-semibold font-space">
                          {selection.odds.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

