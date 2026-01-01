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
      home: number; // 1
      draw: number; // X
      away: number; // 2
    };
    doubleChance: {
      "1X": number; // Home or Draw
      "12": number; // Home or Away
      "X2": number; // Draw or Away
    };
  };
}

export const dummyMatches: Match[] = [
  {
    id: "1",
    league: {
      name: "Premier League",
      icon: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Premier_League_Logo.svg/120px-Premier_League_Logo.svg.png",
      country: "England",
    },
    date: "2026-01-15",
    time: "15:00",
    status: "upcoming",
    homeTeam: {
      name: "Manchester United",
      shortName: "MUN",
      logo: "https://logos-world.net/wp-content/uploads/2020/06/Manchester-United-Logo.png",
    },
    awayTeam: {
      name: "Liverpool FC",
      shortName: "LIV",
      logo: "https://logos-world.net/wp-content/uploads/2020/06/Liverpool-Logo.png",
    },
    odds: {
      straightWin: {
        home: 2.45,
        draw: 3.20,
        away: 2.80,
      },
      doubleChance: {
        "1X": 1.45,
        "12": 1.35,
        "X2": 1.55,
      },
    },
  },
  {
    id: "2",
    league: {
      name: "La Liga",
      icon: "https://upload.wikimedia.org/wikipedia/en/thumb/0/03/La_Liga_Logo.svg/120px-La_Liga_Logo.svg.png",
      country: "Spain",
    },
    date: "2026-01-15",
    time: "17:30",
    status: "live",
    homeTeam: {
      name: "Real Madrid",
      shortName: "RMA",
      logo: "https://logos-world.net/wp-content/uploads/2020/06/Real-Madrid-Logo.png",
    },
    awayTeam: {
      name: "FC Barcelona",
      shortName: "BAR",
      logo: "https://logos-world.net/wp-content/uploads/2020/06/Barcelona-Logo.png",
    },
    score: {
      home: 2,
      away: 1,
    },
    odds: {
      straightWin: {
        home: 1.95,
        draw: 3.50,
        away: 3.80,
      },
      doubleChance: {
        "1X": 1.30,
        "12": 1.25,
        "X2": 1.65,
      },
    },
  },
  {
    id: "3",
    league: {
      name: "Bundesliga",
      icon: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d9/Bundesliga_logo.svg/120px-Bundesliga_logo.svg.png",
      country: "Germany",
    },
    date: "2026-01-15",
    time: "14:00",
    status: "upcoming",
    homeTeam: {
      name: "Bayern Munich",
      shortName: "BAY",
      logo: "https://logos-world.net/wp-content/uploads/2020/06/Bayern-Munich-Logo.png",
    },
    awayTeam: {
      name: "Borussia Dortmund",
      shortName: "BVB",
      logo: "https://logos-world.net/wp-content/uploads/2020/06/Borussia-Dortmund-Logo.png",
    },
    odds: {
      straightWin: {
        home: 1.75,
        draw: 3.80,
        away: 4.50,
      },
      doubleChance: {
        "1X": 1.20,
        "12": 1.40,
        "X2": 2.10,
      },
    },
  },
  {
    id: "4",
    league: {
      name: "Serie A",
      icon: "https://upload.wikimedia.org/wikipedia/en/thumb/2/29/Serie_A_Logo.svg/120px-Serie_A_Logo.svg.png",
      country: "Italy",
    },
    date: "2026-01-15",
    time: "18:00",
    status: "finished",
    homeTeam: {
      name: "AC Milan",
      shortName: "MIL",
      logo: "https://logos-world.net/wp-content/uploads/2020/06/AC-Milan-Logo.png",
    },
    awayTeam: {
      name: "Inter Milan",
      shortName: "INT",
      logo: "https://logos-world.net/wp-content/uploads/2020/06/Inter-Milan-Logo.png",
    },
    score: {
      home: 1,
      away: 1,
    },
    odds: {
      straightWin: {
        home: 2.60,
        draw: 3.10,
        away: 2.70,
      },
      doubleChance: {
        "1X": 1.50,
        "12": 1.30,
        "X2": 1.48,
      },
    },
  },
  {
    id: "5",
    league: {
      name: "UEFA Champions League",
      icon: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b3/UEFA_Champions_League_Logo.svg/120px-UEFA_Champions_League_Logo.svg.png",
      country: "Europe",
    },
    date: "2026-01-15",
    time: "20:00",
    status: "upcoming",
    homeTeam: {
      name: "Paris Saint-Germain",
      shortName: "PSG",
      logo: "https://logos-world.net/wp-content/uploads/2020/06/Paris-Saint-Germain-Logo.png",
    },
    awayTeam: {
      name: "Manchester City",
      shortName: "MCI",
      logo: "https://logos-world.net/wp-content/uploads/2020/06/Manchester-City-Logo.png",
    },
    odds: {
      straightWin: {
        home: 2.20,
        draw: 3.40,
        away: 3.00,
      },
      doubleChance: {
        "1X": 1.40,
        "12": 1.32,
        "X2": 1.58,
      },
    },
  },
  {
    id: "6",
    league: {
      name: "Premier League",
      icon: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Premier_League_Logo.svg/120px-Premier_League_Logo.svg.png",
      country: "England",
    },
    date: "2026-01-15",
    time: "12:30",
    status: "upcoming",
    homeTeam: {
      name: "Arsenal FC",
      shortName: "ARS",
      logo: "https://logos-world.net/wp-content/uploads/2020/06/Arsenal-Logo.png",
    },
    awayTeam: {
      name: "Chelsea FC",
      shortName: "CHE",
      logo: "https://logos-world.net/wp-content/uploads/2020/06/Chelsea-Logo.png",
    },
    odds: {
      straightWin: {
        home: 2.10,
        draw: 3.30,
        away: 3.40,
      },
      doubleChance: {
        "1X": 1.38,
        "12": 1.28,
        "X2": 1.62,
      },
    },
  },
];