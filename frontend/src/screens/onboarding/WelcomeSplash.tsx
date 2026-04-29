import React from 'react';
import { AppShell } from '../../components/AppShell';

type WelcomeSplashProps = {
  canResume: boolean;
  onStart: () => void;
  onResume: () => void;
};

export function WelcomeSplash({
  canResume,
  onStart,
  onResume,
}: WelcomeSplashProps) {
  return (
    <AppShell
      eyebrow="Pika"
      title="Make the room obvious fast."
      subtitle="Create or join a room, feel the vibe instantly, and let the best option pull ahead."
    >
      <div className="stack-lg">
        <div className="hero-card">
          <p className="hero-card__title">Tiny sparks. Big room energy.</p>
          <p>
            Pika is for quick group choices that should feel alive, legible, and a little bit
            dramatic in the best way.
          </p>
        </div>

        <div className="button-column">
          <button type="button" className="button" onClick={onStart}>
            Start a room
          </button>
          <button
            type="button"
            className="button button--ghost"
            onClick={onResume}
            disabled={!canResume}
          >
            {canResume ? 'Resume room' : 'Resume room soon'}
          </button>
        </div>

        <div className="state-card">
          <p className="state-card__title">Why Pika feels different</p>
          <p>You do not just vote. You watch the room tell on itself in real time.</p>
        </div>
      </div>
    </AppShell>
  );
}