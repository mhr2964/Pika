import React from 'react';

export function LoadingState({ title = 'Loading…', message = 'Pika is getting things ready.' }) {
  return (
    <div style={{
      padding: '1rem',
      borderRadius: '10px',
      backgroundColor: '#eff6ff',
      border: '1px solid #bfdbfe',
      color: '#1d4ed8',
      textAlign: 'center',
      marginTop: '1rem'
    }}>
      <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⚡</div>
      <p style={{ margin: '0 0 0.25rem 0', fontWeight: 600 }}>{title}</p>
      <p style={{ margin: 0 }}>{message}</p>
    </div>
  );
}

export function ErrorState({ title = 'Something went sideways', message = 'Please try again.' }) {
  return (
    <div style={{
      padding: '1rem',
      borderRadius: '10px',
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      color: '#991b1b',
      marginTop: '1rem'
    }}>
      <p style={{ margin: '0 0 0.25rem 0', fontWeight: 600 }}>{title}</p>
      <p style={{ margin: 0 }}>{message}</p>
    </div>
  );
}

export function EmptyState({ title = 'Nothing here yet', message = 'Pika is waiting for the next move.' }) {
  return (
    <div style={{
      padding: '1rem',
      borderRadius: '10px',
      backgroundColor: '#f9fafb',
      border: '1px dashed #d1d5db',
      color: '#4b5563',
      textAlign: 'center',
      marginTop: '1rem'
    }}>
      <p style={{ margin: '0 0 0.25rem 0', fontWeight: 600 }}>{title}</p>
      <p style={{ margin: 0 }}>{message}</p>
    </div>
  );
}