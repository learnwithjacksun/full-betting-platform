import { useAdmin } from "@/hooks";
import {
  Users,
  Ticket,
  CreditCard,
  ArrowUpCircle,
  Calendar,
  DollarSign,
  Clock,
} from "lucide-react";

export default function Home() {
  const { useStatsQuery } = useAdmin();
  const { data: stats, isLoading, error } = useStatsQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted">Loading stats...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Failed to load stats</div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.users.total.toLocaleString(),
      change: `+${stats.users.recent} this week`,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Total Bets",
      value: stats.bets.total.toLocaleString(),
      change: `+${stats.bets.recent} this week`,
      icon: Ticket,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Pending Bets",
      value: stats.bets.pending.toLocaleString(),
      change: `${stats.bets.won} won, ${stats.bets.lost} lost`,
      icon: Clock,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Total Matches",
      value: stats.matches.total.toLocaleString(),
      change: `${stats.matches.live} live, ${stats.matches.upcoming} upcoming`,
      icon: Calendar,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Total Deposits",
      value: `₦${stats.transactions.deposits.totalAmount.toLocaleString()}`,
      change: `${stats.transactions.deposits.count} transactions`,
      icon: DollarSign,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Pending Withdrawals",
      value: `₦${stats.transactions.withdrawals.pending.totalAmount.toLocaleString()}`,
      change: `${stats.transactions.withdrawals.pending.count} requests`,
      icon: ArrowUpCircle,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-space">
          Dashboard Overview
        </h1>
        <p className="text-sm text-muted mt-1">
          Welcome back! Here's what's happening with your platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-secondary border border-line rounded-lg p-6 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted mb-1">{card.title}</p>
                  <p className="text-2xl font-bold font-space mb-2">{card.value}</p>
                  <p className="text-xs text-muted">{card.change}</p>
                </div>
                <div className={`${card.bgColor} p-3 rounded-lg`}>
                  <Icon size={24} className={card.color} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bets Breakdown */}
        <div className="bg-secondary border border-line rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Ticket size={20} className="text-primary" />
            <h2 className="text-lg font-semibold font-space">Bets Breakdown</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Won</span>
              <span className="text-sm font-semibold text-green-500">
                {stats.bets.won.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Lost</span>
              <span className="text-sm font-semibold text-red-500">
                {stats.bets.lost.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Cancelled</span>
              <span className="text-sm font-semibold text-yellow-500">
                {stats.bets.cancelled.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Transactions Summary */}
        <div className="bg-secondary border border-line rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard size={20} className="text-primary" />
            <h2 className="text-lg font-semibold font-space">Transactions Summary</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Total Transactions</span>
              <span className="text-sm font-semibold">
                {stats.transactions.total.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Total Withdrawals</span>
              <span className="text-sm font-semibold">
                ₦{stats.transactions.withdrawals.totalAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Withdrawal Count</span>
              <span className="text-sm font-semibold">
                {stats.transactions.withdrawals.count.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Matches Status */}
      <div className="bg-secondary border border-line rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={20} className="text-primary" />
          <h2 className="text-lg font-semibold font-space">Matches Status</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-foreground/60 rounded-lg">
            <p className="text-2xl font-bold text-blue-500 mb-1">
              {stats.matches.upcoming.toLocaleString()}
            </p>
            <p className="text-sm text-muted">Upcoming</p>
          </div>
          <div className="text-center p-4 bg-foreground/60 rounded-lg">
            <p className="text-2xl font-bold text-red-500 mb-1">
              {stats.matches.live.toLocaleString()}
            </p>
            <p className="text-sm text-muted">Live</p>
          </div>
          <div className="text-center p-4 bg-foreground/60 rounded-lg">
            <p className="text-2xl font-bold text-green-500 mb-1">
              {stats.matches.finished.toLocaleString()}
            </p>
            <p className="text-sm text-muted">Finished</p>
          </div>
        </div>
      </div>
    </div>
  );
}
