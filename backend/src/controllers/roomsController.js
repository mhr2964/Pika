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
    const result = await joinRoomById(
      req.params.roomId,
      normalizeJoinRoomInput(req.body || {})
    );

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
    const room = await getRoomById(req.params.roomId);

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
    const vote = await submitVoteForRoom(
      req.params.roomId,
      normalizeVoteInput(req.body || {})
    );

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
    const reaction = await submitReactionForRoom(
      req.params.roomId,
      normalizeReactionInput(req.body || {})
    );

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
    const results = await getRoomResults(req.params.roomId);

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