const fs = require('fs/promises');
const path = require('path');
const { env } = require('../config/env');

const roomsById = new Map();
const roomIdsByCode = new Map();
let hasLoadedPersistedRooms = false;

function createStoreError(message, statusCode, code, fields, details) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  error.fields = fields;
  error.details = details;
  return error;
}

function createId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function createRoomCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';

  for (let index = 0; index < 6; index += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  return code;
}

function cloneValue(value) {
  return JSON.parse(JSON.stringify(value));
}

function getSafeStoragePath() {
  const resolvedPath = env.roomsFile;
  const safeBaseDirectory = `${path.resolve(process.cwd())}${path.sep}`;

  if (!resolvedPath.startsWith(safeBaseDirectory)) {
    throw createStoreError('Resolved storage path is outside the allowed workspace.', 500, 'INTERNAL_ERROR');
  }

  return resolvedPath;
}

async function ensureStorageFile() {
  const storagePath = getSafeStoragePath();
  const storageDirectory = path.dirname(storagePath);

  await fs.mkdir(storageDirectory, { recursive: true });

  try {
    await fs.access(storagePath);
  } catch (_error) {
    await fs.writeFile(storagePath, '[]', 'utf8');
  }

  return storagePath;
}

function indexRoom(room) {
  roomsById.set(room.id, room);
  roomIdsByCode.set(room.code, room.id);
}

async function loadPersistedRoomsIfNeeded() {
  if (!env.persistRooms || hasLoadedPersistedRooms) {
    return;
  }

  const storagePath = await ensureStorageFile();
  const rawContent = await fs.readFile(storagePath, 'utf8');
  const parsedRooms = JSON.parse(rawContent);

  roomsById.clear();
  roomIdsByCode.clear();

  for (const room of parsedRooms) {
    if (room && typeof room.id === 'string' && typeof room.code === 'string') {
      indexRoom(room);
    }
  }

  hasLoadedPersistedRooms = true;
}

async function persistRoomsIfEnabled() {
  if (!env.persistRooms) {
    return;
  }

  const storagePath = await ensureStorageFile();
  await fs.writeFile(storagePath, JSON.stringify(Array.from(roomsById.values()), null, 2), 'utf8');
}

function getRoomRecordByCode(code) {
  const roomId = roomIdsByCode.get(code);
  if (!roomId) {
    return null;
  }
  return roomsById.get(roomId) || null;
}

function summarizeParticipant(participant) {
  return {
    id: participant.id,
    displayName: participant.displayName,
    joinedAt: participant.joinedAt
  };
}

function computeCapabilities(room, participantId) {
  const isHost = participantId && participantId === room.hostParticipantId;
  return [
    ...(isHost && room.phase !== 'results' && room.phase !== 'closed' ? ['canAdvancePhase'] : []),
    ...(room.phase === 'active' ? ['canSubmitChoice'] : []),
    ...(room.phase === 'results' ? ['canViewResults'] : [])
  ];
}

function buildRoomState(room, participantId) {
  return {
    id: room.id,
    code: room.code,
    phase: room.phase,
    createdAt: room.createdAt,
    updatedAt: room.updatedAt,
    participants: room.participants.map(summarizeParticipant),
    participantCount: room.participants.length,
    activeMatchup:
      room.phase === 'active' && room.matchups[room.currentMatchupIndex]
        ? {
            id: room.matchups[room.currentMatchupIndex].id,
            prompt: room.matchups[room.currentMatchupIndex].prompt,
            choices: room.matchups[room.currentMatchupIndex].choices.map((choice) => ({
              id: choice.id,
              label: choice.label
            })),
            status: room.matchups[room.currentMatchupIndex].locked ? 'locked' : 'pending'
          }
        : null,
    completedMatchupCount: room.matchups.filter((matchup) => matchup.locked).length,
    totalMatchupCount: room.matchups.length,
    capabilities: computeCapabilities(room, participantId),
    viewerRole: participantId
      ? participantId ===
'host'
        : 'guest',
    session: {
      participantId: participantId || undefined,
      authState: 'unknown'
    }
  };
}

function buildResultsState(room) {
  const matchup = room.matchups[room.currentMatchupIndex] || room.matchups[room.matchups.length - 1];
  const voteCountByChoiceId = new Map();

  for (const submission of room.submissions) {
    voteCountByChoiceId.set(
      submission.choiceId,
      (voteCountByChoiceId.get(submission.choiceId) || 0) + 1
    );
  }

  const rankings = (matchup ? matchup.choices : [])
    .map((choice) => ({
      choiceId: choice.id,
      label: choice.label,
      voteCount: voteCountByChoiceId.get(choice.id) || 0
    }))
    .sort((left, right) => right.voteCount - left.voteCount || left.label.localeCompare(right.label));

  return {
    roomId: room.id,
    roomCode: room.code,
    winner: rankings[0] || null,
    rankings,
    totalSubmissions: room.submissions.length,
    phase: 'results'
  };
}

function ensureParticipant(room, participantId) {
  const participant = room.participants.find((entry) => entry.id === participantId);
  if (!participant) {
    throw createStoreError('Participant is not in this room.', 403, 'FORBIDDEN');
  }
  return participant;
}

function ensureHost(room, participantId) {
  ensureParticipant(room, participantId);
  if (room.hostParticipantId !== participantId) {
    throw createStoreError('Only the host can advance the room.', 403, 'FORBIDDEN');
  }
}

function ensureRoomOpenForJoin(room) {
  if (room.phase === 'closed' || room.phase === 'results') {
    throw createStoreError('Room is closed.', 409, 'ROOM_CLOSED');
  }
}

function ensureActiveMatchup(room, matchupId) {
  const matchup = room.matchups[room.currentMatchupIndex];
  if (!matchup || matchup.id !== matchupId) {
    throw createStoreError('Matchup is not active.', 409, 'INVALID_PHASE');
  }
  return matchup;
}

async function createRoomRecord({ hostDisplayName, matchupPrompt, choices }) {
  await loadPersistedRoomsIfNeeded();

  const timestamp = new Date().toISOString();
  const hostParticipant = {
    id: createId('participant'),
    displayName: hostDisplayName,
    joinedAt: timestamp
  };

  let code = createRoomCode();
  while (roomIdsByCode.has(code)) {
    code = createRoomCode();
  }

  const room = {
    id: createId('room'),
    code,
    phase: 'lobby',
    createdAt: timestamp,
    updatedAt: timestamp,
    hostParticipantId: hostParticipant.id,
    participants: [hostParticipant],
    currentMatchupIndex: 0,
    matchups: [
      {
        id: createId('matchup'),
        prompt: matchupPrompt,
        choices: choices.map((choice) => ({
          id: choice.id,
          label: choice.label
        })),
        locked: false
      }
    ],
    submissions: [],
    security: {
      rateLimitingImplemented: false,
      authIntegrationImplemented: false
    }
  };

  indexRoom(room);
  await persistRoomsIfEnabled();

  return {
    room: buildRoomState(room, hostParticipant.id),
    participant: summarizeParticipant(hostParticipant)
  };
}

async function getRoomByCode(code) {
  await loadPersistedRoomsIfNeeded();

  const room = getRoomRecordByCode(code);
  if (!room) {
    return null;
  }

  return buildRoomState(room);
}

async function joinRoomByCode(code, { displayName }) {
  await loadPersistedRoomsIfNeeded();

  const room = getRoomRecordByCode(code);
  if (!room) {
    throw createStoreError('Room not found.', 404, 'NOT_FOUND');
  }

  ensureRoomOpenForJoin(room);

  const duplicateName = room.participants.some(
    (participant) => participant.displayName.toLowerCase() === displayName.toLowerCase()
  );

  if (duplicateName) {
    throw createStoreError('A participant with this display name already joined.', 409, 'DUPLICATE_JOIN');
  }

  const timestamp = new Date().toISOString();
  const participant = {
    id: createId('participant'),
    displayName,
    joinedAt: timestamp
  };

  room.participants.push(participant);
  room.updatedAt = timestamp;

  indexRoom(room);
  await persistRoomsIfEnabled();

  return {
    room: buildRoomState(room, participant.id),
    participant: summarizeParticipant(participant)
  };
}

async function submitChoiceForRoom(code, { participantId, matchupId, choiceId, requestId }) {
  await loadPersistedRoomsIfNeeded();

  const room = getRoomRecordByCode(code);
  if (!room) {
    throw createStoreError('Room not found.', 404, 'NOT_FOUND');
  }

  ensureParticipant(room, participantId);

  if (room.phase !== 'active') {
    throw createStoreError('Room is not accepting choices in the current phase.', 409, 'INVALID_PHASE');
  }

  const matchup = ensureActiveMatchup(room, matchupId);
  const choiceExists = matchup.choices.some((choice) => choice.id === choiceId);

  if (!choiceExists) {
    throw createStoreError('Choice is invalid for the active matchup.', 400, 'VALIDATION_ERROR', [
      { field: 'choiceId', message: 'choiceId must reference an active matchup choice.' }
    ]);
  }

  const existingSubmission = room.submissions.find((submission) => {
    if (requestId && submission.requestId === requestId) {
      return true;
    }

    return submission.matchupId === matchupId && submission.participantId === participantId;
  });

  if (existingSubmission) {
    if (existingSubmission.choiceId !== choiceId) {
      throw createStoreError(
        'A choice was already submitted for this matchup.',
        409,
        'CHOICE_ALREADY_SUBMITTED'
      );
    }

    return {
      room: buildRoomState(room, participantId),
      submission: {
        matchupId: existingSubmission.matchupId,
        participantId: existingSubmission.participantId,
        choiceId: existingSubmission.choiceId,
        submittedAt: existingSubmission.submittedAt,
        duplicate: true
      }
    };
  }

  const timestamp = new Date().toISOString();
  const submission = {
    matchupId,
    participantId,
    choiceId,
    requestId: requestId || null,
    submittedAt: timestamp
  };

  room.submissions.push(submission);
  room.updatedAt = timestamp;

  indexRoom(room);
  await persistRoomsIfEnabled();

  return {
    room: buildRoomState(room, participantId),
    submission: {
      matchupId,
      participantId,
      choiceId,
      submittedAt: timestamp,
      duplicate: false
    }
  };
}

async function advanceRoomPhase(code, { requestedByParticipantId }) {
  await loadPersistedRoomsIfNeeded();

  const room = getRoomRecordByCode(code);
  if (!room) {
    throw createStoreError('Room not found.', 404, 'NOT_FOUND');
  }

  ensureHost(room, requestedByParticipantId);

  if (room.phase === 'lobby') {
    room.phase = 'active';
  } else if (room.phase === 'active') {
    room.matchups[room.currentMatchupIndex].locked = true;
    room.phase = 'results';
  } else {
    throw createStoreError('Room cannot be advanced from the current phase.', 409, 'INVALID_PHASE');
  }

  room.updatedAt = new Date().toISOString();

  indexRoom(room);
  await persistRoomsIfEnabled();

  return {
    room: buildRoomState(room, requestedByParticipantId)
  };
}

async function getRoomResults(code) {
  await loadPersistedRoomsIfNeeded();

  const room = getRoomRecordByCode(code);
  if (!room) {
    throw createStoreError('Room not found.', 404, 'NOT_FOUND');
  }

  if (room.phase !== 'results') {
    throw createStoreError('Results are not available in the current phase.', 409, 'INVALID_PHASE');
  }

  return {
    results: buildResultsState(room),
    room: buildRoomState(room)
  };
}

module.exports = {
  createRoomRecord,
  getRoomByCode,
  joinRoomByCode,
  submitChoiceForRoom,
  advanceRoomPhase,
  getRoomResults
};