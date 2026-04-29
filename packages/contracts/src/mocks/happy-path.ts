import type {
  AdvanceMatchupResponse,
  CreateRoomResponse,
  JoinRoomResponse,
  SubmitMatchupChoiceResponse,
  SubmitOptionsResponse,
  SynthesizeResultsResponse,
} from '../index';

export const createRoomHappyPath: CreateRoomResponse = {
  sessionPlayerId: 'player-host-1',
  room: {
    id: 'room-1',
    code: 'PIKA42',
    status: 'lobby',
    hostPlayerId: 'player-host-1',
    createdAt: '2026-04-29T21:00:00.000Z',
    players: [
      {
        id: 'player-host-1',
        displayName: 'Mina',
        role: 'host',
        presence: 'active',
        joinedAt: '2026-04-29T21:00:00.000Z',
        isReady: true,
      },
    ],
    options: [],
  },
};

export const joinRoomHappyPath: JoinRoomResponse = {
  sessionPlayerId: 'player-2',
  room: {
    ...createRoomHappyPath.room,
    players: [
      ...createRoomHappyPath.room.players,
      {
        id: 'player-2',
        displayName: 'Jules',
        role: 'participant',
        presence: 'active',
        joinedAt: '2026-04-29T21:01:00.000Z',
        isReady: true,
      },
    ],
  },
};

export const submitOptionsHappyPath: SubmitOptionsResponse = {
  acceptedOptions: [
    {
      id: 'option-1',
      label: 'Tacos',
      createdByPlayerId: 'player-host-1',
      createdAt: '2026-04-29T21:02:00.000Z',
    },
    {
      id: 'option-2',
      label: 'Sushi',
      createdByPlayerId: 'player-2',
      createdAt: '2026-04-29T21:02:10.000Z',
    },
  ],
  room: {
    ...joinRoomHappyPath.room,
    status: 'matchupInProgress',
    options: [
      {
        id: 'option-1',
        label: 'Tacos',
        createdByPlayerId: 'player-host-1',
        createdAt: '2026-04-29T21:02:00.000Z',
      },
      {
        id: 'option-2',
        label: 'Sushi',
        createdByPlayerId: 'player-2',
        createdAt: '2026-04-29T21:02:10.000Z',
      },
    ],
    currentMatchup: {
      id: 'matchup-1',
      roundNumber: 1,
      optionIds: ['option-1', 'option-2'],
      status: 'active',
      startedAt: '2026-04-29T21:03:00.000Z',
    },
    roundState: {
      currentRoundNumber: 1,
      activeMatchupId: 'matchup-1',
      completedMatchupIds: [],
      remainingOptionIds: ['option-1', 'option-2'],
      waitingOnPlayerIds: ['player-host-1', 'player-2'],
    },
  },
};

export const submitMatchupChoiceHappyPath: SubmitMatchupChoiceResponse = {
  room: {
    ...submitOptionsHappyPath.room,
    currentMatchup: {
      id: 'matchup-1',
      roundNumber: 1,
      optionIds: ['option-1', 'option-2'],
      status: 'resolved',
      startedAt: '2026-04-29T21:03:00.000Z',
      resolvedAt: '2026-04-29T21:03:30.000Z',
      winningOptionId: 'option-2',
      tallies: [
        { optionId: 'option-1', voteCount: 0 },
        { optionId: 'option-2', voteCount: 2 },
      ],
    },
    roundState: {
      currentRoundNumber: 1,
      activeMatchupId: 'matchup-1',
      completedMatchupIds: ['matchup-1'],
      remainingOptionIds: ['option-2'],
      waitingOnPlayerIds: [],
    },
  },
  matchup: {
    id: 'matchup-1',
    roundNumber: 1,
    optionIds: ['option-1', 'option-2'],
    status: 'resolved',
    startedAt: '2026-04-29T21:03:00.000Z',
    resolvedAt: '2026-04-29T21:03:30.000Z',
    winningOptionId: 'option-2',
    tallies: [
      { optionId: 'option-1', voteCount: 0 },
      { optionId: 'option-2', voteCount: 2 },
    ],
  },
};

export const advanceMatchupHappyPath: AdvanceMatchupResponse = {
  room: {
    ...submitMatchupChoiceHappyPath.room,
    status: 'synthesizingResults',
  },
  results: {
    roomId: 'room-1',
    status: 'ready',
    winnerOptionId: 'option-2',
    generatedAt: '2026-04-29T21:03:45.000Z',
    rankings: [
      { optionId: 'option-2', label: 'Sushi', rank: 1, score: 1 },
      { optionId: 'option-1', label: 'Tacos', rank: 2, score: 0 },
    ],
  },
};

export const synthesizeResultsHappyPath: SynthesizeResultsResponse = {
  room: {
    ...advanceMatchupHappyPath.room,
    status: 'completed',
    results: advanceMatchupHappyPath.results,
  },
  results: advanceMatchupHappyPath.results!,
};