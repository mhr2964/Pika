import React from 'react';

type ResultItem = {
  id: string;
  label: string;
  scoreText?: string;
};

type ResultsRevealProps = {
  title?: string;
  summary?: string;
  results: ResultItem[];
  onPlayAgain?: () => void;
};

export function ResultsReveal({
  title = 'And the room picked…',
  summary = 'One result rose to the top.',
  results,
  onPlayAgain,
}: ResultsRevealProps) {
  return (
    <main>
      <section>
        <p>{summary}</p>
        <h1>{title}</h1>
        <ol>
          {results.map((result) => (
            <li key={result.id}>
              <strong>{result.label}</strong>
              {result.scoreText ? <span> — {result.scoreText}</span> : null}
            </li>
          ))}
        </ol>
        <button type="button" onClick={onPlayAgain}>
          Play again
        </button>
      </section>
    </main>
  );
}