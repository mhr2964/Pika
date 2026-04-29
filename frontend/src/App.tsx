import { useMemo, useState } from 'react';
import './App.css';

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

type RoomAdapter = {
  createRoom(input: { displayName: string }): Room;
  joinRoom(input: { roomCode: string; displayName: string }): Room;
  addOption(input: { roomId: string; label: string }): Room;
  updateOption(input: { roomId: string; optionId: string; label: string }): Room;
  removeOption(input: { roomId: string; optionId: string }): Room;
  startRoom(input: { roomId: string }): Room;
  getCurrentMatchup(input: { roomId: string }): Matchup | null;
  submitChoice(input: { roomId: string; winnerOptionId: string }): Room;
  getResults(input: { roomId: string }): { winner: RoomOption | null; shareText: string };
};

type EntryMode = 'join' | 'create';

const ROOM_NAME = 'Friday Night Pick';
const INITIAL_PARTICIPANTS: Participant[] = [
  { id: 'you', name: 'You', isYou: true },
  { id: 'mia', name: 'Mia' },
  { id: 'leo', name: 'Leo' },
];

const INITIAL_OPTIONS: RoomOption[] = [
  { id: 'opt-1', label: 'Sushi train', addedBy: 'You' },
  { id: 'opt-2', label: 'Karaoke room', addedBy: 'Mia' },
  { id: 'opt-3', label: 'Rooftop tacos', addedBy: 'Leo' },
  { id: 'opt-4', label: 'Late-night gelato', addedBy: 'You' },
];

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function buildMatchups(options: RoomOption[]): Matchup[] {
  const pairs: Matchup[] = [];

  for (let index = 0; index < options.length - 1; index += 1) {
    const left = options[index];
    const right = options[index + 1];

    if (!left || !right) {
      continue;
    }

    pairs.push({
      id: `matchup-${left.id}-${right.id}`,
      leftOptionId: left.id,
      rightOptionId: right.id,
      roundLabel: `Round ${pairs.length + 1}`,
    });
  }

  if (pairs.length === 0 && options.length >= 2) {
    pairs.push({
      id: `matchup-${options[0].id}-${options[1].id}`,
      leftOptionId: options[0].id,
      rightOptionId: options[1].id,
      roundLabel: 'Round 1',
    });
  }

  return pairs;
}

function getOptionById(options: RoomOption[], optionId: string) {
  return options.find((option) => option.id === optionId) ?? null;
}

const mockedRoomAdapter: RoomAdapter = {
  createRoom({ displayName }) {
    return {
      id: makeId('room'),
      code: 'PIKA42',
      name: ROOM_NAME,
      lifecycleState: 'waiting',
      participants: [
        { id: 'you', name: displayName || 'You', isYou: true },
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
      code: roomCode || 'PIKA42',
      name: ROOM_NAME,
      lifecycleState: 'collecting_options',
      participants: [
        { id: 'you', name: displayName || 'You', isYou: true },
        ...INITIAL_PARTICIPANTS.filter((participant) => !participant.isYou),
      ],
      options: INITIAL_OPTIONS,
      currentMatchupIndex: 0,
      selectedWinnerIds: [],
    };
  },

  addOption({ roomId, label }) {
    return {
      ...currentRoomStore[roomId],
      lifecycleState: 'collecting_options',
      options: [
        ...currentRoomStore[roomId].options,
        { id: makeId('opt'), label, addedBy: 'You' },
      ],
    };
  },

  updateOption({ roomId, optionId, label }) {
    return {
      ...currentRoomStore[roomId],
      options: currentRoomStore[roomId].options.map((option) =>
        option.id === optionId ? { ...option, label } : option,
      ),
    };
  },

  removeOption({ roomId, optionId }) {
    return {
      ...currentRoomStore[roomId],
      options: currentRoomStore[roomId].options.filter((option) => option.id !== optionId),
    };
  },

  startRoom({ roomId }) {
    return {
      ...currentRoomStore[roomId],
      lifecycleState: 'active',
      currentMatchupIndex: 0,
      selectedWinnerIds: [],
    };
  },

  getCurrentMatchup({ roomId }) {
    const room = currentRoomStore[roomId];
    const matchups = buildMatchups(room.options);

    return matchups[room.currentMatchupIndex] ?? null;
  },

  submitChoice({ roomId, winnerOptionId }) {
    const room = currentRoomStore[roomId];
    const nextSelectedWinnerIds = [...room.selectedWinnerIds, winnerOptionId];
    const matchups = buildMatchups(room.options);
    const isLastMatchup = room.currentMatchupIndex >= matchups.length - 1;

    return {
      ...room,
      lifecycleState: isLastMatchup ? 'completed' : 'active',
      currentMatchupIndex: isLastMatchup ? room.currentMatchupIndex : room.currentMatchupIndex + 1,
      selectedWinnerIds: nextSelectedWinnerIds,
    };
  },

  getResults({ roomId }) {
    const room = currentRoomStore[roomId];
    const winnerId = room.selectedWinnerIds[room.selectedWinnerIds.length - 1];
    const winner = winnerId ? getOptionById(room.options, winnerId) : room.options[0] ?? null;
    const shareText = winner
      ? `We used Pika and landed on ${winner.label} in room ${room.code}. No more "wait what are we doing?" energy.`
      : `We used Pika to settle the room in ${room.code}.`;

    return { winner, shareText };
  },
};

const currentRoomStore: Record<string, Room> = {};

function App() {
  const [entryMode, setEntryMode] = useState<EntryMode>('join');
  const [displayName, setDisplayName] = useState('Avery');
  const [roomCodeInput, setRoomCodeInput] = useState('PIKA42');
  const [room, setRoom] = useState<Room | null>(null);
  const [optionDraft, setOptionDraft] = useState('');
  const [editingOptionId, setEditingOptionId] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);

  const matchups = useMemo(() => (room ? buildMatchups(room.options) : []), [room]);
  const currentMatchup = useMemo(() => {
    if (!room) {
      return null;
    }

    currentRoomStore[room.id] = room;
    return mockedRoomAdapter.getCurrentMatchup({ roomId: room.id });
  }, [room]);

  const results = useMemo(() => {
    if (!room || room.lifecycleState !== 'completed') {
      return null;
    }

    currentRoomStore[room.id] = room;
    return mockedRoomAdapter.getResults({ roomId: room.id });
  }, [room]);

  function syncRoom(nextRoom: Room) {
    currentRoomStore[nextRoom.id] = nextRoom;
    setRoom(nextRoom);
  }

  function handleCreateRoom() {
    const nextRoom = mockedRoomAdapter.createRoom({ displayName });
    syncRoom(nextRoom);
  }

  function handleJoinRoom() {
    const nextRoom = mockedRoomAdapter.joinRoom({
      roomCode: roomCodeInput.trim().toUpperCase(),
      displayName,
    });
    syncRoom(nextRoom);
  }

  function handleAdvanceFromWaiting() {
    if (!room) {
      return;
    }

    syncRoom({ ...room, lifecycleState: 'collecting_options' });
  }

  function handleSaveOption() {
    if (!room) {
      return;
    }

    const cleanedLabel = optionDraft.trim();

    if (!cleanedLabel) {
      return;
    }

    currentRoomStore[room.id] = room;

    if (editingOptionId) {
      const updatedRoom = mockedRoomAdapter.updateOption({
        roomId: room.id,
        optionId: editingOptionId,
        label: cleanedLabel,
      });
      syncRoom(updatedRoom);
      setEditingOptionId(null);
      setOptionDraft('');
      return;
    }

    const updatedRoom = mockedRoomAdapter.addOption({
      roomId: room.id,
      label: cleanedLabel,
    });
    syncRoom(updatedRoom);
    setOptionDraft('');
  }

  function handleEditOption(optionId: string) {
    if (!room) {
      return;
    }

    const option = getOptionById(room.options, optionId);

    if (!option) {
      return;
    }

    setEditingOptionId(option.id);
    setOptionDraft(option.label);
  }

  function handleRemoveOption(optionId: string) {
    if (!room) {
      return;
    }

    currentRoomStore[room.id] = room;
    const updatedRoom = mockedRoomAdapter.removeOption({ roomId: room.id, optionId });
    syncRoom(updatedRoom);

    if (editingOptionId === optionId) {
      setEditingOptionId(null);
      setOptionDraft('');
    }
  }

  function handleStartRoom() {
    if (!room || room.options.length < 2) {
      return;
    }

    currentRoomStore[room.id] = room;
    const updatedRoom = mockedRoomAdapter.startRoom({ roomId: room.id });
    syncRoom(updatedRoom);
    setShareCopied(false);
  }

  function handleSubmitChoice(optionId: string) {
    if (!room) {
      return;
    }

    currentRoomStore[room.id] = room;
    const updatedRoom = mockedRoomAdapter.submitChoice({
      roomId: room.id,
      winnerOptionId: optionId,
    });
    syncRoom(updatedRoom);
  }

  function handleCopyShare() {
    setShareCopied(true);
  }

  function handleBackToCollecting() {
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
  }

  const optionCountLabel = room
    ? `${room.options.length} option${room.options.length === 1 ? '' : 's'}`
    : '0 options';
  const participantCountLabel = room
    ? `${room.participants.length} people in the room`
    : '0 people in the room';
  const progressValue =
    room && matchups.length > 0 ? ((room.currentMatchupIndex + 1) / matchups.length) * 100 : 0;

  return (
    <div className="app-shell">
      <div className="phone-frame">
        <div className="app-panel">
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
                  This Sprint 1 slice maps the proven prototype to explicit room lifecycle states.
                </p>
              </div>

              <div className="segmented-control" role="tablist" aria-label="Entry mode">
                <button
                  type="button"
                  className={entryMode === 'join' ? 'segment active' : 'segment'}
                  onClick={() => setEntryMode('join')}
                >
                  Join room
                </button>
                <button
                  type="button"
                  className={entryMode === 'create' ? 'segment active' : 'segment'}
                  onClick={() => setEntryMode('create')}
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
                  />
                </label>

                {entryMode === 'join' ? (
                  <label className="field">
                    <span>Room code</span>
                    <input
                      value={roomCodeInput}
                      onChange={(event) => setRoomCodeInput(event.target.value.toUpperCase())}
                      placeholder="PIKA42"
                    />
                  </label>
                ) : null}

                <button
                  type="button"
                  className="primary-button"
                  onClick={entryMode === 'join' ? handleJoinRoom : handleCreateRoom}
                >
                  {entryMode === 'join' ? 'Join the room' : 'Create and enter'}
                </button>

                <p className="support-copy">
                  {entryMode === 'join'
                    ? 'Join by code and drop directly into the current room lifecycle.'
                    : 'Create a fresh room in waiting state, then move into collection.'}
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
                  <span>{participantCountLabel}</span>
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

                <button type="button" className="primary-button" onClick={handleAdvanceFromWaiting}>
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
                  <h2>{participantCountLabel}</h2>
                </div>
                <div className="summary-stats">
                  <span>{optionCountLabel}</span>
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
                  />
                  <button type="button" className="primary-button compact" onClick={handleSaveOption}>
                    {editingOptionId ? 'Save edit' : 'Add option'}
                  </button>
                </div>

                {editingOptionId ? (
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => {
                      setEditingOptionId(null);
                      setOptionDraft('');
                    }}
                  >
                    Cancel edit
                  </button>
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
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="secondary-button danger"
                            onClick={() => handleRemoveOption(option.id)}
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
                  onClick={handleStartRoom}
                  disabled={room.options.length < 2}
                >
                  Start matchups
                </button>

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
                    {currentMatchup?.roundLabel ?? 'Round'} · {room.currentMatchupIndex + 1}/
                    {Math.max(matchups.length, 1)}
                  </h2>
                </div>
                <span className="progress-label">{Math.round(progressValue)}%</span>
              </div>

              <div className="progress-track" aria-hidden="true">
                <div className="progress-fill" style={{ width: `${progressValue}%` }} />
              </div>

              {currentMatchup ? (
                <div className="matchup-grid">
                  <button
                    type="button"
                    className="choice-card"
                    onClick={() => handleSubmitChoice(currentMatchup.leftOptionId)}
                  >
                    <span className="choice-number">A</span>
                    <strong>{getOptionById(room.options, currentMatchup.leftOptionId)?.label}</strong>
                    <p>Tappable. Decisive. Slightly chaotic.</p>
                  </button>

                  <button
                    type="button"
                    className="choice-card"
                    onClick={() => handleSubmitChoice(currentMatchup.rightOptionId)}
                  >
                    <span className="choice-number">B</span>
                    <strong>{getOptionById(room.options, currentMatchup.rightOptionId)?.label}</strong>
                    <p>If this one wins, the room commits with chest.</p>
                  </button>
                </div>
              ) : (
                <div className="empty-state">
                  <p>No matchup available.</p>
                  <span>Head back to collecting and add at least two options first.</span>
                </div>
              )}
            </section>
          ) : null}

          {room?.lifecycleState === 'completed' ? (
            <section className="screen">
              <div className="result-badge">State: completed</div>
              <div className="winner-card">
                <p className="eyebrow">The room has spoken</p>
                <h2>{results?.winner?.label ?? 'Mystery pick'}</h2>
                <p>Tiny electric drumroll complete. Pika says this is the move.</p>
              </div>

              <div className="card stack">
                <div className="section-header">
                  <div>
                    <h3>Share the outcome</h3>
                    <p>Send it before somebody heroically tries to reopen the debate.</p>
                  </div>
                </div>

                <div className="share-box">
                  <p>{results?.shareText}</p>
                </div>

                <button type="button" className="primary-button" onClick={handleCopyShare}>
                  {shareCopied ? 'Copied-ish for the mock' : 'Copy share text'}
                </button>

                <button type="button" className="secondary-button wide" onClick={handleBackToCollecting}>
                  Back to options
                </button>
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default App;