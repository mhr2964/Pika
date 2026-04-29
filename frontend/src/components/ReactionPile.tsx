import React from 'react';
import { RoomParticipant } from '../types/pika';

type ReactionPileProps = {
  participants: RoomParticipant[];
};

export function ReactionPile({ participants }: ReactionPileProps) {
  if (participants.length === 0) {
    return (
      <div className="state-card state-card--empty">
        <p className="state-card__title">No reactions yet.</p>
        <p>The room is still suspiciously calm. That never lasts in Pika.</p>
      </div>
    );
  }

  return (
    <div className="reaction-pile">
      {participants.map((participant) => (
        <article
          key={participant.id}
          className={`reaction-chip reaction-chip--${participant.tone}`}
        >
          <p className="reaction-chip__name">{participant.name}</p>
          <p className="reaction-chip__text">{participant.reaction}</p>
        </article>
      ))}
    </div>
  );
}