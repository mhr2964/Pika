import React from 'react';
import { RoomActivity } from '../types/pika';

type ActivityFeedProps = {
  items: RoomActivity[];
};

export function ActivityFeed({ items }: ActivityFeedProps) {
  if (items.length === 0) {
    return (
      <div className="state-card">
        <p className="state-card__title">No feed updates yet.</p>
        <p>The room log starts the second someone picks a side.</p>
      </div>
    );
  }

  return (
    <ul className="activity-feed">
      {items.map((item) => (
        <li key={item.id} className="activity-feed__item">
          <span className="activity-feed__actor">{item.actor}</span>
          <span>{item.message}</span>
        </li>
      ))}
    </ul>
  );
}