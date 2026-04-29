import React from 'react';
import { RoomParticipant } from '../types/pika';

type ReactionPileProps = {
  participants: RoomParticipant[];
};

export function ReactionPile({ participants }: ReactionPileProps) {
  if (participants.length === 0) {
    return (
      <div className="state-card state-card--empty">
        <p className="state-card__title">No one is reacting yet.</p>
        <p>Invite a few friends and the room goes from quiet to feral fast.</p>
      </div>
    );
  }

  return (
    <div className="reaction-pile">
      {participants.map((participant) => (
        <article key={participant.id} className="reaction-chip">
          <span className={`reaction-chip__tone reaction-chip__tone--${participant.tone}`}>
            {participant.name}
          </span>
          <p>{participant.reaction}</p>
        </article>
      ))}
    </div>
  );
}