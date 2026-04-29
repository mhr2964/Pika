import React from 'react';

type WelcomeSplashProps = {
  canResume: boolean;
  onStart: () => void;
  onResume: () => void;
};

export function WelcomeSplash({ canResume, onStart, onResume }: WelcomeSplashProps) {
  return (
    <main className="screen-shell">
      <section className="hero-card">
        <p className="eyebrow">Pika</p>
        <h1>Make the room pick a winner without making the room weird.</h1>
        <p className="lede">
          Start a fast vote, join the chaos, and let Pika turn indecision into a tiny shared event.
        </p>

        <div className="hero-actions">
          <button type="button" onClick={onStart}>
            Start a room
          </button>
          {canResume ? (
            <button type="button" className="ghost-button" onClick={onResume}>
              Jump back in
            </button>
          ) : null}
        </div>

        <p className="pika-note">Today’s vibe: decisive, but with a little sparkle.</p>
      </section>
    </main>
  );
}