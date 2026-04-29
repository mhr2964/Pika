import React, { useState } from 'react';

type MatchupOption = {
  id: string;
  label: string;
  description?: string;
};

type ActiveMatchupProps = {
  prompt?: string;
  leftOption: MatchupOption;
  rightOption: MatchupOption;
  progressLabel?: string;
  isSubmitting?: boolean;
  errorMessage?: string;
  onSubmitChoice?: (optionId: string) => void;
};

export function ActiveMatchup({
  prompt = 'Pick the one that deserves the win.',
  leftOption,
  rightOption,
  progressLabel = 'Choice 1 of 1',
  isSubmitting = false,
  errorMessage,
  onSubmitChoice,
}: ActiveMatchupProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string>('');

  const hasSelection = Boolean(selectedOptionId);

  function handleSubmit() {
    if (!selectedOptionId || isSubmitting) {
      return;
    }

    onSubmitChoice?.(selectedOptionId);
  }

  function renderOption(option: MatchupOption) {
    const isSelected = selectedOptionId === option.id;

    return (
      <button
        key={option.id}
        type="button"
        aria-pressed={isSelected}
        onClick={() => setSelectedOptionId(option.id)}
      >
        <strong>{option.label}</strong>
        {option.description ? <span>{option.description}</span> : null}
        {isSelected ? <span> Locked in.</span> : null}
      </button>
    );
  }

  return (
    <main>
      <section>
        <p>{progressLabel}</p>
        <h1>{prompt}</h1>
        <div>
          {renderOption(leftOption)}
          {renderOption(rightOption)}
        </div>
        {errorMessage ? <p role="alert">{errorMessage}</p> : null}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!hasSelection || isSubmitting}
        >
          {isSubmitting ? 'Submitting…' : 'Lock choice'}
        </button>
      </section>
    </main>
  );
}