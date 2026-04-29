export const ROOM_STATUS = {
  lobby: 'lobby',
  collectingOptions: 'collectingOptions',
  matchupInProgress: 'matchupInProgress',
  synthesizingResults: 'synthesizingResults',
  completed: 'completed',
} as const;

export type RoomStatus = (typeof ROOM_STATUS)[keyof typeof ROOM_STATUS];

export const PLAYER_ROLE = {
  host: 'host',
  participant: 'participant',
} as const;

export type PlayerRole = (typeof PLAYER_ROLE)[keyof typeof PLAYER_ROLE];

export const PLAYER_PRESENCE = {
  active: 'active',
  disconnected: 'disconnected',
  left: 'left',
} as const;

export type PlayerPresence = (typeof PLAYER_PRESENCE)[keyof typeof PLAYER_PRESENCE];

export const MATCHUP_STATUS = {
  pending: 'pending',
  active: 'active',
  resolved: 'resolved',
} as const;

export type MatchupStatus = (typeof MATCHUP_STATUS)[keyof typeof MATCHUP_STATUS];

export const RESULT_STATUS = {
  pending: 'pending',
  ready: 'ready',
} as const;

export type ResultStatus = (typeof RESULT_STATUS)[keyof typeof RESULT_STATUS];

export const LOADING_STATE = {
  idle: 'idle',
  loading: 'loading',
  success: 'success',
  error: 'error',
} as const;

export type LoadingState = (typeof LOADING_STATE)[keyof typeof LOADING_STATE];

export interface Player {
  id: string;
  displayName: string;
  role: PlayerRole;
  presence: PlayerPresence;
  joinedAt: string;
  isReady?: boolean;
}

export interface OptionEntry {
  id: string;
  label: string;
  createdByPlayerId: string;
  createdAt: string;
  eliminated?: boolean;
}

export interface MatchupChoiceTally {
  optionId: string;
  voteCount: number;
}

export interface Matchup {
  id: string;
  roundNumber: number;
  optionIds: [string, string];
  status: MatchupStatus;
  startedAt?: string;
  resolvedAt?: string;
  winningOptionId?: string;
  tallies?: MatchupChoiceTally[];
}

export interface RoundState {
  currentRoundNumber: number;
  totalRoundsPlanned?: number;
  activeMatchupId?: string;
  completedMatchupIds: string[];
  remainingOptionIds: string[];
  waitingOnPlayerIds?: string[];
}

export interface ResultSummaryEntry {
  optionId: string;
  label: string;
  rank: number;
  score?: number;
}

export interface ResultSummary {
  roomId: string;
  status: ResultStatus;
  winnerOptionId?: string;
  generatedAt?: string;
  rankings: ResultSummaryEntry[];
}

export interface Room {
  id: string;
  code: string;
  status: RoomStatus;
  hostPlayerId: string;
  createdAt: string;
  players: Player[];
  options: OptionEntry[];
  currentMatchup?: Matchup;
  roundState?: RoundState;
  results?: ResultSummary;
}