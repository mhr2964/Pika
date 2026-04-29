import React from 'react';

type RoomDecisionProps = {
  onCreateRoom?: () => void;
  onJoinRoom?: () => void;
};

export function RoomDecision({
  onCreateRoom,
  onJoinRoom,
}: RoomDecisionProps) {
  return (
    <main>
      <section>
        <p>One choice. Two kinds of chaos.</p>
        <h1>Make the room or jump into one?</h1>
        <div>
          <button type="button" onClick={onCreateRoom}>
            Create room
          </button>
          <button type="button" onClick={onJoinRoom}>
            Join room
          </button>
        </div>
      </section>
    </main>
  );
}