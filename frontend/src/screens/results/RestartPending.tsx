import React from 'react';

type RestartPendingProps = {
  isHost?: boolean;
  onStartNextRound?: () => void;
};

export function RestartPending({
  isHost = false,
  onStartNextRound,
}: RestartPendingProps) {
  return (
    <main>
      <section>
        <p>Same room. Fresh chaos.</p>
        <h1>{isHost ? 'Room reset and ready.' : 'Waiting for the host.'}</h1>
        <p>
          {isHost
            ? 'Start the next round when everyone is set.'
            : 'The next round will kick off as soon as the host starts it.'}
        </p>
        {isHost ? (
          <button type="button" onClick={onStartNextRound}>
            Start next round
          </button>
        ) : null}
      </section>
    </main>
  );
}