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
      eyebrow="Outcome"
      title={winningOption ? `${winningOption.label} wins the room.` : 'No winner yet.'}
      subtitle="The verdict should feel instant, obvious, and ready for the next move."
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
            <p className="state-card__title">No outcome to reveal.</p>
            <p>Head back into the room and let the group react a little louder.</p>
          </div>
        )}

        <div className="state-card">
          <p className="state-card__title">Next move</p>
          <p>
            {winningOption
              ? `Send everyone toward ${winningOption.label} or spin up another fast question while the energy is still hot.`
              : 'Run another reaction pass, then come back when the room has made itself clear.'}
          </p>
        </div>

        <div className="button-row">
          <button type="button" className="button button--ghost" onClick={onStartOver}>
            Start fresh
          </button>
          <button type="button" className="button" onClick={onPlayAgain}>
            Run another round
          </button>
        </div>
      </div>
    </AppShell>
  );
}