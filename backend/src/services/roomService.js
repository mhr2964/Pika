const { v4: uuidv4 } = require('uuid');

/**
 * In-memory room store keyed by room code
 */
const rooms = new Map();

/**
 * Generate a 6-character alphanumeric room code
 */
function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

/**
 * Create a new room session
 * @returns {SessionState}
 */
function createRoom() {
  const code = generateRoomCode();
  const session = {
    code,
    createdAt: Date.now(),
    participants: [],
    matchups: [],
    results: [],
    completed: false
  };
  rooms.set(code, session);
  return session;
}

/**
 * Get a room by code
 * @param {string} code
 * @returns {SessionState | null}
 */
function getRoom(code) {
  return rooms.get(code) || null;
}

/**
 * Add a participant to a room
 * @param {string} code
 * @param {string} name
 * @returns {SessionState | null}
 */
function addParticipant(code, name) {
  const session = rooms.get(code);
  if (!session) return null;

  const participant = {
    id: uuidv4(),
    name,
    joinedAt: Date.now()
  };
  session.participants.push(participant);

  // Generate matchups if we now have 3 participants
  if (session.participants.length === 3 && session.matchups.length === 0) {
    generateMatchups(session);
  }

  return session;
}

/**
 * Generate all matchups for 3 participants (round-robin: 3 total)
 * @param {SessionState} session
 */
function generateMatchups(session) {
  const [p1, p2, p3] = session.participants;
  session.matchups = [
    {
      id: uuidv4(),
      p1Id: p1.id,
      p2Id: p2.id,
      createdAt: Date.now()
    },
    {
      id: uuidv4(),
      p1Id: p1.id,
      p2Id: p3.id,
      createdAt: Date.now()
    },
    {
      id: uuidv4(),
      p1Id: p2.id,
      p2Id: p3.id,
      createdAt: Date.now()
    }
  ];
}

/**
 * Submit a result for a matchup
 * @param {string} code
 * @param {string} matchupId
 * @param {string} submittedBy - participant ID
 * @param {string} winner - participant ID
 * @returns {SessionState | null}
 */
function submitResult(code, matchupId, submittedBy, winner) {
  const session = rooms.get(code);
  if (!session) return null;

  const matchup = session.matchups.find(m => m.id === matchupId);
  if (!matchup) return null;

  // Verify submitter is one of the participants in the matchup
  if (submittedBy !== matchup.p1Id && submittedBy !== matchup.p2Id) {
    return null;
  }

  // Verify winner is one of the participants in the matchup
  if (winner !== matchup.p1Id && winner !== matchup.p2Id) {
    return null;
  }

  const result = {
    id: uuidv4(),
    matchupId,
    submittedBy,
    winner,
    submittedAt: Date.now()
  };
  session.results.push(result);

  // Check if 2/3 quorum is met for this matchup
  checkCompletion(session);

  return session;
}

/**
 * Check if session is complete (all matchups have 2/3 quorum)
 * @param {SessionState} session
 */
function checkCompletion(session) {
  const allComplete = session.matchups.every(matchup => {
    const resultsForMatchup = session.results.filter(r => r.matchupId === matchup.id);
    return resultsForMatchup.length >= 2;
  });

  session.completed = allComplete;
}

module.exports = {
  createRoom,
  getRoom,
  addParticipant,
  submitResult,
  checkCompletion
};