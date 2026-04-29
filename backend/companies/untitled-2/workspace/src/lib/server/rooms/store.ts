import type {
  CreateRoomInput,
  JoinRoomInput,
  RoomParticipant,
  RoomRecord,
  SelectionInput,
} from '@/lib/server/rooms/types';

export interface StoreResult<T> {
  ok: boolean;
  status: number;
  error?: string;
  data?: T;
}

const ROOM_CODE_LENGTH = 6;
const ROOM_ID_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const rooms = new Map<string, RoomRecord>();

function nowIsoString(): string {
  return new Date().toISOString();
}

function buildParticipantId(prefix: 'host' | 'player'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function generateRoomId(): string {
  let roomId = '';

  for (let index = 0; index < ROOM_CODE_LENGTH; index += 1) {
    const randomIndex = Math.floor(Math.random() * ROOM_ID_ALPHABET.length);
    roomId += ROOM_ID_ALPHABET[randomIndex];
  }

  return roomId;
}

function generateUniqueRoomId(): string {
  let roomId = generateRoomId();

  while (rooms.has(roomId)) {
    roomId = generateRoomId();
  }

  return roomId;
}

function cloneRoom(room: RoomRecord): RoomRecord {
  return {
    ...room,
    participants: room.participants.map((participant) => ({ ...participant })),
    selections: room.selections.map((selection) => ({ ...selection })),
  };
}

function findParticipant(room: RoomRecord, participantId: string): RoomParticipant | undefined {
  return room.participants.find((participant) => participant.id === participantId);
}

function buildRoomRecord(input: CreateRoomInput = {}): RoomRecord {
  const timestamp = nowIsoString();
  const hostId = input.hostId?.trim() || buildParticipantId('host');

  return {
    id: generateUniqueRoomId(),
    createdAt: timestamp,
    updatedAt: timestamp,
    status: 'waiting',
    hostId,
    participants: [
      {
        id: hostId,
        joinedAt: timestamp,
      },
    ],
    selections: [],
  };
}

export function createRoom(input: CreateRoomInput = {}): RoomRecord {
  const room = buildRoomRecord(input);
  rooms.set(room.id, room);
  return cloneRoom(room);
}

export function getRoom(roomId: string): RoomRecord | null {
  const room = rooms.get(roomId);
  return room ? cloneRoom(room) : null;
}

export function joinRoom(roomId: string, input: JoinRoomInput = {}): StoreResult<RoomRecord> {
  const room = rooms.get(roomId);

  if (!room) {
    return {
      ok: false,
      status: 404,
      error: 'Room not found',
    };
  }

  const participantId = input.participantId?.trim() || buildParticipantId('player');
  const existingParticipant = findParticipant(room, participantId);

  if (existingParticipant) {
    return {
      ok: true,
      status: 200,
      data: cloneRoom(room),
    };
  }

  const timestamp = nowIsoString();

  room.participants.push({
    id: participantId,
    joinedAt: timestamp,
  });
  room.updatedAt = timestamp;

  if (room.status === 'waiting' && room.participants.length > 1) {
    room.status = 'active';
  }

  return {
    ok: true,
    status: 200,
    data: cloneRoom(room),
  };
}

export function submitSelection(roomId: string, input: SelectionInput): StoreResult<RoomRecord> {
  const room = rooms.get(roomId);

  if (!room) {
    return {
      ok: false,
      status: 404,
      error: 'Room not found',
    };
  }

  const participantId = input.participantId?.trim();
  const optionId = input.optionId?.trim();

  if (!participantId || !optionId) {
    return {
      ok: false,
      status: 400,
      error: 'participantId and optionId are required',
    };
  }

  if (!findParticipant(room, participantId)) {
    return {
      ok: false,
      status: 404,
      error: 'Participant not found in room',
    };
  }

  const timestamp = nowIsoString();
  const selectionIndex = room.selections.findIndex(
    (selection) => selection.participantId === participantId,
  );

  if (selectionIndex >= 0) {
    room.selections[selectionIndex] = {
      participantId,
      optionId,
      submittedAt: timestamp,
    };
  } else {
    room.selections.push({
      participantId,
      optionId,
      submittedAt: timestamp,
    });
  }

  room.updatedAt = timestamp;

  if (room.selections.length >= room.participants.length) {
    room.status = 'complete';
  } else if (room.participants.length > 1) {
    room.status = 'active';
  }

  return {
    ok: true,
    status: 200,
    data: cloneRoom(room),
  };
}