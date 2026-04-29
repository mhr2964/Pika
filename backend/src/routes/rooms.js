const express = require('express');
const {
  createRoom,
  joinRoom,
  getRoom,
  submitVote,
  submitReaction,
  getResults
} = require('../controllers/roomsController');

const roomsRouter = express.Router();

roomsRouter.post('/', createRoom);
roomsRouter.get('/:roomId', getRoom);
roomsRouter.post('/:roomId/join', joinRoom);
roomsRouter.post('/:roomId/votes', submitVote);
roomsRouter.post('/:roomId/reactions', submitReaction);
roomsRouter.get('/:roomId/results', getResults);

module.exports = {
  roomsRouter
};