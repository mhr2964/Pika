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
      title={winningOption ? `${winningOption.label} takes it.` : 'The room needs a verdict.'}
      subtitle="No mystery, no spreadsheet energy — just a clear next move."
    >
      <div className="stack-lg">
        {winningOption ? (
          <div className="winner-card">
            <p className="winner-card__eyebrow">Room verdict</p>
            <h2>{winningOption.label}</h2>
            <p>{winningOption.votes} people pushed it over the line.</p>
          </div>
        ) : (
          <div className="state-card state-card--empty">
            <p className="state-card__title">No winning option yet.</p>
            <p>Run one more reaction wave before calling the result.</p>
          </div>
        )}

        <div className="state-card">
          <p className="state-card__title">What happens next?</p>
          <p>
            {winningOption
              ? `Send the room toward ${winningOption.label} and spin up another question if the group still has energy.`
              : 'Head back to the room, give people something to react to, and let the winner emerge.'}
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