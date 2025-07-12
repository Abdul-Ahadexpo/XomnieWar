export interface OC {
  name: string;
  backstory: string;
  avatar: string;
  powers: string[]; // Can have up to 4 powers after winning battles
  stats: {
    strength: number;
    speed: number;
    intelligence: number;
  };
  specialAbility: string;
  createdAt: number;
  wins?: number;
  history?: BattleHistory[];
  powersAbsorbed?: AbsorbedPower[];
  title?: string;
}

export interface User {
  uid: string;
  email: string;
  oc?: OC;
  banned?: boolean;
}

export interface BattleResult {
  winner: string;
  loser: string;
  winnerPower: number;
  loserPower: number;
  timestamp: number;
  powersTransferred: string[];
}
export interface BattleHistory {
  opponent: string;
  result: 'won' | 'lost';
  date: string;
  powersGained?: string[];
  statsGained?: number;
  timestamp: number;
}

export interface BattleRequest {
  fromUid: string;
  fromOCName: string;
  fromOCAvatar: string;
  fromOCPower: number;
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: number;
}

export interface OCComment {
  uid: string;
  username: string;
  comment: string;
  timestamp: number;
}
export interface AbsorbedPower {
  power: string;
  fromOpponent: string;
  timestamp: number;
}