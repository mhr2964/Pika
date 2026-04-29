import React from 'react';
import { AppShell } from '../../components/AppShell';

type CreateRoomScreenProps = {
  hostName: string;
  prompt: string;
  isSubmitting: boolean;
  hasError: boolean;
  onHostNameChange: (value: string) => void;
  onPromptChange: (value: string) => void;
  onCreateRoom: () => void;
  onBack: () => void;
  onGoToJoinRoom: () => void;
};

export function CreateRoomScreen({
  hostName,
  prompt,
  isSubmitting,
  hasError,
  onHostNameChange,
  onPromptChange,
  onCreateRoom,
  onBack,
  onGoToJoinRoom,
}: CreateRoomScreenProps) {
  const isDisabled = isSubmitting || !hostName.trim() || !prompt.trim();

  return (
    <AppShell
      eyebrow="Create room"
      title="Set the prompt, start the swirl"
      subtitle="Give the room one sharp question and let Pika do the emotional sorting."
    >
      <div className="stack-lg">
        <div className="state-card">
          <p className="state-card__title">Host energy matters.</p>
          <p>Start with a prompt people can answer on instinct, not a spreadsheet.</p>
        </div>

        <label className="field">
          <span>Host name</span>
          <input
            value={hostName}
            onChange={(event) => onHostNameChange(event.target.value)}
            placeholder="Chaos Captain"
          />
        </label>

        <label className="field">
          <span>Prompt</span>
          <textarea
            value={prompt}
            onChange={(event) => onPromptChange(event.target.value)}
            placeholder="Best late-night snack run?"
            rows={4}
          />
        </label>

        {hasError ? (
          <div className="state-card state-card--error">
            <p className="state-card__title">Room did not spin up.</p>
            <p>Give it another shot. Even the best rooms need one dramatic retry.</p>
          </div>
        ) : null}

        <div className="button-row">
          <button type="button" className="button button--ghost" onClick={onBack}>
            Back
          </button>
          <button type="button" className="button button--ghost" onClick={onGoToJoinRoom}>
            Join instead
          </button>
          <button
            type="button"
            className="button"
            onClick={onCreateRoom}
            disabled={isDisabled}
          >
            {isSubmitting ? 'Creating room…' : 'Create room'}
          </button>
        </div>
      </div>
    </AppShell>
  );
}