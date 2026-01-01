import { useQuery } from "@tanstack/react-query";
import api from "@/config/api";

export interface Match {
  id: string;
  league: {
    name: string;
    icon: string;
    country: string;
  };
  date: string;
  time: string;
  status: "upcoming" | "live" | "finished";
  homeTeam: {
    name: string;
    shortName: string;
    logo?: string;
  };
  awayTeam: {
    name: string;
    shortName: string;
    logo?: string;
  };
  score?: {
    home: number;
    away: number;
  };
  odds: {
    straightWin: {
      home: number;
      draw: number;
      away: number;
    };
    doubleChance: {
      "1X": number;
      "12": number;
      "X2": number;
    };
  };
}

export default function useMatches() {
  // Query key factory
  const matchesKeys = {
    all: ["matches"] as const,
    lists: () => [...matchesKeys.all, "list"] as const,
    list: (status?: string, league?: string, date?: string) =>
      [...matchesKeys.lists(), status, league, date] as const,
    details: () => [...matchesKeys.all, "detail"] as const,
    detail: (id: string) => [...matchesKeys.details(), id] as const,
  };

  // Get all matches
  const getMatches = async (
    status?: string,
    league?: string,
    date?: string
  ): Promise<Match[]> => {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (league) params.append("league", league);
    if (date) params.append("date", date);

    const queryString = params.toString();
    const url = `/matches${queryString ? `?${queryString}` : ""}`;

    const response = await api.get(url, { silent: true });
    if (response.data.success) {
      return response.data.matches;
    }
    throw new Error(response.data.message || "Failed to fetch matches");
  };

  // Get single match by ID
  const getMatchById = async (id: string): Promise<Match> => {
    const response = await api.get(`/matches/${id}`, { silent: true });
    if (response.data.success) {
      return response.data.match;
    }
    throw new Error(response.data.message || "Failed to fetch match");
  };

  // React Query hooks
  const useMatchesQuery = (status?: string, league?: string, date?: string) => {
    return useQuery({
      queryKey: matchesKeys.list(status, league, date),
      queryFn: () => getMatches(status, league, date),
      staleTime: 30000, // Consider data fresh for 30 seconds
    });
  };

  const useMatchQuery = (id: string) => {
    return useQuery({
      queryKey: matchesKeys.detail(id),
      queryFn: () => getMatchById(id),
      enabled: !!id,
    });
  };

  return {
    useMatchesQuery,
    useMatchQuery,
  };
}

