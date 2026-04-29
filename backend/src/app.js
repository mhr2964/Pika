const express = require('express');
const { healthRouter } = require('./routes/health');
const { pikaItemsRouter } = require('./routes/pikaItems');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

function createApp() {
  const app = express();

  app.use(express.json());

  app.use('/api/v1/health', healthRouter);
  app.use('/api/v1/pika-items', pikaItemsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = {
  createApp
};