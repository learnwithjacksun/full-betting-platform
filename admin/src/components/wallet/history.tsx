import { HistoryIcon, ArrowDownCircle, ArrowUpCircle, Ticket, TrendingUp, XCircle } from "lucide-react";
import useTransactions from "@/hooks/useTransactions";
import { useState } from "react";
import { formatNumber } from "@/helpers/formatNumber";

type TransactionFilter = "all" | "deposit" | "withdrawal" | "bet" | "bet_win" | "bet_refund";
type StatusFilter = "all" | "pending" | "completed" | "failed" | "cancelled";

export default function History() {
  const { useTransactionsQuery } = useTransactions();
  const [typeFilter, setTypeFilter] = useState<TransactionFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useTransactionsQuery({
    type: typeFilter !== "all" ? typeFilter : undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    limit: 20,
    page,
  });

  const transactions = data?.transactions || [];
  const pagination = data?.pagination;

  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case "deposit":
        return <ArrowDownCircle size={16} className="text-green-500" />;
      case "withdrawal":
        return <ArrowUpCircle size={16} className="text-red-500" />;
      case "bet":
        return <Ticket size={16} className="text-blue-500" />;
      case "bet_win":
        return <TrendingUp size={16} className="text-green-500" />;
      case "bet_refund":
        return <XCircle size={16} className="text-yellow-500" />;
      default:
        return <HistoryIcon size={16} className="text-muted" />;
    }
  };

  const getStatusBadge = (status: TransactionStatus) => {
    const baseClasses = "text-[10px] px-2 py-0.5 rounded-full font-semibold";
    switch (status) {
      case "pending":
        return (
          <span className={`${baseClasses} bg-yellow-500/20 text-yellow-600`}>
            Pending
          </span>
        );
      case "completed":
        return (
          <span className={`${baseClasses} bg-green-500/20 text-green-600`}>
            Completed
          </span>
        );
      case "failed":
        return (
          <span className={`${baseClasses} bg-red-500/20 text-red-600`}>
            Failed
          </span>
        );
      case "cancelled":
        return (
          <span className={`${baseClasses} bg-gray-500/20 text-gray-600`}>
            Cancelled
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const typeFilters: { id: TransactionFilter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "deposit", label: "Deposits" },
    { id: "withdrawal", label: "Withdrawals" },
    { id: "bet", label: "Bets" },
    { id: "bet_win", label: "Winnings" },
    { id: "bet_refund", label: "Refunds" },
  ];

  const statusFilters: { id: StatusFilter; label: string }[] = [
    { id: "all", label: "All Status" },
    { id: "pending", label: "Pending" },
    { id: "completed", label: "Completed" },
    { id: "failed", label: "Failed" },
    { id: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-secondary rounded-xl border border-line p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold font-space mb-2">
            Transaction History
          </h3>
          <p className="text-sm text-muted">
            View all your deposits, withdrawals, and betting transactions
          </p>
        </div>

        {/* Filters */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted block mb-2">
              Filter by Type
            </label>
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
              {typeFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => {
                    setTypeFilter(filter.id);
                    setPage(1);
                  }}
                  className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-medium transition-all ${
                    typeFilter === filter.id
                      ? "bg-primary text-white border-primary shadow-md"
                      : "bg-secondary/80 text-muted border-line hover:border-primary/40 hover:text-main"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted block mb-2">
              Filter by Status
            </label>
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
              {statusFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => {
                    setStatusFilter(filter.id);
                    setPage(1);
                  }}
                  className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-medium transition-all ${
                    statusFilter === filter.id
                      ? "bg-primary text-white border-primary shadow-md"
                      : "bg-secondary/80 text-muted border-line hover:border-primary/40 hover:text-main"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <HistoryIcon size={48} className="mx-auto text-muted mb-3 animate-pulse" />
            <p className="text-sm font-medium text-main">Loading transactions...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-12">
            <HistoryIcon size={48} className="mx-auto text-red-500 mb-3" />
            <p className="text-sm font-medium text-main mb-1">
              Failed to load transactions
            </p>
            <p className="text-xs text-muted">Please try refreshing the page</p>
          </div>
        )}

        {/* Transactions List */}
        {!isLoading && !error && transactions.length === 0 && (
          <div className="text-center py-12">
            <HistoryIcon size={48} className="mx-auto text-muted mb-3" />
            <p className="text-sm font-medium text-main mb-1">No transactions found</p>
            <p className="text-xs text-muted">
              Your transaction history will appear here
            </p>
          </div>
        )}

        {!isLoading && !error && transactions.length > 0 && (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-foreground/60 rounded-lg border border-line p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-0.5">{getTransactionIcon(transaction.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold capitalize">
                          {transaction.type.replace("_", " ")}
                        </p>
                        {getStatusBadge(transaction.status)}
                      </div>
                      <p className="text-xs text-muted mb-1">
                        {transaction.description}
                      </p>
                      {transaction.bankAccount && (
                        <p className="text-xs text-muted">
                          {transaction.bankAccount.bankName} -{" "}
                          {transaction.bankAccount.accountNumber.replace(
                            /(\d{4})(?=\d)/g,
                            "$1 "
                          )}
                        </p>
                      )}
                      {transaction.reference && (
                        <p className="text-[10px] text-muted font-mono mt-1">
                          Ref: {transaction.reference}
                        </p>
                      )}
                      <p className="text-[10px] text-muted mt-1">
                        {formatDate(transaction.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-base font-bold font-space ${
                        transaction.type === "deposit" || transaction.type === "bet_win"
                          ? "text-green-500"
                          : transaction.type === "withdrawal" || transaction.type === "bet"
                          ? "text-red-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {transaction.type === "deposit" || transaction.type === "bet_win"
                        ? "+"
                        : "-"}
                      ₦{formatNumber(transaction.amount)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-line">
            <p className="text-xs text-muted">
              Page {pagination.page} of {pagination.pages} ({pagination.total} total)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={pagination.page === 1}
                className="px-3 py-1.5 rounded-lg border border-line bg-secondary text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-foreground transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={pagination.page === pagination.pages}
                className="px-3 py-1.5 rounded-lg border border-line bg-secondary text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-foreground transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
