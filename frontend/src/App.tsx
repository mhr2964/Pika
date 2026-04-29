import React, { useMemo, useState } from 'react';
import { WelcomeSplash } from './screens/onboarding/WelcomeSplash';
import { ActiveRoomScreen } from './screens/room/ActiveRoomScreen';
import { CreateRoomScreen } from './screens/room/CreateRoomScreen';
import { OutcomeScreen } from './screens/room/OutcomeScreen';
import { RoomActivity, RoomOption, RoomParticipant, RoomStage, RoomState } from './types/pika';

const DEFAULT_OPTIONS: RoomOption[] = [
  { id: 'option-1', label: 'Tacos at midnight', votes: 4 },
  { id: 'option-2', label: 'Diner pancakes', votes: 3 },
  { id: 'option-3', label: 'Drive-thru fries', votes: 2 },
];

const DEFAULT_PARTICIPANTS: RoomParticipant[] = [
  { id: 'p-1', name: 'Maya', reaction: 'Already campaigning for tacos.', tone: 'hype' },
  { id: 'p-2', name: 'Jules', reaction: 'Pancakes feel emotionally correct.', tone: 'locked-in' },
  { id: 'p-3', name: 'Dev', reaction: 'Fries are chaos-neutral and I respect that.', tone: 'side-eye' },
];

const DEFAULT_ACTIVITY: RoomActivity[] = [
  { id: 'a-1', actor: 'Maya', message: 'threw early weight behind tacos' },
  { id: 'a-2', actor: 'Jules', message: 'declared pancakes the healing path' },
  { id: 'a-3', actor: 'Dev', message: 'asked whether fries count as a philosophy' },
];

const INITIAL_ROOM: RoomState = {
  code: 'PIKA42',
  prompt: 'Best late-night snack run?',
  hostName: 'Chaos Captain',
  roundLabel: 'Round 1',
  participants: DEFAULT_PARTICIPANTS,
  options: DEFAULT_OPTIONS,
  activity: DEFAULT_ACTIVITY,
  selectedOptionId: null,
  winningOptionId: null,
};

function cloneRoomState(room: RoomState): RoomState {
  return {
    ...room,
    participants: room.participants.map((participant) => ({ ...participant })),
    options: room.options.map((option) => ({ ...option })),
    activity: room.activity.map((item) => ({ ...item })),
  };
}

function getWinningOptionId(options: RoomOption[]): string | null {
  if (options.length === 0) {
    return null;
  }

  const winningOption = [...options].sort((left, right) => right.votes - left.votes)[0];
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

function createEmptyRoom(currentRoom: RoomState): RoomState {
  return {
    ...cloneRoomState(currentRoom),
    options: [],
    participants: [],
    activity: [],
    selectedOptionId: null,
    winningOptionId: null,
  };
}

export default function App() {
  const [stage, setStage] = useState<RoomStage>('welcome');
  const [hostName, setHostName] = useState(INITIAL_ROOM.hostName);
  const [prompt, setPrompt] = useState(INITIAL_ROOM.prompt);
  const [room, setRoom] = useState<RoomState>(cloneRoomState(INITIAL_ROOM));
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isRoomLoading, setIsRoomLoading] = useState(false);
  const [createError] = useState(false);
  const [roomError, setRoomError] = useState(false);

  const canResume = useMemo(() => stage !== 'welcome', [stage]);

  const handleStart = () => {
    setStage('room-setup');
  };

  const handleResume = () => {
    setStage('room-active');
  };

  const handleBackToWelcome = () => {
    setStage('welcome');
  };

  const handleCreateRoom = () => {
    setIsCreatingRoom(true);
    setRoomError(false);

    window.setTimeout(() => {
      const nextRoom = cloneRoomState(INITIAL_ROOM);
      nextRoom.hostName = hostName.trim();
      nextRoom.prompt = prompt.trim();
      nextRoom.code = `PIKA${Math.floor(100 + Math.random() * 900)}`;
      nextRoom.roundLabel = 'Round 1';
      nextRoom.selectedOptionId = null;
      nextRoom.winningOptionId = null;

      setRoom(nextRoom);
      setIsCreatingRoom(false);
      setStage('room-active');
      setIsRoomLoading(true);

      window.setTimeout(() => {
        setIsRoomLoading(false);
      }, 700);
    }, 650);
  };

  const handleSelectOption = (selectedOptionId: string) => {
    setRoomError(false);

    setRoom((currentRoom) => {
      const nextRoom = cloneRoomState(currentRoom);
      nextRoom.selectedOptionId = selectedOptionId;
      nextRoom.winningOptionId = null;

      nextRoom.options = nextRoom.options.map((option) =>
        option.id === selectedOptionId
          ? { ...option, votes: option.votes + 1 }
          : option,
      );

      const selectedOption = nextRoom.options.find((option) => option.id === selectedOptionId);

      if (selectedOption) {
        nextRoom.activity = [
          {
            id: `a-${Date.now()}`,
            actor: nextRoom.hostName,
            message: createReactionMessage(selectedOption.label),
          },
          ...nextRoom.activity,
        ];
      }

      return nextRoom;
    });
  };

  const handleRevealOutcome = () => {
    setRoom((currentRoom) => ({
      ...currentRoom,
      winningOptionId: getWinningOptionId(currentRoom.options),
    }));
    setStage('room-outcome');
  };

  const handlePlayAgain = () => {
    setRoom((currentRoom) => ({
      ...cloneRoomState(currentRoom),
      roundLabel: currentRoom.roundLabel === 'Round 1' ? 'Round 2' : 'Bonus round',
      winningOptionId: null,
      selectedOptionId: null,
      activity: [],
    }));
    setRoomError(false);
    setStage('room-active');
  };

  const handleStartOver = () => {
    setRoom(cloneRoomState(INITIAL_ROOM));
    setHostName(INITIAL_ROOM.hostName);
    setPrompt(INITIAL_ROOM.prompt);
    setRoomError(false);
    setStage('welcome');
  };

  const handleResetRoom = () => {
    setRoom(cloneRoomState(INITIAL_ROOM));
    setRoomError(false);
    setStage('room-setup');
  };

  const handleShowEmptyState = () => {
    setRoom(createEmptyRoom(room));
    setRoomError(false);
  };

  const handleTriggerErrorState = () => {
    setRoomError(true);
  };

  if (stage === 'welcome') {
    return (
      <WelcomeSplash
        onStart={handleStart}
        onResume={handleResume}
        canResume={canResume}
      />
    );
  }

  if (stage === 'room-setup') {
    return (
      <CreateRoomScreen
        hostName={hostName}
        prompt={prompt}
        isSubmitting={isCreatingRoom}
        hasError={createError}
        onHostNameChange={setHostName}
        onPromptChange={setPrompt}
        onCreateRoom={handleCreateRoom}
        onBack={handleBackToWelcome}
      />
    );
  }

  if (stage === 'room-outcome') {
    return (
      <OutcomeScreen
        room={room}
        onPlayAgain={handlePlayAgain}
        onStartOver={handleStartOver}
      />
    );
  }

  return (
    <ActiveRoomScreen
      room={room}
      isLoading={isRoomLoading}
      hasError={roomError}
      onSelectOption={handleSelectOption}
      onRevealOutcome={handleRevealOutcome}
      onResetRoom={handleResetRoom}
      onShowEmptyState={handleShowEmptyState}
      onTriggerErrorState={handleTriggerErrorState}
    />
  );
}