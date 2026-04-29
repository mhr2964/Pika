const fs = require('fs/promises');
const path = require('path');
const { env } = require('../config/env');

const itemsById = new Map();
let hasLoadedPersistedItems = false;

function createItemId() {
  return `item_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function getAllItems() {
  return Array.from(itemsById.values());
}

function getSafeStoragePath() {
  const resolvedPath = env.pikaItemsFile;
  const workspaceRoot = `${path.resolve(process.cwd())}${path.sep}`;

  if (!resolvedPath.startsWith(workspaceRoot)) {
    throw new Error('Resolved storage path is outside the allowed workspace.');
  }

  return resolvedPath;
}

async function ensureStorageFile() {
  const storagePath = getSafeStoragePath();
  const storageDirectory = path.dirname(storagePath);

  await fs.mkdir(storageDirectory, { recursive: true });

  try {
    await fs.access(storagePath);
  } catch (_error) {
    await fs.writeFile(storagePath, '[]', 'utf8');
  }

  return storagePath;
}

async function loadPersistedItemsIfNeeded() {
  if (!env.persistPikaItems || hasLoadedPersistedItems) {
    return;
  }

  const storagePath = await ensureStorageFile();
  const rawContent = await fs.readFile(storagePath, 'utf8');
  const parsedItems = JSON.parse(rawContent);

  itemsById.clear();

  for (const item of parsedItems) {
    if (item && typeof item.id === 'string') {
      itemsById.set(item.id, item);
    }
  }

  hasLoadedPersistedItems = true;
}

async function persistItemsIfEnabled() {
  if (!env.persistPikaItems) {
    return;
  }

  const storagePath = await ensureStorageFile();
  await fs.writeFile(storagePath, JSON.stringify(getAllItems(), null, 2), 'utf8');
}

async function createItem({ name, description }) {
  await loadPersistedItemsIfNeeded();

  const timestamp = new Date().toISOString();
  const item = {
    id: createItemId(),
    name,
    description,
    status: 'pending',
    createdAt: timestamp,
    updatedAt: timestamp
  };

  itemsById.set(item.id, item);
  await persistItemsIfEnabled();

  return item;
}

async function listItems({ status } = {}) {
  await loadPersistedItemsIfNeeded();

  const items = getAllItems();

  if (!status) {
    return items;
  }

  return items.filter((item) => item.status === status);
}

async function updateItemStatus(id, status) {
  await loadPersistedItemsIfNeeded();

  const existingItem = itemsById.get(id);

  if (!existingItem) {
    return null;
  }

  const updatedItem = {
    ...existingItem,
    status,
    updatedAt: new Date().toISOString()
  };

  itemsById.set(id, updatedItem);
  await persistItemsIfEnabled();

  return updatedItem;
}

module.exports = {
  createItem,
  listItems,
  updateItemStatus
};