import React from 'react';

type RoomCodeCardProps = {
  code: string;
};

export function RoomCodeCard({ code }: RoomCodeCardProps) {
  return (
    <div className="room-code-card">
      <span className="room-code-card__label">Room code</span>
      <strong className="room-code-card__value">{code}</strong>
      <p className="room-code-card__hint">Share it fast before someone claims they never got the invite.</p>
    </div>
  );
}