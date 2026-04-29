const express = require('express');
const {
  createPikaItem,
  listPikaItems,
  updatePikaItemStatus
} = require('../controllers/pikaItemsController');

const pikaItemsRouter = express.Router();

pikaItemsRouter.get('/', listPikaItems);
pikaItemsRouter.post('/', createPikaItem);
pikaItemsRouter.patch('/:id/status', updatePikaItemStatus);

module.exports = {
  pikaItemsRouter
};