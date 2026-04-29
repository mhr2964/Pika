const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

function parseBoolean(value, defaultValue = false) {
  if (value === undefined) {
    return defaultValue;
  }

  return String(value).toLowerCase() === 'true';
}

function parsePort(value, defaultValue) {
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    return defaultValue;
  }

  return parsedValue;
}

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parsePort(process.env.PORT, 3000),
  persistRooms: parseBoolean(process.env.PERSIST_ROOMS, false),
  roomsFile: path.resolve(process.cwd(), process.env.ROOMS_FILE || './data/rooms.json')
};

module.exports = {
  env
};