import React from 'react';
import { AppShell } from '../../components/AppShell';
import { RoomState } from '../../types/pika';

type OutcomeScreenProps = {
  room: RoomState;
  onPlayAgain: () => void;
  onStartOver: () => void;
};

export function OutcomeScreen({
  room,
  onPlayAgain,
  onStartOver,
}: OutcomeScreenProps) {
  const winningOption = room.options.find(
    (option) => option.id === room.winningOptionId,
  );

  return (
    <AppShell
      eyebrow="Results"
      title={winningOption ? `${winningOption.label} wins the room.` : 'No winner yet.'}
      subtitle="Make the result feel instant, then tee up the next move while the energy is hot."
    >
      <div className="stack-lg">
        {winningOption ? (
          <div className="winner-card">
            <p className="winner-card__eyebrow">Room verdict</p>
            <h2>{winningOption.label}</h2>
            <p>{winningOption.votes} votes pushed it over the line.</p>
          </div>
        ) : (
          <div className="state-card state-card--empty">
            <p className="state-card__title">No result to show yet.</p>
            <p>Let the room react a bit more, then come back for the reveal.</p>
          </div>
        )}

        <div className="state-card">
          <p className="state-card__title">Next step</p>
          <p>
            {winningOption
              ? `Point everyone toward ${winningOption.label}, or spin up another round before the group cools off.`
              : 'Kick off another pass and let the room become obvious.'}
          </p>
        </div>

        <div className="button-row">
          <button type="button" className="button button--ghost" onClick={onStartOver}>
            Back to start
          </button>
          <button type="button" className="button" onClick={onPlayAgain}>
            Run another round
          </button>
        </div>
      </div>
    </AppShell>
  );
}