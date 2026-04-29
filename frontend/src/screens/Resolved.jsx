import React from 'react';

export function Resolved({ result, onRestart }) {
  return (
    <div style={{ 
      padding: '2rem', 
      textAlign: 'center',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <div style={{
        fontSize: '3rem',
        marginBottom: '1rem'
      }}>
        ✓
      </div>
      <h1>Matchup Complete</h1>
      <div style={{
        backgroundColor: '#f0fdf4',
        border: '1px solid #bbf7d0',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '1.5rem',
      }}>
        <p style={{ color: '#166534', fontWeight: '600', marginBottom: '0.5rem' }}>
          Result Recorded
        </p>
        <p style={{ fontSize: '1.125rem', color: '#15803d' }}>
          {result}
        </p>
      </div>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Thanks for playing! The ranking has been updated.
      </p>
      <button
        onClick={onRestart}
        style={{
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          backgroundColor: '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        Start Another Matchup
      </button>
    </div>
  );
}