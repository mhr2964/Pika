export * from './api';
export * from './domain';
export * from './errors';
export * from './sessions';

/**
 * Live canonical surface for the current /api/v1/sessions/* slice:
 * - canonical baseline artifact: ../pika-vertical-slice.json
 * - typed/package implementation surface: ./sessions.ts
 * - package export entrypoint: ./index.ts
 * - current readable session payload examples:
 *   - ../samples/requests/sessions.create.v1.request-minimal.json
 *   - ../samples/requests/sessions.join.v1.request-minimal.json
 *   - ../samples/responses/sessions.create.v1.response-success.json
 *   - ../samples/responses/sessions.get.v1.response-complete.json
 *   - ../samples/responses/sessions.get.v1.response-in-progress.json
 *   - ../samples/responses/sessions.get.v1.response-review-ready.json
 *   - ../samples/responses/sessions.join.v1.response-success.json
 *
 * Precedence:
 * - ../pika-vertical-slice.json is the canonical baseline artifact
 * - ./sessions.ts must conform to ../pika-vertical-slice.json
 * - this file is the package export entrypoint
 * - sample JSON files are authoritative inspectable examples only where
 *   consistent with ../pika-vertical-slice.json
 *
 * Superseded/invalid in this workspace:
 * - ./pika-vertical-slice.md
 * - ../samples/sessions/
 */