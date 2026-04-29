function createContractError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function normalizeString(value) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();
}

function requireNonEmptyString(value, fieldName) {
  const normalizedValue = normalizeString(value);

  if (!normalizedValue) {
    throw createContractError(`Field "${fieldName}" is required.`, 400);
  }

  return normalizedValue;
}

function normalizeOptionalTopic(value) {
  if (value === undefined) {
    return '';
  }

  if (typeof value !== 'string') {
    throw createContractError('Field "topic" must be a string.', 400);
  }

  return value.trim();
}

function normalizeCreateRoomInput(input) {
  return {
    hostName: requireNonEmptyString(input.hostName, 'hostName'),
    topic: normalizeOptionalTopic(input.topic)
  };
}

function normalizeJoinRoomInput(input) {
  return {
    name: requireNonEmptyString(input.name, 'name')
  };
}

function normalizeVoteInput(input) {
  const playerId = requireNonEmptyString(input.playerId, 'playerId');
  const targetId = requireNonEmptyString(input.targetId, 'targetId');
  const value = Number(input.value);

  if (!Number.isFinite(value) || value <= 0) {
    throw createContractError('Field "value" must be a positive number.', 400);
  }

  return {
    playerId,
    targetId,
    value
  };
}

function normalizeReactionInput(input) {
  return {
    playerId: requireNonEmptyString(input.playerId, 'playerId'),
    emoji: requireNonEmptyString(input.emoji, 'emoji')
  };
}

module.exports = {
  normalizeCreateRoomInput,
  normalizeJoinRoomInput,
  normalizeVoteInput,
  normalizeReactionInput
};