import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "./schema";

const sqlite = new Database("quikapi.db", { create: true });

sqlite.exec(`PRAGMA journal_mode = WAL;`);

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS apis (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    schema TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS records (
    id TEXT PRIMARY KEY,
    api_id TEXT NOT NULL REFERENCES apis(id) ON DELETE CASCADE,
    resource TEXT NOT NULL,
    data TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

export const db = drizzle(sqlite, { schema });