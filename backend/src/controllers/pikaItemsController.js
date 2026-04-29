const {
  createItem,
  listItems,
  updateItemStatus,
  isValidStatus
} = require('../storage/pikaItemsStore');

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function createPikaItem(req, res, next) {
  try {
    const { name, description = '' } = req.body || {};

    if (typeof name !== 'string' || name.trim().length === 0) {
      throw createHttpError(400, 'Field "name" is required.');
    }

    if (typeof description !== 'string') {
      throw createHttpError(400, 'Field "description" must be a string.');
    }

    const item = await createItem({
      name: name.trim(),
      description: description.trim()
    });

    res.status(201).json({ data: item });
  } catch (error) {
    next(error);
  }
}

async function listPikaItems(req, res, next) {
  try {
    const { status } = req.query;

    if (status !== undefined && !isValidStatus(status)) {
      throw createHttpError(400, 'Query "status" must be one of: pending, active, archived.');
    }

    const items = await listItems({ status });
    res.status(200).json({ data: items });
  } catch (error) {
    next(error);
  }
}

async function updatePikaItemStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body || {};

    if (!isValidStatus(status)) {
      throw createHttpError(400, 'Field "status" must be one of: pending, active, archived.');
    }

    const item = await updateItemStatus(id, status);

    if (!item) {
      throw createHttpError(404, 'Pika item not found.');
    }

    res.status(200).json({ data: item });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createPikaItem,
  listPikaItems,
  updatePikaItemStatus
};