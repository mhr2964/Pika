import React from 'react';
import { AppShell } from '../../components/AppShell';
import { ReactionPile } from '../../components/ReactionPile';
import { RoomCodeCard } from '../../components/RoomCodeCard';
import { RoomState } from '../../types/pika';

type LobbyScreenProps = {
  room: RoomState;
  viewerName: string;
  isLoading: boolean;
  hasError: boolean;
  onStartVoting: () => void;
  onBackToWelcome: () => void;
};

export function LobbyScreen({
  room,
  viewerName,
  isLoading,
  hasError,
  onStartVoting,
  onBackToWelcome,
}: LobbyScreenProps) {
  return (
    <AppShell
      eyebrow="Lobby"
      title={`${viewerName}, you are in.`}
      subtitle="The room is gathering. Read the vibe before the real taps begin."
    >
      <div className="stack-lg">
        <RoomCodeCard code={room.code} />

        <div className="state-card">
          <p className="state-card__title">Current prompt</p>
          <p>{room.prompt}</p>
        </div>

        {hasError ? (
          <div className="state-card state-card--error">
            <p className="state-card__title">Lobby sync hiccup.</p>
            <p>The room blinked. Give it another moment and the vibe will settle.</p>
          </div>
        ) : null}

        {isLoading ? (
          <div className="state-card">
            <p className="state-card__title">Room is filling up…</p>
            <p>Pulling in reactions, names, and the first signs of momentum.</p>
          </div>
        ) : (
          <>
            <div className="state-card">
              <p className="state-card__title">Who is here</p>
              <p>
                {room.participants.length > 0
                  ? `${room.participants.length} people are already circling the decision.`
                  : 'No one else is here yet, which is peaceful and suspicious.'}
              </p>
            </div>

            <section className="stack-sm">
              <div className="section-heading">
                <h2>Room vibe</h2>
                <p>You can almost hear the takes forming.</p>
              </div>
              <ReactionPile participants={room.participants} />
            </section>
          </>
        )}

        <div className="button-row">
          <button type="button" className="button button--ghost" onClick={onBackToWelcome}>
            Leave room
          </button>
          <button type="button" className="button" onClick={onStartVoting} disabled={isLoading}>
            Start reacting
          </button>
        </div>
      </div>
    </AppShell>
  );
}