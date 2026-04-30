import dotenv from "dotenv";
import express, { type Request, type Response } from "express";
import fs from "fs";
import path from "path";

dotenv.config();

type RoomStatus = "collecting_options" | "in_progress" | "completed";
type MatchupStatus = "pending" | "resolved";

interface Actor {
  session_id: string;
  user_id: string | null;
}

interface RoomOption {
  id: string;
  label: string;
  created_at: string;
  created_by_session_id: string;
  created_by_user_id: string | null;
}

interface MatchupRecord {
  id: string;
  room_id: string;
  left_option_id: string;
  right_option_id: string;
  order: number;
  status: MatchupStatus;
  chosen_option_id: string | null;
  chosen_by_session_id: string | null;
  chosen_by_user_id: string | null;
  created_at: string;
  resolved_at: string | null;
}

interface ResultEntry {
  option_id: string;
  label: string;
  wins: number;
  losses: number;
  score: number;
  rank: number;
}

interface RoomRecord {
  id: string;
  status: RoomStatus;
  created_at: string;
  updated_at: string;
  created_by_session_id: string;
  created_by_user_id: string | null;
  options: RoomOption[];
  matchups: MatchupRecord[];
  active_matchup_id: string | null;
  started_at: string | null;
  completed_at: string | null;
  results: ResultEntry[] | null;
}

interface CreateRoomBody {
  room_id?: string;
}

interface AddOptionBody {
  label?: string;
}

const app = express();
app.use(express.json());

const port = parsePort(process.env.PORT);
const shouldPersistRooms = process.env.PERSIST_ROOMS === "true";
const roomsFile = process.env.ROOMS_FILE || "./data/rooms-v1.json";
const inMemoryRooms = new Map<string, RoomRecord>();

loadPersistedRooms();

app.get("/api/v1/health", (_req: Request, res: Response) => {
  res.json({
    ok: true,
    data: {
      service: "pika-backend",
      version: "v1",
      timestamp: new Date().toISOString(),
    },
  });
});

app.post("/api/v1/rooms", (req: Request, res: Response) => {
  const actor = getActor(req);
  const requestedRoomId = normalizeId(req.body?.room_id);

  const roomId = requestedRoomId || generateId("room");

  if (inMemoryRooms.has(roomId)) {
    return sendError(res, 409, "room_conflict", "Room already exists");
  }

  const now = nowIso();
  const room: RoomRecord = {
    id: roomId,
    status: "collecting_options",
    created_at: now,
    updated_at: now,
    created_by_session_id: actor.session_id,
    created_by_user_id: actor.user_id,
    options: [],
    matchups: [],
    active_matchup_id: null,
    started_at: null,
    completed_at: null,
    results: null,
  };

  inMemoryRooms.set(room.id, room);
  persistRooms();
  setSessionHeader(res, actor.session_id);

  return res.status(201).json({
    ok: true,
    data: {
      room: toRoomSummary(room),
      actor,
    },
  });
});

app.get("/api/v1/rooms/:id", (req: Request, res: Response) => {
  const actor = getActor(req);
  const room = getRoomOrNull(req.params.id);

  if (!room) {
    return sendError(res, 404, "room_not_found", "Room not found");
  }

  setSessionHeader(res, actor.session_id);

  return res.json({
    ok: true,
    data: {
      room: toRoomDetail(room),
      actor,
    },
  });
});

app.post("/api/v1/rooms/:id/options", (req: Request, res: Response) => {
  const actor = getActor(req);
  const room = getRoomOrNull(req.params.id);

  if (!room) {
    return sendError(res, 404, "room_not_found", "Room not found");
  }

  if (room.status !== "collecting_options") {
    return sendError(
      res,
      409,
      "room_not_collecting",
      "Options can only be added before matchups start",
    );
  }

  const label = normalizeOptionLabel((req.body ?? {}).label);

  if (!label) {
    return sendError(res, 400, "invalid_option_label", "Option label is required");
  }

  const duplicate = room.options.find(
    (option) => option.label.toLowerCase() === label.toLowerCase(),
  );

  if (duplicate) {
    return sendError(res, 409, "duplicate_option", "Option already exists");
  }

  const option: RoomOption = {
    id: generateId("opt"),
    label,
    created_at: nowIso(),
    created_by_session_id: actor.session_id,
    created_by_user_id: actor.user_id,
  };

  room.options.push(option);
  touchRoom(room);
  persistRooms();
  setSessionHeader(res, actor.session_id);

  return res.status(201).json({
    ok: true,
    data: {
      room_id: room.id,
      status: room.status,
      option,
      option_count: room.options.length,
    },
  });
});

app.post("/api/v1/rooms/:id/matchups/start", (req: Request, res: Response) => {
  const actor = getActor(req);
  const room = getRoomOrNull(req.params.id);

  if (!room) {
    return sendError(res, 404, "room_not_found", "Room not found");
  }

  if (room.status !== "collecting_options") {
    return sendError(res, 409, "matchups_already_started", "Matchups already started");
  }

  if (room.options.length < 2) {
    return sendError(
      res,
      400,
      "insufficient_options",
      "At least two options are required to start matchups",
    );
  }

  const matchups = buildMatchups(room.id, room.options);

  room.matchups = matchups;
  room.active_matchup_id = matchups[0]?.id ?? null;
  room.status = matchups.length > 0 ? "in_progress" : "completed";
  room.started_at = nowIso();
  room.completed_at = matchups.length > 0 ? null : nowIso();
  room.results = matchups.length > 0 ? null : buildResults(room);
  touchRoom(room);
  persistRooms();
  setSessionHeader(res, actor.session_id);

  return res.status(201).json({
    ok: true,
    data: {
      room_id: room.id,
      status: room.status,
      active_matchup_id: room.active_matchup_id,
      matchup_count: room.matchups.length,
      next_matchup: getActiveMatchup(room),
    },
  });
});

app.post(
  "/api/v1/rooms/:id/matchups/:matchupId/choose",
  (req: Request, res: Response) => {
    const actor = getActor(req);
    const room = getRoomOrNull(req.params.id);

    if (!room) {
      return sendError(res, 404, "room_not_found", "Room not found");
    }

    if (room.status !== "in_progress") {
      return sendError(res, 409, "room_not_in_progress", "Room is not in progress");
    }

    const matchup = room.matchups.find(
      (candidate) => candidate.id === req.params.matchupId,
    );

    if (!matchup) {
      return sendError(res, 404, "matchup_not_found", "Matchup not found");
    }

    if (matchup.status === "resolved") {
      return sendError(res, 409, "matchup_already_resolved", "Matchup already resolved");
    }

    if (room.active_matchup_id !== matchup.id) {
      return sendError(res, 409, "matchup_not_active", "Matchup is not active");
    }

    const chosenOptionId = normalizeId((req.body ?? {}).chosen_option_id);

    if (!chosenOptionId) {
      return sendError(
        res,
        400,
        "invalid_chosen_option_id",
        "chosen_option_id is required",
      );
    }

    if (
      chosenOptionId !== matchup.left_option_id &&
      chosenOptionId !== matchup.right_option_id
    ) {
      return sendError(
        res,
        400,
        "chosen_option_not_in_matchup",
        "Chosen option must belong to the matchup",
      );
    }

    matchup.status = "resolved";
    matchup.chosen_option_id = chosenOptionId;
    matchup.chosen_by_session_id = actor.session_id;
    matchup.chosen_by_user_id = actor.user_id;
    matchup.resolved_at = nowIso();

    const nextPending = room.matchups.find((candidate) => candidate.status === "pending");
    room.active_matchup_id = nextPending?.id ?? null;

    if (!room.active_matchup_id) {
      room.status = "completed";
      room.completed_at = nowIso();
      room.results = buildResults(room);
    }

    touchRoom(room);
    persistRooms();
    setSessionHeader(res, actor.session_id);

    return res.status(201).json({
      ok: true,
      data: {
        room_id: room.id,
        status: room.status,
        resolved_matchup: toMatchupResponse(matchup, room),
        next_matchup: getActiveMatchup(room),
        results_ready: room.status === "completed",
      },
    });
  },
);

app.get("/api/v1/rooms/:id/results", (req: Request, res: Response) => {
  const actor = getActor(req);
  const room = getRoomOrNull(req.params.id);

  if (!room) {
    return sendError(res, 404, "room_not_found", "Room not found");
  }

  setSessionHeader(res, actor.session_id);

  return res.json({
    ok: true,
    data: {
      room_id: room.id,
      status: room.status,
      results: room.results ?? [],
      active_matchup_id: room.active_matchup_id,
      completed_at: room.completed_at,
    },
  });
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});

function parsePort(rawPort: string | undefined): number {
  const fallbackPort = 3000;
  const parsedPort = Number(rawPort);
  if (!rawPort || !Number.isInteger(parsedPort) || parsedPort <= 0) {
    return fallbackPort;
  }
  return parsedPort;
}

function getActor(req: Request): Actor {
  const headerSessionId = normalizeId(req.header("x-session-id") ?? undefined);
  const authUserId = normalizeUserId(req.header("x-user-id") ?? undefined);

  return {
    session_id: headerSessionId || generateId("sess"),
    user_id: authUserId,
  };
}

function setSessionHeader(res: Response, sessionId: string): void {
  res.setHeader("x-session-id", sessionId);
}

function nowIso(): string {
  return new Date().toISOString();
}

function normalizeId(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  if (!/^[a-z0-9_-]{3,64}$/.test(normalized)) {
    return null;
  }

  return normalized;
}

function normalizeUserId(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function normalizeOptionLabel(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  if (normalized.length < 1 || normalized.length > 120) {
    return null;
  }
  return normalized;
}

function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`.toLowerCase();
}

function getRoomOrNull(roomIdParam: string): RoomRecord | null {
  const roomId = normalizeId(roomIdParam);
  if (!roomId) {
    return null;
  }
  return inMemoryRooms.get(roomId) ?? null;
}

function buildMatchups(roomId: string, options: RoomOption[]): MatchupRecord[] {
  const matchups: MatchupRecord[] = [];
  let order = 1;

  for (let leftIndex = 0; leftIndex < options.length; leftIndex += 1) {
    for (
      let rightIndex = leftIndex + 1;
      rightIndex < options.length;
      rightIndex += 1
    ) {
      const left = options[leftIndex];
      const right = options[rightIndex];
      matchups.push({
        id: `${roomId}_m_${String(order).padStart(3, "0")}`,
        room_id: roomId,
        left_option_id: left.id,
        right_option_id: right.id,
        order,
        status: "pending",
        chosen_option_id: null,
        chosen_by_session_id: null,
        chosen_by_user_id: null,
        created_at: nowIso(),
        resolved_at: null,
      });
      order += 1;
    }
  }

  return matchups;
}

function buildResults(room: RoomRecord): ResultEntry[] {
  const tally = new Map<string, { wins: number; losses: number; label: string }>();

  for (const option of room.options) {
    tally.set(option.id, { wins: 0, losses: 0, label: option.label });
  }

  for (const matchup of room.matchups) {
    if (matchup.status !== "resolved" || !matchup.chosen_option_id) {
      continue;
    }

    const winner = matchup.chosen_option_id;
    const loser =
      winner === matchup.left_option_id
        ? matchup.right_option_id
        : matchup.left_option_id;

    const winnerEntry = tally.get(winner);
    const loserEntry = tally.get(loser);

    if (winnerEntry) {
      winnerEntry.wins += 1;
    }

    if (loserEntry) {
      loserEntry.losses += 1;
    }
  }

  const ranked = Array.from(tally.entries()).map(([option_id, entry]) => ({
    option_id,
    label: entry.label,
    wins: entry.wins,
    losses:
entry.wins - entry.losses,
    }));

  ranked.sort((left, right) => {
    if (right.score !== left.score) {
      return right.score - left.score;
    }

    if (right.wins !== left.wins) {
      return right.wins - left.wins;
    }

    return left.label.localeCompare(right.label);
  });

  return ranked.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
}

function getActiveMatchup(room: RoomRecord) {
  const matchup = room.matchups.find(
    (candidate) => candidate.id === room.active_matchup_id,
  );

  return matchup ? toMatchupResponse(matchup, room) : null;
}

function toRoomSummary(room: RoomRecord) {
  return {
    id: room.id,
    status: room.status,
    created_at: room.created_at,
    updated_at: room.updated_at,
    option_count: room.options.length,
    matchup_count: room.matchups.length,
    resolved_matchup_count: room.matchups.filter((matchup) => matchup.status === "resolved")
      .length,
    active_matchup_id: room.active_matchup_id,
    completed_at: room.completed_at,
  };
}

function toRoomDetail(room: RoomRecord) {
  return {
    ...toRoomSummary(room),
    created_by_session_id: room.created_by_session_id,
    created_by_user_id: room.created_by_user_id,
    started_at: room.started_at,
    options: room.options,
    current_matchup: getActiveMatchup(room),
  };
}

function toMatchupResponse(matchup: MatchupRecord, room: RoomRecord) {
  const left = room.options.find((option) => option.id === matchup.left_option_id) ?? null;
  const right =
    room.options.find((option) => option.id === matchup.right_option_id) ?? null;

  return {
    id: matchup.id,
    room_id: matchup.room_id,
    order: matchup.order,
    status: matchup.status,
    chosen_option_id: matchup.chosen_option_id,
    created_at: matchup.created_at,
    resolved_at: matchup.resolved_at,
    left_option: left,
    right_option: right,
  };
}

function touchRoom(room: RoomRecord): void {
  room.updated_at = nowIso();
}

function sendError(
  res: Response,
  status: number,
  code: string,
  message: string,
): Response {
  return res.status(status).json({
    ok: false,
    error: {
      code,
      message,
    },
  });
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
      inMemoryRooms.set(room.id, room);
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