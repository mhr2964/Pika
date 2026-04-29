const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

function parseBoolean(value, defaultValue = false) {
  if (value === undefined) {
    return defaultValue;
  }

  return value === 'true';
}

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 3000),
  persistPikaItems: parseBoolean(process.env.PERSIST_PIKA_ITEMS, false),
  pikaItemsFile: path.resolve(process.cwd(), process.env.PIKA_ITEMS_FILE || './data/pika-items.json')
};

module.exports = {
  env
};