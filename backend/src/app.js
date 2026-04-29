const express = require('express');
const { healthRouter } = require('./routes/health');
const { roomsRouter } = require('./routes/rooms');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

function createApp() {
  const app = express();

  app.use(express.json());

  app.use('/api/v1/health', healthRouter);
  app.use('/api/v1/rooms', roomsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = {
  createApp
};