import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/config/api";
import { toast } from "sonner";



export default function useAdmin() {
  const queryClient = useQueryClient();

  // Query keys
  const adminKeys = {
    stats: ["admin", "stats"] as const,
    users: ["admin", "users"] as const,
    user: (id: string) => ["admin", "user", id] as const,
    bets: (status?: string) => ["admin", "bets", status] as const,
    transactions: (type?: string, status?: string) =>
      ["admin", "transactions", type, status] as const,
    withdrawals: (status?: string) => ["admin", "withdrawals", status] as const,
    matches: (status?: string) => ["admin", "matches", status] as const,
  };

  // Get dashboard stats
  const getStats = async (): Promise<IAdminStats> => {
    const response = await api.get("/admin/stats");
    if (response.data.success) {
      return response.data.stats;
    }
    throw new Error(response.data.message || "Failed to fetch stats");
  };

  // Get all users
  const getUsers = async (): Promise<IUser[]> => {
    const response = await api.get("/admin/users");
    if (response.data.success) {
      return response.data.users;
    }
    throw new Error(response.data.message || "Failed to fetch users");
  };

  // Get user by ID with bets and transactions
  const getUserById = async (id: string): Promise<{
    user: IUser;
    bets: IBet[];
    transactions: ITransaction[];
  }> => {
    const response = await api.get(`/admin/users/${id}`);
    if (response.data.success) {
      return {
        user: response.data.user,
        bets: response.data.bets,
        transactions: response.data.transactions,
      };
    }
    throw new Error(response.data.message || "Failed to fetch user");
  };

  // Get all bets
  const getBets = async (status?: string): Promise<IBet[]> => {
    const params = status ? `?status=${status}` : "";
    const response = await api.get(`/admin/bets${params}`);
    if (response.data.success) {
      return response.data.bets;
    }
    throw new Error(response.data.message || "Failed to fetch bets");
  };

  // Update bet status
  const updateBetStatus = async ({
    id,
    status,
  }: {
    id: string;
    status: "pending" | "won" | "lost" | "cancelled";
  }): Promise<IBet> => {
    const response = await api.patch(`/v1/admin/bets/${id}/status`, { status });
    if (response.data.success) {
      return response.data.bet;
    }
    throw new Error(response.data.message || "Failed to update bet status");
  };

  // Get all transactions
  const getTransactions = async (
    type?: string,
    status?: string
  ): Promise<ITransaction[]> => {
    const params = new URLSearchParams();
    if (type) params.append("type", type);
    if (status) params.append("status", status);
    const queryString = params.toString();
    const url = `/admin/transactions${queryString ? `?${queryString}` : ""}`;
    const response = await api.get(url);
    if (response.data.success) {
      return response.data.transactions;
    }
    throw new Error(response.data.message || "Failed to fetch transactions");
  };

  // Get all withdrawals
  const getWithdrawals = async (status?: string): Promise<ITransaction[]> => {
    const params = status ? `?status=${status}` : "";
    const response = await api.get(`/admin/withdrawals${params}`);
    if (response.data.success) {
      return response.data.withdrawals;
    }
    throw new Error(response.data.message || "Failed to fetch withdrawals");
  };

  // Get all matches
  const getMatches = async (status?: string): Promise<IMatch[]> => {
    const params = status ? `?status=${status}` : "";
    const response = await api.get(`/matches${params}`);
    if (response.data.success) {
      return response.data.matches;
    }
    throw new Error(response.data.message || "Failed to fetch matches");
  };

  // Create match
  const createMatch = async (matchData: Omit<IMatch, "id">): Promise<IMatch> => {
    const response = await api.post("/matches", matchData);
    if (response.data.success) {
      return response.data.match;
    }
    throw new Error(response.data.message || "Failed to create match");
  };

  // Update match
  const updateMatch = async ({
    id,
    ...updateData
  }: Partial<IMatch> & { id: string }): Promise<IMatch> => {
    const response = await api.patch(`/matches/${id}`, updateData);
    if (response.data.success) {
      return response.data.match;
    }
    throw new Error(response.data.message || "Failed to update match");
  };

  // Delete match
  const deleteMatch = async (id: string): Promise<void> => {
    const response = await api.delete(`/matches/${id}`);
    if (response.data.success) {
      return;
    }
    throw new Error(response.data.message || "Failed to delete match");
  };

  // Update user wallet balance
  const updateUserWallet = async ({
    userId,
    amount,
    type,
    description,
  }: {
    userId: string;
    amount: number;
    type: "add" | "subtract" | "set";
    description?: string;
  }): Promise<{ user: IUser; oldBalance: number; newBalance: number }> => {
    const response = await api.patch(`/admin/users/${userId}/wallet`, {
      amount,
      type,
      description,
    });
    if (response.data.success) {
      return {
        user: response.data.user,
        oldBalance: response.data.oldBalance,
        newBalance: response.data.newBalance,
      };
    }
    throw new Error(response.data.message || "Failed to update wallet balance");
  };

  // Approve withdrawal
  const approveWithdrawal = async (id: string): Promise<ITransaction> => {
    const response = await api.post(`/transactions/${id}/approve`);
    if (response.data.success) {
      return response.data.transaction;
    }
    throw new Error(response.data.message || "Failed to approve withdrawal");
  };

  // Reject/Cancel withdrawal
  const rejectWithdrawal = async (id: string): Promise<ITransaction> => {
    const response = await api.post(`/transactions/${id}/cancel`);
    if (response.data.success) {
      return response.data.transaction;
    }
    throw new Error(response.data.message || "Failed to reject withdrawal");
  };

  // Toggle user admin status
  const toggleUserAdminStatus = async ({
    userId,
    isAdmin,
  }: {
    userId: string;
    isAdmin: boolean;
  }): Promise<IUser> => {
    const response = await api.patch(`/admin/users/${userId}/admin`, { isAdmin });
    if (response.data.success) {
      return response.data.user;
    }
    throw new Error(response.data.message || "Failed to update admin status");
  };

  // React Query hooks
  const useStatsQuery = () => {
    return useQuery({
      queryKey: adminKeys.stats,
      queryFn: getStats,
      staleTime: 30000, // 30 seconds
    });
  };

  const useUsersQuery = () => {
    return useQuery({
      queryKey: adminKeys.users,
      queryFn: getUsers,
    });
  };

  const useUserQuery = (id: string) => {
    return useQuery({
      queryKey: adminKeys.user(id),
      queryFn: () => getUserById(id),
      enabled: !!id,
    });
  };

  const useBetsQuery = (status?: string) => {
    return useQuery({
      queryKey: adminKeys.bets(status),
      queryFn: () => getBets(status),
    });
  };

  const useTransactionsQuery = (type?: string, status?: string) => {
    return useQuery({
    queryKey: adminKeys.transactions(type, status),
  queryFn: () => getTransactions(type, status),
  });
  };

  const useWithdrawalsQuery = (status?: string) => {
    return useQuery({
      queryKey: adminKeys.withdrawals(status),
      queryFn: () => getWithdrawals(status),
    });
  };

  const useMatchesQuery = (status?: string) => {
    return useQuery({
      queryKey: adminKeys.matches(status),
      queryFn: () => getMatches(status),
    });
  };

  // Mutations
  const updateBetStatusMutation = useMutation({
    mutationFn: updateBetStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.bets() });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats });
      toast.success("Bet status updated successfully");
    },
  });

  const createMatchMutation = useMutation({
    mutationFn: createMatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.matches() });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats });
      toast.success("Match created successfully");
    },
  });

  const updateMatchMutation = useMutation({
    mutationFn: updateMatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.matches() });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats });
      toast.success("Match updated successfully");
    },
  });

  const deleteMatchMutation = useMutation({
    mutationFn: deleteMatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.matches() });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats });
      toast.success("Match deleted successfully");
    },
  });

  const updateUserWalletMutation = useMutation({
    mutationFn: updateUserWallet,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.user(data.user.id) });
      queryClient.invalidateQueries({ queryKey: adminKeys.users });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats });
      toast.success(`Wallet balance updated to ₦${data.newBalance.toLocaleString()}`);
    },
  });

  const approveWithdrawalMutation = useMutation({
    mutationFn: approveWithdrawal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.withdrawals() });
      queryClient.invalidateQueries({ queryKey: adminKeys.transactions() });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats });
      toast.success("Withdrawal approved successfully");
    },
  });

  const rejectWithdrawalMutation = useMutation({
    mutationFn: rejectWithdrawal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.withdrawals() });
      queryClient.invalidateQueries({ queryKey: adminKeys.transactions() });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats });
      toast.success("Withdrawal rejected successfully");
    },
  });

  const toggleUserAdminStatusMutation = useMutation({
    mutationFn: toggleUserAdminStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.user(data.id) });
      queryClient.invalidateQueries({ queryKey: adminKeys.users });
      queryClient.invalidateQueries({ queryKey: adminKeys.stats });
      toast.success(`Admin status ${data.isAdmin ? "enabled" : "disabled"} successfully`);
    },
  });

  return {
    // Queries
    useStatsQuery,
    useUsersQuery,
    useUserQuery,
    useBetsQuery,
    useTransactionsQuery,
    useWithdrawalsQuery,
    useMatchesQuery,
    // Mutations
    updateBetStatus: updateBetStatusMutation.mutateAsync,
    createMatch: createMatchMutation.mutateAsync,
    updateMatch: updateMatchMutation.mutateAsync,
    deleteMatch: deleteMatchMutation.mutateAsync,
    updateUserWallet: updateUserWalletMutation.mutateAsync,
    approveWithdrawal: approveWithdrawalMutation.mutateAsync,
    rejectWithdrawal: rejectWithdrawalMutation.mutateAsync,
    toggleUserAdminStatus: toggleUserAdminStatusMutation.mutateAsync,
    // Mutation states
    isUpdatingBetStatus: updateBetStatusMutation.isPending,
    isCreatingMatch: createMatchMutation.isPending,
    isUpdatingMatch: updateMatchMutation.isPending,
    isDeletingMatch: deleteMatchMutation.isPending,
    isUpdatingWallet: updateUserWalletMutation.isPending,
    isApprovingWithdrawal: approveWithdrawalMutation.isPending,
    isRejectingWithdrawal: rejectWithdrawalMutation.isPending,
    isTogglingAdminStatus: toggleUserAdminStatusMutation.isPending,
  };
}
