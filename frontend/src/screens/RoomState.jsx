import React, { useState, useEffect } from 'react';

export function RoomState({ roomId, participantId, onReady, onSubmitResult }) {
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const poll = async () => {
      try {
        const res = await fetch(`/api/v1/rooms/${roomId}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const data = await res.json();
        // TODO: confirm response shape from backend contract
        // Expected: { roomId, code, participants: [...], status, ... }
        setRoom(data);
        setParticipants(data.participants || []);
        setLoading(false);
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      }
    };
    poll();
    const interval = setInterval(poll, 2000);
    return () => {
      clearInterval(interval);
      controller.abort();
    };
  }, [roomId]);

  const handleToggleReady = async () => {
    try {
      const res = await fetch(`/api/v1/rooms/${roomId}/ready`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantId, ready: !isReady }),
      });
      if (!res.ok) throw new Error(`Toggle failed: ${res.status}`);
      setIsReady(!isReady);
      onReady(!isReady);
    } catch (err) {
      setError(err.message);
    }
  };

  const allReady = participants.length > 1 && participants.every(p => p.ready);

  if (loading) return <div style={{ padding: '2rem' }}>Loading room...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Room {room?.code}</h1>
      <div style={{ 
        backgroundColor: '#f3f4f6', 
        padding: '1rem', 
        borderRadius: '6px',
        marginBottom: '1.5rem'
      }}>
        <h2 style={{ margin: '0 0 0.5rem 0' }}>Participants ({participants.length})</h2>
        {participants.map((p) => (
          <div 
            key={p.participantId}
            style={{
              padding: '0.5rem',
              marginBottom: '0.25rem',
              backgroundColor: '#fff',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>{p.name || `Participant ${p.participantId.slice(0, 8)}`}</span>
            <span style={{
              padding: '0.25rem 0.75rem',
              borderRadius: '4px',
              fontSize: '0.875rem',
              backgroundColor: p.ready ? '#dcfce7' : '#fee2e2',
              color: p.ready ? '#166534' : '#991b1b',
            }}>
              {p.ready ? '✓ Ready' : 'Waiting'}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={handleToggleReady}
        style={{
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          backgroundColor: isReady ? '#7c3aed' : '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          marginBottom: '1rem',
          width: '100%',
        }}
      >
        {isReady ? '✓ Ready' : 'Mark Ready'}
      </button>

      {allReady && (
        <button
          onClick={onSubmitResult}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            backgroundColor: '#059669',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          All Ready — Enter Results
        </button>
      )}

      {error && <p style={{ color: '#dc2626', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
}