import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Match } from "@/constants/dummy";

export interface BetSelection {
  id: string; // Unique ID for this bet selection
  matchId: string;
  match: Match;
  betType: "straightWin" | "doubleChance";
  option: string; // "home", "draw", "away", "1X", "12", "X2"
  odds: number;
  label: string; // Display label like "Manchester United Win" or "1X"
}

interface BetslipStore {
  bets: BetSelection[];
  addBet: (bet: BetSelection) => void;
  removeBet: (betId: string) => void;
  clearBets: () => void;
  getTotalOdds: () => number;
  isBetInSlip: (matchId: string, betType: "straightWin" | "doubleChance", option: string) => boolean;
}

const useBetslipStore = create<BetslipStore>()(
  persist(
    (set, get) => ({
      bets: [],

      addBet: (bet) => {
        const { bets } = get();
        
        // Check if this exact bet already exists
        const existingBetIndex = bets.findIndex(
          (b) =>
            b.matchId === bet.matchId &&
            b.betType === bet.betType &&
            b.option === bet.option
        );

        if (existingBetIndex >= 0) {
          // Remove if already exists (toggle behavior)
          set({
            bets: bets.filter((_, index) => index !== existingBetIndex),
          });
        } else {
          // Add new bet (always allow multiple bets)
          set({ bets: [...bets, bet] });
        }
      },

      removeBet: (betId) => {
        set({ bets: get().bets.filter((b) => b.id !== betId) });
      },

      clearBets: () => {
        set({ bets: [] });
      },

      getTotalOdds: () => {
        const { bets } = get();
        if (bets.length === 0) return 0;
        
        // Always multiply odds for accumulator/combine bets
        return bets.reduce((total, bet) => total * bet.odds, 1);
      },

      isBetInSlip: (matchId, betType, option) => {
        return get().bets.some(
          (b) => b.matchId === matchId && b.betType === betType && b.option === option
        );
      },
    }),
    {
      name: "betslip",
      partialize: (state) => ({
        bets: state.bets,
      }),
    }
  )
);

export default useBetslipStore;

