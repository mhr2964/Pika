import React from 'react';

type WelcomeSplashProps = {
  onStart?: () => void;
  onResume?: () => void;
  canResume?: boolean;
};

export function WelcomeSplash({
  onStart,
  onResume,
  canResume = false,
}: WelcomeSplashProps) {
  return (
    <main>
      <section>
        <p>Pika</p>
        <h1>Start the room. Stir the chaos.</h1>
        <p>Fast choices, live reactions, no mystery about what happens next.</p>
        <button type="button" onClick={onStart}>
          Start
        </button>
        {canResume ? (
          <button type="button" onClick={onResume}>
            Resume where the chaos left off
          </button>
        ) : null}
      </section>
    </main>
  );
}