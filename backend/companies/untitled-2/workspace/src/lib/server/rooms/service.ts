import { ApiError } from '@/lib/server/api/errors';
import {
  createRoom,
  getRoom,
  joinRoom,
  submitSelection,
  type StoreResult,
} from '@/lib/server/rooms/store';
import type {
  CreateRoomInput,
  JoinRoomInput,
  RoomRecord,
  SelectionInput,
} from '@/lib/server/rooms/types';

export interface ServiceResult<T> {
  ok: boolean;
  status: number;
  error?: string;
  data?: T;
}

function toServiceResult<T>(result: StoreResult<T>): ServiceResult<T> {
  return {
    ok: result.ok,
    status: result.status,
    error: result.error,
    data: result.data,
  };
}

function requireRoomId(roomId: string): string {
  const trimmedRoomId = roomId.trim();

  if (!trimmedRoomId) {
    throw new ApiError(400, 'roomId is required');
  }

  return trimmedRoomId;
}

export function createRoomRecord(input: CreateRoomInput = {}): ServiceResult<RoomRecord> {
  return {
    ok: true,
    status: 201,
    data: createRoom(input),
  };
}

export function getRoomRecord(roomId: string): ServiceResult<RoomRecord> {
  const normalizedRoomId = requireRoomId(roomId);
  const room = getRoom(normalizedRoomId);

  if (!room) {
    return {
      ok: false,
      status: 404,
      error: 'Room not found',
    };
  }

  return {
    ok: true,
    status: 200,
    data: room,
  };
}

export function joinRoomRecord(
  roomId: string,
  input: JoinRoomInput = {},
): ServiceResult<RoomRecord> {
  const normalizedRoomId = requireRoomId(roomId);
  return toServiceResult(joinRoom(normalizedRoomId, input));
}

export function submitRoomSelection(
  roomId: string,
  input: SelectionInput,
): ServiceResult<RoomRecord> {
  const normalizedRoomId = requireRoomId(roomId);
  return toServiceResult(submitSelection(normalizedRoomId, input));
}