const DEFAULT_API_BASE_URL = '/api';
const DEFAULT_MOCK_DELAY_MS = 250;
const MOCK_ROOM_CODE = 'PIKA42';

function trimTrailingSlash(value) {
  return value.replace(/\/+$/, '');
}

function readRuntimeBaseUrl() {
  const viteBaseUrl =
    typeof import.meta !== 'undefined' &&
    import.meta.env &&
    typeof import.meta.env.VITE_API_BASE_URL === 'string'
      ? import.meta.env.VITE_API_BASE_URL
      : '';

  if (viteBaseUrl.trim()) {
    return viteBaseUrl;
  }

  const windowBaseUrl =
    typeof window !== 'undefined' &&
    typeof window.__PIKA_API_BASE_URL__ === 'string'
      ? window.__PIKA_API_BASE_URL__
      : '';

  if (windowBaseUrl.trim()) {
    return windowBaseUrl;
  }

  return DEFAULT_API_BASE_URL;
}

export function getApiBaseUrl() {
  return trimTrailingSlash(readRuntimeBaseUrl());
}

export function buildApiUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
}

async function readResponsePayload(response) {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
}

function extractErrorMessage(payload, response) {
  if (payload && typeof payload === 'object') {
    if (typeof payload.error === 'string' && payload.error.trim()) {
      return payload.error;
    }

    if (typeof payload.message === 'string' && payload.message.trim()) {
      return payload.message;
    }
  }

  if (typeof payload === 'string' && payload.trim()) {
    return payload;
  }

  return `Request failed with status ${response.status}`;
}

export async function apiRequest(path, options = {}) {
  const response = await fetch(buildApiUrl(path), options);
  const payload = await readResponsePayload(response);

  if (!response.ok) {
    throw new Error(extractErrorMessage(payload, response));
  }

  return payload;
}

function delay(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export async function withMockFallback(loader, fallback, options = {}) {
  const { shouldFallback = false, mockDelayMs = DEFAULT_MOCK_DELAY_MS } = options;

  if (!shouldFallback) {
    return loader();
  }

  await delay(mockDelayMs);

  if (typeof fallback === 'function') {
    return fallback();
  }

  return fallback;
}

export function createMockRoom(overrides = {}) {
  return {
    code: MOCK_ROOM_CODE,
    status: 'waiting',
    options: [],
    members: [
      { id: 'host-1', name: 'You', isHost: true, isReady: false },
      { id: 'guest-1', name: 'Kai', isHost: false, isReady: false },
    ],
    ...overrides,
  };
}

export function createMockMatchup(overrides = {}) {
  return {
    id: 'matchup-1',
    left: 'Late-night ramen',
    right: 'Street tacos',
    round: 1,
    totalRounds: 3,
    ...overrides,
  };
}

export function createMockResults(overrides = {}) {
  return {
    winner: 'Late-night ramen',
    totalVotes: 6,
    roundsCompleted: 3,
    ...overrides,
  };
}