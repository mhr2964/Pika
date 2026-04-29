import React from 'react';

type InitialLoadingProps = {
  message?: string;
};

export function InitialLoading({
  message = 'Setting the stage…',
}: InitialLoadingProps) {
  return (
    <main>
      <section>
        <h1>{message}</h1>
        <p>Getting your next move ready.</p>
      </section>
    </main>
  );
}