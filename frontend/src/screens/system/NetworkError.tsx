import React from 'react';

type NetworkErrorProps = {
  message?: string;
  onRetry?: () => void;
};

export function NetworkError({
  message = 'The signal fizzled before that action landed.',
  onRetry,
}: NetworkErrorProps) {
  return (
    <main>
      <section>
        <h1>Network error</h1>
        <p>{message}</p>
        <button type="button" onClick={onRetry}>
          Try again
        </button>
      </section>
    </main>
  );
}