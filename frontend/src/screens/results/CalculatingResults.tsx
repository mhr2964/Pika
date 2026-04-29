import React from 'react';

type CalculatingResultsProps = {
  message?: string;
};

export function CalculatingResults({
  message = 'Crunching the chaos.',
}: CalculatingResultsProps) {
  return (
    <main>
      <section>
        <h1>{message}</h1>
        <p>Choices are in. Results are on the way.</p>
      </section>
    </main>
  );
}