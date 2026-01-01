import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BetSelection } from "./useBetslipStore";

export interface PlacedBet {
  id: string;
  bets: BetSelection[];
  stake: number;
  totalOdds: number;
  potentialWin: number;
  status: "pending" | "won" | "lost" | "cancelled";
  placedAt: string;
  settledAt?: string;
}

interface PlacedBetsStore {
  placedBets: PlacedBet[];
  placeBet: (bets: BetSelection[], stake: number, totalOdds: number, potentialWin: number) => void;
  updateBetStatus: (betId: string, status: PlacedBet["status"]) => void;
  getPendingBets: () => PlacedBet[];
  getWonBets: () => PlacedBet[];
  getLostBets: () => PlacedBet[];
}

const usePlacedBetsStore = create<PlacedBetsStore>()(
  persist(
    (set, get) => ({
      placedBets: [],

      placeBet: (bets, stake, totalOdds, potentialWin) => {
        const newBet: PlacedBet = {
          id: `bet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          bets,
          stake,
          totalOdds,
          potentialWin,
          status: "pending",
          placedAt: new Date().toISOString(),
        };
        set({ placedBets: [newBet, ...get().placedBets] });
        return newBet.id;
      },

      updateBetStatus: (betId, status) => {
        set({
          placedBets: get().placedBets.map((bet) =>
            bet.id === betId
              ? { ...bet, status, settledAt: new Date().toISOString() }
              : bet
          ),
        });
      },

      getPendingBets: () => {
        return get().placedBets.filter((bet) => bet.status === "pending");
      },

      getWonBets: () => {
        return get().placedBets.filter((bet) => bet.status === "won");
      },

      getLostBets: () => {
        return get().placedBets.filter((bet) => bet.status === "lost");
      },
    }),
    {
      name: "placed-bets",
      partialize: (state) => ({
        placedBets: state.placedBets,
      }),
    }
  )
);

export default usePlacedBetsStore;

