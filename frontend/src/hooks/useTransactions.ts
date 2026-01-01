import { useQuery } from "@tanstack/react-query";
import api from "@/config/api";
import useAuth from "./useAuth";

export default function useTransactions() {
  const { user } = useAuth();

  // Query key factory
  const transactionKeys = {
    all: ["transactions"] as const,
    lists: () => [...transactionKeys.all, "list"] as const,
    list: (filters?: { type?: string; status?: string }) => [
      ...transactionKeys.lists(),
      filters,
    ] as const,
    details: () => [...transactionKeys.all, "detail"] as const,
    detail: (id: string) => [...transactionKeys.details(), id] as const,
  };

  // Get transactions
  const getTransactions = async (filters?: {
    type?: TransactionType;
    status?: TransactionStatus;
    limit?: number;
    page?: number;
  }): Promise<{
    transactions: ITransaction[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> => {
    const params = new URLSearchParams();
    if (filters?.type) params.append("type", filters.type);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.page) params.append("page", filters.page.toString());

    const queryString = params.toString();
    const url = `/transactions${queryString ? `?${queryString}` : ""}`;

    const response = await api.get(url);
    if (response.data.success) {
      return {
        transactions: response.data.transactions,
        pagination: response.data.pagination,
      };
    }
    throw new Error(response.data.message || "Failed to fetch transactions");
  };

  // Get single transaction by ID
  const getTransactionById = async (id: string): Promise<ITransaction> => {
    const response = await api.get(`/transactions/${id}`);
    if (response.data.success) {
      return response.data.transaction;
    }
    throw new Error(response.data.message || "Failed to fetch transaction");
  };

  // React Query hooks
  const useTransactionsQuery = (filters?: {
    type?: TransactionType;
    status?: TransactionStatus;
    limit?: number;
    page?: number;
  }) => {
    return useQuery({
      queryKey: transactionKeys.list(filters),
      queryFn: () => getTransactions(filters),
      enabled: !!user, // Only fetch if user is authenticated
      staleTime: 30000, // Consider data fresh for 30 seconds
    });
  };

  const useTransactionQuery = (id: string) => {
    return useQuery({
      queryKey: transactionKeys.detail(id),
      queryFn: () => getTransactionById(id),
      enabled: !!user && !!id,
    });
  };

  return {
    // Queries
    useTransactionsQuery,
    useTransactionQuery,
  };
}

