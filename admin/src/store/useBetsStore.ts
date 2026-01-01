import { create } from "zustand";

interface IBetsState {
  bets: IBet[];
  setBets: (bets: IBet[]) => void;
  addBet: (bet: IBet) => void;
  updateBet: (id: string, bet: Partial<IBet>) => void;
  removeBet: (id: string) => void;
  getBetsByStatus: (status: BetStatus) => IBet[];
  getPendingBetsCount: () => number;
  getTotalBetsCount: () => number;
}

const useBetsStore = create<IBetsState>()((set, get) => ({
  bets: [],
  
  setBets: (bets) => set({ bets }),
  
  addBet: (bet) => set((state) => ({ bets: [bet, ...state.bets] })),
  
  updateBet: (id, updatedBet) =>
    set((state) => ({
      bets: state.bets.map((bet) =>
        bet.id === id ? { ...bet, ...updatedBet } : bet
      ),
    })),
  
  removeBet: (id) =>
    set((state) => ({
      bets: state.bets.filter((bet) => bet.id !== id),
    })),
  
  getBetsByStatus: (status) => {
    return get().bets.filter((bet) => bet.status === status);
  },
  
  getPendingBetsCount: () => {
    return get().bets.filter((bet) => bet.status === "pending").length;
  },
  
  getTotalBetsCount: () => {
    return get().bets.length;
  },
}));

export default useBetsStore;
