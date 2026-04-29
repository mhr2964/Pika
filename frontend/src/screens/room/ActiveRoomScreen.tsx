import React from 'react';
import { ActivityFeed } from '../../components/ActivityFeed';
import { AppShell } from '../../components/AppShell';
import { ReactionPile } from '../../components/ReactionPile';
import { RoomCodeCard } from '../../components/RoomCodeCard';
import { RoomOptionCard } from '../../components/RoomOptionCard';
import { RoomState } from '../../types/pika';

type ActiveRoomScreenProps = {
  room: RoomState;
  isLoading: boolean;
  hasError: boolean;
  onSelectOption: (id: string) => void;
  onRevealOutcome: () => void;
  onResetRoom: () => void;
};

export function ActiveRoomScreen({
  room,
  isLoading,
  hasError,
  onSelectOption,
  onRevealOutcome,
  onResetRoom,
}: ActiveRoomScreenProps) {
  return (
    <AppShell
      eyebrow={room.roundLabel}
      title={room.prompt}
      subtitle="Fast choices, live reactions, and a room that reads itself out loud."
    >
      <div className="stack-lg">
        <RoomCodeCard code={room.code} />

        {hasError ? (
          <div className="state-card state-card--error">
            <p className="state-card__title">The room blinked.</p>
            <p>Try that tap one more time and Pika will snap back into place.</p>
          </div>
        ) : null}

        {isLoading ? (
          <div className="state-card">
            <p className="state-card__title">Room is gathering steam…</p>
            <p>Syncing options, reactions, and the current front-runner.</p>
          </div>
        ) : (
          <>
            <section className="stack-sm">
              <div className="section-heading">
                <h2>Choices</h2>
                <p>Pick the option that deserves the room.</p>
              </div>
              <div className="option-grid">
                {room.options.length === 0 ? (
                  <div className="state-card state-card--empty">
                    <p className="state-card__title">No options yet.</p>
                    <p>The room needs choices before the chaos can organize itself.</p>
                  </div>
                ) : (
                  room.options.map((option) => (
                    <RoomOptionCard
                      key={option.id}
                      option={option}
                      isSelected={room.selectedOptionId === option.id}
                      isWinner={room.winningOptionId === option.id}
                      onSelect={onSelectOption}
                      disabled={isLoading}
                    />
                  ))
                )}
              </div>
            </section>

            <section className="stack-sm">
              <div className="section-heading">
                <h2>Live reactions</h2>
                <p>Emotional legibility, immediately.</p>
              </div>
              <ReactionPile participants={room.participants} />
            </section>

            <section className="stack-sm">
              <div className="section-heading">
                <h2>Room feed</h2>
                <p>A tiny blow-by-blow of the chaos.</p>
              </div>
              <ActivityFeed items={room.activity} />
            </section>
          </>
        )}

        <div className="button-row">
          <button type="button" className="button button--ghost" onClick={onResetRoom}>
            End round
          </button>
          <button
            type="button"
            className="button"
            onClick={onRevealOutcome}
            disabled={isLoading || room.options.length === 0}
          >
            Reveal outcome
          </button>
        </div>
      </div>
    </AppShell>
  );
}