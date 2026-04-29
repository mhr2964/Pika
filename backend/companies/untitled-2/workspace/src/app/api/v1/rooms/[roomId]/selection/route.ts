import { jsonError, jsonFromError, jsonOk } from '@/lib/server/api/json';
import { submitRoomSelection } from '@/lib/server/rooms/service';
import type {
  RoomResponse,
  SelectionRequestBody,
} from '@/lib/server/rooms/types';

interface RouteContext {
  params: {
    roomId: string;
  };
}

function isSelectionRequestBody(value: unknown): value is SelectionRequestBody {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  const hasValidParticipantId =
    candidate.participantId === undefined || typeof candidate.participantId === 'string';
  const hasValidOptionId =
    candidate.optionId === undefined || typeof candidate.optionId === 'string';

  return hasValidParticipantId && hasValidOptionId;
}

async function parseSelectionRequest(request: Request): Promise<SelectionRequestBody> {
  try {
    const body = (await request.json()) as unknown;
    return isSelectionRequestBody(body) ? body : {};
  } catch {
    return {};
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const body = await parseSelectionRequest(request);
    const result = submitRoomSelection(context.params.roomId, body);

    if (!result.ok) {
      return jsonError(result.error ?? 'Unable to submit selection', result.status);
    }

    const payload: RoomResponse = {
      room: result.data!,
    };

    return jsonOk(payload);
  } catch (error) {
    return jsonFromError(error);
  }
}