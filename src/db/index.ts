import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const DB_PATH = join(process.cwd(), "quikapi-data.json");

interface Api {
  id: string;
  name: string;
  description: string;
  schema: string;
  createdAt: string;
}

interface Record {
  id: string;
  apiId: string;
  resource: string;
  data: string;
  createdAt: string;
}

interface DB {
  apis: Api[];
  records: Record[];
}

function readDB(): DB {
  if (!existsSync(DB_PATH)) {
    return { apis: [], records: [] };
  }
  try {
    return JSON.parse(readFileSync(DB_PATH, "utf-8"));
  } catch {
    return { apis: [], records: [] };
  }
}

function writeDB(data: DB): void {
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export const db = {
  // APIs
  getAllApis(): Api[] {
    return readDB().apis.sort((a, b) =>
      a.createdAt.localeCompare(b.createdAt)
    );
  },

  getApiById(id: string): Api | undefined {
    return readDB().apis.find((a) => a.id === id);
  },

  insertApi(api: Omit<Api, "createdAt">): Api {
    const data = readDB();
    const newApi: Api = { ...api, createdAt: new Date().toISOString() };
    data.apis.push(newApi);
    writeDB(data);
    return newApi;
  },

  deleteApi(id: string): void {
    const data = readDB();
    data.apis = data.apis.filter((a) => a.id !== id);
    data.records = data.records.filter((r) => r.apiId !== id);
    writeDB(data);
  },

  // Records
  getRecords(apiId: string, resource: string): Record[] {
    return readDB().records.filter(
      (r) => r.apiId === apiId && r.resource === resource
    );
  },

  insertRecord(record: Omit<Record, "createdAt">): Record {
    const data = readDB();
    const newRecord: Record = {
      ...record,
      createdAt: new Date().toISOString(),
    };
    data.records.push(newRecord);
    writeDB(data);
    return newRecord;
  },

  updateRecord(id: string, newData: string): boolean {
    const data = readDB();
    const idx = data.records.findIndex((r) => r.id === id);
    if (idx === -1) return false;
    data.records[idx].data = newData;
    writeDB(data);
    return true;
  },

  deleteRecord(id: string): void {
    const data = readDB();
    data.records = data.records.filter((r) => r.id !== id);
    writeDB(data);
  },
};