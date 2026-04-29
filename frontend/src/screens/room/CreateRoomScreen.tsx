import React, { useMemo } from 'react';

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

const MIN_NAME_LENGTH = 2;
const MIN_PROMPT_LENGTH = 8;

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
  const trimmedHostName = hostName.trim();
  const trimmedPrompt = prompt.trim();

  const validationMessage = useMemo(() => {
    if (trimmedHostName.length < MIN_NAME_LENGTH) {
      return 'Give your host name at least 2 characters.';
    }

    if (trimmedPrompt.length < MIN_PROMPT_LENGTH) {
      return 'Prompt needs a little more juice — try 8+ characters.';
    }

    return '';
  }, [trimmedHostName, trimmedPrompt]);

  const isDisabled = Boolean(validationMessage) || isSubmitting;

  return (
    <main className="screen-shell">
      <section className="panel-card">
        <p className="eyebrow">Create room</p>
        <h1>Set the question. Keep the energy crisp.</h1>
        <p className="lede">One room, one deliciously overqualified decision.</p>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (!isDisabled) {
              onCreateRoom();
            }
          }}
        >
          <label className="field">
            <span>Host name</span>
            <input
              value={hostName}
              onChange={(event) => onHostNameChange(event.target.value)}
              placeholder="Chaos Captain"
            />
          </label>

          <label className="field">
            <span>What are we deciding?</span>
            <textarea
              value={prompt}
              onChange={(event) => onPromptChange(event.target.value)}
              rows={3}
              placeholder="Best late-night snack run?"
            />
          </label>

          {validationMessage ? <p className="hint error-text">{validationMessage}</p> : null}
          {hasError ? (
            <p className="hint error-text">Pika dropped the marker. Try creating the room again.</p>
          ) : null}

          <div className="stacked-actions">
            <button type="submit" disabled={isDisabled}>
              {isSubmitting ? 'Creating room…' : 'Create room'}
            </button>
            <button type="button" className="ghost-button" onClick={onGoToJoinRoom}>
              I have a code instead
            </button>
            <button type="button" className="text-button" onClick={onBack}>
              Back
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}