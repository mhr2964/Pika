const {
  createRoomRecord,
  getRoomByCode,
  joinRoomByCode,
  submitChoiceForRoom,
  advanceRoomPhase,
  getRoomResults
} = require('../storage/roomsStore');

function createHttpError(statusCode, code, message, fields) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  error.fields = fields;
  return error;
}

function sendError(res, error) {
  const statusCode = error.statusCode || 500;
  const code = error.code || 'INTERNAL_ERROR';
  const message =
    statusCode >= 500 ? 'An unexpected error occurred.' : error.message || 'Request failed.';

  return res.status(statusCode).json({
    error: {
      code,
      message,
      ...(error.fields ? { fields: error.fields } : {})
    }
  });
}

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function parseCreateRoomInput(body) {
  const hostDisplayName = normalizeString(body.hostDisplayName);
  const matchupPrompt = normalizeString(body.matchupPrompt) || 'Pick your favorite';
  const rawChoices = Array.isArray(body.choices) ? body.choices : [];
  const choices = rawChoices
    .map((choice, index) => ({
      id: normalizeString(choice && choice.id) || `choice_${index + 1}`,
      label: normalizeString(choice && choice.label)
    }))
    .filter((choice) => choice.label);

  const fields = [];
  if (!hostDisplayName) {
    fields.push({ field: 'hostDisplayName', message: 'hostDisplayName is required.' });
  }
  if (choices.length < 2) {
    fields.push({ field: 'choices', message: 'At least two choices are required.' });
  }

  if (fields.length) {
    throw createHttpError(400, 'VALIDATION_ERROR', 'Invalid create room payload.', fields);
  }

  return { hostDisplayName, matchupPrompt, choices };
}

function parseJoinInput(body) {
  const displayName = normalizeString(body.displayName);
  if (!displayName) {
    throw createHttpError(400, 'VALIDATION_ERROR', 'Invalid join payload.', [
      { field: 'displayName', message: 'displayName is required.' }
    ]);
  }

  return { displayName };
}

function parseSubmitChoiceInput(body) {
  const participantId = normalizeString(body.participantId);
  const matchupId = normalizeString(body.matchupId);
  const choiceId = normalizeString(body.choiceId);
  const requestId = normalizeString(body.requestId);

  const fields = [];
  if (!participantId) fields.push({ field: 'participantId', message: 'participantId is required.' });
  if (!matchupId) fields.push({ field: 'matchupId', message: 'matchupId is required.' });
  if (!choiceId) fields.push({ field: 'choiceId', message: 'choiceId is required.' });

  if (fields.length) {
    throw createHttpError(400, 'VALIDATION_ERROR', 'Invalid submit choice payload.', fields);
  }

  return { participantId, matchupId, choiceId, requestId: requestId || undefined };
}

function parseAdvanceInput(body) {
  const action = normalizeString(body.action);
  const requestedByParticipantId = normalizeString(body.requestedByParticipantId);

  const fields = [];
  if (action !== 'advance') fields.push({ field: 'action', message: 'action must be "advance".' });
  if (!requestedByParticipantId) {
    fields.push({
      field: 'requestedByParticipantId',
      message: 'requestedByParticipantId is required.'
    });
  }

  if (fields.length) {
    throw createHttpError(400, 'VALIDATION_ERROR', 'Invalid advance payload.', fields);
  }

  return { action, requestedByParticipantId };
}

async function createRoom(req, res) {
  try {
    const input = parseCreateRoomInput(req.body || {});
    const result = await createRoomRecord(input);
    res.status(201).json({ data: result });
  } catch (error) {
    sendError(res, error);
  }
}

async function joinRoom(req, res) {
  try {
    const input = parseJoinInput(req.body || {});
    const result = await joinRoomByCode(req.params.code, input);
    res.status(200).json({ data: result });
  } catch (error) {
    sendError(res, error);
  }
}

async function getRoom(req, res) {
  try {
    const room = await getRoomByCode(req.params.code);
    if (!room) {
      throw createHttpError(404, 'NOT_FOUND', 'Room not found.');
    }
    res.status(200).json({ data: { room } });
  } catch (error) {
    sendError(res, error);
  }
}

async function submitChoice(req, res) {
  try {
    const input = parseSubmitChoiceInput(req.body || {});
    const result = await submitChoiceForRoom(req.params.code, input);
    res.status(200).json({ data: result });
  } catch (error) {
    sendError(res, error);
  }
}

async function advancePhase(req, res) {
  try {
    const input = parseAdvanceInput(req.body || {});
    const result = await advanceRoomPhase(req.params.code, input);
    res.status(200).json({ data: result });
  } catch (error) {
    sendError(res, error);
  }
}

async function getResults(req, res) {
  try {
    const result = await getRoomResults(req.params.code);
    res.status(200).json({ data: result });
  } catch (error) {
    sendError(res, error);
  }
}

module.exports = {
  createRoom,
  joinRoom,
  getRoom,
  submitChoice,
  advancePhase,
  getResults
};