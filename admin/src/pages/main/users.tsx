import { useAdmin } from "@/hooks";
import { Users, Search, Loader, Mail, Phone, Wallet, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { formatNumber } from "@/helpers/formatNumber";
import { useState, useMemo } from "react";

export default function UsersPage() {
  const { useUsersQuery } = useAdmin();
  const { data: users, isLoading, error } = useUsersQuery();
  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    if (!search.trim()) return users;

    const searchLower = search.toLowerCase();
    return users.filter(
      (user) =>
        user.username.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.phone.toLowerCase().includes(searchLower)
    );
  }, [users, search]);

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-space">
          Users Management
        </h1>
        <p className="text-sm text-muted mt-1">
          View and manage all registered users on the platform
        </p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 rounded-full border border-line bg-secondary px-3 py-1.5">
        <Search size={18} className="text-muted" />
        <input
          type="text"
          placeholder="Search users by name, email, or phone..."
          className="w-full bg-transparent outline-none h-10 placeholder:text-muted text-main"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Stats Summary */}
      {users && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-secondary border border-line rounded-lg p-4">
            <p className="text-sm text-muted mb-1">Total Users</p>
            <p className="text-2xl font-bold font-space">{users.length.toLocaleString()}</p>
          </div>
          <div className="bg-secondary border border-line rounded-lg p-4">
            <p className="text-sm text-muted mb-1">Verified Users</p>
            <p className="text-2xl font-bold font-space text-green-500">
              {users.filter((u) => u.isVerified).length.toLocaleString()}
            </p>
          </div>
          <div className="bg-secondary border border-line rounded-lg p-4">
            <p className="text-sm text-muted mb-1">Total Wallet Balance</p>
            <p className="text-2xl font-bold font-space">
              ₦{formatNumber(users.reduce((sum, u) => sum + (u.wallet || 0), 0))}
            </p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-secondary border border-line rounded-lg p-12 text-center">
          <Loader className="animate-spin text-primary mx-auto mb-3" size={32} />
          <p className="text-sm text-muted">Loading users...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="bg-secondary border border-line rounded-lg p-12 text-center">
          <XCircle className="text-red-500 mx-auto mb-3" size={32} />
          <p className="text-sm font-medium text-main mb-1">Failed to load users</p>
          <p className="text-xs text-muted">Please try refreshing the page</p>
        </div>
      )}

      {/* Users List */}
      {!isLoading && !error && filteredUsers && filteredUsers.length === 0 && (
        <div className="bg-secondary border border-line rounded-lg p-12 text-center">
          <Users className="text-muted mx-auto mb-3" size={32} />
          <p className="text-sm font-medium text-main mb-1">No users found</p>
          <p className="text-xs text-muted">
            {search ? "Try adjusting your search criteria" : "No users registered yet"}
          </p>
        </div>
      )}

      {!isLoading && !error && filteredUsers && filteredUsers.length > 0 && (
        <div className="bg-secondary border border-line rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-foreground/60 border-b border-line">
                <tr>
                  <th className="text-left p-4 text-xs font-semibold text-muted uppercase">
                    User
                  </th>
                  <th className="text-left p-4 text-xs font-semibold text-muted uppercase">
                    Contact
                  </th>
                  <th className="text-left p-4 text-xs font-semibold text-muted uppercase">
                    Wallet
                  </th>
                  <th className="text-left p-4 text-xs font-semibold text-muted uppercase">
                    Status
                  </th>
                  <th className="text-left p-4 text-xs font-semibold text-muted uppercase">
                    Joined
                  </th>
                  <th className="text-right p-4 text-xs font-semibold text-muted uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-line hover:bg-foreground/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold font-space">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{user.username}</p>
                          {user.isAdmin && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-600 font-semibold">
                              Admin
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-muted">
                          <Mail size={12} />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted">
                          <Phone size={12} />
                          <span>{user.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Wallet size={16} className="text-green-500" />
                        <span className="text-sm font-semibold font-space">
                          ₦{formatNumber(user.wallet || 0)}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      {user.isVerified ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-green-500" />
                          <span className="text-xs text-green-600 font-semibold">Verified</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <XCircle size={16} className="text-yellow-500" />
                          <span className="text-xs text-yellow-600 font-semibold">Unverified</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-muted">{formatDate(user.createdAt)}</span>
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        to={`/users/${user.id}`}
                        className="text-xs text-nowrap font-semibold text-primary hover:underline"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
