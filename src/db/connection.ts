import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const DB_PATH = "/tmp/app.sqlite";
const SCHEMA_PATH = path.join(__dirname, "schema.sql");
const SEED_PATH = path.join(__dirname, "seed.sql");

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);
db.pragma("foreign_keys = ON");

const schema = fs.readFileSync(SCHEMA_PATH, "utf-8");
db.exec(schema);

const seed = fs.readFileSync(SEED_PATH, "utf-8");
db.exec(seed);

export { db };
