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
}: CreateRoomScreenProps) {
  const isDisabled = isSubmitting || !hostName.trim() || !prompt.trim();

  return (
    <AppShell
      eyebrow="Room setup"
      title="Start the room before the energy drifts"
      subtitle="Make the question obvious, invite instant reactions, and keep one dominant next step."
    >
      <div className="stack-lg">
        <div className="state-card">
          <p className="state-card__title">Keep it quick-hit.</p>
          <p>Pika sings when the prompt feels answerable in one gut reaction.</p>
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
          <span>Room prompt</span>
          <textarea
            value={prompt}
            onChange={(event) => onPromptChange(event.target.value)}
            placeholder="Best late-night snack run?"
            rows={4}
          />
        </label>

        {hasError ? (
          <div className="state-card state-card--error">
            <p className="state-card__title">Room launch failed.</p>
            <p>Tap it again. Even beautiful chaos needs one retry sometimes.</p>
          </div>
        ) : null}

        <div className="button-row">
          <button type="button" className="button button--ghost" onClick={onBack}>
            Back
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