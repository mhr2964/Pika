const {
  createItem,
  listItems,
  updateItemStatus
} = require('../storage/pikaItemsStore');
const {
  isValidPikaItemStatus,
  normalizeCreatePikaItemInput
} = require('../contracts/pikaItems');

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function createPikaItem(req, res, next) {
  try {
    const input = normalizeCreatePikaItemInput(req.body || {});
    const item = await createItem(input);

    res.status(201).json({
      data: item
    });
  } catch (error) {
    next(error);
  }
}

async function listPikaItems(req, res, next) {
  try {
    const { status } = req.query;

    if (status !== undefined && !isValidPikaItemStatus(status)) {
      throw createHttpError(400, 'Query "status" must be one of: pending, active, archived.');
    }

    const items = await listItems({ status });

    res.status(200).json({
      data: items
    });
  } catch (error) {
    next(error);
  }
}

async function updatePikaItemStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body || {};

    if (!isValidPikaItemStatus(status)) {
      throw createHttpError(400, 'Field "status" must be one of: pending, active, archived.');
    }

    const updatedItem = await updateItemStatus(id, status);

    if (!updatedItem) {
      throw createHttpError(404, 'Pika item not found.');
    }

    res.status(200).json({
      data: updatedItem
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createPikaItem,
  listPikaItems,
  updatePikaItemStatus
};