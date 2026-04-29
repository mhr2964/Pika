import React, { useMemo, useState } from 'react';

type NameEntryProps = {
  initialName?: string;
  onContinue?: (name: string) => void;
  onBack?: () => void;
};

const MIN_NAME_LENGTH = 2;

function getValidationMessage(name: string) {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return 'Pick a name so the room knows who just arrived.';
  }

  if (trimmedName.length < MIN_NAME_LENGTH) {
    return 'Make it at least 2 characters so it feels like a real entrance.';
  }

  return '';
}

export function NameEntry({
  initialName = '',
  onContinue,
  onBack,
}: NameEntryProps) {
  const [name, setName] = useState(initialName);
  const validationMessage = useMemo(() => getValidationMessage(name), [name]);

  function handleContinue() {
    if (validationMessage) {
      return;
    }

    onContinue?.(name.trim());
  }

  return (
    <main>
      <section>
        <p>You’re almost in.</p>
        <h1>What should the room call you?</h1>
        <input
          aria-label="Display name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Pick a display name"
        />
        {validationMessage ? <p role="alert">{validationMessage}</p> : null}
        <div>
          <button type="button" onClick={onBack}>
            Back
          </button>
          <button type="button" onClick={handleContinue}>
            Continue
          </button>
        </div>
      </section>
    </main>
  );
}