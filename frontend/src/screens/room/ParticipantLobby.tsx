import React from 'react';

type ParticipantLobbyProps = {
  roomCode: string;
  hostName?: string;
  playerCount?: number;
};

export function ParticipantLobby({
  roomCode,
  hostName = 'Host',
  playerCount = 1,
}: ParticipantLobbyProps) {
  return (
    <main>
      <section>
        <p>You’re in. Waiting for the fuse.</p>
        <h1>Room {roomCode}</h1>
        <p>{hostName} will start when the room is ready.</p>
        <p>{playerCount} player{playerCount === 1 ? '' : 's'} in the room.</p>
      </section>
    </main>
  );
}