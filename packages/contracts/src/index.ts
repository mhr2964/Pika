export type ID = string;
export type RoomCode = string;
export type ISODateTime = string;

export type RoomStatus = "waiting" | "lobby" | "active" | "results" | "closed";
export type MemberRole = "host" | "participant";
export type MemberPresence = "connected" | "disconnected";
export type RoomPhase = "lobby" | "matchup" | "results";

export interface User {
  id: ID;
  name: string;
  createdAt: ISODateTime;
}

export interface Room {
  id: ID;
  code: RoomCode;
  hostUserId: ID;
  status: RoomStatus;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface RoomMember {
  id: ID;
  roomId: ID;
  userId: ID;
  role: MemberRole;
  presence: MemberPresence;
  joinedAt: ISODateTime;
}

export interface Option {
  id: ID;
  roomId: ID;
  label: string;
  createdByUserId?: ID;
}

export interface Matchup {
  id: ID;
  roomId: ID;
  round: number;
  leftOptionId: ID;
  rightOptionId: ID;
  openedAt: ISODateTime;
  closesAt?: ISODateTime;
  winningOptionId?: ID;
}

export interface Vote {
  id: ID;
  roomId: ID;
  matchupId: ID;
  memberId: ID;
  selectedOptionId: ID;
  createdAt: ISODateTime;
}

export interface RankedResult {
  optionId: ID;
  rank: number;
  score: number;
}

export interface ResultSummary {
  roomId: ID;
  winningOptionId: ID;
  rankings: RankedResult[];
  decidedAt: ISODateTime;
}

export interface LobbyState {
  phase: "lobby";
  room: Room;
  members: RoomMember[];
  options: Option[];
  canStart: boolean;
}

export interface ActiveMatchupState {
  phase: "matchup";
  room: Room;
  members: RoomMember[];
  options: Option[];
  matchup: Matchup;
  submittedMemberIds: ID[];
}

export interface ResultsState {
  phase: "results";
  room: Room;
  members: RoomMember[];
  options: Option[];
  summary: ResultSummary;
}

export type RoomState = LobbyState | ActiveMatchupState | ResultsState;

export interface CreateRoomRequest {
  hostName: string;
  optionLabels: string[];
}

export interface CreateRoomResponse {
  user: User;
  room: Room;
  member: RoomMember;
  state: LobbyState;
}

export interface JoinRoomRequest {
  roomCode: RoomCode;
  userName: string;
}

export interface JoinRoomResponse {
  user: User;
  room: Room;
  member: RoomMember;
  state: LobbyState;
}

export interface GetLobbyRequest {
  roomCode: RoomCode;
  userId: ID;
}

export interface GetLobbyResponse {
  state: LobbyState;
}

export interface SubmitVoteRequest {
  roomCode: RoomCode;
  userId: ID;
  matchupId: ID;
  selectedOptionId: ID;
}

export interface SubmitVoteResponse {
  accepted: boolean;
  vote?: Vote;
  state: ActiveMatchupState | ResultsState;
}

export interface GetResultsRequest {
  roomCode: RoomCode;
  userId: ID;
}

export interface GetResultsResponse {
  state: ResultsState;
}