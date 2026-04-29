import { jsonCreated, jsonFromError } from '@/lib/server/api/json';
import { createRoomRecord } from '@/lib/server/rooms/service';
import type {
  CreateRoomRequestBody,
  RoomResponse,
} from '@/lib/server/rooms/types';

function isCreateRoomRequestBody(value: unknown): value is CreateRoomRequestBody {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return candidate.hostId === undefined || typeof candidate.hostId === 'string';
}

async function parseCreateRoomRequest(request: Request): Promise<CreateRoomRequestBody> {
  try {
    const body = (await request.json()) as unknown;
    return isCreateRoomRequestBody(body) ? body : {};
  } catch {
    return {};
  }
}

export async function POST(request: Request) {
  try {
    const body = await parseCreateRoomRequest(request);
    const result = createRoomRecord(body);
    const payload: RoomResponse = {
      room: result.data!,
    };

    return jsonCreated(payload);
  } catch (error) {
    return jsonFromError(error);
  }
}