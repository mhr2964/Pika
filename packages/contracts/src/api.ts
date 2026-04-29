import type { APIError } from './errors';
import type { Matchup, OptionEntry, ResultSummary, Room } from './domain';

export interface CreateRoomRequest {
  hostName: string;
}

export interface CreateRoomResponse {
  room: Room;
  sessionPlayerId: string;
}

export interface JoinRoomRequest {
  roomCode: string;
  playerName: string;
}

export interface JoinRoomResponse {
  room: Room;
  sessionPlayerId: string;
}

export interface SubmitOptionsRequest {
  roomId: string;
  playerId: string;
  options: Array<Pick<OptionEntry, 'label'>>;
}

export interface SubmitOptionsResponse {
  room: Room;
  acceptedOptions: OptionEntry[];
}

export interface StartMatchupRequest {
  roomId: string;
  playerId: string;
}

export interface StartMatchupResponse {
  room: Room;
  matchup: Matchup;
}

export interface SubmitMatchupChoiceRequest {
  roomId: string;
  playerId: string;
  matchupId: string;
  selectedOptionId: string;
}

export interface SubmitMatchupChoiceResponse {
  room: Room;
  matchup: Matchup;
}

export interface AdvanceMatchupRequest {
  roomId: string;
  playerId: string;
  matchupId: string;
}

export interface AdvanceMatchupResponse {
  room: Room;
  matchup?: Matchup;
  results?: ResultSummary;
}

export interface SynthesizeResultsRequest {
  roomId: string;
  playerId: string;
}

export interface SynthesizeResultsResponse {
  room: Room;
  results: ResultSummary;
}

export interface ContractSuccess<T> {
  ok: true;
  data: T;
}

export interface ContractFailure {
  ok: false;
  error: APIError;
}

export type ContractResult<T> = ContractSuccess<T> | ContractFailure;