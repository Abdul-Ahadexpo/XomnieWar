export interface OC {
  name: string;
  backstory: string;
  avatar: string;
  powers: Power[]; // Can have unlimited powers after winning battles
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
  customPowers?: CustomPower[];
}

export interface Power {
  name: string;
  attack: number;
  defense: number;
  magic: number;
  description: string;
  isCustom?: boolean;
  createdBy?: string;
}

export interface CustomPower {
  name: string;
  attack: number;
  defense: number;
  magic: number;
  description: string;
  createdBy: string;
  timestamp: number;
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
  powersGained?: Power[];
  statsGained?: number;
  timestamp: number;
}

export interface BattleRequest {
  fromUid: string;
  fromOCName: string;
  fromOCAvatar: string;
  fromOCPower: number;
  fromOCData: OC;
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
  power: Power;
  fromOpponent: string;
  timestamp: number;
}