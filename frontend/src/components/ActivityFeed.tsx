import React from 'react';
import { RoomActivity } from '../types/pika';

type ActivityFeedProps = {
  items: RoomActivity[];
};

export function ActivityFeed({ items }: ActivityFeedProps) {
  if (items.length === 0) {
    return (
      <div className="state-card">
        <p className="state-card__title">No plot twists yet.</p>
        <p>The feed wakes up the moment someone taps an option.</p>
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