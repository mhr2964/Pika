import React from 'react';

type MatchupIntroProps = {
  roundLabel?: string;
  onBegin?: () => void;
};

export function MatchupIntro({
  roundLabel = 'Round 1',
  onBegin,
}: MatchupIntroProps) {
  return (
    <main>
      <section>
        <p>{roundLabel}</p>
        <h1>First clash incoming.</h1>
        <p>Make one clear pick. Then get ready for the next spark.</p>
        <button type="button" onClick={onBegin}>
          Begin
        </button>
      </section>
    </main>
  );
}