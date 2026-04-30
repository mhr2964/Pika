import dotenv from "dotenv";
import express, { type Request, type Response } from "express";
import fs from "fs";
import path from "path";
import {
  type Matchup,
  type Participant,
  type Result,
  type SessionState,
} from "./types/sessions";

dotenv.config();

type RoomPhase =
  | "collecting"
  | "ready"
  | "voting"
  | "ranking"
  | "results"
  | "closed";

interface RoomRecord extends SessionState {
  phase: RoomPhase;
  updatedAt: number;
}

interface CreateRoomBody {
  roomCode?: string;
}

interface JoinRoomBody {
  name?: string;
}

interface SubmitResultBody {
  matchupId?: string;
  submittedBy?: string;
  winner?: string;
}

const app = express();
app.use(express.json());

const port = parsePort(process.env.PORT);
const shouldPersistRooms = process.env.PERSIST_ROOMS === "true";
const roomsFile = process.env.ROOMS_FILE || "./data/rooms.json";

const inMemoryRooms = new Map<string, RoomRecord>();

loadPersistedRooms();

app.get("/api/v1/health", (_req: Request, res: Response) => {
  res.json({
    ok: true,
    service: "pika-backend",
    version: "v1",
    timestamp: Date.now(),
  });
});

app.post("/api/v1/rooms", (req: Request, res: Response) => {
  const body = (req.body ?? {}) as CreateRoomBody;
  const roomCode = normalizeRoomCode(body.roomCode) || generateRoomCode();

  if (inMemoryRooms.has(roomCode)) {
    res.status(409).json({ error: "room_code_conflict" });
    return;
  }

  const now = Date.now();
  const room: RoomRecord = {
    code: roomCode,
    createdAt: now,
    updatedAt: now,
    participants: [],
    matchups: [],
    results: [],
    completed: false,
    phase: "collecting",
  };

  inMemoryRooms.set(roomCode, room);
  persistRooms();

  res.status(201).json({ room: toRoomResponse(room) });
});

app.get("/api/v1/rooms/:roomCode", (req: Request, res: Response) => {
  const room = getRoomOrNull(req.params.roomCode);

  if (!room) {
    res.status(404).json({ error: "room_not_found" });
    return;
  }

  res.json({ room: toRoomResponse(room) });
});

app.post("/api/v1/rooms/:roomCode/join", (req: Request, res: Response) => {
  const room = getRoomOrNull(req.params.roomCode);

  if (!room) {
    res.status(404).json({ error: "room_not_found" });
    return;
  }

  const body = (req.body ?? {}) as JoinRoomBody;
  const name = normalizeParticipantName(body.name);

  if (!name) {
    res.status(400).json({ error: "invalid_participant_name" });
    return;
  }

  const participant: Participant = {
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
  });
});

app.get("/api/v1/rooms/:roomCode/session", (req: Request, res: Response) => {
  const room = getRoomOrNull(req.params.roomCode);

  if (!room) {
    res.status(404).json({ error: "room_not_found" });
    return;
  }

  res.json({
    session: toSessionResponse(room),
  });
});

app.post("/api/v1/rooms/:roomCode/results", (req: Request, res: Response) => {
  const room = getRoomOrNull(req.params.roomCode);

  if (!room) {
    res.status(404).json({ error: "room_not_found" });
    return;
  }

  const body = (req.body ?? {}) as SubmitResultBody;
  const matchupId = typeof body.matchupId === "string" ? body.matchupId : "";
  const submittedBy =
    typeof body.submittedBy === "string" ? body.submittedBy : "";
  const winner = typeof body.winner === "string" ? body.winner : "";

  const matchup = room.matchups.find((candidate) => candidate.id === matchupId);

  if (!matchup) {
    res.status(400).json({ error: "invalid_matchup_id" });
    return;
  }

  const participantIds = new Set(room.participants.map((participant) => participant.id));

  if (!participantIds.has(submittedBy)) {
    res.status(400).json({ error: "invalid_submitted_by" });
    return;
  }

  if (!participantIds.has(winner)) {
    res.status(400).json({ error: "invalid_winner" });
    return;
  }

  if (winner !== matchup.p1Id && winner !== matchup.p2Id) {
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

  const result: Result = {
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

function parsePort(rawPort: string | undefined): number {
  const fallbackPort = 3000;

  if (!rawPort) {
    return fallbackPort;
  }

  const parsedPort = Number(rawPort);

  if (!Number.isInteger(parsedPort) || parsedPort <= 0) {
    return fallbackPort;
  }

  return parsedPort;
}

function normalizeRoomCode(roomCode: string | undefined): string | null {
  if (typeof roomCode !== "string") {
    return null;
  }

  const normalized = roomCode.trim().toUpperCase();

  if (!/^[A-Z0-9]{4,12}$/.test(normalized)) {
    return null;
  }

  return normalized;
}

function normalizeParticipantName(name: string | undefined): string | null {
  if (typeof name !== "string") {
    return null;
  }

  const normalized = name.trim();

  if (normalized.length < 1 || normalized.length > 40) {
    return null;
  }

  return normalized;
}

function generateRoomCode(): string {
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

function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function getRoomOrNull(roomCodeParam: string): RoomRecord | null {
  const roomCode = normalizeRoomCode(roomCodeParam);

  if (!roomCode) {
    return null;
  }

  return inMemoryRooms.get(roomCode) ?? null;
}

function recalculateRoom(room: RoomRecord): void {
  room.matchups = buildMatchups(room.participants, room.createdAt);
  room.completed = room.matchups.every((matchup) =>
    room.results.some((result) => result.matchupId === matchup.id),
  );
  room.phase = derivePhase(room);
  room.updatedAt = Date.now();
}

function buildMatchups(
  participants: Participant[],
  createdAt: number,
): Matchup[] {
  const nextMatchups: Matchup[] = [];

  for (let leftIndex = 0; leftIndex < participants.length; leftIndex += 1) {
    for (
      let rightIndex = leftIndex + 1;
      rightIndex < participants.length;
      rightIndex += 1
    ) {
      const leftParticipant = participants[leftIndex];
      const rightParticipant = participants[rightIndex];

      nextMatchups.push({
        id: `m_${leftParticipant.id}_${rightParticipant.id}`,
        p1Id: leftParticipant.id,
        p2Id: rightParticipant.id,
        createdAt,
      });
    }
  }

  return nextMatchups;
}

function derivePhase(room: RoomRecord): RoomPhase {
  if (room.completed && room.matchups.length > 0) {
    return "results";
  }

  if (room.results.length > 0) {
    return "voting";
  }

  if (room.matchups.length > 0) {
    return "ready";
  }

  return "collecting";
}

function toRoomResponse(room: RoomRecord) {
  return {
    code: room.code,
    phase: room.phase,
    createdAt: room.createdAt,
    updatedAt: room.updatedAt,
    participantCount: room.participants.length,
    matchupCount: room.matchups.length,
    resultCount: room.results.length,
    completed: room.completed,
  };
}

function toSessionResponse(room: RoomRecord) {
  return {
    code: room.code,
    phase: room.phase,
    createdAt: room.createdAt,
    updatedAt: room.updatedAt,
    participants: room.participants,
    matchups: room.matchups,
    results: room.results,
    completed: room.completed,
  };
}

function loadPersistedRooms(): void {
  if (!shouldPersistRooms) {
    return;
  }

  const resolvedRoomsFile = path.resolve(roomsFile);

  if (!fs.existsSync(resolvedRoomsFile)) {
    return;
  }

  try {
    const serialized = fs.readFileSync(resolvedRoomsFile, "utf8");
    const parsed = JSON.parse(serialized) as { rooms?: RoomRecord[] };

    for (const room of parsed.rooms ?? []) {
      inMemoryRooms.set(room.code, room);
    }
  } catch (error) {
    console.error("Failed to load rooms file", error);
  }
}

function persistRooms(): void {
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