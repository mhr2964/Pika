import { NextResponse } from 'next/server';

import { ApiError, getErrorMessage, isApiError } from '@/lib/server/api/errors';
import type { ApiErrorPayload } from '@/lib/server/rooms/types';

export function jsonOk<T>(body: T, status = 200) {
  return NextResponse.json(body, { status });
}

export function jsonCreated<T>(body: T) {
  return jsonOk(body, 201);
}

export function jsonError(message: string, status: number) {
  const payload: ApiErrorPayload = {
    error: message,
  };

  return NextResponse.json(payload, { status });
}

export function toApiError(error: unknown): ApiError {
  if (isApiError(error)) {
    return error;
  }

  return new ApiError(500, getErrorMessage(error));
}

export function jsonFromError(error: unknown) {
  const apiError = toApiError(error);
  return jsonError(apiError.message, apiError.status);
}