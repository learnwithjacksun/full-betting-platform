import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/config/api";
import { toast } from "sonner";
import useAuth from "./useAuth";

interface ResolveBankAccountData {
  accountNumber: string;
  bankCode: string;
  bankName: string;
}

interface AddBankAccountData {
  accountName: string;
  accountNumber: string;
  bankName: string;
  bankCode: string;
}

export default function useBank() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Query key factory
  const bankKeys = {
    all: ["bank"] as const,
    supported: () => [...bankKeys.all, "supported"] as const,
    accounts: () => [...bankKeys.all, "accounts"] as const,
  };

  // Get supported banks (public endpoint)
  const getSupportedBanks = async (): Promise<ISupportedBank[]> => {
    const response = await api.get("/bank/supported");
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to fetch supported banks");
  };

  // Resolve bank account
  const resolveBankAccount = async (
    data: ResolveBankAccountData
  ): Promise<{
    accountName: string;
    accountNumber: string;
    bankName: string;
    bankCode: string;
  }> => {
    const response = await api.post("/bank/resolve", data);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to resolve bank account");
  };

  // Get user's bank accounts
  const getBankAccounts = async (): Promise<IBankAccount[]> => {
    const response = await api.get("/bank");
    if (response.data.success) {
      return response.data.data || [];
    }
    throw new Error(response.data.message || "Failed to fetch bank accounts");
  };

  // Add bank account
  const addBankAccount = async (data: AddBankAccountData): Promise<IBankAccount[]> => {
    const response = await api.post("/bank", data);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to add bank account");
  };

  // Delete bank account
  const deleteBankAccount = async (id: string): Promise<void> => {
    const response = await api.delete(`/bank/${id}`);
    if (response.data.success) {
      return;
    }
    throw new Error(response.data.message || "Failed to delete bank account");
  };

  // React Query hooks
  const useSupportedBanksQuery = () => {
    return useQuery({
      queryKey: bankKeys.supported(),
      queryFn: getSupportedBanks,
      staleTime: 24 * 60 * 60 * 1000, // Cache for 24 hours (banks don't change often)
    });
  };

  const useBankAccountsQuery = () => {
    return useQuery({
      queryKey: bankKeys.accounts(),
      queryFn: getBankAccounts,
      enabled: !!user, // Only fetch if user is authenticated
    });
  };

  const resolveBankAccountMutation = useMutation({
    mutationFn: resolveBankAccount,
    onError: () => {
      // Error is handled by API interceptor
    },
  });

  const addBankAccountMutation = useMutation({
    mutationFn: addBankAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bankKeys.accounts() });
      queryClient.invalidateQueries({ queryKey: ["auth", "check"] }); // Refresh user data
      toast.success("Bank account added successfully!");
    },
  });

  const deleteBankAccountMutation = useMutation({
    mutationFn: deleteBankAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bankKeys.accounts() });
      queryClient.invalidateQueries({ queryKey: ["auth", "check"] }); // Refresh user data
      toast.success("Bank account deleted successfully!");
    },
  });

  return {
    // Queries
    useSupportedBanksQuery,
    useBankAccountsQuery,

    // Mutations
    resolveBankAccount: resolveBankAccountMutation.mutateAsync,
    addBankAccount: addBankAccountMutation.mutateAsync,
    deleteBankAccount: deleteBankAccountMutation.mutateAsync,

    // Mutation states
    isResolving: resolveBankAccountMutation.isPending,
    isAdding: addBankAccountMutation.isPending,
    isDeleting: deleteBankAccountMutation.isPending,
  };
}
