const dotenv = require("dotenv");
const express = require("express");
const fs = require("fs");
const path = require("path");

dotenv.config();

const app = express();
app.use(express.json());

const port = parsePort(process.env.PORT);
const shouldPersistRooms = process.env.PERSIST_ROOMS === "true";
const roomsFile = process.env.ROOMS_FILE || "./data/rooms.json";
const inMemoryRooms = new Map();

loadPersistedRooms();

app.get("/api/v1/health", (_req, res) => {
  res.json({
    ok: true,
    service: "pika-backend",
    version: "v1",
    timestamp: Date.now(),
  });
});

app.post("/api/v1/rooms", (req, res) => {
  const body = req.body || {};
  const roomCode = normalizeRoomCode(body.roomCode) || generateRoomCode();

  if (inMemoryRooms.has(roomCode)) {
    res.status(409).json({ error: "room_code_conflict" });
    return;
  }

  const now = Date.now();
  const room = {
    code: roomCode,
    createdAt: now,
    updatedAt: now,
    participants: [],
    options: [],
    matchups: [],
    results: [],
    reveal: buildRevealState(),
    completed: false,
    phase: "onboarding",
  };

  inMemoryRooms.set(roomCode, room);
  persistRooms();

  res.status(201).json({
    room: toRoomResponse(room),
    session: toSessionResponse(room),
  });
});

app.get("/api/v1/rooms/:roomCode", (req, res) => {
  const room = getRoomOrNull(req.params.roomCode);

  if (!room) {
    res.status(404).json({ error: "room_not_found" });
    return;
  }

  res.json({ room: toRoomResponse(room) });
});

app.post("/api/v1/rooms/:roomCode/join", (req, res) => {
  const room = getRoomOrNull(req.params.roomCode);

  if (!room) {
    res.status(404).json({ error: "room_not_found" });
    return;
  }

  if (room.phase !== "onboarding" && room.phase !== "options") {
    res.status(409).json({ error: "join_closed_for_phase" });
    return;
  }

  const body = req.body || {};
  const name = normalizeParticipantName(body.name);

  if (!name) {
    res.status(400).json({ error: "invalid_participant_name" });
    return;
  }

  const duplicateName = room.participants.find(
    (participant) => participant.name.toLowerCase() === name.toLowerCase(),
  );

  if (duplicateName) {
    res.status(409).json({ error: "participant_name_conflict" });
    return;
  }

  const participant = {
    id: generateId("p"),
    name,
    joinedAt: Date.now(),
  };

  room.participants.push(participant);
  recalculateRoom(room);
  persistRooms();

  res.status(201).json({
    participant,
    room: toRoomResponse(room),
    session: toSessionResponse(room),
  });
});

app.post("/api/v1/rooms/:roomCode/options", (req, res) => {
  const room = getRoomOrNull(req.params.roomCode);

  if (!room) {
    res.status(404).json({ error: "room_not_found" });
    return;
  }

  if (room.phase !== "onboarding" && room.phase !== "options") {
    res.status(409).json({ error: "option_submission_closed" });
    return;
  }

  const body = req.body || {};
  const participantId =
    typeof body.participantId === "string" ? body.participantId : "";
  const text = normalizeOptionText(body.text);

  if (!participantId || !hasParticipant(room, participantId)) {
    res.status(400).json({ error: "invalid_participant_id" });
    return;
  }

  if (!text) {
    res.status(400).json({ error: "invalid_option_text" });
    return;
  }

  const duplicateOption = room.options.find(
    (option) =>
      option.participantId === participantId &&
      option.text.toLowerCase() === text.toLowerCase(),
  );

  if (duplicateOption) {
    res.status(409).json({ error: "duplicate_option_submission" });
    return;
  }

  const option = {
    id: generateId("o"),
    participantId,
    text,
    submittedAt: Date.now(),
  };

  room.options.push(option);
  recalculateRoom(room);
  persistRooms();

  res.status(201).json({
    option,
    room: toRoomResponse(room),
    session: toSessionResponse(room),
  });
});

app.post("/api/v1/rooms/:roomCode/advance", (req, res) => {
  const room = getRoomOrNull(req.params.roomCode);

  if (!room) {
    res.status(404).json({ error: "room_not_found" });
    return;
  }

  const body = req.body || {};
  const targetPhase = normalizePhase(body.phase);

  if (!targetPhase) {
    res.status(400).json({ error: "invalid_target_phase" });
    return;
  }

  const currentPhase = room.phase;
  const allowedNextPhase = getAllowedNextPhase(room);

  if (allowedNextPhase !== targetPhase) {
    res.status(409).json({
      error: "invalid_phase_transition",
      currentPhase,
      allowedNextPhase,
    });
    return;
  }

  if (targetPhase === "matchups" && room.options.length < 2) {
    res.status(409).json({ error: "insufficient_options_for_matchups" });
    return;
  }

  room.phase = targetPhase;
  room.updatedAt = Date.now();

  if (targetPhase === "reveal") {
    room.reveal.ready = true;
    room.reveal.revealedAt = Date.now();
  }

  if (targetPhase === "complete") {
    room.completed = true;
  }

  persistRooms();

  res.json({
    room: toRoomResponse(room),
    session: toSessionResponse(room),
  });
});

app.get("/api/v1/rooms/:roomCode/session", (req, res) => {
  const room = getRoomOrNull(req.params.roomCode);

  if (!room) {
    res.status(404).json({ error: "room_not_found" });
    return;
  }

  res.json({
    session: toSessionResponse(room),
  });
});

app.get("/api/v1/rooms/:roomCode/reveal", (req, res) => {
  const room = getRoomOrNull(req.params.roomCode);

  if (!room) {
    res.status(404).json({ error: "room_not_found" });
    return;
  }

  res.json({
    reveal: toRevealResponse(room),
  });
});

app.post("/api/v1/rooms/:roomCode/results", (req, res) => {
  const room = getRoomOrNull(req.params.roomCode);

  if (!room) {
    res.status(404).json({ error: "room_not_found" });
    return;
  }

  if (room.phase !== "matchups" && room.phase !== "results") {
    res.status(409).json({ error: "result_submission_closed" });
    return;
  }

  const body = req.body || {};
  const matchupId = typeof body.matchupId === "string" ? body.matchupId : "";
  const submittedBy =
    typeof body.submittedBy === "string" ? body.submittedBy : "";
  const winner = typeof body.winner === "string" ? body.winner : "";

  const matchup = room.matchups.find((candidate) => candidate.id === matchupId);

  if (!matchup) {
    res.status(400).json({ error: "invalid_matchup_id" });
    return;
  }

  if (!hasParticipant(room, submittedBy)) {
    res.status(400).json({ error: "invalid_submitted_by" });
    return;
  }

  if (!hasOption(room, winner)) {
    res.status(400).json({ error: "invalid_winner" });
    return;
  }

  if (winner !== matchup.leftOptionId && winner !== matchup.rightOptionId) {
    res.status(400).json({ error: "winner_not_in_matchup" });
    return;
  }

  const duplicateSubmission = room.results.find(
    (result) =>
      result.matchupId === matchupId && result.submittedBy === submittedBy,
  );

  if (duplicateSubmission) {
    res.status(409).json({ error: "duplicate_result_submission" });
    return;
  }

  const result = {
    id: generateId("r"),
    matchupId,
    submittedBy,
    winner,
    submittedAt: Date.now(),
  };

  room.results.push(result);
  recalculateRoom(room);
  persistRooms();

  res.status(201).json({
    result,
    room: toRoomResponse(room),
    session: toSessionResponse(room),
  });
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});

function parsePort(rawPort) {
  const fallbackPort = 3001;

  if (!rawPort) {
    return fallbackPort;
  }

  const parsedPort = Number(rawPort);

  if (!Number.isInteger(parsedPort) || parsedPort <= 0) {
    return fallbackPort;
  }

  return parsedPort;
}

function normalizeRoomCode(roomCode) {
  if (typeof roomCode !== "string") {
    return null;
  }

  const normalized = roomCode.trim().toUpperCase();

  if (!/^[A-Z0-9]{4,12}$/.test(normalized)) {
    return null;
  }

  return normalized;
}

function normalizeParticipantName(name) {
  if (typeof name !== "string") {
    return null;
  }

  const normalized = name.trim();

  if (normalized.length < 1 || normalized.length > 40) {
    return null;
  }

  return normalized;
}

function normalizeOptionText(text) {
  if (typeof text !== "string") {
    return null;
  }

  const normalized = text.trim();

  if (normalized.length < 1 || normalized.length > 160) {
    return null;
  }

  return normalized;
}

function normalizePhase(phase) {
  const allowedPhases = new Set([
    "options",
    "matchups",
    "results",
    "reveal",
    "complete",
  ]);

  if (typeof phase !== "string") {
    return null;
  }

  return allowedPhases.has(phase) ? phase : null;
}

function generateRoomCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  for (let attempt = 0; attempt < 10; attempt += 1) {
    let roomCode = "";

    for (let index = 0; index < 6; index += 1) {
      roomCode += alphabet[Math.floor(Math.random() * alphabet.length)];
    }

    if (!inMemoryRooms.has(roomCode)) {
      return roomCode;
    }
  }

  return `${Date.now().toString(36).toUpperCase()}`
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 8);
}

function generateId(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function getRoomOrNull(roomCodeParam) {
  const roomCode = normalizeRoomCode(roomCodeParam);

  if (!roomCode) {
    return null;
  }

  return inMemoryRooms.get(roomCode) || null;
}

function hasParticipant(room, participantId) {
  return room.participants.some((participant) => participant.id === participantId);
}

function hasOption(room, optionId) {
  return room.options.some((option) => option.id === optionId);
}

function buildRevealState() {
  return {
    ready: false,
    revealedAt: null,
    winnerOptionId: null,
    winnerParticipantId: null,
    winnerVotes: 0,
    standings: [],
  };
}

function recalculateRoom(room) {
  if (!Array.isArray(room.options)) {
    room.options = [];
  }

  if (!Array.isArray(room.results)) {
    room.results = [];
  }

  if (!room.reveal) {
    room.reveal = buildRevealState();
  }

  room.matchups = buildMatchups(room.options);
  room.reveal = buildRevealFromResults(room);

  if (room.phase === "onboarding" && room.participants.length > 0) {
    room.phase = "options";
  }

  if (
    (room.phase === "options" || room.phase === "onboarding") &&
    room.options.length >= 2
  ) {
    room.phase = "matchups";
  }

  if (room.phase === "matchups" && room.results.length > 0) {
    room.phase = "results";
  }

  if (room.reveal.ready && room.phase !== "complete") {
    room.phase = "reveal";
  }

  room.completed = room.phase === "complete";
  room.updatedAt = Date.now();
}

function buildMatchups(options) {
  const nextMatchups = [];

  for (let leftIndex = 0; leftIndex < options.length; leftIndex += 1) {
    for (
      let rightIndex = leftIndex + 1;
      rightIndex < options.length;
      rightIndex += 1
    ) {
      const leftOption = options[leftIndex];
      const rightOption = options[rightIndex];

      nextMatchups.push({
        id: `m_${leftOption.id}_${rightOption.id}`,
        leftOptionId: leftOption.id,
        rightOptionId: rightOption.id,
      });
    }
  }

  return nextMatchups;
}

function buildRevealFromResults(room) {
  const voteCounts = new Map();

  for (const option of room.options) {
    voteCounts.set(option.id, 0);
  }

  for (const result of room.results) {
    if (voteCounts.has(result.winner)) {
      voteCounts.set(result.winner, voteCounts.get(result.winner) + 1);
    }
  }

  const standings = room.options
    .map((option) => ({
      optionId: option.id,
      participantId: option.participantId,
      text: option.text,
      votes: voteCounts.get(option.id) || 0,
    }))
    .sort((left, right) => right.votes - left.votes || left.text.localeCompare(right.text));

  const allMatchupsHaveResults =
    room.matchups.length > 0 &&
    room.matchups.every((matchup) =>
      room.results.some((result) => result.matchupId === matchup.id),
    );

  const topStanding = standings[0] || null;

  return {
    ready: allMatchupsHaveResults,
    revealedAt: allMatchupsHaveResults ? Date.now() : null,
    winnerOptionId: topStanding ? topStanding.optionId : null,
    winnerParticipantId: topStanding ? topStanding.participantId : null,
    winnerVotes: topStanding ? topStanding.votes : 0,
    standings,
  };
}

function getAllowedNextPhase(room) {
  switch (room.phase) {
    case "onboarding":
      return "options";
    case "options":
      return "matchups";
    case "matchups":
      return "results";
    case "results":
      return "reveal";
    case "reveal":
      return "complete";
    default:
      return null;
  }
}

function toRoomResponse(room) {
  return {
    code: room.code,
    phase: room.phase,
    createdAt: room.createdAt,
    updatedAt: room.updatedAt,
    participantCount: room.participants.length,
    optionCount: room.options.length,
    matchupCount: room.matchups.length,
    resultCount: room.results.length,
    revealReady: room.reveal.ready,
    completed: room.completed,
  };
}

function toSessionResponse(room) {
  return {
    code: room.code,
    phase: room.phase,
    createdAt: room.createdAt,
    updatedAt: room.updatedAt,
    participants: room.participants,
    options: room.options,
    matchups: room.matchups,
    results: room.results,
    reveal: toRevealResponse(room),
    completed: room.completed,
  };
}

function toRevealResponse(room) {
  return {
    ready: room.reveal.ready,
    revealedAt: room.reveal.revealedAt,
    winnerOptionId: room.reveal.ready ? room.reveal.winnerOptionId : null,
    winnerParticipantId: room.reveal.ready
      ? room.reveal.winnerParticipantId
      : null,
    winnerVotes: room.reveal.ready ? room.reveal.winnerVotes : 0,
    standings: room.reveal.ready ? room.reveal.standings : [],
  };
}

function loadPersistedRooms() {
  if (!shouldPersistRooms) {
    return;
  }

  const resolvedRoomsFile = path.resolve(roomsFile);

  if (!fs.existsSync(resolvedRoomsFile)) {
    return;
  }

  try {
    const serialized = fs.readFileSync(resolvedRoomsFile, "utf8");
    const parsed = JSON.parse(serialized);

    for (const room of parsed.rooms || []) {
      const hydratedRoom = {
        ...room,
        options: Array.isArray(room.options) ? room.options : [],
        results: Array.isArray(room.results) ? room.results : [],
        reveal: room.reveal || buildRevealState(),
      };
      recalculateRoom(hydratedRoom);
      inMemoryRooms.set(hydratedRoom.code, hydratedRoom);
    }
  } catch (error) {
    console.error("Failed to load rooms file", error);
  }
}

function persistRooms() {
  if (!shouldPersistRooms) {
    return;
  }

  const resolvedRoomsFile = path.resolve(roomsFile);
  const safeParentDirectory = path.resolve(path.dirname(roomsFile));
  const actualParentDirectory = path.dirname(resolvedRoomsFile);

  if (
    actualParentDirectory !== safeParentDirectory &&
    !actualParentDirectory.startsWith(`${safeParentDirectory}${path.sep}`)
  ) {
    console.error("Refusing to persist rooms outside configured directory");
    return;
  }

  fs.mkdirSync(actualParentDirectory, { recursive: true });
  fs.writeFileSync(
    resolvedRoomsFile,
    JSON.stringify({ rooms: Array.from(inMemoryRooms.values()) }, null, 2),
    "utf8",
  );
}