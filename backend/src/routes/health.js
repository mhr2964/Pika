const express = require('express');
const { env } = require('../config/env');

const healthRouter = express.Router();

healthRouter.get('/', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'pika-backend',
    environment: env.nodeEnv
  });
});

module.exports = {
  healthRouter
};