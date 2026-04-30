import React from 'react';

const baseWrapStyle = {
  padding: '2rem',
  textAlign: 'center',
};

export function LoadingState({ title = 'Loading…', message = 'Pika is getting things ready.' }) {
  return (
    <div style={baseWrapStyle}>
      <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⚡</div>
      <h2 style={{ margin: '0 0 0.5rem 0' }}>{title}</h2>
      <p style={{ margin: 0, color: '#6b7280' }}>{message}</p>
    </div>
  );
}

export function ErrorState({ title = 'Something went sideways', message, retryLabel, onRetry }) {
  return (
    <div
      style={{
        ...baseWrapStyle,
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '12px',
        maxWidth: '520px',
        margin: '1.5rem auto 0',
      }}
    >
      <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⚠️</div>
      <h2 style={{ margin: '0 0 0.5rem 0', color: '#991b1b' }}>{title}</h2>
      <p style={{ margin: '0 0 1rem 0', color: '#7f1d1d' }}>{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#dc2626',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          {retryLabel || 'Try again'}
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, message }) {
  return (
    <div
      style={{
        ...baseWrapStyle,
        backgroundColor: '#f9fafb',
        border: '1px dashed #d1d5db',
        borderRadius: '12px',
      }}
    >
      <h3 style={{ margin: '0 0 0.5rem 0' }}>{title}</h3>
      <p style={{ margin: 0, color: '#6b7280' }}>{message}</p>
    </div>
  );
}