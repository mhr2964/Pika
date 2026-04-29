import React, { useState } from 'react';

type CreateRoomSetupProps = {
  defaultRoomLabel?: string;
  isCreating?: boolean;
  errorMessage?: string;
  onCreateRoom?: (roomLabel: string) => void;
};

export function CreateRoomSetup({
  defaultRoomLabel = '',
  isCreating = false,
  errorMessage,
  onCreateRoom,
}: CreateRoomSetupProps) {
  const [roomLabel, setRoomLabel] = useState(defaultRoomLabel);

  const trimmedLabel = roomLabel.trim();
  const validationMessage = trimmedLabel
    ? ''
    : 'Give the room a name so people know where the chaos lives.';

  function handleCreateRoom() {
    if (validationMessage || isCreating) {
      return;
    }

    onCreateRoom?.(trimmedLabel);
  }

  return (
    <main>
      <section>
        <p>Keep setup light. Momentum matters.</p>
        <h1>Create a room</h1>
        <input
          aria-label="Room name"
          value={roomLabel}
          onChange={(event) => setRoomLabel(event.target.value)}
          placeholder="Give your room a name"
        />
        {validationMessage ? <p role="alert">{validationMessage}</p> : null}
        {errorMessage ? <p role="alert">{errorMessage}</p> : null}
        <button
          type="button"
          onClick={handleCreateRoom}
          disabled={isCreating}
        >
          {isCreating ? 'Creating…' : 'Create room'}
        </button>
      </section>
    </main>
  );
}