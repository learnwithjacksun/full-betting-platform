interface InputWithIconProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode;
  type: string;
  label?: string;
  error?: string;
}
interface InputWithoutIconProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  type: string;
  label?: string;
  error?: string;
}

interface ButtonWithLoaderProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  initialText: string;
  loadingText: string;
}

interface SelectWithIconProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  icon: React.ReactNode;
  label?: string;
  error?: string;
  defaultValue?: string;
  options: {
    label: string;
    value: string;
  }[];
}

interface SelectWithoutIconProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  defaultValue?: string;
  options: {
    label: string;
    value: string;
  }[];
}

interface IBankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  bankCode: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ISupportedBank {
  name: string;
  code: string;
}
interface IUser {
  id: string;
  username: string;
  email: string;
  phone: string;
  wallet: number;
  bankAccounts: IBankAccount[];
  isAdmin: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}


type BetStatus = "pending" | "won" | "lost" | "cancelled";
type BetType = "straightWin" | "doubleChance";

/* =====================
   Match-related types
===================== */

interface ILeague {
  name: string;
  icon: string;
  country: string;
}

interface ITeam {
  name: string;
  shortName: string;
  logo?: string;
}

interface IScore {
  home?: number;
  away?: number;
}

interface IMatch {
  id: string;
  league: ILeague;
  date: string;
  time: string;
  status: string;

  homeTeam: ITeam;
  awayTeam: ITeam;

  score?: IScore;
}

/* =====================
   Bet Selection
===================== */

interface IBetSelection {
  id: string;
  matchId: string;

  match: IMatch;

  betType: BetType;
  option: string;
  odds: number;
  label: string;
}

/* =====================
   Main Bet Interface
===================== */

interface IBet {
  id: string;

  user: string; // userId (ObjectId string)

  betId: string;

  stake: number;
  totalOdds: number;
  potentialWin: number;

  status: BetStatus;

  placedAt: string;
  settledAt?: string;

  selections: IBetSelection[];

  createdAt: string;
  updatedAt: string;
}

/* =====================
   Transaction Types
===================== */

type TransactionType = "deposit" | "withdrawal" | "bet" | "bet_win" | "bet_refund";
type TransactionStatus = "pending" | "completed" | "failed" | "cancelled";

interface ITransaction {
  id: string;
  user: string; // userId
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  description: string;
  reference?: string;
  bankAccount?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    bankCode: string;
  };
  betId?: string;
  paymentReference?: string;
  processedBy?: string;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface IMatch {
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

interface IAdminStats {
  users: {
    total: number;
    recent: number;
  };
  bets: {
    total: number;
    recent: number;
    pending: number;
    won: number;
    lost: number;
    cancelled: number;
  };
  transactions: {
    total: number;
    deposits: {
      count: number;
      totalAmount: number;
    };
    withdrawals: {
      count: number;
      totalAmount: number;
      pending: {
        count: number;
        totalAmount: number;
      };
    };
  };
  matches: {
    total: number;
    upcoming: number;
    live: number;
    finished: number;
  };
}
