export type RoomStatus = 'waiting' | 'active' | 'complete';

export interface RoomParticipant {
  id: string;
  joinedAt: string;
}

export interface RoomSelection {
  participantId: string;
  optionId: string;
  submittedAt: string;
}

export interface RoomRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: RoomStatus;
  hostId: string;
  participants: RoomParticipant[];
  selections: RoomSelection[];
}

export interface CreateRoomInput {
  hostId?: string;
}

export interface JoinRoomInput {
  participantId?: string;
}

export interface SelectionInput {
  participantId?: string;
  optionId?: string;
}

export interface ApiErrorPayload {
  error: string;
}

export interface RoomResponse {
  room: RoomRecord;
}

export interface CreateRoomRequestBody {
  hostId?: string;
}

export interface JoinRoomRequestBody {
  participantId?: string;
}

export interface SelectionRequestBody {
  participantId?: string;
  optionId?: string;
}