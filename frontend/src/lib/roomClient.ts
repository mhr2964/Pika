import { RoomState } from '../types/pika';

export type CreateRoomInput = {
  hostName: string;
  prompt: string;
};

export type JoinRoomInput = {
  guestName: string;
  roomCode: string;
};

export type SubmitChoiceInput = {
  roomCode: string;
  selectedOptionId: string;
};

export type AdvanceRoomInput = {
  roomCode: string;
};

export type RoomClientErrorCode =
  | 'bad-request'
  | 'not-found'
  | 'conflict'
  | 'rate-limited'
  | 'unauthorized'
  | 'forbidden'
  | 'network-error'
  | 'server-error'
  | 'not-implemented'
  | 'unknown';

export class RoomClientError extends Error {
  code: RoomClientErrorCode;
  status?: number;
  details?: unknown;

  constructor(message: string, options: { code: RoomClientErrorCode; status?: number; details?: unknown }) {
    super(message);
    this.name = 'RoomClientError';
    this.code = options.code;
    this.status = options.status;
    this.details = options.details;
  }
}

export type RoomClient = {
  createRoom: (input: CreateRoomInput) => Promise<RoomState>;
  joinRoom: (input: JoinRoomInput) => Promise<RoomState>;
  fetchRoomState: (roomCode: string) => Promise<RoomState>;
  submitChoice: (input: SubmitChoiceInput) => Promise<RoomState>;
  fetchResults: (roomCode: string) => Promise<RoomState>;
  advanceRoomPhase: (input: AdvanceRoomInput) => Promise<RoomState>;
};

type FetchLike = typeof fetch;

type RoomClientConfig = {
  baseUrl?: string;
  fetchImpl?: FetchLike;
};

type RequestOptions = {
  method?: 'GET' | 'POST';
  body?: unknown;
};

const DEFAULT_BASE_URL = '/api';

function normalizeRoomCode(value: string) {
  return value.trim().toUpperCase();
}

async function parseJson(response: Response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new RoomClientError('The room server replied with something weird.', {
      code: 'server-error',
      status: response.status,
      details: text,
    });
  }
}

function mapErrorCode(status: number): RoomClientErrorCode {
  if (status === 400) return 'bad-request';
  if (status === 401) return 'unauthorized';
  if (status === 403) return 'forbidden';
  if (status === 404) return 'not-found';
  if (status === 409) return 'conflict';
  if (status === 429) return 'rate-limited';
  if (status >= 500) return 'server-error';
  return 'unknown';
}

function extractMessage(payload: unknown, fallback: string) {
  if (payload && typeof payload === 'object' && 'message' in payload && typeof payload.message === 'string') {
    return payload.message;
  }

  return fallback;
}

async function request<T>(
  fetchImpl: FetchLike,
  baseUrl: string,
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  let response: Response;

  try {
    response = await fetchImpl(`${baseUrl}${path}`, {
      method: options.method ?? 'GET',
      headers: {
        Accept: 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  } catch (error) {
    throw new RoomClientError('Could not reach the room server.', {
      code: 'network-error',
      details: error,
    });
  }

  const payload = await parseJson(response);

  if (!response.ok) {
    throw new RoomClientError(extractMessage(payload, 'The room request did not go through.'), {
      code: mapErrorCode(response.status),
      status: response.status,
      details: payload,
    });
  }

  return payload as T;
}

function notImplemented(methodName: string): Promise<never> {
  throw new RoomClientError(`${methodName} is not wired to a launch-approved backend endpoint yet.`, {
    code: 'not-implemented',
  });
}

export function createRoomClient(config: RoomClientConfig = {}): RoomClient {
  const fetchImpl = config.fetchImpl ?? fetch;
  const baseUrl = (config.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, '');

  return {
    createRoom(input) {
      return request<RoomState>(fetchImpl, baseUrl, '/rooms', {
        method: 'POST',
        body: input,
      });
    },

    joinRoom(input) {
      return request<RoomState>(fetchImpl, baseUrl, `/rooms/${normalizeRoomCode(input.roomCode)}/join`, {
        method: 'POST',
        body: {
          guestName: input.guestName,
        },
      });
    },

    fetchRoomState(roomCode) {
      return request<RoomState>(fetchImpl, baseUrl, `/rooms/${normalizeRoomCode(roomCode)}`);
    },

    submitChoice(input) {
      return request<RoomState>(fetchImpl, baseUrl, `/rooms/${normalizeRoomCode(input.roomCode)}/choices`, {
        method: 'POST',
        body: {
          selectedOptionId: input.selectedOptionId,
        },
      });
    },

    fetchResults(roomCode) {
      return request<RoomState>(fetchImpl, baseUrl, `/rooms/${normalizeRoomCode(roomCode)}/results`);
    },

    advanceRoomPhase(input) {
      return notImplemented(`advanceRoomPhase(${normalizeRoomCode(input.roomCode)})`);
    },
  };
}