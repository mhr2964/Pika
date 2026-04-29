import { useMemo, useState } from 'react';
import './App.css';

type Stage = 'entry' | 'lobby' | 'matchups' | 'result';

type RoomMode = 'join' | 'create';

type Participant = {
  id: string;
  name: string;
  isYou?: boolean;
};

type Option = {
  id: string;
  label: string;
  addedBy: string;
};

type Matchup = {
  id: string;
  leftOptionId: string;
  rightOptionId: string;
};

const INITIAL_PARTICIPANTS: Participant[] = [
  { id: 'you', name: 'You', isYou: true },
  { id: 'mia', name: 'Mia' },
  { id: 'leo', name: 'Leo' },
];

const INITIAL_OPTIONS: Option[] = [
  { id: '1', label: 'Sushi train', addedBy: 'You' },
  { id: '2', label: 'Karaoke room', addedBy: 'Mia' },
  { id: '3', label: 'Rooftop tacos', addedBy: 'Leo' },
  { id: '4', label: 'Late-night gelato', addedBy: 'You' },
];

const ROOM_CODE = 'PIKA42';

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function buildMatchups(options: Option[]): Matchup[] {
  const pairs: Matchup[] = [];

  for (let index = 0; index < options.length - 1; index += 1) {
    const left = options[index];
    const right = options[index + 1];

    if (left && right) {
      pairs.push({
        id: `matchup-${left.id}-${right.id}`,
        leftOptionId: left.id,
        rightOptionId: right.id,
      });
    }
  }

  if (pairs.length === 0 && options.length >= 2) {
    pairs.push({
      id: `matchup-${options[0].id}-${options[1].id}`,
      leftOptionId: options[0].id,
      rightOptionId: options[1].id,
    });
  }

  return pairs;
}

function getOptionLabel(optionId: string, options: Option[]) {
  return options.find((option) => option.id === optionId)?.label ?? 'Unknown option';
}

function App() {
  const [stage, setStage] = useState<Stage>('entry');
  const [roomMode, setRoomMode] = useState<RoomMode>('join');
  const [displayName, setDisplayName] = useState('Avery');
  const [roomCodeInput, setRoomCodeInput] = useState(ROOM_CODE);
  const [participants] = useState<Participant[]>(INITIAL_PARTICIPANTS);
  const [options, setOptions] = useState<Option[]>(INITIAL_OPTIONS);
  const [optionDraft, setOptionDraft] = useState('');
  const [editingOptionId, setEditingOptionId] = useState<string | null>(null);
  const [currentMatchupIndex, setCurrentMatchupIndex] = useState(0);
  const [selectedWinners, setSelectedWinners] = useState<string[]>([]);
  const [shareCopied, setShareCopied] = useState(false);

  const matchups = useMemo(() => buildMatchups(options), [options]);
  const currentMatchup = matchups[currentMatchupIndex];

  const winnerOption = useMemo(() => {
    if (selectedWinners.length > 0) {
      const mostRecentWinnerId = selectedWinners[selectedWinners.length - 1];
      return options.find((option) => option.id === mostRecentWinnerId) ?? options[0] ?? null;
    }

    return options[0] ?? null;
  }, [options, selectedWinners]);

  const optionCountLabel = `${options.length} option${options.length === 1 ? '' : 's'}`;
  const participantCountLabel = `${participants.length} people in the room`;

  function handleEnterRoom() {
    setStage('lobby');
  }

  function handleSaveOption() {
    const cleanedLabel = optionDraft.trim();

    if (!cleanedLabel) {
      return;
    }

    if (editingOptionId) {
      setOptions((currentOptions) =>
        currentOptions.map((option) =>
          option.id === editingOptionId ? { ...option, label: cleanedLabel } : option,
        ),
      );
      setEditingOptionId(null);
      setOptionDraft('');
      return;
    }

    setOptions((currentOptions) => [
      ...currentOptions,
      { id: makeId('option'), label: cleanedLabel, addedBy: 'You' },
    ]);
    setOptionDraft('');
  }

  function handleEditOption(optionId: string) {
    const option = options.find((item) => item.id === optionId);

    if (!option) {
      return;
    }

    setEditingOptionId(option.id);
    setOptionDraft(option.label);
  }

  function handleRemoveOption(optionId: string) {
    setOptions((currentOptions) => currentOptions.filter((option) => option.id !== optionId));

    if (editingOptionId === optionId) {
      setEditingOptionId(null);
      setOptionDraft('');
    }
  }

  function handleStartMatchups() {
    if (options.length < 2) {
      return;
    }

    setCurrentMatchupIndex(0);
    setSelectedWinners([]);
    setShareCopied(false);
    setStage('matchups');
  }

  function handleChooseWinner(optionId: string) {
    const nextWinners = [...selectedWinners, optionId];
    const isLastMatchup = currentMatchupIndex >= matchups.length - 1;

    setSelectedWinners(nextWinners);

    if (isLastMatchup) {
      setStage('result');
      return;
    }

    setCurrentMatchupIndex((currentIndex) => currentIndex + 1);
  }

  function handleCopyShare() {
    setShareCopied(true);
  }

  const progressValue = matchups.length === 0 ? 0 : ((currentMatchupIndex + 1) / matchups.length) * 100;

  return (
    <div className="app-shell">
      <div className="phone-frame">
        <div className="app-panel">
          <header className="topbar">
            <div>
              <p className="eyebrow">Pika proto</p>
              <h1>Pika picks the vibe fast.</h1>
            </div>
            {stage !== 'entry' ? <span className="room-chip">Room {ROOM_CODE}</span> : null}
          </header>

          {stage === 'entry' ? (
            <section className="screen">
              <div className="hero-card">
                <p className="hero-kicker">Stop the “anything works” spiral.</p>
                <h2>Make one room. Toss in options. Let the room feel the winner.</h2>
                <p className="hero-copy">
                  Pika turns messy group indecision into one obvious next move.
                </p>
              </div>

              <div className="segmented-control" role="tablist" aria-label="Room mode">
                <button
                  type="button"
                  className={roomMode === 'join' ? 'segment active' : 'segment'}
                  onClick={() => setRoomMode('join')}
                >
                  Join room
                </button>
                <button
                  type="button"
                  className={roomMode === 'create' ? 'segment active' : 'segment'}
                  onClick={() => setRoomMode('create')}
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

                <label className="field">
                  <span>{roomMode === 'join' ? 'Room code' : 'Starter room code'}</span>
                  <input
                    value={roomCodeInput}
                    onChange={(event) => setRoomCodeInput(event.target.value.toUpperCase())}
                    placeholder="PIKA42"
                  />
                </label>

                <button type="button" className="primary-button" onClick={handleEnterRoom}>
                  {roomMode === 'join' ? 'Join the room' : 'Create and enter'}
                </button>

                <p className="support-copy">
                  {roomMode === 'join'
                    ? 'Jump straight into the lobby and see what the room is circling.'
                    : 'Start the room, drop the first option, and become the spark.'}
                </p>
              </div>
            </section>
          ) : null}

          {stage === 'lobby' ? (
            <section className="screen">
              <div className="room-summary">
                <div>
                  <p className="eyebrow">Lobby</p>
                  <h2>{participantCountLabel}</h2>
                </div>
                <div className="summary-stats">
                  <span>{optionCountLabel}</span>
                  <span>Host energy: high</span>
                </div>
              </div>

              <div className="card stack">
                <div className="section-header">
                  <div>
                    <h3>Who’s here</h3>
                    <p>The room already has enough chaos to make this fun.</p>
                  </div>
                </div>
                <div className="participant-list">
                  {participants.map((participant) => (
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
                    <p>Give the room a few contenders. Pika can do the rest.</p>
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

                {options.length === 0 ? (
                  <div className="empty-state">
                    <p>No options yet.</p>
                    <span>Be the first brave little gremlin to throw one in.</span>
                  </div>
                ) : (
                  <div className="option-list">
                    {options.map((option) => (
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
                  onClick={handleStartMatchups}
                  disabled={options.length < 2}
                >
                  Start matchups
                </button>

                <p className="support-copy">
                  Need at least 2 options before the room can start choosing.
                </p>
              </div>
            </section>
          ) : null}

          {stage === 'matchups' ? (
            <section className="screen">
              <div className="progress-header">
                <div>
                  <p className="eyebrow">Matchups</p>
                  <h2>
                    Pick the better vibe {currentMatchupIndex + 1}/{Math.max(matchups.length, 1)}
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
                    onClick={() => handleChooseWinner(currentMatchup.leftOptionId)}
                  >
                    <span className="choice-number">A</span>
                    <strong>{getOptionLabel(currentMatchup.leftOptionId, options)}</strong>
                    <p>Tappable. Decisive. Slightly chaotic.</p>
                  </button>

                  <button
                    type="button"
                    className="choice-card"
                    onClick={() => handleChooseWinner(currentMatchup.rightOptionId)}
                  >
                    <span className="choice-number">B</span>
                    <strong>{getOptionLabel(currentMatchup.rightOptionId, options)}</strong>
                    <p>If this one wins, the room commits with chest.</p>
                  </button>
                </div>
              ) : (
                <div className="empty-state">
                  <p>No matchups ready.</p>
                  <span>Head back and add at least two options first.</span>
                </div>
              )}
            </section>
          ) : null}

          {stage === 'result' ? (
            <section className="screen">
              <div className="result-badge">Winner revealed</div>
              <div className="winner-card">
                <p className="eyebrow">The room has spoken</p>
                <h2>{winnerOption?.label ?? 'Mystery pick'}</h2>
                <p>
                  Tiny electric drumroll complete. Pika says this is the move.
                </p>
              </div>

              <div className="card stack">
                <div className="section-header">
                  <div>
                    <h3>Share the outcome</h3>
                    <p>Send it to the group chat before someone reopens the debate.</p>
                  </div>
                </div>

                <div className="share-box">
                  <p>
                    We used Pika and landed on <strong>{winnerOption?.label ?? 'our winner'}</strong>{' '}
                    in room {ROOM_CODE}. No more “wait what are we doing?” energy.
                  </p>
                </div>

                <button type="button" className="primary-button" onClick={handleCopyShare}>
                  {shareCopied ? 'Copied-ish for the proto' : 'Copy share text'}
                </button>

                <button
                  type="button"
                  className="secondary-button wide"
                  onClick={() => setStage('lobby')}
                >
                  Back to lobby
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