import { unlinkSync } from "fs";
import { JSONFilePreset } from "lowdb/node";
import path from "path";

try {
  unlinkSync(path.join("db.json"));
} catch (e) {}

const db = await JSONFilePreset("db.json", { jobs: [] });

export default db;
