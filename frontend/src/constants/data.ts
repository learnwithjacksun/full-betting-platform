import {

  Volleyball,
  Ticket,
  UserRound,
  HelpCircle,
  Wallet,
} from "lucide-react";

export const libraries = [
  "React Router",
  "Tailwind CSS",
  "Lucide React",
  "React Hook Form",
  "React Query",
  "Zustand",
  "Axios",
  "Zod",
  "Sonner",
  "Framer Motion",
];

export const sidebarTabs = [
  {
    label: "All Football",
    icon: Volleyball,
    path: "/",
  },
  {
    label: "My Bets",
    icon: Ticket,
    path: "/bets",
  },
  {
    label: "Wallet",
    icon: Wallet,
    path: "/wallet",
  },
  {
    label: "Profile",
    icon: UserRound,
    path: "/profile",
  },
  {
    label: "Help & Support",
    icon: HelpCircle,
    path: "/help-support",
  },
];

export const leagues = [
  {
    name: "Premier League",
    slug: "premier-league",
    country: "England",
    region: "Europe",
    matchesToday: 8,
    icon:
      "https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Premier_League_Logo.svg/200px-Premier_League_Logo.svg.png",
  },
  {
    name: "La Liga",
    slug: "la-liga",
    country: "Spain",
    region: "Europe",
    matchesToday: 6,
    icon:
      "https://upload.wikimedia.org/wikipedia/en/thumb/0/03/La_Liga_Logo.svg/200px-La_Liga_Logo.svg.png",
  },
  {
    name: "Bundesliga",
    slug: "bundesliga",
    country: "Germany",
    region: "Europe",
    matchesToday: 5,
    icon:
      "https://upload.wikimedia.org/wikipedia/en/thumb/d/d9/Bundesliga_logo.svg/200px-Bundesliga_logo.svg.png",
  },
  {
    name: "Serie A",
    slug: "serie-a",
    country: "Italy",
    region: "Europe",
    matchesToday: 4,
    icon:
      "https://upload.wikimedia.org/wikipedia/en/thumb/e/e9/Serie_A_logo_%282019%29.svg/200px-Serie_A_logo_%282019%29.svg.png",
  },
  {
    name: "UEFA Champions League",
    slug: "uefa-champions-league",
    country: "Europe",
    region: "International",
    matchesToday: 2,
    icon:
      "https://upload.wikimedia.org/wikipedia/en/thumb/b/b3/UEFA_Champions_League_Logo.svg/200px-UEFA_Champions_League_Logo.svg.png",
  },
  {
    name: "CAF Competitions",
    slug: "caf-competitions",
    country: "Africa",
    region: "Africa",
    matchesToday: 3,
    icon:
      "https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Confederation_of_African_Football_logo.svg/200px-Confederation_of_African_Football_logo.svg.png",
  },
];

export const timeFilters = [
  { id: "all", label: "All Time" },
  { id: "today", label: "Today" },
  { id: "this-week", label: "This Week" },
  { id: "this-month", label: "This Month" },
  { id: "this-year", label: "This Year" },
];