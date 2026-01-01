import { useAdmin } from "@/hooks";
import {
  ArrowLeft,
  Mail,
  Phone,
  Wallet,
  CheckCircle,
  XCircle,
  Calendar,
  Ticket,
  CreditCard,
  Loader,
  User,
  Edit,
  Copy,
  Check,
  Shield,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { formatNumber } from "@/helpers/formatNumber";
import { useState } from "react";
import Modal from "@/components/ui/modal";
import { ButtonWithLoader } from "@/components/ui";
import { toast } from "sonner";

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const {
    useUserQuery,
    updateUserWallet,
    isUpdatingWallet,
    toggleUserAdminStatus,
    isTogglingAdminStatus,
  } = useAdmin();
  const { data, isLoading, error } = useUserQuery(id || "");
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [walletAmount, setWalletAmount] = useState("");
  const [walletType, setWalletType] = useState<"add" | "subtract" | "set">("add");
  const [walletDescription, setWalletDescription] = useState("");
  const [copiedAccountId, setCopiedAccountId] = useState<string | null>(null);

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

  const getStatusBadge = (status: BetStatus) => {
    const baseClasses = "text-[10px] px-2 py-0.5 rounded-full font-semibold";
    switch (status) {
      case "pending":
        return (
          <span className={`${baseClasses} bg-yellow-500/20 text-yellow-600`}>Pending</span>
        );
      case "won":
        return (
          <span className={`${baseClasses} bg-green-500/20 text-green-600`}>Won</span>
        );
      case "lost":
        return (
          <span className={`${baseClasses} bg-red-500/20 text-red-600`}>Lost</span>
        );
      case "cancelled":
        return (
          <span className={`${baseClasses} bg-gray-500/20 text-gray-600`}>Cancelled</span>
        );
    }
  };

  const handleCopyAccountNumber = async (accountNumber: string, accountId: string) => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopiedAccountId(accountId);
      toast.success("Account number copied to clipboard");
      setTimeout(() => setCopiedAccountId(null), 2000);
    } catch (error) {
      console.error(error);
      toast.error("Failed to copy account number");
    }
  };

  const handleUpdateWallet = async () => {
    if (!walletAmount || parseFloat(walletAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!id) {
      toast.error("User ID not found");
      return;
    }

    try {
      await updateUserWallet({
        userId: id,
        amount: parseFloat(walletAmount),
        type: walletType,
        description: walletDescription || undefined,
      });
      setIsWalletModalOpen(false);
      setWalletAmount("");
      setWalletDescription("");
      setWalletType("add");
    } catch (error) {
      console.error(error);
      // Error is handled by the mutation
    }
  };

  const handleToggleAdminStatus = async () => {
    if (!id) {
      toast.error("User ID not found");
      return;
    }

    const newAdminStatus = !user.isAdmin;
    const confirmMessage = newAdminStatus
      ? `Are you sure you want to make ${user.username} an admin?`
      : `Are you sure you want to remove admin privileges from ${user.username}?`;

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      await toggleUserAdminStatus({
        userId: id,
        isAdmin: newAdminStatus,
      });
    } catch (error) {
      console.error(error);
      // Error is handled by the mutation
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin text-primary" size={32} />
        <span className="ml-3 text-muted">Loading user details...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-4">
        <Link
          to="/users"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-main"
        >
          <ArrowLeft size={16} />
          Back to Users
        </Link>
        <div className="bg-secondary border border-line rounded-lg p-12 text-center">
          <XCircle className="text-red-500 mx-auto mb-3" size={32} />
          <p className="text-sm font-medium text-main mb-1">Failed to load user</p>
          <p className="text-xs text-muted">User not found or an error occurred</p>
        </div>
      </div>
    );
  }

  const { user, bets, transactions } = data;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        to="/users"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-main"
      >
        <ArrowLeft size={16} />
        Back to Users
      </Link>

      {/* User Info Card */}
      <div className="bg-secondary border border-line rounded-lg p-6">
        <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold font-space">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold font-space">{user.username}</h1>
              <div className="flex items-center gap-2 mt-1">
                {user.isVerified ? (
                  <div className="flex items-center gap-1">
                    <CheckCircle size={14} className="text-green-500" />
                    <span className="text-xs text-green-600 font-semibold">Verified</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <XCircle size={14} className="text-yellow-500" />
                    <span className="text-xs text-yellow-600 font-semibold">Unverified</span>
                  </div>
                )}
                {user.isAdmin && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-600 font-semibold">
                    Admin
                  </span>
                )}
              </div>
            </div>
          </div>
          <div>
            <ButtonWithLoader
              initialText={user.isAdmin ? "Remove Admin" : "Make Admin"}
              loadingText={user.isAdmin ? "Removing..." : "Adding..."}
              loading={isTogglingAdminStatus}
              onClick={handleToggleAdminStatus}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                user.isAdmin
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-primary text-white hover:bg-primary/90"
              }`}
            >
              <Shield size={16} />
            </ButtonWithLoader>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-muted" />
              <div>
                <p className="text-xs text-muted">Email</p>
                <p className="text-sm font-semibold">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={18} className="text-muted" />
              <div>
                <p className="text-xs text-muted">Phone</p>
                <p className="text-sm font-semibold">{user.phone}</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <Wallet size={18} className="text-green-500" />
                <div>
                  <p className="text-xs text-muted">Wallet Balance</p>
                  <p className="text-sm font-semibold font-space">
                    ₦{formatNumber(user.wallet || 0)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsWalletModalOpen(true)}
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <Edit size={14} />
                Update
              </button>
            </div>
            <div className="flex items-center gap-3">
              <Calendar size={18} className="text-muted" />
              <div>
                <p className="text-xs text-muted">Joined</p>
                <p className="text-sm font-semibold">{formatDate(user.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bank Accounts */}
        {user.bankAccounts && user.bankAccounts.length > 0 && (
          <div className="mt-6 pt-6 border-t border-line">
            <h3 className="text-sm font-semibold mb-3">Bank Accounts</h3>
            <div className="space-y-2">
              {user.bankAccounts.map((account) => (
                <div
                  key={account.id}
                  className="bg-foreground/60 rounded-lg p-3 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{account.bankName}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted">
                        {account.accountNumber.replace(/(\d{4})(?=\d)/g, "$1 ")}
                      </p>
                      <button
                        onClick={() => handleCopyAccountNumber(account.accountNumber, account.id)}
                        className="text-primary hover:text-primary/80 transition-colors"
                        title="Copy account number"
                      >
                        {copiedAccountId === account.id ? (
                          <Check size={14} className="text-green-500" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-muted">{account.accountName}</p>
                  </div>
                  {account.isDefault && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-semibold">
                      Default
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-secondary border border-line rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Ticket size={20} className="text-primary" />
            <p className="text-sm text-muted">Total Bets</p>
          </div>
          <p className="text-2xl font-bold font-space">{bets?.length || 0}</p>
        </div>
        <div className="bg-secondary border border-line rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard size={20} className="text-primary" />
            <p className="text-sm text-muted">Total Transactions</p>
          </div>
          <p className="text-2xl font-bold font-space">{transactions?.length || 0}</p>
        </div>
        <div className="bg-secondary border border-line rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <User size={20} className="text-primary" />
            <p className="text-sm text-muted">Pending Bets</p>
          </div>
          <p className="text-2xl font-bold font-space">
            {bets?.filter((b) => b.status === "pending").length || 0}
          </p>
        </div>
      </div>

      {/* Recent Bets */}
      <div className="bg-secondary border border-line rounded-lg p-6">
        <h2 className="text-lg font-semibold font-space mb-4 flex items-center gap-2">
          <Ticket size={20} className="text-primary" />
          Recent Bets
        </h2>
        {!bets || bets.length === 0 ? (
          <div className="text-center py-8">
            <Ticket className="text-muted mx-auto mb-2" size={32} />
            <p className="text-sm text-muted">No bets found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {bets.map((bet) => (
              <div
                key={bet.id}
                className="bg-foreground/60 rounded-lg border border-line p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-sm font-semibold">Bet #{bet.betId}</p>
                      {getStatusBadge(bet.status)}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-muted mb-2">
                      <div>
                        <span>Stake: </span>
                        <span className="font-semibold text-main">₦{formatNumber(bet.stake)}</span>
                      </div>
                      <div>
                        <span>Odds: </span>
                        <span className="font-semibold text-main">{bet.totalOdds.toFixed(2)}</span>
                      </div>
                      <div>
                        <span>Potential Win: </span>
                        <span className="font-semibold text-green-500">
                          ₦{formatNumber(bet.potentialWin)}
                        </span>
                      </div>
                      <div>
                        <span>Selections: </span>
                        <span className="font-semibold text-main">{bet.selections.length}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-muted">{formatDate(bet.placedAt)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="bg-secondary border border-line rounded-lg p-6">
        <h2 className="text-lg font-semibold font-space mb-4 flex items-center gap-2">
          <CreditCard size={20} className="text-primary" />
          Recent Transactions
        </h2>
        {!transactions || transactions.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard className="text-muted mx-auto mb-2" size={32} />
            <p className="text-sm text-muted">No transactions found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-foreground/60 rounded-lg border border-line p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold capitalize">
                        {transaction.type.replace("_", " ")}
                      </p>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          transaction.status === "completed"
                            ? "bg-green-500/20 text-green-600"
                            : transaction.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-600"
                            : transaction.status === "failed"
                            ? "bg-red-500/20 text-red-600"
                            : "bg-gray-500/20 text-gray-600"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted mb-1">{transaction.description}</p>
                    <p className="text-[10px] text-muted">{formatDate(transaction.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-base font-bold font-space ${
                        transaction.type === "deposit" || transaction.type === "bet_win"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {transaction.type === "deposit" || transaction.type === "bet_win" ? "+" : "-"}
                      ₦{formatNumber(transaction.amount)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Wallet Update Modal */}
      <Modal
        isOpen={isWalletModalOpen}
        onClose={() => {
          setIsWalletModalOpen(false);
          setWalletAmount("");
          setWalletDescription("");
          setWalletType("add");
        }}
        title="Update Wallet Balance"
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted block mb-2">
              Operation Type
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setWalletType("add")}
                className={`flex-1 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                  walletType === "add"
                    ? "bg-green-500/20 text-green-600 border-green-500"
                    : "bg-secondary border-line text-muted hover:border-primary/40"
                }`}
              >
                Add
              </button>
              <button
                onClick={() => setWalletType("subtract")}
                className={`flex-1 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                  walletType === "subtract"
                    ? "bg-red-500/20 text-red-600 border-red-500"
                    : "bg-secondary border-line text-muted hover:border-primary/40"
                }`}
              >
                Subtract
              </button>
              <button
                onClick={() => setWalletType("set")}
                className={`flex-1 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                  walletType === "set"
                    ? "bg-blue-500/20 text-blue-600 border-blue-500"
                    : "bg-secondary border-line text-muted hover:border-primary/40"
                }`}
              >
                Set
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted block mb-2">
              Amount (₦)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={walletAmount}
              onChange={(e) => setWalletAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-4 py-2 bg-secondary border border-line rounded-lg text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted block mb-2">
              Description (Optional)
            </label>
            <textarea
              value={walletDescription}
              onChange={(e) => setWalletDescription(e.target.value)}
              placeholder="Add a note about this transaction"
              rows={3}
              className="w-full px-4 py-2 bg-secondary border border-line rounded-lg text-sm focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => {
                setIsWalletModalOpen(false);
                setWalletAmount("");
                setWalletDescription("");
                setWalletType("add");
              }}
              className="flex-1 px-4 py-2 bg-secondary border border-line rounded-lg text-sm font-medium hover:bg-foreground transition-colors"
            >
              Cancel
            </button>
            <ButtonWithLoader
              initialText="Update Wallet"
              loadingText="Updating..."
              loading={isUpdatingWallet}
              onClick={handleUpdateWallet}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
