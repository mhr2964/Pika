import { jsonError, jsonFromError, jsonOk } from '@/lib/server/api/json';
import { getRoomRecord } from '@/lib/server/rooms/service';
import type { RoomResponse } from '@/lib/server/rooms/types';

interface RouteContext {
  params: {
    roomId: string;
  };
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const result = getRoomRecord(context.params.roomId);

    if (!result.ok) {
      return jsonError(result.error ?? 'Room not found', result.status);
    }

    const payload: RoomResponse = {
      room: result.data!,
    };

    return jsonOk(payload);
  } catch (error) {
    return jsonFromError(error);
  }
}