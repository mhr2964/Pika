import React from 'react';

const containerStyle = {
  padding: '1rem',
  borderRadius: '12px',
  marginTop: '1rem',
};

export function LoadingState({
  title = 'Loading…',
  message = 'Pika is getting things ready.',
}) {
  return (
    <div
      style={{
        ...containerStyle,
        backgroundColor: '#eff6ff',
        border: '1px solid #bfdbfe',
        color: '#1d4ed8',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⚡</div>
      <strong style={{ display: 'block', marginBottom: '0.25rem' }}>{title}</strong>
      <span>{message}</span>
    </div>
  );
}

export function ErrorState({
  title = 'Something went sideways',
  message = 'Please try again.',
}) {
  return (
    <div
      style={{
        ...containerStyle,
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
        color: '#991b1b',
      }}
    >
      <strong style={{ display: 'block', marginBottom: '0.25rem' }}>{title}</strong>
      <span>{message}</span>
    </div>
  );
}

export function EmptyState({
  title = 'Nothing here yet',
  message = 'Once there’s activity, this screen will wake up.',
}) {
  return (
    <div
      style={{
        ...containerStyle,
        backgroundColor: '#f9fafb',
        border: '1px dashed #d1d5db',
        color: '#4b5563',
        textAlign: 'center',
      }}
    >
      <strong style={{ display: 'block', marginBottom: '0.25rem' }}>{title}</strong>
      <span>{message}</span>
    </div>
  );
}