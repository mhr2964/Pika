import { useMemo, useState } from 'react';
import './App.css';

type AppPhase = 'room-entry' | 'room-standings' | 'room-results';

type RoomMode = 'create' | 'join';

type RoomMember = {
  id: string;
  name: string;
  isHost: boolean;
  isYou: boolean;
  points: number;
  status: 'ready' | 'ranking' | 'locked';
};

type RoomStanding = {
  playerId: string;
  playerName: string;
  points: number;
  deltaLabel: string;
  vibe: string;
};

type FinalResultCard = {
  id: string;
  rank: number;
  title: string;
  summary: string;
  supportLabel: string;
};

type RoomState = {
  roomCode: string;
  hostName: string;
  youName: string;
  status: 'ranking' | 'results';
  roundLabel: string;
  roomPrompt: string;
  playerCount: number;
  players: RoomMember[];
  standings: RoomStanding[];
  finalResults: FinalResultCard[];
};

type CreateRoomPayload = {
  hostName: string;
  roomPrompt: string;
};

type JoinRoomPayload = {
  roomCode: string;
  playerName: string;
};

function createMockRoomState(payload: CreateRoomPayload): RoomState {
  return {
    roomCode: 'PIKA42',
    hostName: payload.hostName.trim(),
    youName: payload.hostName.trim(),
    status: 'ranking',
    roundLabel: 'Round 1 of 3',
    roomPrompt: payload.roomPrompt.trim(),
    playerCount: 4,
    players: [
      {
        id: 'player-you',
        name: payload.hostName.trim(),
        isHost: true,
        isYou: true,
        points: 18,
        status: 'locked',
      },
      {
        id: 'player-zoe',
        name: 'Zoe',
        isHost: false,
        isYou: false,
        points: 17,
        status: 'locked',
      },
      {
        id: 'player-omar',
        name: 'Omar',
        isHost: false,
        isYou: false,
        points: 13,
        status: 'locked',
      },
      {
        id: 'player-lina',
        name: 'Lina',
        isHost: false,
        isYou: false,
        points: 11,
        status: 'locked',
      },
    ],
    standings: [
      {
        playerId: 'player-you',
        playerName: payload.hostName.trim(),
        points: 18,
        deltaLabel: '+6 this round',
        vibe: 'You picked the calm power move.',
      },
      {
        playerId: 'player-zoe',
        playerName: 'Zoe',
        points: 17,
        deltaLabel: '+7 this round',
        vibe: 'One spicy upset away.',
      },
      {
        playerId: 'player-omar',
        playerName: 'Omar',
        points: 13,
        deltaLabel: '+5 this round',
        vibe: 'Still absolutely in this.',
      },
      {
        playerId: 'player-lina',
        playerName: 'Lina',
        points: 11,
        deltaLabel: '+4 this round',
        vibe: 'Quietly collecting believers.',
      },
    ],
    finalResults: [
      {
        id: 'result-1',
        rank: 1,
        title: 'Lantern rooftop noodles',
        summary: 'Warm lights, open-air table, and exactly enough chaos to feel memorable.',
        supportLabel: 'Won with 14 room points',
      },
      {
        id: 'result-2',
        rank: 2,
        title: 'Late museum + pastry crawl',
        summary: 'A small adventure with soft edges and multiple bailout points.',
        supportLabel: 'Finished 2 points behind',
      },
      {
        id: 'result-3',
        rank: 3,
        title: 'Back-pocket board game night',
        summary: 'Low lift, high loyalty, very hard to regret.',
        supportLabel: 'Stayed lovable to the end',
      },
    ],
  };
}

function joinMockRoomState(payload: JoinRoomPayload): RoomState {
  return {
    roomCode: payload.roomCode.trim().toUpperCase(),
    hostName: 'Mika',
    youName: payload.playerName.trim(),
    status: 'ranking',
    roundLabel: 'Round 2 of 3',
    roomPrompt: 'Pick the best low-pressure Saturday plan for four overbooked friends.',
    playerCount: 4,
    players: [
      {
        id: 'player-mika',
        name: 'Mika',
        isHost: true,
        isYou: false,
        points: 24,
        status: 'locked',
      },
      {
        id: 'player-you',
        name: payload.playerName.trim(),
        isHost: false,
        isYou: true,
        points: 22,
        status: 'locked',
      },
      {
        id: 'player-jules',
        name: 'Jules',
        isHost: false,
        isYou: false,
        points: 18,
        status: 'locked',
      },
      {
        id: 'player-rio',
        name: 'Rio',
        isHost: false,
        isYou: false,
        points: 16,
        status: 'locked',
      },
    ],
    standings: [
      {
        playerId: 'player-mika',
        playerName: 'Mika',
        points: 24,
        deltaLabel: '+9 this round',
        vibe: 'Host energy, unfortunately effective.',
      },
      {
        playerId: 'player-you',
        playerName: payload.playerName.trim(),
        points: 22,
        deltaLabel: '+8 this round',
        vibe: 'Neck and neck, very Pika.',
      },
      {
        playerId: 'player-jules',
        playerName: 'Jules',
        points: 18,
        deltaLabel: '+6 this round',
        vibe: 'A comeback with intent.',
      },
      {
        playerId: 'player-rio',
        playerName: 'Rio',
        points: 16,
        deltaLabel: '+5 this round',
        vibe: 'Still holding mystery value.',
      },
    ],
    finalResults: [
      {
        id: 'join-result-1',
        rank: 1,
        title: 'Sunset dumplings on the patio',
        summary: 'Easy to say yes to, easy to extend if the night gets legs.',
        supportLabel: 'Crowned by 4 players',
      },
      {
        id: 'join-result-2',
        rank: 2,
        title: 'Bookstore drift + ramen stop',
        summary: 'Low-pressure wandering with a clean, warm finish.',
        supportLabel: 'Missed first by 2 votes',
      },
      {
        id: 'join-result-3',
        rank: 3,
        title: 'Picnic snacks and people-watching lap',
        summary: 'Cheap, forgiving, and somehow still iconic.',
        supportLabel: 'The dark horse everyone respected',
      },
    ],
  };
}

const roomFlowAdapter = {
  createRoom(payload: CreateRoomPayload) {
    return createMockRoomState(payload);
  },
  joinRoom(payload: JoinRoomPayload) {
    return joinMockRoomState(payload);
  },
};

function App() {
  const [phase, setPhase] = useState<AppPhase>('room-entry');
  const [roomMode, setRoomMode] = useState<RoomMode>('create');
  const [createHostName, setCreateHostName] = useState('Avery');
  const [createRoomPrompt, setCreateRoomPrompt] = useState(
    'Pick the best low-lift plan for a team that wants one excellent decision.'
  );
  const [joinRoomCode, setJoinRoomCode] = useState('PIKA42');
  const [joinPlayerName, setJoinPlayerName] = useState('June');
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canCreateRoom = createHostName.trim().length > 0 && createRoomPrompt.trim().length > 0;
  const canJoinRoom = joinRoomCode.trim().length > 0 && joinPlayerName.trim().length > 0;

  const adapterFieldSummary = useMemo(
    () => ({
      roomState:
        'roomCode, hostName, youName, status, roundLabel, roomPrompt, playerCount, players, standings, finalResults',
      players: 'id, name, isHost, isYou, points, status',
      standings: 'playerId, playerName, points, deltaLabel, vibe',
      finalResults: 'id, rank, title, summary, supportLabel',
    }),
    []
  );

  function handleContinueFromEntry() {
    if (roomMode === 'create') {
      if (!canCreateRoom) {
        setErrorMessage('Add a host name and one sharp prompt so the room knows what it is deciding.');
        return;
      }

      setRoomState(
        roomFlowAdapter.createRoom({
          hostName: createHostName,
          roomPrompt: createRoomPrompt,
        })
      );
      setErrorMessage(null);
      setPhase('room-standings');
      return;
    }

    if (!canJoinRoom) {
      setErrorMessage('Add a room code and your name so Pika knows where to drop you.');
      return;
    }

    setRoomState(
      roomFlowAdapter.joinRoom({
        roomCode: joinRoomCode,
        playerName: joinPlayerName,
      })
    );
    setErrorMessage(null);
    setPhase('room-standings');
  }

  function handleRevealResults() {
    if (!roomState) {
      return;
    }

    setRoomState({
      ...roomState,
      status: 'results',
    });
    setPhase('room-results');
  }

  function handleBackToEntry() {
    setPhase('room-entry');
    setRoomState(null);
    setErrorMessage(null);
  }

  return (
    <div className="app-shell">
      <div className="phone-frame">
        <div className="app-panel">
          <header className="topbar">
            <div>
              <p className="eyebrow">Pika rooms</p>
              <h1>Get the room in, let the ranking speak, then land one winning answer.</h1>
            </div>
          </header>

          <main className="screen">
            {phase === 'room-entry' ? (
              <>
                <section className="hero-card">
                  <p className="hero-kicker">One room. One scoreline. One answer everyone can point at.</p>
                  <h2>Create the room or join it fast — then let Pika make the standings emotionally obvious.</h2>
                  <p className="hero-copy">
                    This thin slice freezes scope to exactly three screens: entry, live standings, and final results.
                  </p>
                </section>

                {errorMessage ? (
                  <div className="error-banner" role="alert">
                    {errorMessage}
                  </div>
                ) : null}

                <section className="card stack">
                  <div className="room-mode-toggle">
                    <button
                      type="button"
                      className={roomMode === 'create' ? 'primary-button' : 'secondary-button'}
                      onClick={() => setRoomMode('create')}
                    >
                      Create room
                    </button>
                    <button
                      type="button"
                      className={roomMode === 'join' ? 'primary-button' : 'secondary-button'}
                      onClick={() => setRoomMode('join')}
                    >
                      Join room
                    </button>
                  </div>

                  {roomMode === 'create' ? (
                    <>
                      <div className="section-header">
                        <div>
                          <h3>Open a room</h3>
                          <p>Give the room a host name and one clean prompt. Pika handles the scoreboard mood swing.</p>
                        </div>
                      </div>

                      <label className="field">
                        <span>Host name</span>
                        <input
                          value={createHostName}
                          onChange={(event) => setCreateHostName(event.target.value)}
                          placeholder="Avery"
                        />
                      </label>

                      <label className="field">
                        <span>Room prompt</span>
                        <textarea
                          value={createRoomPrompt}
                          onChange={(event) => setCreateRoomPrompt(event.target.value)}
                          placeholder="Choose the best low-pressure dinner plan for the team."
                          rows={4}
                        />
                      </label>
                    </>
                  ) : (
                    <>
                      <div className="section-header">
                        <div>
                          <h3>Slide into a room</h3>
                          <p>Bring the code, bring your name, and let the standings do the social compression.</p>
                        </div>
                      </div>

                      <label className="field">
                        <span>Room code</span>
                        <input
                          value={joinRoomCode}
                          onChange={(event) => setJoinRoomCode(event.target.value.toUpperCase())}
                          placeholder="PIKA42"
                        />
                      </label>

                      <label className="field">
                        <span>Your name</span>
                        <input
                          value={joinPlayerName}
                          onChange={(event) => setJoinPlayerName(event.target.value)}
                          placeholder="June"
                        />
                      </label>
                    </>
                  )}

                  <div className="adapter-box">
                    <p>
                      <strong>Adapter boundary:</strong> createRoom(payload) / joinRoom(payload) → RoomState using
                      assumed fields: {adapterFieldSummary.roomState}.
                    </p>
                  </div>

                  <button type="button" className="primary-button" onClick={handleContinueFromEntry}>
                    {roomMode === 'create' ? 'Open room and view standings' : 'Join room and view standings'}
                  </button>
                </section>
              </>
            ) : null}

            {phase === 'room-standings' && roomState ? (
              <>
                <section className="hero-card">
                  <p className="hero-kicker">
                    Room {roomState.roomCode} · {roomState.roundLabel}
                  </p>
                  <h2>{roomState.roomPrompt}</h2>
                  <p className="hero-copy">
                    {roomState.playerCount} players in orbit. The board below is the live ranking snapshot.
                  </p>
                </section>

                <section className="card stack">
                  <div className="section-header">
                    <div>
                      <h3>Live standings</h3>
                      <p>Assumed standings fields: {adapterFieldSummary.standings}.</p>
                    </div>
                  </div>

                  <div className="standings-list">
                    {roomState.standings.map((standing, index) => (
                      <div key={standing.playerId} className="standing-row">
                        <div className="standing-rank">#{index + 1}</div>
                        <div className="standing-copy">
                          <strong>{standing.playerName}</strong>
                          <p>{standing.vibe}</p>
                        </div>
                        <div className="standing-points">
                          <strong>{standing.points}</strong>
                          <span>{standing.deltaLabel}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="adapter-box">
                    <p>
                      <strong>Assumed player fields:</strong> {adapterFieldSummary.players}.
                    </p>
                  </div>

                  <button type="button" className="primary-button" onClick={handleRevealResults}>
                    Reveal final results
                  </button>
                  <button type="button" className="text-button" onClick={handleBackToEntry}>
                    Back to entry
                  </button>
                </section>
              </>
            ) : null}

            {phase === 'room-results' && roomState ? (
              <>
                <section className="winner-card">
                  <p className="eyebrow">Final results</p>
                  <h2>{roomState.finalResults[0]?.title}</h2>
                  <p>{roomState.finalResults[0]?.summary}</p>
                </section>

                <section className="card stack">
                  <div className="section-header">
                    <div>
                      <h3>Full podium</h3>
                      <p>Assumed result fields: {adapterFieldSummary.finalResults}.</p>
                    </div>
                  </div>

                  <div className="results-list">
                    {roomState.finalResults.map((finalResult) => (
                      <div key={finalResult.id} className="result-row">
                        <span className="room-code-pill">#{finalResult.rank}</span>
                        <div className="standing-copy">
                          <strong>{finalResult.title}</strong>
                          <p>{finalResult.summary}</p>
                        </div>
                        <span className="result-support">{finalResult.supportLabel}</span>
                      </div>
                    ))}
                  </div>

                  <div className="adapter-box">
                    <p>
                      <strong>Mock/local fixtures only:</strong> swap the roomFlowAdapter implementation with backend
                      calls and keep the same RoomState, standings, and finalResults shapes.
                    </p>
                  </div>

                  <button type="button" className="primary-button" onClick={handleBackToEntry}>
                    Start another room
                  </button>
                </section>
              </>
            ) : null}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;