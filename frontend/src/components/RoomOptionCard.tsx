import React from 'react';
import { RoomOption } from '../types/pika';

type RoomOptionCardProps = {
  option: RoomOption;
  isSelected: boolean;
  isWinner: boolean;
  onSelect: (id: string) => void;
  disabled?: boolean;
};

export function RoomOptionCard({
  option,
  isSelected,
  isWinner,
  onSelect,
  disabled = false,
}: RoomOptionCardProps) {
  const cardClassName = [
    'room-option-card',
    isSelected ? 'room-option-card--selected' : '',
    isWinner ? 'room-option-card--winner' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={cardClassName}
      onClick={() => onSelect(option.id)}
      disabled={disabled}
    >
      <span className="room-option-card__label">{option.label}</span>
      <span className="room-option-card__meta">{option.votes} reactions in</span>
    </button>
  );
}