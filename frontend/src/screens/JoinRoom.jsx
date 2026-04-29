import React, { useState } from 'react';

export function JoinRoom({ onJoined }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Please enter a room code.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/rooms/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.toUpperCase() }),
      });
      if (!res.ok) throw new Error(`Join failed: ${res.status}`);
      const data = await res.json();
      // TODO: confirm response shape from backend contract
      // Expected: { roomId, participantId, ... }
      onJoined(data.roomId, data.participantId);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Join a Room</h1>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Enter the code shared by the room creator.
      </p>
      <form onSubmit={handleJoin}>
        <input
          type="text"
          placeholder="Enter code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '1rem',
            border: '1px solid #ccc',
            borderRadius: '6px',
            fontFamily: 'monospace',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '1rem',
            boxSizing: 'border-box',
          }}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '1rem',
            backgroundColor: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Joining...' : 'Join'}
        </button>
      </form>
      {error && <p style={{ color: '#dc2626', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
}