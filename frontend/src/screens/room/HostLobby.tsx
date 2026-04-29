import React from 'react';

type Player = {
  id: string;
  name: string;
  status?: string;
};

type HostLobbyProps = {
  roomCode: string;
  players: Player[];
  minimumPlayers?: number;
  canStart?: boolean;
  onCopyCode?: () => void;
  onStartRound?: () => void;
};

export function HostLobby({
  roomCode,
  players,
  minimumPlayers = 2,
  canStart = false,
  onCopyCode,
  onStartRound,
}: HostLobbyProps) {
  return (
    <main>
      <section>
        <p>Host view</p>
        <h1>Room ready? Light the fuse.</h1>
        <p>Code: {roomCode}</p>
        <button type="button" onClick={onCopyCode}>
          Copy code
        </button>
        <h2>Players</h2>
        <ul>
          {players.map((player) => (
            <li key={player.id}>
              {player.name}
              {player.status ? ` — ${player.status}` : ''}
            </li>
          ))}
        </ul>
        <p>
          Need at least {minimumPlayers} players to start. Current count:{' '}
          {players.length}
        </p>
        <button type="button" onClick={onStartRound} disabled={!canStart}>
          Start round
        </button>
      </section>
    </main>
  );
}