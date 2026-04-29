const PIKA_ITEM_STATUSES = ['pending', 'active', 'archived'];

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function isValidPikaItemStatus(value) {
  return PIKA_ITEM_STATUSES.includes(value);
}

function normalizeCreatePikaItemInput(input) {
  const { name, description = '' } = input;

  if (typeof name !== 'string' || name.trim().length === 0) {
    throw createHttpError(400, 'Field "name" is required.');
  }

  if (typeof description !== 'string') {
    throw createHttpError(400, 'Field "description" must be a string.');
  }

  return {
    name: name.trim(),
    description: description.trim()
  };
}

module.exports = {
  PIKA_ITEM_STATUSES,
  isValidPikaItemStatus,
  normalizeCreatePikaItemInput
};