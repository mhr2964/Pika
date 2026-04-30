import React, { useMemo, useState } from 'react';

type Screen = 'create' | 'options' | 'matchups' | 'results';

type Room = {
  id: string;
  code: string;
  prompt: string;
  hostName?: string;
};

type Matchup = {
  id: string;
  left: string;
  right: string;
};

type RoomDraft = {
  prompt: string;
  name: string;
};

type RoomFlowState = {
  room: Room | null;
  options: string[];
  currentMatchupIndex: number;
  matchupWinners: string[];
};

type RoomFlowAdapter = {
  createRoom: (draft: RoomDraft) => Promise<Room>;
  saveOptions: (roomId: string, options: string[]) => Promise<string[]>;
  getMatchups: (roomId: string, options: string[]) => Promise<Matchup[]>;
  chooseWinner: (
    roomId: string,
    matchup: Matchup,
    winner: string
  ) => Promise<{ winner: string }>;
  getResults: (
    roomId: string,
    winners: string[],
    options: string[]
  ) => Promise<string[]>;
};

const MOCK_NETWORK_DELAY_MS = 220;
const MIN_OPTIONS = 2;
const DEFAULT_PROMPT = 'What should we do tonight?';

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function makeRoomCode() {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';

  for (let index = 0; index < 5; index += 1) {
    code += letters[Math.floor(Math.random() * letters.length)];
  }

  return code;
}

function normalizeOption(option: string) {
  return option.trim().replace(/\s+/g, ' ');
}

function dedupeOptions(options: string[]) {
  const seen = new Set<string>();
  return options.filter((option) => {
    const normalizedKey = option.toLocaleLowerCase();
    if (seen.has(normalizedKey)) {
      return false;
    }
    seen.add(normalizedKey);
    return true;
  });
}

function buildMatchups(options: string[]): Matchup[] {
  const normalizedOptions = dedupeOptions(
    options.map(normalizeOption).filter((option) => option.length > 0)
  );

  const matchups: Matchup[] = [];
  for (let index = 0; index < normalizedOptions.length; index += 2) {
    const left = normalizedOptions[index];
    const right = normalizedOptions[index + 1];

    if (left && right) {
      matchups.push({
        id: `matchup-${index}`,
        left,
        right,
      });
      continue;
    }

    if (left) {
      matchups.push({
        id: `matchup-bye-${index}`,
        left,
        right: 'Bye to the next round',
      });
    }
  }

  return matchups;
}

const mockRoomFlowAdapter: RoomFlowAdapter = {
  async createRoom(draft) {
    await wait(MOCK_NETWORK_DELAY_MS);

    if (draft.prompt.toLocaleLowerCase().includes('error')) {
      throw new Error('Mock adapter refused that prompt. Try a friendlier one.');
    }

    return {
      id: `room-${Date.now()}`,
      code: makeRoomCode(),
      prompt: normalizeOption(draft.prompt) || DEFAULT_PROMPT,
      hostName: normalizeOption(draft.name),
    };
  },

  async saveOptions(_roomId, options) {
    await wait(MOCK_NETWORK_DELAY_MS);

    const normalizedOptions = dedupeOptions(
      options.map(normalizeOption).filter((option) => option.length > 0)
    );

    if (normalizedOptions.length < MIN_OPTIONS) {
      throw new Error('You need at least two real contenders to start matchups.');
    }

    return normalizedOptions;
  },

  async getMatchups(_roomId, options) {
    await wait(MOCK_NETWORK_DELAY_MS);
    return buildMatchups(options);
  },

  async chooseWinner(_roomId, matchup, winner) {
    await wait(MOCK_NETWORK_DELAY_MS);

    if (winner !== matchup.left && winner !== matchup.right) {
      throw new Error('Winner must be one of the displayed options.');
    }

    return { winner };
  },

  async getResults(_roomId, winners, options) {
    await wait(MOCK_NETWORK_DELAY_MS);

    const tally = new Map<string, number>();
    options.forEach((option) => {
      tally.set(option, 0);
    });

    winners.forEach((winner, index) => {
      const points = winners.length - index;
      tally.set(winner, (tally.get(winner) ?? 0) + points);
    });

    return [...tally.entries()]
      .sort((left, right) => right[1] - left[1])
      .map(([option]) => option);
  },
};

const appShellStyle: React.CSSProperties = {
  minHeight: '100vh',
  background:
    'radial-gradient(circle at top, rgba(255, 215, 102, 0.24), transparent 35%), linear-gradient(180deg, #151521 0%, #0f1020 100%)',
  color: '#f8f7ff',
  display: 'flex',
  justifyContent: 'center',
  padding: '32px 16px',
  fontFamily:
    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

const panelStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: 720,
  background: 'rgba(21, 24, 42, 0.92)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 24,
  boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
  padding: 24,
  backdropFilter: 'blur(12px)',
};

const eyebrowStyle: React.CSSProperties = {
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  fontSize: 12,
  color: '#f8c95b',
  fontWeight: 700,
  marginBottom: 12,
};

const titleStyle: React.CSSProperties = {
  fontSize: 34,
  lineHeight: 1.05,
  margin: '0 0 12px 0',
};

const bodyStyle: React.CSSProperties = {
  fontSize: 16,
  lineHeight: 1.5,
  color: 'rgba(248, 247, 255, 0.82)',
  margin: 0,
};

const primaryButtonStyle: React.CSSProperties = {
  width: '100%',
  border: 0,
  borderRadius: 16,
  background: 'linear-gradient(135deg, #ffd666 0%, #ff9f5a 100%)',
  color: '#1a1630',
  fontWeight: 800,
  fontSize: 16,
  padding: '16px 18px',
  cursor: 'pointer',
  marginTop: 16,
};

const secondaryButtonStyle: React.CSSProperties = {
  border: '1px solid rgba(255,255,255,0.14)',
  borderRadius: 14,
  background: 'transparent',
  color: '#f8f7ff',
  fontWeight: 700,
  fontSize: 14,
  padding: '12px 14px',
  cursor: 'pointer',
};

const optionButtonStyle: React.CSSProperties = {
  width: '100%',
  textAlign: 'left',
  color: '#fff',
  background: 'rgba(255,255,255,0.05)',
  cursor: 'pointer',
  padding: 20,
  borderRadius: 18,
  border: '1px solid rgba(255,255,255,0.1)',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  background: 'rgba(255,255,255,0.06)',
  color: '#fff',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 14,
  padding: '14px 16px',
  fontSize: 16,
  outline: 'none',
};

const mutedCardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 18,
  padding: 16,
};

function SectionHeader({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <header style={{ marginBottom: 24 }}>
      <div style={eyebrowStyle}>{eyebrow}</div>
      <h1 style={titleStyle}>{title}</h1>
      <p style={bodyStyle}>{body}</p>
    </header>
  );
}

function ErrorBanner({ message }: { message: string }) {
  if (!message) {
    return null;
  }

  return (
    <div
      role="alert"
      style={{
        marginTop: 12,
        marginBottom: 12,
        borderRadius: 14,
        padding: '12px 14px',
        background: 'rgba(255, 96, 96, 0.12)',
        border: '1px solid rgba(255, 140, 140, 0.28)',
        color: '#ffd4d4',
        fontWeight: 700,
      }}
    >
      {message}
    </div>
  );
}

function StatusPill({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        borderRadius: 999,
        padding: '8px 12px',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.08)',
        fontSize: 13,
        color: 'rgba(248, 247, 255, 0.84)',
      }}
    >
      {children}
    </div>
  );
}

function CreateRoomScreen({
  onCreate,
  isBusy,
  errorMessage,
}: {
  onCreate: (draft: RoomDraft) => Promise<void>;
  isBusy: boolean;
  errorMessage: string;
}) {
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [name, setName] = useState('');
  const [localError, setLocalError] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!prompt.trim()) {
      setLocalError('Pick a prompt first so the room knows what it is deciding.');
      return;
    }

    setLocalError('');
    await onCreate({
      prompt,
      name,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <SectionHeader
        eyebrow="Start a room"
        title="Start a room"
        body="Pick a prompt, invite your people, and let the tiny tournament begin."
      />

      <div style={{ display: 'grid', gap: 14 }}>
        <label>
          <div style={{ marginBottom: 8, fontWeight: 700 }}>Prompt</div>
          <input
            style={inputStyle}
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="What are we deciding?"
          />
        </label>

        <label>
          <div style={{ marginBottom: 8, fontWeight: 700 }}>Your name (optional)</div>
          <input
            style={inputStyle}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Host name, nickname, or mystery"
          />
        </label>
      </div>

      <ErrorBanner message={localError || errorMessage} />

      <button type="submit" style={primaryButtonStyle} disabled={isBusy}>
        {isBusy ? 'Starting room…' : 'Create room'}
      </button>

      <p style={{ ...bodyStyle, marginTop: 14 }}>
        Guest-first and gloriously low-friction. No login wall, just momentum.
      </p>
    </form>
  );
}

function OptionsScreen({
  room,
  initialOptions,
  isBusy,
  errorMessage,
  onContinue,
}: {
  room: Room;
  initialOptions: string[];
  isBusy: boolean;
  errorMessage: string;
  onContinue: (options: string[]) => Promise<void>;
}) {
  const [candidate, setCandidate] = useState('');
  const [options, setOptions] = useState<string[]>(initialOptions);
  const [localError, setLocalError] = useState('');

  function addOption() {
    const trimmed = normalizeOption(candidate);

    if (!trimmed) {
      setLocalError('Add a real option. “Something fun” is a vibe, not a contender.');
      return;
    }

    if (options.some((option) => option.toLocaleLowerCase() === trimmed.toLocaleLowerCase())) {
      setLocalError('That contender is already in the bracket.');
      return;
    }

    setOptions((current) => [...current, trimmed]);
    setCandidate('');
    setLocalError('');
  }

  function removeOption(optionToRemove: string) {
    setOptions((current) => current.filter((option) => option !== optionToRemove));
    setLocalError('');
  }

  async function handleContinue() {
    if (options.length < MIN_OPTIONS) {
      setLocalError('You need at least two options before the tiny tournament can begin.');
      return;
    }

    setLocalError('');
    await onContinue(options);
  }

  return (
    <div>
      <SectionHeader
        eyebrow={`Room ${room.code}`}
        title={room.prompt}
        body="Add the contenders, trim the obvious no’s, then let the bracket do its little drama."
      />

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 18 }}>
        <StatusPill>Guest mode is on</StatusPill>
        {room.hostName ? <StatusPill>Hosted by {room.hostName}</StatusPill> : null}
        <StatusPill>Share code {room.code}</StatusPill>
      </div>

      <div style={{ ...mutedCardStyle, marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <input
            style={inputStyle}
            value={candidate}
            onChange={(event) => setCandidate(event.target.value)}
            placeholder="Add an option"
          />
          <button type="button" style={secondaryButtonStyle} onClick={addOption}>
            Add
          </button>
        </div>
        <div style={{ ...bodyStyle, marginTop: 10 }}>
          Drop in ideas fast. Pika works best before the group chat mutates into a committee.
        </div>
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        {options.length === 0 ? (
          <div style={mutedCardStyle}>
            No options yet. The bracket is hungry and emotionally available.
          </div>
        ) : (
          options.map((option, index) => (
            <div
              key={option}
              style={{
                ...mutedCardStyle,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <div>
                <div style={{ fontWeight: 800 }}>{option}</div>
                <div style={{ ...bodyStyle, marginTop: 4 }}>Contender #{index + 1}</div>
              </div>
              <button
                type="button"
                style={secondaryButtonStyle}
                onClick={() => removeOption(option)}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      <ErrorBanner message={localError || errorMessage} />

      <button type="button" style={primaryButtonStyle} disabled={isBusy} onClick={handleContinue}>
        {isBusy ? 'Building bracket…' : 'Start matchups'}
      </button>
    </div>
  );
}

function MatchupScreen({
  room,
  matchups,
  currentMatchupIndex,
  isBusy,
  errorMessage,
  onPickWinner,
}: {
  room: Room;
  matchups: Matchup[];
  currentMatchupIndex: number;
  isBusy: boolean;
  errorMessage: string;
  onPickWinner: (matchup: Matchup, winner: string) => Promise<void>;
}) {
  const currentMatchup = matchups[currentMatchupIndex];

  if (!currentMatchup) {
    return null;
  }

  return (
    <div>
      <SectionHeader
        eyebrow={`Room ${room.code}`}
        title="Pick the one with more pull."
        body="No spreadsheets. No speeches. Just choose the option that wins the moment."
      />

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
        <StatusPill>
          Matchup {currentMatchupIndex + 1} of {matchups.length}
        </StatusPill>
        <StatusPill>One tap decides</StatusPill>
      </div>

      <div style={{ display: 'grid', gap: 16 }}>
        {[currentMatchup.left, currentMatchup.right].map((choice) => (
          <button
            key={choice}
            type="button"
            onClick={() => onPickWinner(currentMatchup, choice)}
            disabled={isBusy}
            style={optionButtonStyle}
          >
            <div style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Tap to advance
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, marginTop: 10 }}>{choice}</div>
          </button>
        ))}
      </div>

      <ErrorBanner message={errorMessage} />

      <p style={{ ...bodyStyle, marginTop: 16 }}>
        Pika rule: if you pause long enough to make a slideshow, you waited too long.
      </p>
    </div>
  );
}

function ResultsScreen({
  room,
  rankedOptions,
  onRestart,
}: {
  room: Room;
  rankedOptions: string[];
  onRestart: () => void;
}) {
  const [winner, ...rest] = rankedOptions;

  return (
    <div>
      <SectionHeader
        eyebrow={`Room ${room.code}`}
        title="Winner picked."
        body="The room has spoken. Tiny tournament complete."
      />

      <div
        style={{
          background: 'linear-gradient(135deg, rgba(255,214,102,0.18), rgba(255,159,90,0.12))',
          border: '1px solid rgba(255,214,102,0.3)',
          borderRadius: 20,
          padding: 22,
          marginBottom: 20,
        }}
      >
        <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          Top pick
        </div>
        <div style={{ fontSize: 32, fontWeight: 900, marginTop: 8 }}>
          {winner || 'No winner yet'}
        </div>
        <p style={{ ...bodyStyle, marginTop: 10 }}>
          Decided with vibes, clicks, and just enough structure to stop the spiral.
        </p>
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        {rest.length === 0 ? (
          <div style={mutedCardStyle}>No runners-up this round. Clean sweep energy.</div>
        ) : (
          rest.map((option, index) => (
            <div key={option} style={mutedCardStyle}>
              <strong>#{index + 2}</strong> {option}
            </div>
          ))
        )}
      </div>

      <button type="button" style={primaryButtonStyle} onClick={onRestart}>
        Start another room
      </button>
    </div>
  );
}

export default function App() {
  const adapter = useMemo(() => mockRoomFlowAdapter, []);
  const [screen, setScreen] = useState<Screen>('create');
  const [flowState, setFlowState] = useState<RoomFlowState>({
    room: null,
    options: [],
    currentMatchupIndex: 0,
    matchupWinners: [],
  });
  const [matchups, setMatchups] = useState<Matchup[]>([]);
  const [rankedOptions, setRankedOptions] = useState<string[]>([]);
  const [isBusy, setIsBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleCreateRoom(draft: RoomDraft) {
    setIsBusy(true);
    setErrorMessage('');

    try {
      const room = await adapter.createRoom(draft);
      setFlowState({
        room,
        options: [],
        currentMatchupIndex: 0,
        matchupWinners: [],
      });
      setMatchups([]);
      setRankedOptions([]);
      setScreen('options');
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Could not create room. Try again.'
      );
    } finally {
      setIsBusy(false);
    }
  }

  async function handleSaveOptions(options: string[]) {
    if (!flowState.room) {
      return;
    }

    setIsBusy(true);
    setErrorMessage('');

    try {
      const savedOptions = await adapter.saveOptions(flowState.room.id, options);
      const nextMatchups = await adapter.getMatchups(flowState.room.id, savedOptions);

      setFlowState((current) => ({
        ...current,
        options: savedOptions,
        currentMatchupIndex: 0,
        matchupWinners: [],
      }));
      setMatchups(nextMatchups);
      setScreen('matchups');
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Could not save options. Try again.'
      );
    } finally {
      setIsBusy(false);
    }
  }

  async function handlePickWinner(matchup: Matchup, winner: string) {
    if (!flowState.room) {
      return;
    }

    setIsBusy(true);
    setErrorMessage('');

    try {
      const result = await adapter.chooseWinner(flowState.room.id, matchup, winner);
      const nextWinners = [...flowState.matchupWinners, result.winner];
      const nextIndex = flowState.currentMatchupIndex + 1;

      if (nextIndex >= matchups.length) {
        const results = await adapter.getResults(
          flowState.room.id,
          nextWinners,
          flowState.options
        );
        setFlowState((current) => ({
          ...current,
          currentMatchupIndex: nextIndex,
          matchupWinners: nextWinners,
        }));
        setRankedOptions(results);
        setScreen('results');
        return;
      }

      setFlowState((current) => ({
        ...current,
        currentMatchupIndex: nextIndex,
        matchupWinners: nextWinners,
      }));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Could not record winner. Try again.'
      );
    } finally {
      setIsBusy(false);
    }
  }

  function handleRestart() {
    setFlowState({
      room: null,
      options: [],
      currentMatchupIndex: 0,
      matchupWinners: [],
    });
    setMatchups([]);
    setRankedOptions([]);
    setErrorMessage('');
    setScreen('create');
  }

  return (
    <main style={appShellStyle}>
      <section style={panelStyle}>
        {screen === 'create' ? (
          <CreateRoomScreen
            onCreate={handleCreateRoom}
            isBusy={isBusy}
            errorMessage={errorMessage}
          />
        ) : null}

        {screen === 'options' && flowState.room ? (
          <OptionsScreen
            room={flowState.room}
            initialOptions={flowState.options}
            isBusy={isBusy}
            errorMessage={errorMessage}
            onContinue={handleSaveOptions}
          />
        ) : null}

        {screen === 'matchups' && flowState.room ? (
          <MatchupScreen
            room={flowState.room}
            matchups={matchups}
            currentMatchupIndex={flowState.currentMatchupIndex}
            isBusy={isBusy}
            errorMessage={errorMessage}
            onPickWinner={handlePickWinner}
          />
        ) : null}

        {screen === 'results' && flowState.room ? (
          <ResultsScreen
            room={flowState.room}
            rankedOptions={rankedOptions}
            onRestart={handleRestart}
          />
        ) : null}
      </section>
    </main>
  );
}