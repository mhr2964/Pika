import { NextRequest, NextResponse } from "next/server";

type RoomSelectionRecord = {
  roomId: string;
  selectedOptionIds: string[];
  updatedAt: string;
};

const selectionStore = new Map<string, RoomSelectionRecord>();

type RouteContext = {
  params: {
    roomId: string;
  };
};

function normalizeRoomId(roomId: string): string {
  return roomId.trim();
}

function sanitizeSelectedOptionIds(value: unknown): string[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const uniqueIds = new Set<string>();

  for (const entry of value) {
    if (typeof entry !== "string") {
      return null;
    }

    const normalizedEntry = entry.trim();

    if (!normalizedEntry) {
      return null;
    }

    uniqueIds.add(normalizedEntry);
  }

  return Array.from(uniqueIds);
}

function buildNotFoundResponse(roomId: string) {
  return NextResponse.json(
    {
      error: {
        code: "ROOM_NOT_FOUND",
        message: `Room "${roomId}" was not found.`,
      },
    },
    { status: 404 },
  );
}

function buildInvalidBodyResponse() {
  return NextResponse.json(
    {
      error: {
        code: "INVALID_SELECTION_PAYLOAD",
        message: "Body must include selectedOptionIds as an array of non-empty strings.",
      },
    },
    { status: 400 },
  );
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const roomId = normalizeRoomId(context.params.roomId);

  if (!roomId) {
    return buildNotFoundResponse(roomId);
  }

  const existingSelection = selectionStore.get(roomId);

  if (!existingSelection) {
    return buildNotFoundResponse(roomId);
  }

  return NextResponse.json({
    roomId: existingSelection.roomId,
    selectedOptionIds: existingSelection.selectedOptionIds,
    updatedAt: existingSelection.updatedAt,
  });
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const roomId = normalizeRoomId(context.params.roomId);

  if (!roomId) {
    return buildNotFoundResponse(roomId);
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return buildInvalidBodyResponse();
  }

  const selectedOptionIds = sanitizeSelectedOptionIds(
    (body as { selectedOptionIds?: unknown })?.selectedOptionIds,
  );

  if (!selectedOptionIds) {
    return buildInvalidBodyResponse();
  }

  const updatedSelection: RoomSelectionRecord = {
    roomId,
    selectedOptionIds,
    updatedAt: new Date().toISOString(),
  };

  selectionStore.set(roomId, updatedSelection);

  return NextResponse.json(updatedSelection, { status: 200 });
}