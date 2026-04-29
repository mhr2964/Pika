import React from 'react';
import { RoomActivity } from '../types/pika';

type ActivityFeedProps = {
  items: RoomActivity[];
};

export function ActivityFeed({ items }: ActivityFeedProps) {
  if (items.length === 0) {
    return (
      <div className="state-card state-card--empty">
        <p className="state-card__title">Quiet for a second.</p>
        <p>The second someone taps, the room gossip starts rolling again.</p>
      </div>
    );
  }

  return (
    <div className="activity-feed">
      {items.map((item) => (
        <div key={item.id} className="activity-feed__item">
          <span className="activity-feed__actor">{item.actor}</span>
          <span className="activity-feed__message">{item.message}</span>
        </div>
      ))}
    </div>
  );
}