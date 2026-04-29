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
      subtitle="Live reactions make the room readable before the verdict lands."
    >
      <div className="stack-lg">
        <RoomCodeCard code={room.code} />

        {hasError ? (
          <div className="state-card state-card--error">
            <p className="state-card__title">Live room hiccup.</p>
            <p>The vibe flickered. Tap a choice again and Pika will catch up.</p>
          </div>
        ) : null}

        {isLoading ? (
          <div className="state-card">
            <p className="state-card__title">Room is waking up…</p>
            <p>Syncing reactions and lining up the current front-runner.</p>
          </div>
        ) : (
          <>
            <section className="stack-sm">
              <div className="section-heading">
                <h2>Choices</h2>
                <p>One dominant tap. Zero confusion.</p>
              </div>
              <div className="option-grid">
                {room.options.length === 0 ? (
                  <div className="state-card state-card--empty">
                    <p className="state-card__title">No choices yet.</p>
                    <p>Add options before the room can tilt toward a winner.</p>
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
                <p>The room tells on itself fast.</p>
              </div>
              <ReactionPile participants={room.participants} />
            </section>

            <section className="stack-sm">
              <div className="section-heading">
                <h2>Feed</h2>
                <p>Every little gasp, documented.</p>
              </div>
              <ActivityFeed items={room.activity} />
            </section>
          </>
        )}

        <div className="button-row">
          <button type="button" className="button button--ghost" onClick={onResetRoom}>
            End this round
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