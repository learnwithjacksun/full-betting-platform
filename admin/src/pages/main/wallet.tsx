import { useSearchParams } from "react-router-dom";
import { Wallet, ArrowDownCircle, ArrowUpCircle, History as HistoryIcon } from "lucide-react";

import { useAuth } from "@/hooks";
import { formatNumber } from "@/helpers/formatNumber";
import { Deposit, Withdraw, History } from "@/components/wallet";

type TabType = "deposit" | "withdraw" | "history";

export default function WalletPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get("tab") || "deposit") as TabType;

  const handleTabChange = (tab: TabType) => {
    setSearchParams({ tab });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold font-space mb-2">Wallet</h1>
        <p className="text-sm text-muted">
          Manage your deposits and withdrawals
        </p>
      </div>

      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-r from-red-800 via-red-900 to-red-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Wallet size={24} />
          <span className="text-sm opacity-90">Available Balance</span>
        </div>
        <p className="text-3xl font-bold font-space">
          ₦{formatNumber(user?.wallet || 0)}
        </p>
        <p className="text-xs opacity-75 mt-1">
          Last updated:{" "}
          {new Date(user?.updatedAt || new Date()).toLocaleString()}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-line">
        <button
          onClick={() => handleTabChange("deposit")}
          className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${
            activeTab === "deposit"
              ? "border-primary text-primary"
              : "border-transparent text-muted hover:text-main"
          }`}
        >
          <div className="flex items-center gap-2">
            <ArrowDownCircle size={18} />
            <span>Deposit</span>
          </div>
        </button>
        <button
          onClick={() => handleTabChange("withdraw")}
          className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${
            activeTab === "withdraw"
              ? "border-primary text-primary"
              : "border-transparent text-muted hover:text-main"
          }`}
        >
          <div className="flex items-center gap-2">
            <ArrowUpCircle size={18} />
            <span>Withdraw</span>
          </div>
        </button>
        <button
          onClick={() => handleTabChange("history")}
          className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${
            activeTab === "history"
              ? "border-primary text-primary"
              : "border-transparent text-muted hover:text-main"
          }`}
        >
          <div className="flex items-center gap-2">
            <HistoryIcon size={18} />
            <span>History</span>
          </div>
        </button>
      </div>

      {/* Deposit Tab */}
      {activeTab === "deposit" && <Deposit />}

      {/* Withdraw Tab */}
      {activeTab === "withdraw" && <Withdraw />}

      {/* History Tab */}
      {activeTab === "history" && <History />}
    </div>
  );
}
