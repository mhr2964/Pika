const express = require('express');
const {
  createRoom,
  joinRoom,
  getRoom,
  submitChoice,
  advancePhase,
  getResults
} = require('../controllers/roomsController');

const roomsRouter = express.Router();

/**
 * Launch v1 room surface only.
 * Auth/session attachment is intentionally not implemented here; approved auth
 * middleware can be inserted ahead of handlers when available.
 */
roomsRouter.post('/', createRoom);
roomsRouter.post('/:code/join', joinRoom);
roomsRouter.get('/:code', getRoom);
roomsRouter.post('/:code/choices', submitChoice);
roomsRouter.post('/:code/advance', advancePhase);
roomsRouter.get('/:code/results', getResults);

module.exports = {
  roomsRouter
};