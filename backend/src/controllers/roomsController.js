const {
  normalizeCreateRoomInput,
  normalizeJoinRoomInput,
  normalizeVoteInput,
  normalizeReactionInput
} = require('../contracts/rooms');
const {
  createRoomRecord,
  getRoomById,
  joinRoomById,
  submitVoteForRoom,
  submitReactionForRoom,
  getRoomResults
} = require('../storage/roomsStore');

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function createRoom(req, res, next) {
  try {
    const input = normalizeCreateRoomInput(req.body || {});
    const room = await createRoomRecord(input);

    res.status(201).json({
      data: room
    });
  } catch (error) {
    next(error);
  }
}

async function joinRoom(req, res, next) {
  try {
    const { roomId } = req.params;
    const input = normalizeJoinRoomInput(req.body || {});
    const result = await joinRoomById(roomId, input);

    if (!result) {
      throw createHttpError(404, 'Room not found.');
    }

    res.status(200).json({
      data: result
    });
  } catch (error) {
    next(error);
  }
}

async function getRoom(req, res, next) {
  try {
    const { roomId } = req.params;
    const room = await getRoomById(roomId);

    if (!room) {
      throw createHttpError(404, 'Room not found.');
    }

    res.status(200).json({
      data: room
    });
  } catch (error) {
    next(error);
  }
}

async function submitVote(req, res, next) {
  try {
    const { roomId } = req.params;
    const input = normalizeVoteInput(req.body || {});
    const vote = await submitVoteForRoom(roomId, input);

    if (!vote) {
      throw createHttpError(404, 'Room not found.');
    }

    res.status(201).json({
      data: vote
    });
  } catch (error) {
    next(error);
  }
}

async function submitReaction(req, res, next) {
  try {
    const { roomId } = req.params;
    const input = normalizeReactionInput(req.body || {});
    const reaction = await submitReactionForRoom(roomId, input);

    if (!reaction) {
      throw createHttpError(404, 'Room not found.');
    }

    res.status(201).json({
      data: reaction
    });
  } catch (error) {
    next(error);
  }
}

async function getResults(req, res, next) {
  try {
    const { roomId } = req.params;
    const results = await getRoomResults(roomId);

    if (!results) {
      throw createHttpError(404, 'Room not found.');
    }

    res.status(200).json({
      data: results
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createRoom,
  joinRoom,
  getRoom,
  submitVote,
  submitReaction,
  getResults
};