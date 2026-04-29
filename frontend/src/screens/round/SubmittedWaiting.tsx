import React from 'react';

type SubmittedWaitingProps = {
  message?: string;
  progressHint?: string;
};

export function SubmittedWaiting({
  message = 'Locked in.',
  progressHint = 'Waiting for the rest of the room to catch up.',
}: SubmittedWaitingProps) {
  return (
    <main>
      <section>
        <h1>{message}</h1>
        <p>{progressHint}</p>
      </section>
    </main>
  );
}