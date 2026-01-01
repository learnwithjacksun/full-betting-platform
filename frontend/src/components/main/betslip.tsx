import { X, Ticket, Calculator } from "lucide-react";
import { useBetslipStore } from "@/store";
import { ButtonWithLoader } from "@/components/ui";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import useBets from "@/hooks/useBets";

interface BetslipProps {
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Betslip({ isMobile = false, isOpen = false, onClose }: BetslipProps) {
  const { bets, removeBet, clearBets, getTotalOdds } = useBetslipStore();
  const { placeBet, isPlacingBet } = useBets();
  const [stake, setStake] = useState<string>("");
  const [potentialWin, setPotentialWin] = useState<number>(0);

  const totalOdds = getTotalOdds();

  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = "hidden";
    } else if (isMobile) {
      document.body.style.overflow = "auto";
    }

    return () => {
      if (isMobile) {
        document.body.style.overflow = "auto";
      }
    };
  }, [isMobile, isOpen]);

  // Calculate potential win when stake changes
  const handleStakeChange = (value: string) => {
    setStake(value);
    const stakeNum = parseFloat(value) || 0;
    if (stakeNum > 0 && totalOdds > 0) {
      setPotentialWin(stakeNum * totalOdds);
    } else {
      setPotentialWin(0);
    }
  };

  const formatOdds = (odds: number) => {
    return odds.toFixed(2);
  };

  const handlePlaceBet = async () => {
    if (!stake || parseFloat(stake) <= 0) {
      toast.error("Please enter a valid stake amount");
      return;
    }

    if (bets.length === 0) {
      toast.error("Please add at least one bet to your betslip");
      return;
    }

    try {
      // Transform betslip selections to match API format
      const selections = bets.map((bet) => ({
        id: bet.id,
        matchId: bet.matchId,
        match: bet.match,
        betType: bet.betType,
        option: bet.option,
        odds: bet.odds,
        label: bet.label,
      }));

      await placeBet({
        selections,
        stake: parseFloat(stake),
        totalOdds,
        potentialWin,
      });

      // Clear the betslip after successful placement
      clearBets();
      setStake("");
      setPotentialWin(0);

      // Close mobile betslip if open
      if (isMobile && onClose) {
        onClose();
      }
    } catch (error) {
      console.error(error);
      // Error is handled by API interceptor
    }
  };

  const betslipContent = (
    <>
      {bets.length === 0 ? (
        <div className="p-4 flex flex-col items-center justify-center text-center h-full">
          <div className="w-16 h-16 rounded-full bg-foreground flex items-center justify-center mb-4">
            <Ticket size={32} className="text-muted" />
          </div>
          <p className="text-sm font-semibold text-main mb-1">Your betslip is empty</p>
          <p className="text-xs text-muted">
            Select odds from matches to add them to your betslip
          </p>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="p-4 border-b border-line bg-foreground/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ticket size={18} className="text-primary" />
                <h3 className="text-sm font-semibold font-space">Betslip</h3>
                <span className="text-xs bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center font-space">
                  {bets.length}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {bets.length > 0 && (
                  <button
                    onClick={clearBets}
                    className="text-xs text-muted hover:text-red-500 transition-colors"
                  >
                    Clear all
                  </button>
                )}
                {isMobile && onClose && (
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-full bg-foreground hover:bg-foreground/80 transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Bets List */}
          <div className="flex-1 overflow-y-auto hide-scrollbar p-4 space-y-3">
            {bets.map((bet) => (
              <div
                key={bet.id}
                className="bg-foreground/60 rounded-lg border border-line p-3 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                     
                      <span className="text-[10px] text-muted">
                        {bet.match.league.name}
                      </span>
                    </div>
                    <p className="text-xs font-medium mb-1">
                      {bet.match.homeTeam.name} vs {bet.match.awayTeam.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 bg-primary/20 text-primary rounded-full font-semibold">
                        {bet.betType === "straightWin"
                          ? bet.option === "home"
                            ? "1"
                            : bet.option === "draw"
                            ? "X"
                            : "2"
                          : bet.option}
                      </span>
                      <span className="text-xs text-muted">{bet.label}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeBet(bet.id)}
                    className="text-muted hover:text-red-500 transition-colors flex-shrink-0"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-line">
                  <span className="text-[10px] text-muted">Odds</span>
                  <span className="text-sm font-semibold font-space">
                    {formatOdds(bet.odds)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer with Stake Input and Place Bet */}
          <div className="p-4 border-t border-line bg-foreground/60 space-y-3">
            {bets.length > 1 && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">Total Odds:</span>
                <span className="font-semibold font-space text-primary">
                  {formatOdds(totalOdds)}
                </span>
              </div>
            )}

        <div className="space-y-2">
          <label className="text-xs font-medium text-muted block">Stake</label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter stake amount"
              value={stake}
              onChange={(e) => handleStakeChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-line bg-secondary text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
        </div>

        {stake && parseFloat(stake) > 0 && (
          <div className="flex items-center justify-between p-2 bg-primary/10 rounded-lg">
            <div className="flex items-center gap-2">
              <Calculator size={14} className="text-primary" />
              <span className="text-xs text-muted">Potential Win:</span>
            </div>
            <span className="text-sm font-semibold font-space text-primary">
              ₦{potentialWin.toFixed(2)}
            </span>
          </div>
        )}

            <ButtonWithLoader
              initialText="Place Bet"
              loadingText="Placing..."
              loading={isPlacingBet}
              onClick={handlePlaceBet}
              disabled={!stake || parseFloat(stake) <= 0 || bets.length === 0 || isPlacingBet}
              className="w-full btn-primary h-11 rounded-full text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </>
      )}
    </>
  );

  // Mobile view with drawer
  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="absolute right-0 top-0 h-full w-full max-w-sm bg-secondary border-l border-line flex flex-col"
            >
              {betslipContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  }

  // Desktop view (always visible)
  return (
    <div className="w-full md:w-80 bg-secondary border-l border-line h-[calc(100dvh-70px)] flex flex-col">
      {betslipContent}
    </div>
  );
}

