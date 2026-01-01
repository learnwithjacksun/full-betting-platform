import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useBetsStore } from "@/store";
import api from "@/config/api";
import { toast } from "sonner";
import useAuth from "./useAuth";

interface PlaceBetData {
  selections: Array<{
    id: string;
    matchId: string;
    match: {
      id: string;
      league: {
        name: string;
        icon: string;
        country: string;
      };
      date: string;
      time: string;
      status: string;
      homeTeam: {
        name: string;
        shortName: string;
        logo?: string;
      };
      awayTeam: {
        name: string;
        shortName: string;
        logo?: string;
      };
      score?: {
        home?: number;
        away?: number;
      };
    };
    betType: "straightWin" | "doubleChance";
    option: string;
    odds: number;
    label: string;
  }>;
  stake: number;
  totalOdds: number;
  potentialWin: number;
}

export default function useBets() {
  const { setBets, bets } = useBetsStore();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Query key factory
  const betsKeys = {
    all: ["bets"] as const,
    lists: () => [...betsKeys.all, "list"] as const,
    list: (status?: string) => [...betsKeys.lists(), status] as const,
    details: () => [...betsKeys.all, "detail"] as const,
    detail: (id: string) => [...betsKeys.details(), id] as const,
  };

  // Get all bets
  const getBets = async (status?: string): Promise<IBet[]> => {
    const params = status ? `?status=${status}` : "";
    const response = await api.get(`/bets${params}`);
    if (response.data.success) {
      return response.data.bets;
    }
    throw new Error(response.data.message || "Failed to fetch bets");
  };

  // Get single bet by ID
  const getBetById = async (id: string): Promise<IBet> => {
    const response = await api.get(`/bets/${id}`);
    if (response.data.success) {
      return response.data.bet;
    }
    throw new Error(response.data.message || "Failed to fetch bet");
  };

  // Place a new bet
  const placeBet = async (data: PlaceBetData): Promise<IBet> => {
    const response = await api.post("/bets", data);
    if (response.data.success) {
      return response.data.bet;
    }
    throw new Error(response.data.message || "Failed to place bet");
  };

  // Cancel a bet
  const cancelBet = async (id: string): Promise<IBet> => {
    const response = await api.post(`/bets/${id}/cancel`);
    if (response.data.success) {
      return response.data.bet;
    }
    throw new Error(response.data.message || "Failed to cancel bet");
  };

  // Update bet status (admin only, but available for user to cancel)
  const updateBetStatus = async (
    id: string,
    status: "pending" | "won" | "lost" | "cancelled"
  ): Promise<IBet> => {
    const response = await api.patch(`/bets/${id}/status`, { status });
    if (response.data.success) {
      return response.data.bet;
    }
    throw new Error(response.data.message || "Failed to update bet status");
  };

  // React Query hooks
  const useBetsQuery = (status?: string) => {
    const query = useQuery({
      queryKey: betsKeys.list(status),
      queryFn: () => getBets(status),
      enabled: !!user, // Only fetch if user is authenticated
      staleTime: 30000, // Consider data fresh for 30 seconds
    });

    // Sync with Zustand store when data changes
    useEffect(() => {
      if (query.data) {
        setBets(query.data);
      }
    }, [query.data]); // setBets is stable from Zustand, no need to include it

    return query;
  };

  const useBetQuery = (id: string) => {
    return useQuery({
      queryKey: betsKeys.detail(id),
      queryFn: () => getBetById(id),
      enabled: !!user && !!id,
    });
  };

  const placeBetMutation = useMutation({
    mutationFn: placeBet,
    onSuccess: () => {
      // Invalidate and refetch bets list
      queryClient.invalidateQueries({ queryKey: betsKeys.lists() });
      toast.success("Bet placed successfully!");

      // Update user wallet
      queryClient.invalidateQueries({ queryKey: ["auth", "check"] });
    },
  });

  const cancelBetMutation = useMutation({
    mutationFn: cancelBet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: betsKeys.lists() });
      toast.success("Bet cancelled successfully!");

      // Update user wallet
      queryClient.invalidateQueries({ queryKey: ["auth", "check"] });
    },
  });

  const updateBetStatusMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "pending" | "won" | "lost" | "cancelled";
    }) => updateBetStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: betsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ["auth", "check"] });
    },
  });

  return {
    bets,
    // Queries
    useBetsQuery,
    useBetQuery,

    // Mutations
    placeBet: placeBetMutation.mutateAsync,
    cancelBet: cancelBetMutation.mutateAsync,
    updateBetStatus: updateBetStatusMutation.mutateAsync,

    // Mutation states
    isPlacingBet: placeBetMutation.isPending,
    isCancellingBet: cancelBetMutation.isPending,
    isUpdatingStatus: updateBetStatusMutation.isPending,
  };
}
