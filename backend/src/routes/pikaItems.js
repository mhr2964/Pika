const express = require('express');
const {
  createPikaItem,
  listPikaItems,
  updatePikaItemStatus
} = require('../controllers/pikaItemsController');

const pikaItemsRouter = express.Router();

pikaItemsRouter.post('/', createPikaItem);
pikaItemsRouter.get('/', listPikaItems);
pikaItemsRouter.patch('/:id/status', updatePikaItemStatus);

module.exports = {
  pikaItemsRouter
};