import React from 'react';
import { AppShell } from '../../components/AppShell';

type JoinRoomScreenProps = {
  guestName: string;
  roomCode: string;
  isSubmitting: boolean;
  hasError: boolean;
  onGuestNameChange: (value: string) => void;
  onRoomCodeChange: (value: string) => void;
  onJoinRoom: () => void;
  onBack: () => void;
  onGoToCreateRoom: () => void;
};

export function JoinRoomScreen({
  guestName,
  roomCode,
  isSubmitting,
  hasError,
  onGuestNameChange,
  onRoomCodeChange,
  onJoinRoom,
  onBack,
  onGoToCreateRoom,
}: JoinRoomScreenProps) {
  const isDisabled = isSubmitting || !guestName.trim() || !roomCode.trim();

  return (
    <AppShell
      eyebrow="Join room"
      title="Jump into the room before the best take lands without you"
      subtitle="Name in, code in, and you are part of the chaos in seconds."
    >
      <div className="stack-lg">
        <div className="state-card">
          <p className="state-card__title">Quick in, no mystery.</p>
          <p>The room should feel legible before you even cast your first reaction.</p>
        </div>

        <label className="field">
          <span>Your name</span>
          <input
            value={guestName}
            onChange={(event) => onGuestNameChange(event.target.value)}
            placeholder="Snack Scout"
          />
        </label>

        <label className="field">
          <span>Room code</span>
          <input
            value={roomCode}
            onChange={(event) => onRoomCodeChange(event.target.value.toUpperCase())}
            placeholder="PIKA42"
            maxLength={7}
          />
        </label>

        {hasError ? (
          <div className="state-card state-card--error">
            <p className="state-card__title">Could not join that room.</p>
            <p>Check the code and try again. Tiny typo, huge plot twist.</p>
          </div>
        ) : null}

        <div className="button-row">
          <button type="button" className="button button--ghost" onClick={onBack}>
            Back
          </button>
          <button type="button" className="button button--ghost" onClick={onGoToCreateRoom}>
            Create instead
          </button>
          <button type="button" className="button" onClick={onJoinRoom} disabled={isDisabled}>
            {isSubmitting ? 'Joining room…' : 'Join room'}
          </button>
        </div>
      </div>
    </AppShell>
  );
}