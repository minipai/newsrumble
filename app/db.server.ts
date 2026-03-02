import Database from "better-sqlite3";
import path from "path";

const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), "data", "newsrumble.db");
const db = new Database(dbPath, { readonly: true });

export { db };
