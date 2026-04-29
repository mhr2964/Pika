import { jsonError, jsonFromError, jsonOk } from '@/lib/server/api/json';
import { joinRoomRecord } from '@/lib/server/rooms/service';
import type {
  JoinRoomRequestBody,
  RoomResponse,
} from '@/lib/server/rooms/types';

interface RouteContext {
  params: {
    roomId: string;
  };
}

function isJoinRoomRequestBody(value: unknown): value is JoinRoomRequestBody {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return candidate.participantId === undefined || typeof candidate.participantId === 'string';
}

async function parseJoinRoomRequest(request: Request): Promise<JoinRoomRequestBody> {
  try {
    const body = (await request.json()) as unknown;
    return isJoinRoomRequestBody(body) ? body : {};
  } catch {
    return {};
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const body = await parseJoinRoomRequest(request);
    const result = joinRoomRecord(context.params.roomId, body);

    if (!result.ok) {
      return jsonError(result.error ?? 'Unable to join room', result.status);
    }

    const payload: RoomResponse = {
      room: result.data!,
    };

    return jsonOk(payload);
  } catch (error) {
    return jsonFromError(error);
  }
}