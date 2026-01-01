import { leagues, timeFilters } from "@/constants/data";
import { useState, useMemo } from "react";
import { Trophy, Filter, Search } from "lucide-react";
import { MatchCard } from "@/components/main";
import useMatches from "@/hooks/useMatches";
import Skeleton from "@/components/ui/skeleton";

const ALL_LEAGUES_TAB = "all";

export default function Home() {
  const { useMatchesQuery } = useMatches();
  const [activeTab, setActiveTab] = useState<string>(ALL_LEAGUES_TAB);
  const [search, setSearch] = useState<string>("");
  const tabs = [
    { id: ALL_LEAGUES_TAB, label: "All Leagues" },
    ...leagues.map((league) => ({
      id: league.slug,
      label: league.name,
    })),
  ];

  const [activeTimeFilter, setActiveTimeFilter] = useState<string>(timeFilters[0].id);

  const handleTimeFilterClick = (id: string) => {
    setActiveTimeFilter(id);
  };

  // Get selected league name for API filter
  const selectedLeague = activeTab !== ALL_LEAGUES_TAB 
    ? leagues.find((l) => l.slug === activeTab)?.name 
    : undefined;

  // Fetch matches from API
  const { data: matches = [], isLoading, error } = useMatchesQuery(
    undefined, // status - fetch all
    selectedLeague, // league filter
    undefined // date - handled client-side
  );

  // Filter matches based on search, league, and time filters
  const filteredMatches = useMemo(() => {
    let filtered = [...matches];

    // Filter by search query
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (match) =>
          match.homeTeam.name.toLowerCase().includes(searchLower) ||
          match.awayTeam.name.toLowerCase().includes(searchLower) ||
          match.league.name.toLowerCase().includes(searchLower)
      );
    }

    // Filter by league
    if (activeTab !== ALL_LEAGUES_TAB) {
      filtered = filtered.filter(
        (match) => match.league.name === leagues.find((l) => l.slug === activeTab)?.name
      );
    }

    // Filter by time
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch (activeTimeFilter) {
      case "today": {
        filtered = filtered.filter((match) => {
          const matchDate = new Date(match.date);
          matchDate.setHours(0, 0, 0, 0);
          return matchDate.getTime() === today.getTime();
        });
        break;
      }
      case "this-week": {
        const weekEnd = new Date(today);
        weekEnd.setDate(weekEnd.getDate() + 7);
        filtered = filtered.filter((match) => {
          const matchDate = new Date(match.date);
          return matchDate >= today && matchDate < weekEnd;
        });
        break;
      }
      case "this-month": {
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        filtered = filtered.filter((match) => {
          const matchDate = new Date(match.date);
          return matchDate >= today && matchDate <= monthEnd;
        });
        break;
      }
      case "this-year": {
        const yearEnd = new Date(today.getFullYear(), 11, 31);
        filtered = filtered.filter((match) => {
          const matchDate = new Date(match.date);
          return matchDate >= today && matchDate <= yearEnd;
        });
        break;
      }
      default:
        // "all" - no time filtering
        break;
    }

    return filtered;
  }, [matches, search, activeTab, activeTimeFilter]);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Header Section Skeleton */}
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-3 flex-1">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-80" />
            </div>
            <Skeleton className="h-8 w-32 hidden md:block" />
          </div>

          {/* Search Bar Skeleton */}
          <Skeleton className="h-12 w-full rounded-full" />

          {/* League Filter Tabs Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-9 w-24 rounded-full flex-shrink-0" />
              ))}
            </div>
          </div>

          {/* Time Filter Tabs Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-9 w-20 rounded-full flex-shrink-0" />
              ))}
            </div>
          </div>
        </section>

        {/* Match Cards Grid Skeleton */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="rounded-xl border border-line bg-secondary/80 overflow-hidden"
            >
              {/* League Header Skeleton */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-foreground/60 border-b border-line">
                <Skeleton className="h-4 w-32" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>

              {/* Teams Section Skeleton */}
              <div className="px-4 py-4 space-y-4">
                <div className="grid grid-cols-3 items-center gap-3">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <div className="flex justify-center">
                    <Skeleton className="h-8 w-16 rounded-full" />
                  </div>
                  <div className="space-y-2 text-right">
                    <Skeleton className="h-4 w-24 ml-auto" />
                    <Skeleton className="h-3 w-16 ml-auto" />
                  </div>
                </div>

                {/* Straight Win Odds Skeleton */}
                <div className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <div className="grid grid-cols-3 gap-2">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-16 rounded-lg" />
                    ))}
                  </div>
                </div>

                {/* Double Chance Odds Skeleton */}
                <div className="space-y-2 pt-2 border-t border-line">
                  <Skeleton className="h-3 w-28" />
                  <div className="grid grid-cols-3 gap-2">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-16 rounded-lg" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Failed to load matches. Please try again later.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-2">
              <Trophy size={14} />
              <span>Top Football Competitions</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight font-space">
              Explore Matches
            </h2>
            <p className="text-xs md:text-sm text-muted mt-1">
              Switch between top leagues and discover today&apos;s fixtures at a glance.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 rounded-full border border-line bg-secondary px-3 py-1.5 text-xs text-muted">
            <Filter size={14} className="text-primary" />
            <span>Filter by league</span>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-line bg-secondary px-3 py-1.5 text-xs text-muted">
          <Search
            size={18}
            className="text-muted"
          />
          <input
            type="text"
            placeholder="Search for a match..."
            className="w-full bg-transparent outline-none h-10 placeholder:text-muted text-main"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div>
          <p className="text-xs text-muted">Filter by league</p>
          <div className="flex gap-2 flex-nowrap overflow-x-auto hide-scrollbar pt-1 pb-1">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <div
                  key={tab.id}
          
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap cursor-pointer rounded-full border px-4 py-2 text-xs md:text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary text-white border-primary shadow-md"
                      : "bg-secondary/80 hover:bg-primary/20 text-muted border-line hover:border-primary/40 hover:text-main"
                  }`}
                >
                  {tab.label}
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <p className="text-xs text-muted">Filter by Time</p>
          <div className="flex gap-2 flex-nowrap overflow-x-auto hide-scrollbar pt-1 pb-1">
            {timeFilters.map((timeFilter) => {
              const isActive = timeFilter.id === activeTimeFilter;
              return (
                <div
                  key={timeFilter.id}
          
                  onClick={() => handleTimeFilterClick(timeFilter.id)}
                  className={`whitespace-nowrap cursor-pointer rounded-full border px-4 py-2 text-xs md:text-sm font-medium transition-all ${
                    isActive
                      ? "bg-red-500 text-white border-red-500 shadow-md"
                      : "bg-secondary/80 hover:bg-red-500/20 text-muted border-line hover:border-red-500/40 hover:text-main"
                  }`}
                >
                  {timeFilter.label}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMatches.length > 0 ? (
          filteredMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted text-sm">No matches found matching your filters.</p>
          </div>
        )}
      </section>
    </div>
  );
}
