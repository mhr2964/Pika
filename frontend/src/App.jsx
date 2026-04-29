import React, { useState } from 'react';
import { CreateRoom } from './screens/CreateRoom';
import { JoinRoom } from './screens/JoinRoom';
import { RoomState } from './screens/RoomState';
import { SubmitResult } from './screens/SubmitResult';
import { Resolved } from './screens/Resolved';

function App() {
  const [screen, setScreen] = useState('splash');
  const [roomId, setRoomId] = useState(null);
  const [participantId, setParticipantId] = useState(null);
  const [result, setResult] = useState(null);

  const handleCreateRoom = (rid, code) => {
    setRoomId(rid);
    setParticipantId(`creator-${rid}`);
    setScreen('room-state');
  };

  const handleJoinRoom = (rid, pid) => {
    setRoomId(rid);
    setParticipantId(pid);
    setScreen('room-state');
  };

  const handleSubmitResult = () => {
    setScreen('submit-result');
  };

  const handleResultSubmitted = (data) => {
    setResult(data.result || 'Your entry');
    setScreen('resolved');
  };

  const handleRestart = () => {
    setScreen('splash');
    setRoomId(null);
    setParticipantId(null);
    setResult(null);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#fafafa',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <header style={{
        backgroundColor: '#fff',
        borderBottom: '1px solid #e5e7eb',
        padding: '1rem 2rem',
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>Pika</h1>
      </header>

      <main style={{ minHeight: 'calc(100vh - 70px)' }}>
        {screen === 'splash' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
            padding: '4rem 2rem',
            maxWidth: '900px',
            margin: '0 auto',
          }}>
            <div onClick={() => setScreen('create')} style={{ cursor: 'pointer' }}>
              <div style={{
                backgroundColor: '#fff',
                border: '2px solid #2563eb',
                padding: '2rem',
                borderRadius: '12px',
                textAlign: 'center',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>➕</div>
                <h2 style={{ margin: '0 0 0.5rem 0' }}>Create Room</h2>
                <p style={{ color: '#666', margin: 0 }}>Start a new matchup</p>
              </div>
            </div>
            <div onClick={() => setScreen('join')} style={{ cursor: 'pointer' }}>
              <div style={{
                backgroundColor: '#fff',
                border: '2px solid #7c3aed',
                padding: '2rem',
                borderRadius: '12px',
                textAlign: 'center',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(124, 58, 237, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔗</div>
                <h2 style={{ margin: '0 0 0.5rem 0' }}>Join Room</h2>
                <p style={{ color: '#666', margin: 0 }}>Enter a room code</p>
              </div>
            </div>
          </div>
        )}

        {screen === 'create' && (
          <CreateRoom onRoomCreated={handleCreateRoom} />
        )}

        {screen === 'join' && (
          <JoinRoom onJoined={handleJoinRoom} />
        )}

        {screen === 'room-state' && (
          <RoomState
            roomId={roomId}
            participantId={participantId}
            onReady={() => {}}
            onSubmitResult={handleSubmitResult}
          />
        )}

        {screen === 'submit-result' && (
          <SubmitResult
            roomId={roomId}
            participantId={participantId}
            onSubmitted={handleResultSubmitted}
          />
        )}

        {screen === 'resolved' && (
          <Resolved result={result} onRestart={handleRestart} />
        )}
      </main>
    </div>
  );
}

export default App;