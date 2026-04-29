import React from 'react';

type BetweenMatchupsProps = {
  onContinue?: () => void;
};

export function BetweenMatchups({ onContinue }: BetweenMatchupsProps) {
  return (
    <main>
      <section>
        <p>One down.</p>
        <h1>Fresh chaos in 3… 2…</h1>
        <button type="button" onClick={onContinue}>
          Next matchup
        </button>
      </section>
    </main>
  );
}