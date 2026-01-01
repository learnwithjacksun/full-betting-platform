import { useAdmin } from "@/hooks";
import {
  Calendar,
  Plus,
  Loader,
  Search,
  Edit,
  Trash2,
  XCircle,
} from "lucide-react";
import { useState, useMemo } from "react";
import Modal from "@/components/ui/modal";
import { ButtonWithLoader } from "@/components/ui";
import { toast } from "sonner";
import { leagues } from "@/constants/data";

export default function Matches() {
  const {
    useMatchesQuery,
    createMatch,
    updateMatch,
    deleteMatch,
    isCreatingMatch,
    isUpdatingMatch,
  } = useAdmin();
  const { data: matches, isLoading, error } = useMatchesQuery();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "upcoming" | "live" | "finished">("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<IMatch | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    league: {
      name: "",
      icon: "",
      country: "",
    },
    date: "",
    time: "",
    status: "upcoming" as "upcoming" | "live" | "finished",
    homeTeam: {
      name: "",
      shortName: "",
      logo: "",
    },
    awayTeam: {
      name: "",
      shortName: "",
      logo: "",
    },
    score: {
      home: "",
      away: "",
    },
    odds: {
      straightWin: {
        home: "",
        draw: "",
        away: "",
      },
      doubleChance: {
        "1X": "",
        "12": "",
        "X2": "",
      },
    },
  });

  const filteredMatches = useMemo(() => {
    if (!matches) return [];
    let filtered = matches;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((match) => match.status === statusFilter);
    }

    // Filter by search
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (match) =>
          match.homeTeam.name.toLowerCase().includes(searchLower) ||
          match.awayTeam.name.toLowerCase().includes(searchLower) ||
          match.league.name.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [matches, statusFilter, search]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "text-[10px] px-2 py-0.5 rounded-full font-semibold";
    switch (status) {
      case "upcoming":
        return (
          <span className={`${baseClasses} bg-blue-500/20 text-blue-600`}>Upcoming</span>
        );
      case "live":
        return (
          <span className={`${baseClasses} bg-red-500/20 text-red-600`}>Live</span>
        );
      case "finished":
        return (
          <span className={`${baseClasses} bg-green-500/20 text-green-600`}>Finished</span>
        );
      default:
        return null;
    }
  };

  const resetForm = () => {
    setFormData({
      league: {
        name: "",
        icon: "",
        country: "",
      },
      date: "",
      time: "",
      status: "upcoming",
      homeTeam: {
        name: "",
        shortName: "",
        logo: "",
      },
      awayTeam: {
        name: "",
        shortName: "",
        logo: "",
      },
      score: {
        home: "",
        away: "",
      },
      odds: {
        straightWin: {
          home: "",
          draw: "",
          away: "",
        },
        doubleChance: {
          "1X": "",
          "12": "",
          "X2": "",
        },
      },
    });
    setEditingMatch(null);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (match: IMatch) => {
    setEditingMatch(match);
    setFormData({
      league: match.league,
      date: match.date,
      time: match.time,
      status: match.status as "upcoming" | "live" | "finished",
      homeTeam: {
        name: match.homeTeam.name,
        shortName: match.homeTeam.shortName,
        logo: match.homeTeam.logo || "",
      },
      awayTeam: {
        name: match.awayTeam.name,
        shortName: match.awayTeam.shortName,
        logo: match.awayTeam.logo || "",
      },
      score: match.score
        ? {
            home: match.score.home?.toString() || "",
            away: match.score.away?.toString() || "",
          }
        : { home: "", away: "" },
      odds: {
        straightWin: {
          home: match.odds.straightWin.home.toString(),
          draw: match.odds.straightWin.draw.toString(),
          away: match.odds.straightWin.away.toString(),
        },
        doubleChance: {
          "1X": match.odds.doubleChance["1X"].toString(),
          "12": match.odds.doubleChance["12"].toString(),
          "X2": match.odds.doubleChance["X2"].toString(),
        },
      },
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.league.name || !formData.league.icon || !formData.league.country) {
      toast.error("Please fill in all league information");
      return;
    }

    if (!formData.date || !formData.time) {
      toast.error("Please provide date and time");
      return;
    }

    if (!formData.homeTeam.name || !formData.homeTeam.shortName) {
      toast.error("Please fill in home team information");
      return;
    }

    if (!formData.awayTeam.name || !formData.awayTeam.shortName) {
      toast.error("Please fill in away team information");
      return;
    }

    if (
      !formData.odds.straightWin.home ||
      !formData.odds.straightWin.draw ||
      !formData.odds.straightWin.away ||
      !formData.odds.doubleChance["1X"] ||
      !formData.odds.doubleChance["12"] ||
      !formData.odds.doubleChance["X2"]
    ) {
      toast.error("Please fill in all odds");
      return;
    }

    try {
      const matchPayload = {
        league: formData.league,
        date: formData.date,
        time: formData.time,
        status: formData.status,
        homeTeam: formData.homeTeam,
        awayTeam: formData.awayTeam,
        score:
          formData.score.home && formData.score.away
            ? {
                home: parseFloat(formData.score.home),
                away: parseFloat(formData.score.away),
              }
            : undefined,
        odds: {
          straightWin: {
            home: parseFloat(formData.odds.straightWin.home),
            draw: parseFloat(formData.odds.straightWin.draw),
            away: parseFloat(formData.odds.straightWin.away),
          },
          doubleChance: {
            "1X": parseFloat(formData.odds.doubleChance["1X"]),
            "12": parseFloat(formData.odds.doubleChance["12"]),
            "X2": parseFloat(formData.odds.doubleChance["X2"]),
          },
        },
      };

      if (editingMatch) {
        await updateMatch({
          id: editingMatch.id,
          ...matchPayload,
        });
      } else {
        await createMatch(matchPayload);
      }

      setIsAddModalOpen(false);
      resetForm();
    } catch (error) {
      console.error(error);
      // Error handled by mutation
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this match?")) {
      return;
    }

    try {
      await deleteMatch(id);
    } catch (error) {
      console.error(error);
      // Error handled by mutation
    }
  };

  const handleLeagueSelect = (leagueName: string) => {
    const selectedLeague = leagues.find((l) => l.name === leagueName);
    if (selectedLeague) {
      setFormData((prev) => ({
        ...prev,
        league: {
          name: selectedLeague.name,
          icon: selectedLeague.icon,
          country: selectedLeague.country,
        },
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-space">
            Matches Management
          </h1>
          <p className="text-sm text-muted mt-1">
            Create and manage football matches for betting
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} />
          Add Match
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 flex-wrap">
        <div className="flex-1 flex items-center gap-2 rounded-full border border-line bg-secondary px-3 py-1.5">
          <Search size={18} className="text-muted" />
          <input
            type="text"
            placeholder="Search matches by teams or league..."
            className="w-full bg-transparent outline-none h-10 placeholder:text-muted text-main"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {(["all", "upcoming", "live", "finished"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-full border text-xs font-medium transition-all ${
                statusFilter === status
                  ? "bg-primary text-white border-primary"
                  : "bg-secondary border-line text-muted hover:border-primary/40"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Summary */}
      {matches && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-secondary border border-line rounded-lg p-4">
            <p className="text-sm text-muted mb-1">Total Matches</p>
            <p className="text-2xl font-bold font-space">{matches.length}</p>
          </div>
          <div className="bg-secondary border border-line rounded-lg p-4">
            <p className="text-sm text-muted mb-1">Upcoming</p>
            <p className="text-2xl font-bold font-space text-blue-500">
              {matches.filter((m) => m.status === "upcoming").length}
            </p>
          </div>
          <div className="bg-secondary border border-line rounded-lg p-4">
            <p className="text-sm text-muted mb-1">Live</p>
            <p className="text-2xl font-bold font-space text-red-500">
              {matches.filter((m) => m.status === "live").length}
            </p>
          </div>
          <div className="bg-secondary border border-line rounded-lg p-4">
            <p className="text-sm text-muted mb-1">Finished</p>
            <p className="text-2xl font-bold font-space text-green-500">
              {matches.filter((m) => m.status === "finished").length}
            </p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-secondary border border-line rounded-lg p-12 text-center">
          <Loader className="animate-spin text-primary mx-auto mb-3" size={32} />
          <p className="text-sm text-muted">Loading matches...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="bg-secondary border border-line rounded-lg p-12 text-center">
          <XCircle className="text-red-500 mx-auto mb-3" size={32} />
          <p className="text-sm font-medium text-main mb-1">Failed to load matches</p>
          <p className="text-xs text-muted">Please try refreshing the page</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredMatches && filteredMatches.length === 0 && (
        <div className="bg-secondary border border-line rounded-lg p-12 text-center">
          <Calendar className="text-muted mx-auto mb-3" size={32} />
          <p className="text-sm font-medium text-main mb-1">No matches found</p>
          <p className="text-xs text-muted">
            {search || statusFilter !== "all"
              ? "Try adjusting your filters"
              : "Create your first match to get started"}
          </p>
        </div>
      )}

      {/* Matches List */}
      {!isLoading && !error && filteredMatches && filteredMatches.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMatches.map((match) => (
            <div
              key={match.id}
              className="bg-secondary border border-line rounded-lg p-6 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                   
                    <p className="text-xs font-semibold text-muted">{match.league.name}</p>
                    {getStatusBadge(match.status)}
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{match.homeTeam.name}</p>
                      <p className="text-xs text-muted">{match.homeTeam.shortName}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted mb-1">{formatDate(match.date)}</p>
                      {match.score ? (
                        <p className="text-lg font-bold font-space">
                          {match.score.home} - {match.score.away}
                        </p>
                      ) : (
                        <p className="text-xs text-muted">{match.time}</p>
                      )}
                    </div>
                    <div className="flex-1 text-right">
                      <p className="text-sm font-semibold">{match.awayTeam.name}</p>
                      <p className="text-xs text-muted">{match.awayTeam.shortName}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-line">
                    <div className="text-center">
                      <p className="text-[10px] text-muted mb-1">1</p>
                      <p className="text-sm font-bold">{match.odds.straightWin.home.toFixed(2)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-muted mb-1">X</p>
                      <p className="text-sm font-bold">{match.odds.straightWin.draw.toFixed(2)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-muted mb-1">2</p>
                      <p className="text-sm font-bold">{match.odds.straightWin.away.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => handleOpenEditModal(match)}
                    className="p-2 rounded-lg border border-line hover:bg-foreground transition-colors"
                    title="Edit match"
                  >
                    <Edit size={16} className="text-primary" />
                  </button>
                  <button
                    onClick={() => handleDelete(match.id)}
                    className="p-2 rounded-lg border border-line hover:bg-red-500/10 transition-colors"
                    title="Delete match"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Match Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          resetForm();
        }}
        title={editingMatch ? "Edit Match" : "Add New Match"}
      >
        <div className="space-y-4 max-h-[80vh] overflow-y-auto">
          {/* League Selection */}
          <div>
            <label className="text-xs font-medium text-muted block mb-2">
              League *
            </label>
            <select
              value={formData.league.name}
              onChange={(e) => handleLeagueSelect(e.target.value)}
              className="w-full px-4 py-2 bg-secondary border border-line rounded-lg text-sm focus:outline-none focus:border-primary"
            >
              <option value="">Select a league</option>
              {leagues.map((league) => (
                <option key={league.slug} value={league.name}>
                  {league.name} ({league.country})
                </option>
              ))}
            </select>
            {formData.league.name && (
              <div className="mt-2 flex items-center gap-2">
                
                <p className="text-xs text-muted">{formData.league.country}</p>
              </div>
            )}
          </div>

          {/* Custom League Input */}
          {!leagues.find((l) => l.name === formData.league.name) && formData.league.name && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium text-muted block mb-2">
                  League Icon URL
                </label>
                <input
                  type="text"
                  value={formData.league.icon}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      league: { ...prev.league, icon: e.target.value },
                    }))
                  }
                  placeholder="https://..."
                  className="w-full px-4 py-2 bg-secondary border border-line rounded-lg text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted block mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value={formData.league.country}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      league: { ...prev.league, country: e.target.value },
                    }))
                  }
                  placeholder="Country"
                  className="w-full px-4 py-2 bg-secondary border border-line rounded-lg text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          )}

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium text-muted block mb-2">
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, date: e.target.value }))
                }
                className="w-full px-4 py-2 bg-secondary border border-line rounded-lg text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted block mb-2">
                Time *
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, time: e.target.value }))
                }
                className="w-full px-4 py-2 bg-secondary border border-line rounded-lg text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="text-xs font-medium text-muted block mb-2">
              Status *
            </label>
            <div className="flex gap-2">
              {(["upcoming", "live", "finished"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFormData((prev) => ({ ...prev, status }))}
                  className={`flex-1 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                    formData.status === status
                      ? status === "upcoming"
                        ? "bg-blue-500/20 text-blue-600 border-blue-500"
                        : status === "live"
                        ? "bg-red-500/20 text-red-600 border-red-500"
                        : "bg-green-500/20 text-green-600 border-green-500"
                      : "bg-secondary border-line text-muted hover:border-primary/40"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Home Team */}
          <div className="border-t border-line pt-4">
            <p className="text-xs font-semibold text-muted mb-3">Home Team *</p>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <label className="text-xs font-medium text-muted block mb-1">
                  Team Name
                </label>
                <input
                  type="text"
                  value={formData.homeTeam.name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      homeTeam: { ...prev.homeTeam, name: e.target.value },
                    }))
                  }
                  placeholder="e.g., Manchester United"
                  className="w-full px-4 py-2 bg-secondary border border-line rounded-lg text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted block mb-1">
                  Short Name
                </label>
                <input
                  type="text"
                  value={formData.homeTeam.shortName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      homeTeam: { ...prev.homeTeam, shortName: e.target.value },
                    }))
                  }
                  placeholder="e.g., MUN"
                  className="w-full px-4 py-2 bg-secondary border border-line rounded-lg text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted block mb-1">
                Logo URL (Optional)
              </label>
              <input
                type="text"
                value={formData.homeTeam.logo}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    homeTeam: { ...prev.homeTeam, logo: e.target.value },
                  }))
                }
                placeholder="https://..."
                className="w-full px-4 py-2 bg-secondary border border-line rounded-lg text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Away Team */}
          <div className="border-t border-line pt-4">
            <p className="text-xs font-semibold text-muted mb-3">Away Team *</p>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <label className="text-xs font-medium text-muted block mb-1">
                  Team Name
                </label>
                <input
                  type="text"
                  value={formData.awayTeam.name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      awayTeam: { ...prev.awayTeam, name: e.target.value },
                    }))
                  }
                  placeholder="e.g., Liverpool"
                  className="w-full px-4 py-2 bg-secondary border border-line rounded-lg text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted block mb-1">
                  Short Name
                </label>
                <input
                  type="text"
                  value={formData.awayTeam.shortName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      awayTeam: { ...prev.awayTeam, shortName: e.target.value },
                    }))
                  }
                  placeholder="e.g., LIV"
                  className="w-full px-4 py-2 bg-secondary border border-line rounded-lg text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted block mb-1">
                Logo URL (Optional)
              </label>
              <input
                type="text"
                value={formData.awayTeam.logo}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    awayTeam: { ...prev.awayTeam, logo: e.target.value },
                  }))
                }
                placeholder="https://..."
                className="w-full px-4 py-2 bg-secondary border border-line rounded-lg text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Score (Optional, for finished matches) */}
          {formData.status === "finished" && (
            <div className="border-t border-line pt-4">
              <p className="text-xs font-semibold text-muted mb-3">Score (Optional)</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-muted block mb-1">
                    Home Score
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.score.home}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        score: { ...prev.score, home: e.target.value },
                      }))
                    }
                    placeholder="0"
                    className="w-full px-4 py-2 bg-secondary border border-line rounded-lg text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted block mb-1">
                    Away Score
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.score.away}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        score: { ...prev.score, away: e.target.value },
                      }))
                    }
                    placeholder="0"
                    className="w-full px-4 py-2 bg-secondary border border-line rounded-lg text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Straight Win Odds */}
          <div className="border-t border-line pt-4">
            <p className="text-xs font-semibold text-muted mb-3">Straight Win Odds *</p>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs font-medium text-muted block mb-1">
                  Home (1)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  value={formData.odds.straightWin.home}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      odds: {
                        ...prev.odds,
                        straightWin: { ...prev.odds.straightWin, home: e.target.value },
                      },
                    }))
                  }
                  placeholder="1.50"
                  className="w-full px-4 py-2 bg-secondary border border-line rounded-lg text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted block mb-1">
                  Draw (X)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  value={formData.odds.straightWin.draw}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      odds: {
                        ...prev.odds,
                        straightWin: { ...prev.odds.straightWin, draw: e.target.value },
                      },
                    }))
                  }
                  placeholder="3.50"
                  className="w-full px-4 py-2 bg-secondary border border-line rounded-lg text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted block mb-1">
                  Away (2)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  value={formData.odds.straightWin.away}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      odds: {
                        ...prev.odds,
                        straightWin: { ...prev.odds.straightWin, away: e.target.value },
                      },
                    }))
                  }
                  placeholder="2.50"
                  className="w-full px-4 py-2 bg-secondary border border-line rounded-lg text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Double Chance Odds */}
          <div className="border-t border-line pt-4">
            <p className="text-xs font-semibold text-muted mb-3">Double Chance Odds *</p>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs font-medium text-muted block mb-1">
                  1X (Home or Draw)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  value={formData.odds.doubleChance["1X"]}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      odds: {
                        ...prev.odds,
                        doubleChance: { ...prev.odds.doubleChance, "1X": e.target.value },
                      },
                    }))
                  }
                  placeholder="1.20"
                  className="w-full px-4 py-2 bg-secondary border border-line rounded-lg text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted block mb-1">
                  12 (Home or Away)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  value={formData.odds.doubleChance["12"]}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      odds: {
                        ...prev.odds,
                        doubleChance: { ...prev.odds.doubleChance, "12": e.target.value },
                      },
                    }))
                  }
                  placeholder="1.40"
                  className="w-full px-4 py-2 bg-secondary border border-line rounded-lg text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted block mb-1">
                  X2 (Draw or Away)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  value={formData.odds.doubleChance["X2"]}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      odds: {
                        ...prev.odds,
                        doubleChance: { ...prev.odds.doubleChance, "X2": e.target.value },
                      },
                    }))
                  }
                  placeholder="1.30"
                  className="w-full px-4 py-2 bg-secondary border border-line rounded-lg text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t border-line">
            <button
              onClick={() => {
                setIsAddModalOpen(false);
                resetForm();
              }}
              className="flex-1 px-4 py-2 bg-secondary border border-line rounded-lg text-sm font-medium hover:bg-foreground transition-colors"
            >
              Cancel
            </button>
            <ButtonWithLoader
              initialText={editingMatch ? "Update Match" : "Create Match"}
              loadingText={editingMatch ? "Updating..." : "Creating..."}
              loading={isCreatingMatch || isUpdatingMatch}
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

