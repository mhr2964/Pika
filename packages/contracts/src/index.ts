export * from './api';
export * from './domain';
export * from './errors';
export * from './sessions';

/**
 * Authoritative current /api/v1/sessions/* shared surface:
 * - ./sessions.ts
 * - ../samples/sessions/
 *
 * Any markdown artifact in this package is explanatory/reference-only and
 * must not override the exported session contracts or the canonical session
 * sample set.
 */