import React from 'react';

type RoomCodeCardProps = {
  code: string;
};

export function RoomCodeCard({ code }: RoomCodeCardProps) {
  return (
    <div className="room-code-card">
      <p className="room-code-card__label">Room code</p>
      <p className="room-code-card__code">{code}</p>
      <p className="room-code-card__hint">Post it once and watch the room get loud.</p>
    </div>
  );
}