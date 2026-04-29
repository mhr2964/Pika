/**
 * Participant in a room session
 */
export interface Participant {
  id: string;
  name: string;
  joinedAt: number; // timestamp
}

/**
 * A single matchup between two participants
 */
export interface Matchup {
  id: string;
  p1Id: string;
  p2Id: string;
  createdAt: number;
}

/**
 * Result of a matchup (submitted by one participant)
 */
export interface Result {
  id: string;
  matchupId: string;
  submittedBy: string; // participant ID
  winner: string; // participant ID of winner
  submittedAt: number;
}

/**
 * Overall state of a room session
 */
export interface SessionState {
  code: string;
  createdAt: number;
  participants: Participant[];
  matchups: Matchup[];
  results: Result[];
  completed: boolean; // true when 2/3 quorum met on all matchups
}