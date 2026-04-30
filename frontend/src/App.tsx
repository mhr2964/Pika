import React, { useMemo, useState } from 'react';

type Screen = 'create' | 'options' | 'matchups' | 'results';

type Room = {
  id: string;
  code: string;
  prompt: string;
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

const MOCK_NETWORK_DELAY_MS = 180;
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

function buildMatchups(options: string[]): Matchup[] {
  const matchups: Matchup[] = [];
  for (let index = 0; index < options.length - 1; index += 2) {
    const left = options[index];
    const right = options[index + 1];
    if (left && right) {
      matchups.push({
        id: `matchup-${index}`,
        left,
        right,
      });
    }
  }

  if (options.length % 2 === 1 && options[options.length - 1]) {
    const carried = options[options.length - 1];
    matchups.push({
      id: `matchup-carry`,
      left: carried,
      right: 'Skip this clash',
    });
  }

  return matchups;
}

const mockRoomFlowAdapter: RoomFlowAdapter = {
  async createRoom(draft) {
    await wait(MOCK_NETWORK_DELAY_MS);
    return {
      id: `room-${Date.now()}`,
      code: makeRoomCode(),
      prompt: draft.prompt.trim() || DEFAULT_PROMPT,
    };
  },

  async saveOptions(_roomId, options) {
    await wait(MOCK_NETWORK_DELAY_MS);
    return options;
  },

  async getMatchups(_roomId, options) {
    await wait(MOCK_NETWORK_DELAY_MS);
    return buildMatchups(options);
  },

  async chooseWinner(_roomId, _matchup, winner) {
    await wait(MOCK_NETWORK_DELAY_MS);
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

function CreateRoomScreen({
  onCreate,
  isBusy,
}: {
  onCreate: (draft: RoomDraft) => Promise<void>;
  isBusy: boolean;
}) {
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!prompt.trim()) {
      setError('Give your room a decision prompt so people know the vibe.');
      return;
    }

    setError('');
    await onCreate({
      prompt,
      name,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <SectionHeader
        eyebrow="Pika room"
        title="Spin up a room in one breath."
        body="Guest-first, zero ceremony. Name the decision, drop your options, and let the room start sparking."
      />

      <div style={{ display: 'grid', gap: 14 }}>
        <label>
          <div style={{ marginBottom: 8, fontWeight: 700 }}>Decision prompt</div>
          <input
            style={inputStyle}
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="What are we picking?"
          />
        </label>

        <label>
          <div style={{ marginBottom: 8, fontWeight: 700 }}>Your name (optional)</div>
          <input
            style={inputStyle}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Host energy, but optional"
          />
        </label>
      </div>

      {error ? (
        <div style={{ color: '#ff9b9b', marginTop: 12, fontWeight: 600 }}>{error}</div>
      ) : null}

      <button type="submit" style={primaryButtonStyle} disabled={isBusy}>
        {isBusy ? 'Opening room…' : 'Create room'}
      </button>

      <p style={{ ...bodyStyle, marginTop: 14 }}>
        Pika note: no logins, no wall of setup, just “let’s decide already.”
      </p>
    </form>
  );
}

function OptionsScreen({
  room,
  initialOptions,
  isBusy,
  onContinue,
}: {
  room: Room;
  initialOptions: string[];
  isBusy: boolean;
  onContinue: (options: string[]) => Promise<void>;
}) {
  const [candidate, setCandidate] = useState('');
  const [options, setOptions] = useState<string[]>(initialOptions);
  const [error, setError] = useState('');

  function addOption() {
    const trimmed = candidate.trim();
    if (!trimmed) {
      setError('Throw in at least one real contender.');
      return;
    }

    if (options.includes(trimmed)) {
      setError('That option is already in the ring.');
      return;
    }

    setOptions((current) => [...current, trimmed]);
    setCandidate('');
    setError('');
  }

  function removeOption(optionToRemove: string) {
    setOptions((current) => current.filter((option) => option !== optionToRemove));
  }

  async function handleContinue() {
    if (options.length < MIN_OPTIONS) {
      setError('You need at least two options before the tiny drama can begin.');
      return;
    }

    setError('');
    await onContinue(options);
  }

  return (
    <div>
      <SectionHeader
        eyebrow={`Room ${room.code}`}
        title={room.prompt}
        body="Add the contenders. Keep it messy, weird, and honest — Pika can handle a little chaos."
      />

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
          Room code <strong style={{ color: '#fff' }}>{room.code}</strong> — pass it around if
          your people are fashionably late.
        </div>
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        {options.length === 0 ? (
          <div style={mutedCardStyle}>
            No options yet. This room is all anticipation and no contenders.
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
                <div style={{ ...bodyStyle, marginTop: 4 }}>Option #{index + 1}</div>
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

      {error ? (
        <div style={{ color: '#ff9b9b', marginTop: 12, fontWeight: 600 }}>{error}</div>
      ) : null}

      <button type="button" style={primaryButtonStyle} disabled={isBusy} onClick={handleContinue}>
        {isBusy ? 'Building matchups…' : 'Start matchups'}
      </button>
    </div>
  );
}

function MatchupScreen({
  room,
  matchups,
  currentMatchupIndex,
  isBusy,
  onPickWinner,
}: {
  room: Room;
  matchups: Matchup[];
  currentMatchupIndex: number;
  isBusy: boolean;
  onPickWinner: (matchup: Matchup, winner: string) => Promise<void>;
}) {
  const currentMatchup = matchups[currentMatchupIndex];
  const progressLabel = `${currentMatchupIndex + 1} / ${matchups.length}`;

  if (!currentMatchup) {
    return null;
  }

  return (
    <div>
      <SectionHeader
        eyebrow={`Room ${room.code}`}
        title="Let the contenders clash."
        body="Pick fast. Overthinking is where good options go to become spreadsheets."
      />

      <div style={{ ...mutedCardStyle, marginBottom: 16 }}>
        <div style={{ fontWeight: 800, marginBottom: 6 }}>Matchup progress</div>
        <div style={bodyStyle}>{progressLabel}</div>
      </div>

      <div style={{ display: 'grid', gap: 16 }}>
        {[currentMatchup.left, currentMatchup.right].map((choice) => (
          <button
            key={choice}
            type="button"
            onClick={() => onPickWinner(currentMatchup, choice)}
            disabled={isBusy}
            style={{
              ...mutedCardStyle,
              width: '100%',
              textAlign: 'left',
              color: '#fff',
              cursor: 'pointer',
              padding: 20,
            }}
          >
            <div style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Tap to advance
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, marginTop: 10 }}>{choice}</div>
          </button>
        ))}
      </div>

      <p style={{ ...bodyStyle, marginTop: 16 }}>
        One dominant move: choose the option with the stronger pull right now.
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
        title="We have a winner."
        body="The room has spoken. No committee fog, no endless maybe spiral."
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
        <div style={{ fontSize: 32, fontWeight: 900, marginTop: 8 }}>{winner}</div>
        <p style={{ ...bodyStyle, marginTop: 10 }}>
          Certified by vibes and a tiny bit of structured conflict.
        </p>
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        {rest.map((option, index) => (
          <div key={option} style={mutedCardStyle}>
            <strong>#{index + 2}</strong> {option}
          </div>
        ))}
      </div>

      <button type="button" style={primaryButtonStyle} onClick={onRestart}>
        Start a fresh room
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

  async function handleCreateRoom(draft: RoomDraft) {
    setIsBusy(true);
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
    } finally {
      setIsBusy(false);
    }
  }

  async function handleSaveOptions(options: string[]) {
    if (!flowState.room) {
      return;
    }

    setIsBusy(true);
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
    } finally {
      setIsBusy(false);
    }
  }

  async function handlePickWinner(matchup: Matchup, winner: string) {
    if (!flowState.room) {
      return;
    }

    setIsBusy(true);
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
    setScreen('create');
  }

  return (
    <main style={appShellStyle}>
      <section style={panelStyle}>
        {screen === 'create' ? (
          <CreateRoomScreen onCreate={handleCreateRoom} isBusy={isBusy} />
        ) : null}

        {screen === 'options' && flowState.room ? (
          <OptionsScreen
            room={flowState.room}
            initialOptions={flowState.options}
            isBusy={isBusy}
            onContinue={handleSaveOptions}
          />
        ) : null}

        {screen === 'matchups' && flowState.room ? (
          <MatchupScreen
            room={flowState.room}
            matchups={matchups}
            currentMatchupIndex={flowState.currentMatchupIndex}
            isBusy={isBusy}
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