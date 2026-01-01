import { useAdmin } from "@/hooks";
import {
  ArrowUpCircle,
  CheckCircle,
  XCircle,
  Loader,
  Search,
  CreditCard,
  Calendar,
  Copy,
  Check,
} from "lucide-react";
import { formatNumber } from "@/helpers/formatNumber";
import { useState, useMemo } from "react";
import { ButtonWithLoader } from "@/components/ui";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function WithdrawalRequests() {
  const {
    useWithdrawalsQuery,
    approveWithdrawal,
    rejectWithdrawal,
    isApprovingWithdrawal,
    isRejectingWithdrawal,
  } = useAdmin();
  const { data: withdrawals, isLoading, error } = useWithdrawalsQuery("pending");
  const [search, setSearch] = useState("");
  const [copiedAccountId, setCopiedAccountId] = useState<string | null>(null);

  const filteredWithdrawals = useMemo(() => {
    if (!withdrawals) return [];
    if (!search.trim()) return withdrawals;

    const searchLower = search.toLowerCase();
    return withdrawals.filter((withdrawal) => {
      const user = withdrawal.user as { username?: string; email?: string; id?: string } | string | undefined;
      const userObj = typeof user === "object" && user !== null ? user : null;
      return (
        userObj?.username?.toLowerCase().includes(searchLower) ||
        userObj?.email?.toLowerCase().includes(searchLower) ||
        withdrawal.description.toLowerCase().includes(searchLower) ||
        withdrawal.reference?.toLowerCase().includes(searchLower)
      );
    });
  }, [withdrawals, search]);

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleApprove = async (id: string) => {
    if (!confirm("Are you sure you want to approve this withdrawal?")) {
      return;
    }
    try {
      await approveWithdrawal(id);
    } catch {
      // Error handled by mutation
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Are you sure you want to reject this withdrawal? The amount will be refunded to the user's wallet.")) {
      return;
    }
    try {
      await rejectWithdrawal(id);
    } catch {
      // Error handled by mutation
    }
  };

  const handleCopyAccountNumber = async (accountNumber: string, withdrawalId: string) => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopiedAccountId(withdrawalId);
      toast.success("Account number copied to clipboard");
      setTimeout(() => setCopiedAccountId(null), 2000);
    } catch {
      toast.error("Failed to copy account number");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-space">
          Withdrawal Requests
        </h1>
        <p className="text-sm text-muted mt-1">
          Review and manage pending withdrawal requests from users
        </p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 rounded-full border border-line bg-secondary px-3 py-1.5">
        <Search size={18} className="text-muted" />
        <input
          type="text"
          placeholder="Search by user, email, or reference..."
          className="w-full bg-transparent outline-none h-10 placeholder:text-muted text-main"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Stats Summary */}
      {withdrawals && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-secondary border border-line rounded-lg p-4">
            <p className="text-sm text-muted mb-1">Pending Requests</p>
            <p className="text-2xl font-bold font-space">{withdrawals.length.toLocaleString()}</p>
          </div>
          <div className="bg-secondary border border-line rounded-lg p-4">
            <p className="text-sm text-muted mb-1">Total Amount</p>
            <p className="text-2xl font-bold font-space text-orange-500">
              ₦
              {formatNumber(
                withdrawals.reduce((sum, w) => sum + (w.amount || 0), 0)
              )}
            </p>
          </div>
          <div className="bg-secondary border border-line rounded-lg p-4">
            <p className="text-sm text-muted mb-1">Average Amount</p>
            <p className="text-2xl font-bold font-space">
              ₦
              {withdrawals.length > 0
                ? formatNumber(
                    withdrawals.reduce((sum, w) => sum + (w.amount || 0), 0) /
                      withdrawals.length
                  )
                : "0.00"}
            </p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-secondary border border-line rounded-lg p-12 text-center">
          <Loader className="animate-spin text-primary mx-auto mb-3" size={32} />
          <p className="text-sm text-muted">Loading withdrawal requests...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="bg-secondary border border-line rounded-lg p-12 text-center">
          <XCircle className="text-red-500 mx-auto mb-3" size={32} />
          <p className="text-sm font-medium text-main mb-1">
            Failed to load withdrawal requests
          </p>
          <p className="text-xs text-muted">Please try refreshing the page</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredWithdrawals && filteredWithdrawals.length === 0 && (
        <div className="bg-secondary border border-line rounded-lg p-12 text-center">
          <ArrowUpCircle className="text-muted mx-auto mb-3" size={32} />
          <p className="text-sm font-medium text-main mb-1">No withdrawal requests</p>
          <p className="text-xs text-muted">
            {search
              ? "Try adjusting your search criteria"
              : "All withdrawal requests have been processed"}
          </p>
        </div>
      )}

      {/* Withdrawals List */}
      {!isLoading && !error && filteredWithdrawals && filteredWithdrawals.length > 0 && (
        <div className="space-y-3">
          {filteredWithdrawals.map((withdrawal) => (
            <div
              key={withdrawal.id}
              className="bg-secondary border border-line rounded-lg p-6"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1">
                  {/* User Info */}
                  <div className="flex items-center gap-3 mb-4">
                    {(() => {
                      const user = withdrawal.user as { username?: string; email?: string; id?: string } | string | undefined;
                      const userObj = typeof user === "object" && user !== null ? user : null;
                      const userId = typeof user === "string" ? user : userObj?.id;
                      return (
                        <>
                          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold font-space">
                            {userObj?.username?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold">
                                {userObj?.username || "Unknown User"}
                              </p>
                              {userId && (
                                <Link
                                  to={`/users/${userId}`}
                                  className="text-xs text-primary hover:underline"
                                >
                                  View Profile
                                </Link>
                              )}
                            </div>
                            <p className="text-xs text-muted">{userObj?.email || "N/A"}</p>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  {/* Transaction Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <CreditCard size={16} className="text-muted" />
                      <div>
                        <p className="text-xs text-muted">Amount</p>
                        <p className="text-lg font-bold font-space text-red-500">
                          ₦{formatNumber(withdrawal.amount)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar size={16} className="text-muted" />
                      <div>
                        <p className="text-xs text-muted">Requested</p>
                        <p className="text-sm font-semibold">
                          {formatDate(withdrawal.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-muted mb-2">{withdrawal.description}</p>

                  {/* Bank Account Info */}
                  {withdrawal.bankAccount && (
                    <div className="bg-foreground/60 rounded-lg p-3 mt-3">
                      <p className="text-xs font-semibold text-muted mb-1">Bank Details</p>
                      <p className="text-xs text-main">{withdrawal.bankAccount.bankName}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-main">
                          {withdrawal.bankAccount.accountNumber.replace(/(\d{4})(?=\d)/g, "$1 ")}
                        </p>
                        <button
                          onClick={() =>
                            handleCopyAccountNumber(
                              withdrawal.bankAccount!.accountNumber,
                              withdrawal.id
                            )
                          }
                          className="text-primary hover:text-primary/80 transition-colors"
                          title="Copy account number"
                        >
                          {copiedAccountId === withdrawal.id ? (
                            <Check size={14} className="text-green-500" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-main">{withdrawal.bankAccount.accountName}</p>
                    </div>
                  )}

                  {/* Reference */}
                  {withdrawal.reference && (
                    <p className="text-[10px] text-muted font-mono mt-2">
                      Ref: {withdrawal.reference}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 min-w-[120px]">
                  <ButtonWithLoader
                    initialText="Approve"
                    loadingText="Approving..."
                    loading={isApprovingWithdrawal}
                    onClick={() => handleApprove(withdrawal.id)}
                    className="w-full bg-green-600 text-white h-10 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={16} />
                  </ButtonWithLoader>
                  <ButtonWithLoader
                    initialText="Reject"
                    loadingText="Rejecting..."
                    loading={isRejectingWithdrawal}
                    onClick={() => handleReject(withdrawal.id)}
                    className="w-full bg-red-600 text-white h-10 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle size={16} />
                  </ButtonWithLoader>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
