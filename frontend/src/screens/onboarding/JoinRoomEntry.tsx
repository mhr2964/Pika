import React, { useMemo, useState } from 'react';

type JoinRoomEntryProps = {
  initialCode?: string;
  isJoining?: boolean;
  errorMessage?: string;
  onJoin?: (roomCode: string) => void;
  onBack?: () => void;
};

const MIN_CODE_LENGTH = 4;

function getJoinValidationMessage(roomCode: string) {
  const trimmedCode = roomCode.trim();

  if (!trimmedCode) {
    return 'Enter a room code to jump in.';
  }

  if (trimmedCode.length < MIN_CODE_LENGTH) {
    return 'That code looks short. Check the invite and try again.';
  }

  return '';
}

export function JoinRoomEntry({
  initialCode = '',
  isJoining = false,
  errorMessage,
  onJoin,
  onBack,
}: JoinRoomEntryProps) {
  const [roomCode, setRoomCode] = useState(initialCode);
  const validationMessage = useMemo(
    () => getJoinValidationMessage(roomCode),
    [roomCode]
  );

  function handleJoin() {
    if (validationMessage || isJoining) {
      return;
    }

    onJoin?.(roomCode.trim());
  }

  return (
    <main>
      <section>
        <p>You’ve got the code. Let’s make it count.</p>
        <h1>Join a room</h1>
        <input
          aria-label="Room code"
          value={roomCode}
          onChange={(event) => setRoomCode(event.target.value.toUpperCase())}
          placeholder="Enter room code"
        />
        {validationMessage ? <p role="alert">{validationMessage}</p> : null}
        {errorMessage ? <p role="alert">{errorMessage}</p> : null}
        <div>
          <button type="button" onClick={onBack}>
            Back
          </button>
          <button type="button" onClick={handleJoin} disabled={isJoining}>
            {isJoining ? 'Joining…' : 'Join room'}
          </button>
        </div>
      </section>
    </main>
  );
}