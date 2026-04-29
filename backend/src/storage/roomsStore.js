const fs = require('fs/promises');
const path = require('path');
const { env } = require('../config/env');

const roomsById = new Map();
let hasLoadedPersistedRooms = false;

function createStoreError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
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
    throw createStoreError('Resolved storage path is outside the allowed workspace.', 500);
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

async function loadPersistedRoomsIfNeeded() {
  if (!env.persistRooms || hasLoadedPersistedRooms) {
    return;
  }

  const storagePath = await ensureStorageFile();
  const rawContent = await fs.readFile(storagePath, 'utf8');
  const parsedRooms = JSON.parse(rawContent);

  roomsById.clear();

  for (const room of parsedRooms) {
    if (room && typeof room.id === 'string') {
      roomsById.set(room.id, room);
    }
  }

  hasLoadedPersistedRooms = true;
}

async function persistRoomsIfEnabled() {
  if (!env.persistRooms) {
    return;
  }

  const storagePath = await ensureStorageFile();
  await fs.writeFile(
    storagePath,
    JSON.stringify(Array.from(roomsById.values()), null, 2),
    'utf8'
  );
}

function getRoomRecord(roomId) {
  return roomsById.get(roomId) || null;
}

function requirePlayerInRoom(room, playerId) {
  const exists = room.players.some((player) => player.id === playerId);

  if (!exists) {
    throw createStoreError('Player is not in this room.', 400);
  }
}

function buildResults(room) {
  const totalsByTarget = new Map();
  const reactionCounts = {};

  for (const vote of room.votes) {
    const current = totalsByTarget.get(vote.targetId) || {
      targetId: vote.targetId,
      score: 0,
      voteCount: 0
    };

    current.score += vote.value;
    current.voteCount += 1;
    totalsByTarget.set(vote.targetId, current);
  }

  for (const reaction of room.reactions) {
    reactionCounts[reaction.emoji] = (reactionCounts[reaction.emoji] || 0) + 1;
  }

  const totals = Array.from(totalsByTarget.values()).sort((left, right) => {
    if (right.score !== left.score) {
      return right.score - left.score;
    }

    return right.voteCount - left.voteCount;
  });

  return {
    roomId: room.id,
    topic: room.topic,
    phase: 'results',
    totals,
    reactionCounts,
    winner: totals[0] || null
  };
}

async function createRoomRecord({ hostName, topic }) {
  await loadPersistedRoomsIfNeeded();

  const timestamp = new Date().toISOString();
  const hostPlayer = {
    id: createId('player'),
    name: hostName,
    joinedAt: timestamp
  };

  const room = {
    id: createId('room'),
    code: createRoomCode(),
    topic,
    phase: 'lobby',
    hostId: hostPlayer.id,
    players: [hostPlayer],
    votes: [],
    reactions: [],
    createdAt: timestamp,
    updatedAt: timestamp
  };

  roomsById.set(room.id, room);
  await persistRoomsIfEnabled();

  return cloneValue(room);
}

async function getRoomById(roomId) {
  await loadPersistedRoomsIfNeeded();

  const room = getRoomRecord(roomId);

  if (!room) {
    return null;
  }

  return cloneValue(room);
}

async function joinRoomById(roomId, { name }) {
  await loadPersistedRoomsIfNeeded();

  const room = getRoomRecord(roomId);

  if (!room) {
    return null;
  }

  const duplicateName = room.players.some((player) => {
    return player.name.toLowerCase() === name.toLowerCase();
  });

  if (duplicateName) {
    throw createStoreError('A player with this name is already in the room.', 409);
  }

  const timestamp = new Date().toISOString();
  const player = {
    id: createId('player'),
    name,
    joinedAt: timestamp
  };

  const updatedRoom = {
    ...room,
    players: [...room.players, player],
    updatedAt: timestamp
  };

  roomsById.set(roomId, updatedRoom);
  await persistRoomsIfEnabled();

  return {
    room: cloneValue(updatedRoom),
    player: cloneValue(player)
  };
}

async function submitVoteForRoom(roomId, { playerId, targetId, value }) {
  await loadPersistedRoomsIfNeeded();

  const room = getRoomRecord(roomId);

  if (!room) {
    return null;
  }

  requirePlayerInRoom(room, playerId);

  const timestamp = new Date().toISOString();
  const vote = {
    roomId,
    playerId,
    targetId,
    value,
    submittedAt: timestamp
  };

  const filteredVotes = room.votes.filter((existingVote) => {
    return !(existingVote.playerId === playerId && existingVote.targetId === targetId);
  });

  const updatedRoom = {
    ...room,
    phase: room.phase === 'lobby' ? 'live' : room.phase,
    votes: [...filteredVotes, vote],
    updatedAt: timestamp
  };

  roomsById.set(roomId, updatedRoom);
  await persistRoomsIfEnabled();

  return cloneValue(vote);
}

async function submitReactionForRoom(roomId, { playerId, emoji }) {
  await loadPersistedRoomsIfNeeded();

  const room = getRoomRecord(roomId);

  if (!room) {
    return null;
  }

  requirePlayerInRoom(room, playerId);

  const timestamp = new Date().toISOString();
  const reaction = {
    roomId,
    playerId,
    emoji,
    submittedAt: timestamp
  };

  const updatedRoom = {
    ...room,
    phase: room.phase === 'lobby' ? 'live' : room.phase,
    reactions: [...room.reactions, reaction],
    updatedAt: timestamp
  };

  roomsById.set(roomId, updatedRoom);
  await persistRoomsIfEnabled();

  return cloneValue(reaction);
}

async function getRoomResults(roomId) {
  await loadPersistedRoomsIfNeeded();

  const room = getRoomRecord(roomId);

  if (!room) {
    return null;
  }

  const results = buildResults(room);
  const updatedRoom = {
    ...room,
    phase: 'results',
    updatedAt: new Date().toISOString()
  };

  roomsById.set(roomId, updatedRoom);
  await persistRoomsIfEnabled();

  return results;
}

module.exports = {
  createRoomRecord,
  getRoomById,
  joinRoomById,
  submitVoteForRoom,
  submitReactionForRoom,
  getRoomResults
};