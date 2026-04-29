import React, { useState } from 'react';

export function CreateRoom({ onRoomCreated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [code, setCode] = useState(null);

  const handleCreate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error(`Create failed: ${res.status}`);
      const data = await res.json();
      // TODO: confirm response shape from backend contract
      // Expected: { roomId, code, createdAt, ... }
      setCode(data.code);
      onRoomCreated(data.roomId, data.code);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Create a Room</h1>
      <p>Start a new Pika matchup.</p>
      {code ? (
        <div style={{ 
          border: '2px solid #2563eb', 
          padding: '1.5rem', 
          borderRadius: '8px',
          backgroundColor: '#f0f9ff',
          margin: '1.5rem 0'
        }}>
          <p style={{ fontSize: '0.875rem', color: '#666' }}>Share this code:</p>
          <p style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            fontFamily: 'monospace',
            color: '#2563eb',
            letterSpacing: '0.25em'
          }}>
            {code}
          </p>
        </div>
      ) : (
        <button
          onClick={handleCreate}
          disabled={loading}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            backgroundColor: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Creating...' : 'Create Room'}
        </button>
      )}
      {error && <p style={{ color: '#dc2626', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
}