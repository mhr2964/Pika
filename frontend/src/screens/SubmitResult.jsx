import React, { useState } from 'react';

export function SubmitResult({ roomId, participantId, onSubmitted }) {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!result.trim()) {
      setError('Please enter a result.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/rooms/${roomId}/submit-result`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantId, result: result.trim() }),
      });
      if (!res.ok) throw new Error(`Submit failed: ${res.status}`);
      const data = await res.json();
      // TODO: confirm response shape from backend contract
      onSubmitted(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Submit Your Result</h1>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Enter your choice or result for this matchup.
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={result}
          onChange={(e) => setResult(e.target.value)}
          placeholder="Your result or choice..."
          style={{
            width: '100%',
            minHeight: '120px',
            padding: '0.75rem',
            fontSize: '1rem',
            border: '1px solid #ccc',
            borderRadius: '6px',
            fontFamily: 'inherit',
            marginBottom: '1rem',
            boxSizing: 'border-box',
            resize: 'vertical',
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
          {loading ? 'Submitting...' : 'Submit Result'}
        </button>
      </form>
      {error && <p style={{ color: '#dc2626', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
}