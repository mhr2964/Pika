import { useEffect, useMemo, useState } from 'react';
import './styles.css';

type RoomLifecycleState = 'waiting' | 'collecting_options' | 'active' | 'completed';

type Participant = {
  id: string;
  name: string;
  isYou?: boolean;
};

type RoomOption = {
  id: string;
  label: string;
  addedBy: string;
};

type Matchup = {
  id: string;
  leftOptionId: string;
  rightOptionId: string;
  roundLabel: string;
};

type Room = {
  id: string;
  code: string;
  name: string;
  lifecycleState: RoomLifecycleState;
  participants: Participant[];
  options: RoomOption[];
  currentMatchupIndex: number;
  selectedWinnerIds: string[];
};

type RoomResults = {
  winner: RoomOption | null;
  shareText: string;
};

type RoomAdapter = {
  createRoom(input: { displayName: string }): Room;
  joinRoom(input: { roomCode: string; displayName: string }): Room;
  addOption(input: { roomId: string; label: string }): Room;
  updateOption(input: { roomId: string; optionId: string; label: string }): Room;
  removeOption(input: { roomId: string; optionId: string }): Room;
  startRoom(input: { roomId: string }): Room;
  getCurrentMatchup(input: { roomId: string }): Matchup | null;
  submitChoice(input: { roomId: string; winnerOptionId: string }): Room;
  getResults(input: { roomId: string }): RoomResults;
};

type EntryMode = 'join' | 'create';

type SelectionFeedback = {
  winnerLabel: string;
  isFinalChoice: boolean;
};

type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

type MatchupState = {
  status: AsyncStatus;
  matchup: Matchup | null;
  errorMessage: string | null;
};

type ResultsState = {
  status: AsyncStatus;
  results: RoomResults | null;
  errorMessage: string | null;
};

const ROOM_NAME = 'Friday Night Pick';
const DEFAULT_ROOM_CODE = 'PIKA42';
const MATCHUP_LOADING_COPY = 'Loading the next tiny showdown…';
const RESULTS_LOADING_COPY = 'Locking the winner and staging the reveal…';

const SEEDED_PARTICIPANTS: Participant[] = [
  { id: 'mia', name: 'Mia' },
  { id: 'leo', name: 'Leo' },
];

const SEEDED_OPTIONS: RoomOption[] = [
  { id: 'opt-1', label: 'Sushi train', addedBy: 'You' },
  { id: 'opt-2', label: 'Karaoke room', addedBy: 'Mia' },
  { id: 'opt-3', label: 'Rooftop tacos', addedBy: 'Leo' },
  { id: 'opt-4', label: 'Late-night gelato', addedBy: 'You' },
];

const roomStore: Record<string, Room> = {};

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function getOptionById(options: RoomOption[], optionId: string) {
  return options.find((option) => option.id === optionId) ?? null;
}

function buildMatchups(options: RoomOption[]): Matchup[] {
  const matchups: Matchup[] = [];

  for (let index = 0; index < options.length - 1; index += 1) {
    const left = options[index];
    const right = options[index + 1];

    if (!left || !right) {
      continue;
    }

    matchups.push({
      id: `matchup-${left.id}-${right.id}`,
      leftOptionId: left.id,
      rightOptionId: right.id,
      roundLabel: `Round ${matchups.length + 1}`,
    });
  }

  return matchups;
}

function deriveMatchupState(room: Room | null): MatchupState {
  if (!room) {
    return {
      status: 'idle',
      matchup: null,
      errorMessage: null,
    };
  }

  roomStore[room.id] = room;

  try {
    const matchup = mockedRoomAdapter.getCurrentMatchup({ roomId: room.id });

    return {
      status: 'success',
      matchup,
      errorMessage: null,
    };
  } catch {
    return {
      status: 'error',
      matchup: null,
      errorMessage: 'Could not load the next matchup.',
    };
  }
}

function deriveResultsState(room: Room | null): ResultsState {
  if (!room || room.lifecycleState !== 'completed') {
    return {
      status: 'idle',
      results: null,
      errorMessage: null,
    };
  }

  roomStore[room.id] = room;

  try {
    const results = mockedRoomAdapter.getResults({ roomId: room.id });

    return {
      status: 'success',
      results,
      errorMessage: null,
    };
  } catch {
    return {
      status: 'error',
      results: null,
      errorMessage: 'Could not prepare the final reveal.',
    };
  }
}

const mockedRoomAdapter: RoomAdapter = {
  createRoom({ displayName }) {
    return {
      id: makeId('room'),
      code: DEFAULT_ROOM_CODE,
      name: ROOM_NAME,
      lifecycleState: 'waiting',
      participants: [
        { id: 'you', name: displayName.trim() || 'You', isYou: true },
        { id: 'mia', name: 'Mia' },
      ],
      options: [],
      currentMatchupIndex: 0,
      selectedWinnerIds: [],
    };
  },

  joinRoom({ roomCode, displayName }) {
    return {
      id: makeId('room'),
      code: roomCode.trim().toUpperCase() || DEFAULT_ROOM_CODE,
      name: ROOM_NAME,
      lifecycleState: 'collecting_options',
      participants: [
        { id: 'you', name: displayName.trim() || 'You', isYou: true },
        ...SEEDED_PARTICIPANTS,
      ],
      options: SEEDED_OPTIONS,
      currentMatchupIndex: 0,
      selectedWinnerIds: [],
    };
  },

  addOption({ roomId, label }) {
    const room = roomStore[roomId];

    return {
      ...room,
      options: [...room.options, { id: makeId('opt'), label, addedBy: 'You' }],
    };
  },

  updateOption({ roomId, optionId, label }) {
    const room = roomStore[roomId];

    return {
      ...room,
      options: room.options.map((option) =>
        option.id === optionId ? { ...option, label } : option,
      ),
    };
  },

  removeOption({ roomId, optionId }) {
    const room = roomStore[roomId];

    return {
      ...room,
      options: room.options.filter((option) => option.id !== optionId),
    };
  },

  startRoom({ roomId }) {
    const room = roomStore[roomId];

    return {
      ...room,
      lifecycleState: 'active',
      currentMatchupIndex: 0,
      selectedWinnerIds: [],
    };
  },

  getCurrentMatchup({ roomId }) {
    const room = roomStore[roomId];
    return buildMatchups(room.options)[room.currentMatchupIndex] ?? null;
  },

  submitChoice({ roomId, winnerOptionId }) {
    const room = roomStore[roomId];
    const matchups = buildMatchups(room.options);
    const isFinalMatchup = room.currentMatchupIndex >= matchups.length - 1;

    return {
      ...room,
      lifecycleState: isFinalMatchup ? 'completed' : 'active',
      currentMatchupIndex: isFinalMatchup ? room.currentMatchupIndex : room.currentMatchupIndex + 1,
      selectedWinnerIds: [...room.selectedWinnerIds, winnerOptionId],
    };
  },

  getResults({ roomId }) {
    const room = roomStore[roomId];
    const winnerId = room.selectedWinnerIds[room.selectedWinnerIds.length - 1];
    const winner = winnerId ? getOptionById(room.options, winnerId) : room.options[0] ?? null;

    return {
      winner,
      shareText: winner
        ? `We used Pika and landed on ${winner.label} in room ${room.code}. No more "wait what are we doing?" energy.`
        : `We used Pika to settle the room in ${room.code}.`,
    };
  },
};

function SprintOneApp() {
  const [entryMode, setEntryMode] = useState<EntryMode>('join');
  const [displayName, setDisplayName] = useState('Avery');
  const [roomCodeInput, setRoomCodeInput] = useState(DEFAULT_ROOM_CODE);
  const [room, setRoom] = useState<Room | null>(null);
  const [optionDraft, setOptionDraft] = useState('');
  const [editingOptionId, setEditingOptionId] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const [selectionFeedback, setSelectionFeedback] = useState<SelectionFeedback | null>(null);
  const [entryStatus, setEntryStatus] = useState<AsyncStatus>('idle');
  const [entryError, setEntryError] = useState<string | null>(null);
  const [optionsStatus, setOptionsStatus] = useState<AsyncStatus>('idle');
  const [optionsError, setOptionsError] = useState<string | null>(null);
  const [startStatus, setStartStatus] = useState<AsyncStatus>('idle');
  const [startError, setStartError] = useState<string | null>(null);
  const [matchupState, setMatchupState] = useState<MatchupState>({
    status: 'idle',
    matchup: null,
    errorMessage: null,
  });
  const [submissionStatus, setSubmissionStatus] = useState<AsyncStatus>('idle');
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [resultsState, setResultsState] = useState<ResultsState>({
    status: 'idle',
    results: null,
    errorMessage: null,
  });

  const matchupList = useMemo(() => (room ? buildMatchups(room.options) : []), [room]);

  useEffect(() => {
    if (!selectionFeedback) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setSelectionFeedback(null);
    }, 950);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [selectionFeedback]);

  useEffect(() => {
    if (!room || room.lifecycleState !== 'active') {
      setMatchupState({
        status: 'idle',
        matchup: null,
        errorMessage: null,
      });
      return undefined;
    }

    setMatchupState((currentState) => ({
      ...currentState,
      status: 'loading',
      errorMessage: null,
    }));

    const timeoutId = window.setTimeout(() => {
      setMatchupState(deriveMatchupState(room));
    }, 220);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [room]);

  useEffect(() => {
    if (!room || room.lifecycleState !== 'completed') {
      setResultsState({
        status: 'idle',
        results: null,
        errorMessage: null,
      });
      return undefined;
    }

    setResultsState({
      status: 'loading',
      results: null,
      errorMessage: null,
    });

    const timeoutId = window.setTimeout(() => {
      setResultsState(deriveResultsState(room));
      setSubmissionStatus('success');
    }, 320);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [room]);

  function syncRoom(nextRoom: Room) {
    roomStore[nextRoom.id] = nextRoom;
    setRoom(nextRoom);
  }

  function resetFlowMessages() {
    setEntryError(null);
    setOptionsError(null);
    setStartError(null);
  }

  function handleEnterRoom() {
    const trimmedName = displayName.trim();

    if (!trimmedName) {
      setEntryStatus('error');
      setEntryError('Add your name so the room knows who just arrived.');
      return;
    }

    if (entryMode === 'join' && !roomCodeInput.trim()) {
      setEntryStatus('error');
      setEntryError('Drop in a room code before you make the entrance.');
      return;
    }

    resetFlowMessages();
    setEntryStatus('loading');
    setSelectionFeedback(null);

    window.setTimeout(() => {
      const nextRoom =
        entryMode === 'join'
          ? mockedRoomAdapter.joinRoom({
              roomCode: roomCodeInput,
              displayName,
            })
          : mockedRoomAdapter.createRoom({ displayName });

      syncRoom(nextRoom);
      setShareCopied(false);
      setEntryStatus('success');
    }, 260);
  }

  function handleStartCollecting() {
    if (!room) {
      return;
    }

    resetFlowMessages();
    syncRoom({ ...room, lifecycleState: 'collecting_options' });
  }

  function handleSaveOption() {
    if (!room) {
      return;
    }

    const nextLabel = optionDraft.trim();

    if (!nextLabel) {
      setOptionsStatus('error');
      setOptionsError('Give the room an actual option before you hit save.');
      return;
    }

    setOptionsStatus('loading');
    setOptionsError(null);
    roomStore[room.id] = room;

    window.setTimeout(() => {
      if (editingOptionId) {
        syncRoom(
          mockedRoomAdapter.updateOption({
            roomId: room.id,
            optionId: editingOptionId,
            label: nextLabel,
          }),
        );
        setEditingOptionId(null);
        setOptionDraft('');
        setOptionsStatus('success');
        return;
      }

      syncRoom(
        mockedRoomAdapter.addOption({
          roomId: room.id,
          label: nextLabel,
        }),
      );
      setOptionDraft('');
      setOptionsStatus('success');
    }, 180);
  }

  function handleEditOption(optionId: string) {
    if (!room) {
      return;
    }

    const option = getOptionById(room.options, optionId);

    if (!option) {
      return;
    }

    setOptionsError(null);
    setEditingOptionId(option.id);
    setOptionDraft(option.label);
  }

  function handleCancelEdit() {
    setEditingOptionId(null);
    setOptionDraft('');
    setOptionsError(null);
  }

  function handleRemoveOption(optionId: string) {
    if (!room) {
      return;
    }

    setOptionsStatus('loading');
    setOptionsError(null);
    roomStore[room.id] = room;

    window.setTimeout(() => {
      syncRoom(mockedRoomAdapter.removeOption({ roomId: room.id, optionId }));
      setOptionsStatus('success');

      if (editingOptionId === optionId) {
        setEditingOptionId(null);
        setOptionDraft('');
      }
    }, 180);
  }

  function handleStartMatchups() {
    if (!room) {
      return;
    }

    if (room.options.length < 2) {
      setStartStatus('error');
      setStartError('Pika needs at least two options before it can start the showdown.');
      return;
    }

    setStartStatus('loading');
    setStartError(null);
    setSelectionFeedback(null);
    roomStore[room.id] = room;

    window.setTimeout(() => {
      syncRoom(mockedRoomAdapter.startRoom({ roomId: room.id }));
      setStartStatus('success');
    }, 260);
  }

  function handleSubmitChoice(optionId: string) {
    if (!room || submissionStatus === 'loading') {
      return;
    }

    const selectedOption = getOptionById(room.options, optionId);
    const matchupCount = buildMatchups(room.options).length;
    const isFinalChoice = matchupCount > 0 && room.currentMatchupIndex >= matchupCount - 1;

    setSubmissionStatus('loading');
    setSubmissionError(null);
    roomStore[room.id] = room;

    window.setTimeout(() => {
      try {
        const nextRoom = mockedRoomAdapter.submitChoice({
          roomId: room.id,
          winnerOptionId: optionId,
        });

        setSelectionFeedback({
          winnerLabel: selectedOption?.label ?? 'That pick',
          isFinalChoice,
        });
        syncRoom(nextRoom);

        if (!isFinalChoice) {
          setSubmissionStatus('success');
        }
      } catch {
        setSubmissionStatus('error');
        setSubmissionError('Could not lock that choice. Give it one more decisive tap.');
      }
    }, 220);
  }

  function handleRetryChoiceSubmit() {
    setSubmissionStatus('idle');
    setSubmissionError(null);
  }

  function handleRetryMatchupLoad() {
    if (!room) {
      return;
    }

    setMatchupState({
      status: 'loading',
      matchup: null,
      errorMessage: null,
    });

    window.setTimeout(() => {
      setMatchupState(deriveMatchupState(room));
    }, 220);
  }

  function handleRetryResultsLoad() {
    if (!room) {
      return;
    }

    setResultsState({
      status: 'loading',
      results: null,
      errorMessage: null,
    });

    window.setTimeout(() => {
      setResultsState(deriveResultsState(room));
    }, 320);
  }

  function handleCopyShare() {
    setShareCopied(true);
  }

  function handleBackToOptions() {
    if (!room) {
      return;
    }

    syncRoom({
      ...room,
      lifecycleState: 'collecting_options',
      currentMatchupIndex: 0,
      selectedWinnerIds: [],
    });
    setShareCopied(false);
    setSelectionFeedback(null);
    setStartError(null);
    setSubmissionStatus('idle');
    setSubmissionError(null);
    setResultsState({
      status: 'idle',
      results: null,
      errorMessage: null,
    });
    setMatchupState({
      status: 'idle',
      matchup: null,
      errorMessage: null,
    });
  }

  const progressPercent =
    room && matchupList.length > 0 ? ((room.currentMatchupIndex + 1) / matchupList.length) * 100 : 0;

  const remainingDecisions =
    room && matchupList.length > 0
      ? Math.max(matchupList.length - (room.currentMatchupIndex + 1), 0)
      : 0;

  const currentMatchup = matchupState.matchup;
  const results = resultsState.results;

  return (
    <div className="app-shell">
      <div className="phone-frame">
        <main className="app-panel">
          <header className="topbar">
            <div>
              <p className="eyebrow">Pika Sprint 1</p>
              <h1>Pika picks the vibe fast.</h1>
            </div>
            {room ? <span className="room-chip">Room {room.code}</span> : null}
          </header>

          {!room ? (
            <section className="screen">
              <div className="hero-card">
                <p className="hero-kicker">Mocked contract vertical slice</p>
                <h2>Create or join a room, gather options, and let Pika land the decision.</h2>
                <p className="hero-copy">
                  Same proven flow, now mapped to explicit Sprint 1 lifecycle states.
                </p>
              </div>

              <div className="segmented-control" role="tablist" aria-label="Entry mode">
                <button
                  type="button"
                  className={entryMode === 'join' ? 'segment active' : 'segment'}
                  onClick={() => setEntryMode('join')}
                  disabled={entryStatus === 'loading'}
                >
                  Join room
                </button>
                <button
                  type="button"
                  className={entryMode === 'create' ? 'segment active' : 'segment'}
                  onClick={() => setEntryMode('create')}
                  disabled={entryStatus === 'loading'}
                >
                  Create room
                </button>
              </div>

              <div className="card stack">
                <label className="field">
                  <span>Your name</span>
                  <input
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    placeholder="Avery"
                    disabled={entryStatus === 'loading'}
                  />
                </label>

                {entryMode === 'join' ? (
                  <label className="field">
                    <span>Room code</span>
                    <input
                      value={roomCodeInput}
                      onChange={(event) => setRoomCodeInput(event.target.value.toUpperCase())}
                      placeholder={DEFAULT_ROOM_CODE}
                      disabled={entryStatus === 'loading'}
                    />
                  </label>
                ) : null}

                <button type="button" className="primary-button" onClick={handleEnterRoom}>
                  {entryStatus === 'loading'
                    ? 'Opening the room…'
                    : entryMode === 'join'
                      ? 'Join the room'
                      : 'Create and enter'}
                </button>

                {entryError ? <p className="inline-feedback error">{entryError}</p> : null}
                {entryStatus === 'success' ? (
                  <p className="inline-feedback success">Nice. You’re in and the room is live.</p>
                ) : null}

                <p className="support-copy">
                  {entryMode === 'join'
                    ? 'Join by code and drop directly into the room lifecycle.'
                    : 'Create a fresh room in waiting state, then pull everybody into options.'}
                </p>
              </div>
            </section>
          ) : null}

          {room?.lifecycleState === 'waiting' ? (
            <section className="screen">
              <div className="room-summary">
                <div>
                  <p className="eyebrow">State: waiting</p>
                  <h2>{room.name}</h2>
                </div>
                <div className="summary-stats">
                  <span>{room.participants.length} people in the room</span>
                  <span>Code {room.code}</span>
                </div>
              </div>

              <div className="card stack">
                <div className="section-header">
                  <div>
                    <h3>Room is open</h3>
                    <p>People can join now. When the room feels warm enough, start collecting ideas.</p>
                  </div>
                </div>

                <div className="participant-list">
                  {room.participants.map((participant) => (
                    <div className="participant-pill" key={participant.id}>
                      <span>{participant.name}</span>
                      {participant.isYou ? <strong>You</strong> : null}
                    </div>
                  ))}
                </div>

                <button type="button" className="primary-button" onClick={handleStartCollecting}>
                  Start collecting options
                </button>

                <p className="support-copy">
                  Tiny host move, huge momentum. Pika is ready when the room is.
                </p>
              </div>
            </section>
          ) : null}

          {room?.lifecycleState === 'collecting_options' ? (
            <section className="screen">
              <div className="room-summary">
                <div>
                  <p className="eyebrow">State: collecting_options</p>
                  <h2>{room.participants.length} people in the room</h2>
                </div>
                <div className="summary-stats">
                  <span>
                    {room.options.length} option{room.options.length === 1 ? '' : 's'}
                  </span>
                  <span>{room.name}</span>
                </div>
              </div>

              <div className="card stack">
                <div className="section-header">
                  <div>
                    <h3>Who’s here</h3>
                    <p>The room context is visible before anyone starts making demands.</p>
                  </div>
                </div>

                <div className="participant-list">
                  {room.participants.map((participant) => (
                    <div className="participant-pill" key={participant.id}>
                      <span>{participant.name}</span>
                      {participant.isYou ? <strong>You</strong> : null}
                    </div>
                  ))}
                </div>
              </div>

              <div className="card stack">
                <div className="section-header">
                  <div>
                    <h3>Add options</h3>
                    <p>Give the room contenders. Pika turns them into choice energy.</p>
                  </div>
                </div>

                <div className="option-composer">
                  <input
                    value={optionDraft}
                    onChange={(event) => setOptionDraft(event.target.value)}
                    placeholder="Add a place, plan, or chaos pick"
                    disabled={optionsStatus === 'loading'}
                  />
                  <button
                    type="button"
                    className="primary-button compact"
                    onClick={handleSaveOption}
                    disabled={optionsStatus === 'loading'}
                  >
                    {optionsStatus === 'loading'
                      ? 'Saving…'
                      : editingOptionId
                        ? 'Save edit'
                        : 'Add option'}
                  </button>
                </div>

                {editingOptionId ? (
                  <button type="button" className="text-button" onClick={handleCancelEdit}>
                    Cancel edit
                  </button>
                ) : null}

                {optionsError ? <p className="inline-feedback error">{optionsError}</p> : null}
                {optionsStatus === 'success' ? (
                  <p className="inline-feedback success">Option list updated. The room can feel it.</p>
                ) : null}

                {room.options.length === 0 ? (
                  <div className="empty-state">
                    <p>No options yet.</p>
                    <span>Be the first brave little gremlin to throw one in.</span>
                  </div>
                ) : (
                  <div className="option-list">
                    {room.options.map((option) => (
                      <div className="option-row" key={option.id}>
                        <div>
                          <strong>{option.label}</strong>
                          <p>Added by {option.addedBy}</p>
                        </div>

                        <div className="row-actions">
                          <button
                            type="button"
                            className="secondary-button"
                            onClick={() => handleEditOption(option.id)}
                            disabled={optionsStatus === 'loading'}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="secondary-button danger"
                            onClick={() => handleRemoveOption(option.id)}
                            disabled={optionsStatus === 'loading'}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  className="primary-button"
                  onClick={handleStartMatchups}
                  disabled={startStatus === 'loading' || optionsStatus === 'loading'}
                >
                  {startStatus === 'loading' ? 'Building the bracket…' : 'Start matchups'}
                </button>

                {startError ? <p className="inline-feedback error">{startError}</p> : null}
                {startStatus === 'loading' ? (
                  <p className="inline-feedback pending">Getting the room into showdown mode…</p>
                ) : null}

                <p className="support-copy">
                  Minimum viable room energy: 2 options. Then Pika gets wonderfully decisive.
                </p>
              </div>
            </section>
          ) : null}

          {room?.lifecycleState === 'active' ? (
            <section className="screen">
              <div className="progress-header">
                <div>
                  <p className="eyebrow">State: active</p>
                  <h2>
                    {(currentMatchup?.roundLabel ?? 'Round')} · {room.currentMatchupIndex + 1}/
                    {Math.max(matchupList.length, 1)}
                  </h2>
                </div>
                <span className="progress-label">{Math.round(progressPercent)}%</span>
              </div>

              <div className="matchup-status-card" aria-live="polite">
                <div className="matchup-status-row">
                  <strong>
                    Decision {room.currentMatchupIndex + 1} of {Math.max(matchupList.length, 1)}
                  </strong>
                  <span>
                    {remainingDecisions === 0
                      ? 'Final matchup'
                      : `${remainingDecisions} ${remainingDecisions === 1 ? 'decision' : 'decisions'} left`}
                  </span>
                </div>

                {submissionStatus === 'loading' ? (
                  <p className="matchup-feedback muted">
                    {remainingDecisions === 0
                      ? 'Final choice submitted. Cue the tiny drumroll.'
                      : 'Choice locked. Sliding into the next face-off…'}
                  </p>
                ) : matchupState.status === 'loading' ? (
                  <p className="matchup-feedback muted">{MATCHUP_LOADING_COPY}</p>
                ) : selectionFeedback ? (
                  <p className="matchup-feedback">
                    {selectionFeedback.isFinalChoice
                      ? `${selectionFeedback.winnerLabel} locked in. Rolling straight into the reveal.`
                      : `${selectionFeedback.winnerLabel} takes this round. Next decision up.`}
                  </p>
                ) : submissionStatus === 'error' ? (
                  <p className="matchup-feedback error">{submissionError}</p>
                ) : matchupState.status === 'error' ? (
                  <p className="matchup-feedback error">{matchupState.errorMessage}</p>
                ) : (
                  <p className="matchup-feedback muted">
                    Quick pulse check: pick the stronger option and keep the room moving.
                  </p>
                )}
              </div>

              <div className="progress-track" aria-hidden="true">
                <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
              </div>

              {matchupState.status === 'loading' ? (
                <div className="empty-state">
                  <p>Loading matchup</p>
                  <span>{MATCHUP_LOADING_COPY}</span>
                </div>
              ) : matchupState.status === 'error' ? (
                <div className="empty-state">
                  <p>Matchup unavailable</p>
                  <span>{matchupState.errorMessage}</span>
                  <button type="button" className="secondary-button wide" onClick={handleRetryMatchupLoad}>
                    Try loading again
                  </button>
                </div>
              ) : currentMatchup ? (
                <div className="matchup-grid">
                  <button
                    type="button"
                    className="choice-card"
                    onClick={() => handleSubmitChoice(currentMatchup.leftOptionId)}
                    disabled={submissionStatus === 'loading'}
                  >
                    <span className="choice-number">A</span>
                    <strong>{getOptionById(room.options, currentMatchup.leftOptionId)?.label}</strong>
                    <p>
                      {submissionStatus === 'loading'
                        ? 'Locking your choice…'
                        : 'Tappable. Decisive. Slightly chaotic.'}
                    </p>
                  </button>

                  <button
                    type="button"
                    className="choice-card"
                    onClick={() => handleSubmitChoice(currentMatchup.rightOptionId)}
                    disabled={submissionStatus === 'loading'}
                  >
                    <span className="choice-number">B</span>
                    <strong>{getOptionById(room.options, currentMatchup.rightOptionId)?.label}</strong>
                    <p>
                      {submissionStatus === 'loading'
                        ? 'Hold tight while Pika lands it…'
                        : 'If this one wins, the room commits with chest.'}
                    </p>
                  </button>
                </div>
              ) : (
                <div className="empty-state">
                  <p>No matchup available.</p>
                  <span>Head back to collecting and add at least two options first.</span>
                  <button type="button" className="secondary-button wide" onClick={handleBackToOptions}>
                    Back to options
                  </button>
                </div>
              )}

              {submissionStatus === 'error' ? (
                <button type="button" className="secondary-button wide" onClick={handleRetryChoiceSubmit}>
                  Reset choice state
                </button>
              ) : null}
            </section>
          ) : null}

          {room?.lifecycleState === 'completed' ? (
            <section className="screen">
              <div className="result-badge">State: completed</div>

              {resultsState.status === 'loading' ? (
                <div className="winner-card">
                  <p className="eyebrow">Results readying</p>
                  <h2>Final pick incoming…</h2>
                  <p>{RESULTS_LOADING_COPY}</p>
                </div>
              ) : resultsState.status === 'error' ? (
                <div className="winner-card">
                  <p className="eyebrow">Reveal paused</p>
                  <h2>Results need one more beat</h2>
                  <p>{resultsState.errorMessage}</p>
                </div>
              ) : (
                <div className="winner-card">
                  <p className="eyebrow">The room has spoken</p>
                  <h2>{results?.winner?.label ?? 'Mystery pick'}</h2>
                  <p>Tiny electric drumroll complete. Pika says this is the move.</p>
                </div>
              )}

              <div className="card stack">
                <div className="section-header">
                  <div>
                    <h3>Share the outcome</h3>
                    <p>Send it before somebody heroically tries to reopen the debate.</p>
                  </div>
                </div>

                {resultsState.status === 'loading' ? (
                  <div className="share-box">
                    <p>{RESULTS_LOADING_COPY}</p>
                  </div>
                ) : resultsState.status === 'error' ? (
                  <div className="share-box">
                    <p>{resultsState.errorMessage}</p>
                  </div>
                ) : (
                  <div className="share-box">
                    <p>{results?.shareText}</p>
                  </div>
                )}

                {resultsState.status === 'error' ? (
                  <button type="button" className="primary-button" onClick={handleRetryResultsLoad}>
                    Retry reveal
                  </button>
                ) : (
                  <button
                    type="button"
                    className="primary-button"
                    onClick={handleCopyShare}
                    disabled={resultsState.status !== 'success'}
                  >
                    {shareCopied ? 'Copied-ish for the mock' : 'Copy share text'}
                  </button>
                )}

                <button type="button" className="secondary-button wide" onClick={handleBackToOptions}>
                  Back to options
                </button>
              </div>
            </section>
          ) : null}
        </main>
      </div>
    </div>
  );
}

export default SprintOneApp;