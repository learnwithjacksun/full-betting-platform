import { useState } from "react";
import {
  UserRound,
  Mail,
  Phone,
  Calendar,
  Trophy,
  TrendingUp,
  TrendingDown,
  Wallet,
  Edit2,
  LogOut,
  Save,
  X,
  Clock,
  Ticket,
} from "lucide-react";
import { ButtonWithLoader } from "@/components/ui";
import { useAuth } from "@/hooks";
import useBets from "@/hooks/useBets";

export default function Profile() {
 const {bets } = useBets();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, updateUser, logout, loading: authLoading } = useAuth();

  // User data (in a real app, this would come from a store or API)
  const [userData, setUserData] = useState({
    name: user?.username || "",
    email: user?.email || "",
    phone: user?.phone || "",
    joinDate: user?.createdAt || "",
    avatar: user?.username.charAt(0) || "",
  });

  // Calculate statistics
  const stats = {
    totalBets: bets.length,
    wonBets: bets.filter((bet) => bet.status === "won").length,
    lostBets: bets.filter((bet) => bet.status === "lost").length,
    pendingBets: bets.filter((bet) => bet.status === "pending").length,
    totalWinnings: bets
      .filter((bet) => bet.status === "won")
      .reduce((sum, bet) => sum + bet.potentialWin, 0),
    totalStaked: bets.reduce((sum, bet) => sum + bet.stake, 0),
  };

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    await updateUser({
      username: userData.name,
      email: userData.email,
      phone: userData.phone,
    });
    setLoading(false);
    setIsEditing(false);
  };

  const handleLogout = () => {
    // Handle logout logic here
    logout();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold font-space mb-2">Profile</h1>
        <p className="text-sm text-muted">Manage your account information and preferences</p>
      </div>

      {/* Profile Card */}
      <div className="bg-secondary rounded-xl border border-line p-6 space-y-6">
        {/* Avatar and Name Section */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 min-w-20 min-h-20 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-semibold font-space">
              {userData.avatar}
            </div>
            <div>
              <h2 className="text-lg font-semibold font-space">{userData.name}</h2>
              <p className="text-sm text-muted">Member since {new Date(userData.joinDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
            </div>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-line bg-foreground/60 hover:bg-foreground transition-colors text-sm font-medium"
            >
              <Edit2 size={16} />
              Edit Profile
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 rounded-full border border-line bg-foreground/60 hover:bg-foreground transition-colors"
              >
                <X size={16} />
              </button>
              <ButtonWithLoader
                initialText="Save"
                loadingText="Saving..."
                loading={loading}
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 rounded-full btn-primary text-sm font-medium"
              >
                <Save size={16} />
              </ButtonWithLoader>
            </div>
          )}
        </div>

        {/* User Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-line">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted mb-1">
              <Mail size={16} />
              <span>Email Address</span>
            </div>
            {isEditing ? (
              <input
                type="email"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-line bg-foreground text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            ) : (
              <p className="text-sm font-medium">{userData.email}</p>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted mb-1">
              <Phone size={16} />
              <span>Phone Number</span>
            </div>
            {isEditing ? (
              <input
                type="tel"
                value={userData.phone}
                onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-line bg-foreground text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            ) : (
              <p className="text-sm font-medium">{userData.phone}</p>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted mb-1">
              <UserRound size={16} />
              <span>Full Name</span>
            </div>
            {isEditing ? (
              <input
                type="text"
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-line bg-foreground text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            ) : (
              <p className="text-sm font-medium">{userData.name}</p>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted mb-1">
              <Calendar size={16} />
              <span>Member Since</span>
            </div>
            <p className="text-sm font-medium">
              {new Date(userData.joinDate).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div>
        <h3 className="text-lg font-semibold font-space mb-4">Betting Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-secondary rounded-xl border border-line p-4">
            <div className="flex items-center gap-2 text-sm text-muted mb-2">
              <Ticket size={16} />
              <span>Total Bets</span>
            </div>
            <p className="text-2xl font-bold font-space">{stats.totalBets}</p>
          </div>

          <div className="bg-secondary rounded-xl border border-line p-4">
            <div className="flex items-center gap-2 text-sm text-muted mb-2">
              <TrendingUp size={16} className="text-green-500" />
              <span>Won</span>
            </div>
            <p className="text-2xl font-bold font-space text-green-500">{stats.wonBets}</p>
          </div>

          <div className="bg-secondary rounded-xl border border-line p-4">
            <div className="flex items-center gap-2 text-sm text-muted mb-2">
              <TrendingDown size={16} className="text-red-500" />
              <span>Lost</span>
            </div>
            <p className="text-2xl font-bold font-space text-red-500">{stats.lostBets}</p>
          </div>

          <div className="bg-secondary rounded-xl border border-line p-4">
            <div className="flex items-center gap-2 text-sm text-muted mb-2">
              <Clock size={16} className="text-yellow-500" />
              <span>Pending</span>
            </div>
            <p className="text-2xl font-bold font-space text-yellow-500">{stats.pendingBets}</p>
          </div>

          <div className="bg-secondary rounded-xl border border-line p-4">
            <div className="flex items-center gap-2 text-sm text-muted mb-2">
              <Trophy size={16} className="text-primary" />
              <span>Total Winnings</span>
            </div>
            <p className="text-2xl font-bold font-space text-primary">
              ₦{stats.totalWinnings.toFixed(2)}
            </p>
          </div>

          <div className="bg-secondary rounded-xl border border-line p-4">
            <div className="flex items-center gap-2 text-sm text-muted mb-2">
              <Wallet size={16} />
              <span>Total Staked</span>
            </div>
            <p className="text-2xl font-bold font-space">₦{stats.totalStaked.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-secondary rounded-xl border border-line p-6">
        <h3 className="text-lg font-semibold font-space mb-4">Account Actions</h3>
        <div className="space-y-3">
          <ButtonWithLoader
            initialText="Logout"
            loadingText="Logging out..."
            loading={authLoading}
            onClick={handleLogout}
            className="w-full bg-red-600 text-white h-12 rounded-full font-semibold flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </ButtonWithLoader>
        </div>
      </div>
    </div>
  );
}

