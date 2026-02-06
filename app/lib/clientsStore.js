import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "clients.json");

async function readStore() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    if (err.code === "ENOENT") return {};
    throw err;
  }
}

async function writeStore(store) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(store, null, 2), "utf8");
}

export async function getClient(id) {
  const store = await readStore();
  return store[id] || null;
}

export async function saveClient(client) {
  const store = await readStore();
  store[client.id] = client;
  await writeStore(store);
  return client;
}

export async function updateClient(id, updates) {
  const store = await readStore();
  if (!store[id]) return null;
  store[id] = { ...store[id], ...updates };
  await writeStore(store);
  return store[id];
}
