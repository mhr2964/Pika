const baseUrl = process.env.SMOKE_BASE_URL || "http://127.0.0.1:3001";

async function main() {
  const healthResponse = await fetch(`${baseUrl}/api/v1/health`);
  assertOk(healthResponse, "health");
  const healthPayload = await healthResponse.json();

  if (healthPayload.ok !== true) {
    throw new Error("health payload missing ok=true");
  }

  const createRoomResponse = await fetch(`${baseUrl}/api/v1/rooms`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({}),
  });
  assertOk(createRoomResponse, "create room");
  const createRoomPayload = await createRoomResponse.json();

  if (!createRoomPayload.room || !createRoomPayload.room.code) {
    throw new Error("create room payload missing room.code");
  }

  const roomCode = createRoomPayload.room.code;

  const getRoomResponse = await fetch(`${baseUrl}/api/v1/rooms/${roomCode}`);
  assertOk(getRoomResponse, "get room");
  const getRoomPayload = await getRoomResponse.json();

  if (getRoomPayload.room.code !== roomCode) {
    throw new Error("get room payload returned unexpected code");
  }

  const joinRoomResponse = await fetch(`${baseUrl}/api/v1/rooms/${roomCode}/join`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ name: "Smoke Tester" }),
  });
  assertOk(joinRoomResponse, "join room");
  const joinRoomPayload = await joinRoomResponse.json();

  if (!joinRoomPayload.participant || !joinRoomPayload.participant.id) {
    throw new Error("join room payload missing participant.id");
  }

  const sessionResponse = await fetch(`${baseUrl}/api/v1/rooms/${roomCode}/session`);
  assertOk(sessionResponse, "room session");
  const sessionPayload = await sessionResponse.json();

  if (!sessionPayload.session || sessionPayload.session.code !== roomCode) {
    throw new Error("session payload missing expected room code");
  }

  console.log("Smoke test passed", {
    roomCode,
    participantId: joinRoomPayload.participant.id,
    healthOk: healthPayload.ok,
  });
}

function assertOk(response, label) {
  if (!response.ok) {
    throw new Error(`${label} request failed with status ${response.status}`);
  }
}

main().catch((error) => {
  console.error("Smoke test failed:", error);
  process.exit(1);
});