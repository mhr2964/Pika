import { RoomState } from '../types/pika';

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

function delay(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
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

function getWinningOptionId(room: RoomState): string | null {
  if (room.options.length === 0) {
    return null;
  }

  const [winningOption] = [...room.options].sort((left, right) => right.votes - left.votes);
  return winningOption ? winningOption.id : null;
}

function createReactionMessage(optionLabel: string) {
  const reactionMessages = [
    `just made a hard push for ${optionLabel}`,
    `said ${optionLabel} has the best room energy`,
    `dropped a dramatic vote for ${optionLabel}`,
  ];

  return reactionMessages[Math.floor(Math.random() * reactionMessages.length)];
}

export function createRoomClient(seedRoom: RoomState) {
  let currentRoom = cloneRoomState(seedRoom);

  return {
    async createRoom(input: CreateRoomInput): Promise<RoomState> {
      await delay(500);

      if (!input.hostName || !input.prompt) {
        throw new Error('Missing room setup fields.');
      }

      currentRoom = {
        ...cloneRoomState(currentRoom),
        code: `PIKA${Math.floor(100 + Math.random() * 900)}`,
        hostName: input.hostName,
        prompt: input.prompt,
        roundLabel: 'Round 1',
        selectedOptionId: null,
        winningOptionId: null,
      };

      return cloneRoomState(currentRoom);
    },

    async joinRoom(input: JoinRoomInput): Promise<RoomState> {
      await delay(450);

      if (input.roomCode.length < 4 || !input.guestName) {
        throw new Error('Invalid join details.');
      }

      const joinedRoom = cloneRoomState(currentRoom);
      joinedRoom.code = input.roomCode;
      joinedRoom.participants = [
        {
          id: `guest-${input.guestName.toLowerCase().replace(/\s+/g, '-')}`,
          name: input.guestName,
          reaction: 'Just arrived and already evaluating the room temperature.',
          tone: 'locked-in',
        },
        ...joinedRoom.participants,
      ];
      joinedRoom.activity = [
        {
          id: `joined-${input.roomCode}-${input.guestName}`,
          actor: input.guestName,
          message: 'joined the room and immediately started reading the vibe',
        },
        ...joinedRoom.activity,
      ];

      currentRoom = joinedRoom;
      return cloneRoomState(currentRoom);
    },

    async selectOption(input: SelectOptionInput): Promise<RoomState> {
      await delay(180);

      const nextRoom = cloneRoomState(input.room);
      nextRoom.selectedOptionId = input.selectedOptionId;
      nextRoom.winningOptionId = null;
      nextRoom.options = nextRoom.options.map((option) =>
        option.id === input.selectedOptionId
          ? { ...option, votes: option.votes + 1 }
          : option,
      );

      const selectedOption = nextRoom.options.find(
        (option) => option.id === input.selectedOptionId,
      );

      if (selectedOption) {
        nextRoom.activity = [
          {
            id: `activity-${Date.now()}`,
            actor: input.actorName,
            message: createReactionMessage(selectedOption.label),
          },
          ...nextRoom.activity,
        ];
      }

      currentRoom = nextRoom;
      return cloneRoomState(currentRoom);
    },

    async revealOutcome(room: RoomState): Promise<RoomState> {
      await delay(250);

      const nextRoom = cloneRoomState(room);
      nextRoom.winningOptionId = getWinningOptionId(nextRoom);
      currentRoom = nextRoom;
      return cloneRoomState(currentRoom);
    },

    async resetRound(room: RoomState): Promise<RoomState> {
      await delay(300);

      const nextRoom = cloneRoomState(room);
      nextRoom.roundLabel = room.roundLabel === 'Round 1' ? 'Round 2' : 'Bonus round';
      nextRoom.selectedOptionId = null;
      nextRoom.winningOptionId = null;
      nextRoom.activity = [];
      currentRoom = nextRoom;
      return cloneRoomState(currentRoom);
    },
  };
}