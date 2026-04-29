import React from 'react';

type EmptyRoomProps = {
  isHost?: boolean;
  onInvite?: () => void;
};

export function EmptyRoom({ isHost = false, onInvite }: EmptyRoomProps) {
  return (
    <main>
      <section>
        <h1>No crowd yet.</h1>
        <p>
          {isHost
            ? 'Share the room and bring in a few more sparks.'
            : 'The room is real. It just needs more people.'}
        </p>
        {isHost ? (
          <button type="button" onClick={onInvite}>
            Invite players
          </button>
        ) : null}
      </section>
    </main>
  );
}