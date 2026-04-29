const express = require('express');
const {
  createRoom,
  getRoom,
  addParticipant,
  submitResult
} = require('../services/roomService');

const roomsRouter = express.Router();

/**
 * POST /api/v1/rooms
 * Create a new room
 */
roomsRouter.post('/', (req, res) => {
  try {
    const session = createRoom();
    res.status(201).json({
      code: session.code,
      createdAt: session.createdAt,
      participants: session.participants,
      matchups: session.matchups,
      results: session.results,
      completed: session.completed
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create room' });
  }
});

/**
 * GET /api/v1/rooms/:code
 * Get room state by code
 */
roomsRouter.get('/:code', (req, res) => {
  try {
    const { code } = req.params;
    const session = getRoom(code);

    if (!session) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.status(200).json({
      code: session.code,
      createdAt: session.createdAt,
      participants: session.participants,
      matchups: session.matchups,
      results: session.results,
      completed: session.completed
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch room' });
  }
});

/**
 * POST /api/v1/rooms/:code/join
 * Add a participant to a room
 */
roomsRouter.post('/:code/join', (req, res) => {
  try {
    const { code } = req.params;
    const { name } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'Name is required' });
    }

    const session = addParticipant(code, name.trim());

    if (!session) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.status(200).json({
      code: session.code,
      createdAt: session.createdAt,
      participants: session.participants,
      matchups: session.matchups,
      results: session.results,
      completed: session.completed
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to join room' });
  }
});

/**
 * POST /api/v1/rooms/:code/results
 * Submit a result for a matchup
 */
roomsRouter.post('/:code/results', (req, res) => {
  try {
    const { code } = req.params;
    const { matchupId, submittedBy, winner } = req.body;

    if (!matchupId || !submittedBy || !winner) {
      return res.status(400).json({ error: 'matchupId, submittedBy, and winner are required' });
    }

    const session = submitResult(code, matchupId, submittedBy, winner);

    if (!session) {
      return res.status(404).json({ error: 'Room or matchup not found' });
    }

    res.status(200).json({
      code: session.code,
      createdAt: session.createdAt,
      participants: session.participants,
      matchups: session.matchups,
      results: session.results,
      completed: session.completed
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit result' });
  }
});

module.exports = {
  roomsRouter
};