export type SessionPhase = 'waiting' | 'ready' | 'in_progress' | 'complete';

export interface SessionParticipant {
  id: string;
  displayName: string;
  isHost: boolean;
  hasJoined: boolean;
}

export interface SessionOption {
  id: string;
  label: string;
}

export interface SessionMatchup {
  leftOptionId: string;
  rightOptionId: string;
  round: number;
}

export interface SessionResult {
  winnerOptionId: string;
  shareText: string;
}

export interface SessionState {
  id: string;
  code: string;
  phase: SessionPhase;
  prompt: string;
  participants: SessionParticipant[];
  options: SessionOption[];
  currentMatchup?: SessionMatchup;
  result?: SessionResult;
}

export interface CreateSessionRequest {
  displayName: string;
  prompt: string;
  options: string[];
}

export interface JoinSessionRequest {
  displayName: string;
}

export interface CreateSessionResponse {
  session: SessionState;
}

export interface JoinSessionResponse {
  session: SessionState;
  participant: SessionParticipant;
}

export interface GetSessionResponse {
  session: SessionState;
}

export interface SessionErrorResponse {
  error: {
    code: string;
    message: string;
  };
}