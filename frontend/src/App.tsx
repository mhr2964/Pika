import React, { useMemo, useState } from 'react';
import { WelcomeSplash } from './screens/onboarding/WelcomeSplash';
import { ActiveRoomScreen } from './screens/room/ActiveRoomScreen';
import { CreateRoomScreen } from './screens/room/CreateRoomScreen';
import { JoinRoomScreen } from './screens/room/JoinRoomScreen';
import { LobbyScreen } from './screens/room/LobbyScreen';
import { OutcomeScreen } from './screens/room/OutcomeScreen';
import { createRoomClient } from './lib/roomClient';
import {
  RoomActivity,
  RoomOption,
  RoomParticipant,
  RoomStage,
  RoomState,
} from './types/pika';

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

export default function App() {
  const roomClient = useMemo(() => createRoomClient(cloneRoomState(INITIAL_ROOM)), []);
  const [stage, setStage] = useState<RoomStage>('welcome');
  const [hostName, setHostName] = useState(INITIAL_ROOM.hostName);
  const [prompt, setPrompt] = useState(INITIAL_ROOM.prompt);
  const [guestName, setGuestName] = useState('Snack Scout');
  const [roomCode, setRoomCode] = useState(INITIAL_ROOM.code);
  const [room, setRoom] = useState<RoomState>(cloneRoomState(INITIAL_ROOM));
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);
  const [isLobbyLoading, setIsLobbyLoading] = useState(false);
  const [isRoomLoading, setIsRoomLoading] = useState(false);
  const [createError, setCreateError] = useState(false);
  const [joinError, setJoinError] = useState(false);
  const [lobbyError] = useState(false);
  const [roomError, setRoomError] = useState(false);

  const canResume = stage !== 'welcome';
  const viewerName = stage === 'room-lobby' ? guestName : hostName;

  const handleStart = () => {
    setStage('room-setup');
  };

  const handleResume = () => {
    if (!canResume) {
      setStage('room-setup');
      return;
    }

    setStage('room-active');
  };

  const handleBackToWelcome = () => {
    setCreateError(false);
    setJoinError(false);
    setRoomError(false);
    setStage('welcome');
  };

  const handleGoToCreateRoom = () => {
    setJoinError(false);
    setStage('room-setup');
  };

  const handleGoToJoinRoom = () => {
    setCreateError(false);
    setStage('room-join');
  };

  const handleCreateRoom = async () => {
    try {
      setCreateError(false);
      setIsCreatingRoom(true);
      const nextRoom = await roomClient.createRoom({
        hostName: hostName.trim(),
        prompt: prompt.trim(),
      });
      setRoom(nextRoom);
      setStage('room-active');
      setIsRoomLoading(true);
      window.setTimeout(() => setIsRoomLoading(false), 600);
    } catch {
      setCreateError(true);
    } finally {
      setIsCreatingRoom(false);
    }
  };

  const handleJoinRoom = async () => {
    try {
      setJoinError(false);
      setIsJoiningRoom(true);
      const joinedRoom = await roomClient.joinRoom({
        guestName: guestName.trim(),
        roomCode: roomCode.trim().toUpperCase(),
      });
      setRoom(joinedRoom);
      setStage('room-lobby');
      setIsLobbyLoading(true);
      window.setTimeout(() => setIsLobbyLoading(false), 600);
    } catch {
      setJoinError(true);
    } finally {
      setIsJoiningRoom(false);
    }
  };

  const handleStartVoting = () => {
    setIsRoomLoading(true);
    setStage('room-active');
    window.setTimeout(() => setIsRoomLoading(false), 450);
  };

  const handleSelectOption = async (selectedOptionId: string) => {
    try {
      setRoomError(false);
      const nextRoom = await roomClient.selectOption({
        room,
        selectedOptionId,
        actorName: viewerName,
      });
      setRoom(nextRoom);
    } catch {
      setRoomError(true);
    }
  };

  const handleRevealOutcome = async () => {
    try {
      setRoomError(false);
      const nextRoom = await roomClient.revealOutcome(room);
      setRoom(nextRoom);
      setStage('room-outcome');
    } catch {
      setRoomError(true);
    }
  };

  const handlePlayAgain = async () => {
    const nextRoom = await roomClient.resetRound(room);
    setRoom(nextRoom);
    setStage('room-active');
  };

  const handleStartOver = () => {
    setHostName(INITIAL_ROOM.hostName);
    setPrompt(INITIAL_ROOM.prompt);
    setGuestName('Snack Scout');
    setRoomCode(INITIAL_ROOM.code);
    setRoom(cloneRoomState(INITIAL_ROOM));
    setCreateError(false);
    setJoinError(false);
    setRoomError(false);
    setStage('welcome');
  };

  if (stage === 'welcome') {
    return (
      <WelcomeSplash
        canResume={canResume}
        onStart={handleStart}
        onResume={handleResume}
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
        onGoToJoinRoom={handleGoToJoinRoom}
      />
    );
  }

  if (stage === 'room-join') {
    return (
      <JoinRoomScreen
        guestName={guestName}
        roomCode={roomCode}
        isSubmitting={isJoiningRoom}
        hasError={joinError}
        onGuestNameChange={setGuestName}
        onRoomCodeChange={setRoomCode}
        onJoinRoom={handleJoinRoom}
        onBack={handleBackToWelcome}
        onGoToCreateRoom={handleGoToCreateRoom}
      />
    );
  }

  if (stage === 'room-lobby') {
    return (
      <LobbyScreen
        room={room}
        viewerName={guestName}
        isLoading={isLobbyLoading}
        hasError={lobbyError}
        onStartVoting={handleStartVoting}
        onBackToWelcome={handleBackToWelcome}
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
      onResetRoom={handleStartOver}
    />
  );
}