import { RoomActivity, RoomOption, RoomParticipant, RoomState } from '../types/pika';

type CreateRoomInput = {
  hostName: string;
  prompt: string;
};

type JoinRoomInput = {
  guestName: string;
  roomCode: string;
};

type SelectOptionInput = {
  room: RoomState;
  selectedOptionId: string;
  actorName: string;
};

type UpdateOptionInput = {
  room: RoomState;
  optionId: string;
  label: string;
  actorName: string;
};

type AddOptionInput = {
  room: RoomState;
  label: string;
  actorName: string;
};

type RemoveOptionInput = {
  room: RoomState;
  optionId: string;
  actorName: string;
};

export type RoomClient = {
  createRoom: (input: CreateRoomInput) => Promise<RoomState>;
  joinRoom: (input: JoinRoomInput) => Promise<RoomState>;
  selectOption: (input: SelectOptionInput) => Promise<RoomState>;
  revealOutcome: (room: RoomState) => Promise<RoomState>;
  resetRound: (room: RoomState) => Promise<RoomState>;
  addOption: (input: AddOptionInput) => Promise<RoomState>;
  updateOption: (input: UpdateOptionInput) => Promise<RoomState>;
  removeOption: (input: RemoveOptionInput) => Promise<RoomState>;
};

const MOCK_DELAY_MS = 240;
const ROOM_CODE_LENGTH = 6;
const MIN_NAME_LENGTH = 2;
const MIN_PROMPT_LENGTH = 8;
const MIN_OPTION_LENGTH = 2;

function waitForMockNetwork() {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, MOCK_DELAY_MS);
  });
}

function cloneRoomState(room: RoomState): RoomState {
  return {
    ...room,
    participants: room.participants.map((participant) => ({ ...participant })),
    options: room.options.map((option) => ({ ...option })),
    activity: room.activity.map((item) => ({ ...item })),
  };
}

function normalizeName(value: string) {
  return value.trim();
}

function normalizePrompt(value: string) {
  return value.trim();
}

function normalizeRoomCode(value: string) {
  return value.trim().toUpperCase();
}

function normalizeOptionLabel(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function createActivity(actor: string, message: string): RoomActivity {
  return {
    id: createId('activity'),
    actor,
    message,
  };
}

function createParticipant(name: string): RoomParticipant {
  return {
    id: createId('participant'),
    name,
    reaction: 'just joined and already has opinions.',
    tone: 'hype',
  };
}

function ensureValidName(name: string, fieldLabel: string) {
  if (normalizeName(name).length < MIN_NAME_LENGTH) {
    throw new Error(`${fieldLabel} must be at least ${MIN_NAME_LENGTH} characters.`);
  }
}

function ensureValidPrompt(prompt: string) {
  if (normalizePrompt(prompt).length < MIN_PROMPT_LENGTH) {
    throw new Error(`Prompt must be at least ${MIN_PROMPT_LENGTH} characters.`);
  }
}

function ensureValidRoomCode(roomCode: string) {
  if (normalizeRoomCode(roomCode).length !== ROOM_CODE_LENGTH) {
    throw new Error(`Room code must be ${ROOM_CODE_LENGTH} characters.`);
  }
}

function ensureValidOptionLabel(label: string) {
  if (normalizeOptionLabel(label).length < MIN_OPTION_LENGTH) {
    throw new Error(`Option must be at least ${MIN_OPTION_LENGTH} characters.`);
  }
}

function ensureOptionExists(room: RoomState, optionId: string): RoomOption {
  const option = room.options.find((candidate) => candidate.id === optionId);

  if (!option) {
    throw new Error('That option vanished into the snack void.');
  }

  return option;
}

function buildOutcome(room: RoomState): RoomState {
  if (room.options.length === 0) {
    return {
      ...cloneRoomState(room),
      winningOptionId: null,
      activity: [
        createActivity('Pika', 'opened the reveal curtain and found… no contenders yet.'),
        ...room.activity.map((item) => ({ ...item })),
      ],
    };
  }

  const winningOption = [...room.options].sort((left, right) => right.votes - left.votes)[0];

  return {
    ...cloneRoomState(room),
    winningOptionId: winningOption.id,
    activity: [
      createActivity('Pika', `called it for ${winningOption.label}. confetti, but emotionally precise.`),
      ...room.activity.map((item) => ({ ...item })),
    ],
  };
}

export function createRoomClient(seedRoom: RoomState): RoomClient {
  let currentRoom = cloneRoomState(seedRoom);

  return {
    async createRoom(input) {
      await waitForMockNetwork();

      ensureValidName(input.hostName, 'Host name');
      ensureValidPrompt(input.prompt);

      currentRoom = {
        ...cloneRoomState(currentRoom),
        hostName: normalizeName(input.hostName),
        prompt: normalizePrompt(input.prompt),
        selectedOptionId: null,
        winningOptionId: null,
        activity: [
          createActivity(normalizeName(input.hostName), 'opened a fresh room and set the vibe.'),
          ...currentRoom.activity.map((item) => ({ ...item })),
        ],
      };

      return cloneRoomState(currentRoom);
    },

    async joinRoom(input) {
      await waitForMockNetwork();

      ensureValidName(input.guestName, 'Guest name');
      ensureValidRoomCode(input.roomCode);

      if (normalizeRoomCode(input.roomCode) !== currentRoom.code) {
        throw new Error('That room code is not on the guest list.');
      }

      const guestName = normalizeName(input.guestName);
      const alreadyPresent = currentRoom.participants.some(
        (participant) => participant.name.trim().toLowerCase() === guestName.toLowerCase(),
      );

      currentRoom = {
        ...cloneRoomState(currentRoom),
        participants: alreadyPresent
          ? currentRoom.participants.map((participant) => ({ ...participant }))
          : [...currentRoom.participants.map((participant) => ({ ...participant })), createParticipant(guestName)],
        activity: [
          createActivity(guestName, 'slid into the room with main-character energy.'),
          ...currentRoom.activity.map((item) => ({ ...item })),
        ],
      };

      return cloneRoomState(currentRoom);
    },

    async selectOption(input) {
      await waitForMockNetwork();

      const room = cloneRoomState(input.room);
      const option = ensureOptionExists(room, input.selectedOptionId);
      const actorName = normalizeName(input.actorName) || 'Someone';

      currentRoom = {
        ...room,
        selectedOptionId: option.id,
        options: room.options.map((candidate) => ({
          ...candidate,
          votes:
            candidate.id === option.id
              ? candidate.votes + (room.selectedOptionId === option.id ? 0 : 1)
              : candidate.votes,
        })),
        activity: [
          createActivity(actorName, `backed ${option.label} like it owed them rent.`),
          ...room.activity.map((item) => ({ ...item })),
        ],
      };

      return cloneRoomState(currentRoom);
    },

    async revealOutcome(room) {
      await waitForMockNetwork();
      currentRoom = buildOutcome(room);
      return cloneRoomState(currentRoom);
    },

    async resetRound(room) {
      await waitForMockNetwork();

      currentRoom = {
        ...cloneRoomState(room),
        roundLabel: room.roundLabel === 'Round 1' ? 'Round 2' : `${room.roundLabel} + remix`,
        selectedOptionId: null,
        winningOptionId: null,
        options: room.options.map((option) => ({ ...option, votes: 0 })),
        activity: [createActivity('Pika', 'reset the bracket and kept the chaos polished.')],
      };

      return cloneRoomState(currentRoom);
    },

    async addOption(input) {
      await waitForMockNetwork();

      const room = cloneRoomState(input.room);
      const label = normalizeOptionLabel(input.label);
      const actorName = normalizeName(input.actorName) || 'Someone';
      ensureValidOptionLabel(label);

      currentRoom = {
        ...room,
        options: [...room.options, { id: createId('option'), label, votes: 0 }],
        activity: [
          createActivity(actorName, `added ${label} to the board. bold, maybe brilliant.`),
          ...room.activity.map((item) => ({ ...item })),
        ],
      };

      return cloneRoomState(currentRoom);
    },

    async updateOption(input) {
      await waitForMockNetwork();

      const room = cloneRoomState(input.room);
      const label = normalizeOptionLabel(input.label);
      const actorName = normalizeName(input.actorName) || 'Someone';
      ensureValidOptionLabel(label);
      ensureOptionExists(room, input.optionId);

      currentRoom = {
        ...room,
        options: room.options.map((option) =>
          option.id === input.optionId ? { ...option, label } : { ...option },
        ),
        activity: [
          createActivity(actorName, `renamed an option to ${label}. the plot tightened.`),
          ...room.activity.map((item) => ({ ...item })),
        ],
      };

      return cloneRoomState(currentRoom);
    },

    async removeOption(input) {
      await waitForMockNetwork();

      const room = cloneRoomState(input.room);
      const actorName = normalizeName(input.actorName) || 'Someone';
      const removedOption = ensureOptionExists(room, input.optionId);

      currentRoom = {
        ...room,
        selectedOptionId: room.selectedOptionId === input.optionId ? null : room.selectedOptionId,
        options: room.options.filter((option) => option.id !== input.optionId).map((option) => ({ ...option })),
        activity: [
          createActivity(actorName, `cut ${removedOption.label} from the lineup. ruthless, tidy, iconic.`),
          ...room.activity.map((item) => ({ ...item })),
        ],
      };

      return cloneRoomState(currentRoom);
    },
  };
}