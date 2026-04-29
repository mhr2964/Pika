const fs = require('fs/promises');
const path = require('path');
const { env } = require('../config/env');
const { PIKA_ITEM_STATUSES } = require('../types/pikaItems');

const items = new Map();
let hasLoadedFromDisk = false;

function isValidStatus(status) {
  return PIKA_ITEM_STATUSES.includes(status);
}

function createId() {
  return `item_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function serializeItems() {
  return Array.from(items.values());
}

function getSafeStoragePath() {
  const resolvedFilePath = env.pikaItemsFile;
  const safeBaseDirectory = path.resolve(process.cwd()) + path.sep;

  if (!resolvedFilePath.startsWith(safeBaseDirectory)) {
    throw new Error('Resolved storage path is outside the allowed workspace.');
  }

  return resolvedFilePath;
}

async function ensureStorageFile() {
  const storageFilePath = getSafeStoragePath();
  const storageDirectory = path.dirname(storageFilePath);

  await fs.mkdir(storageDirectory, { recursive: true });

  try {
    await fs.access(storageFilePath);
  } catch (_error) {
    await fs.writeFile(storageFilePath, '[]', 'utf8');
  }

  return storageFilePath;
}

async function loadFromDiskIfNeeded() {
  if (!env.persistPikaItems || hasLoadedFromDisk) {
    return;
  }

  const storageFilePath = await ensureStorageFile();
  const rawContent = await fs.readFile(storageFilePath, 'utf8');
  const parsedItems = JSON.parse(rawContent);

  items.clear();

  for (const item of parsedItems) {
    if (item && typeof item.id === 'string') {
      items.set(item.id, item);
    }
  }

  hasLoadedFromDisk = true;
}

async function persistToDisk() {
  if (!env.persistPikaItems) {
    return;
  }

  const storageFilePath = await ensureStorageFile();
  await fs.writeFile(storageFilePath, JSON.stringify(serializeItems(), null, 2), 'utf8');
}

async function createItem({ name, description }) {
  await loadFromDiskIfNeeded();

  const timestamp = new Date().toISOString();
  const item = {
    id: createId(),
    name,
    description,
    status: 'pending',
    createdAt: timestamp,
    updatedAt: timestamp
  };

  items.set(item.id, item);
  await persistToDisk();

  return item;
}

async function listItems({ status } = {}) {
  await loadFromDiskIfNeeded();

  const allItems = serializeItems();

  if (!status) {
    return allItems;
  }

  return allItems.filter((item) => item.status === status);
}

async function updateItemStatus(id, status) {
  await loadFromDiskIfNeeded();

  const existingItem = items.get(id);

  if (!existingItem) {
    return null;
  }

  const updatedItem = {
    ...existingItem,
    status,
    updatedAt: new Date().toISOString()
  };

  items.set(id, updatedItem);
  await persistToDisk();

  return updatedItem;
}

module.exports = {
  createItem,
  listItems,
  updateItemStatus,
  isValidStatus
};