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
      title="Start the room. Make the choice obvious."
      subtitle="A quick prompt, a room code, and everyone knows the assignment."
    >
      <div className="stack-lg">
        <div className="state-card">
          <p className="state-card__title">Host the moment.</p>
          <p>Keep it punchy. Pika works best when the question feels instantly answerable.</p>
        </div>

        <label className="field">
          <span>Your host name</span>
          <input
            value={hostName}
            onChange={(event) => onHostNameChange(event.target.value)}
            placeholder="Chaos Captain"
          />
        </label>

        <label className="field">
          <span>What are we choosing?</span>
          <textarea
            value={prompt}
            onChange={(event) => onPromptChange(event.target.value)}
            placeholder="Best late-night snack run?"
            rows={4}
          />
        </label>

        {hasError ? (
          <div className="state-card state-card--error">
            <p className="state-card__title">Room failed to start.</p>
            <p>Give it one more tap. Even good chaos needs a retry.</p>
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
            {isSubmitting ? 'Starting room…' : 'Start room'}
          </button>
        </div>
      </div>
    </AppShell>
  );
}