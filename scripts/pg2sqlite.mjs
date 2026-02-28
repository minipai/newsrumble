import { readFileSync } from "fs";
import { unlinkSync, existsSync } from "fs";
import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const sqlFile = join(root, "postgres.sql");
const dbFile = join(root, "data", "newsrumble.db");

// Remove existing db
if (existsSync(dbFile)) unlinkSync(dbFile);

const raw = readFileSync(sqlFile, "utf-8");

// Split into statements
const lines = raw.split("\n");
let statements = [];
let current = [];

for (const line of lines) {
  // Skip comments and empty lines
  if (line.startsWith("--") || line.trim() === "") {
    // If we have accumulated lines, save them as a statement boundary check
    continue;
  }
  // Skip SEQUENCE statements
  if (
    line.match(/CREATE SEQUENCE/i) ||
    line.match(/DROP SEQUENCE/i) ||
    line.match(/ALTER SEQUENCE/i) ||
    line.match(/SELECT setval/i)
  ) {
    // Skip until semicolon
    if (!line.includes(";")) {
      let idx = lines.indexOf(line);
      // Skip multiline sequence statements - handled by skipping in main loop
    }
    continue;
  }

  current.push(line);

  // Check if statement is complete (ends with ;)
  const trimmed = line.trimEnd();
  if (trimmed.endsWith(";")) {
    statements.push(current.join("\n"));
    current = [];
  }
}

if (current.length > 0) {
  statements.push(current.join("\n"));
}

// Transform statements for SQLite
function transformStatement(stmt) {
  // Remove "public". prefix
  stmt = stmt.replace(/"public"\./g, "");

  // Transform CREATE TABLE: replace nextval(...) DEFAULT with INTEGER PRIMARY KEY
  if (stmt.match(/CREATE TABLE/i)) {
    // Remove DEFAULT nextval(...) and ::regclass
    stmt = stmt.replace(
      /"id"\s+int4\s+NOT NULL\s+DEFAULT\s+nextval\('[^']*'::regclass\)/g,
      '"id" INTEGER'
    );
    // Replace PRIMARY KEY constraint - we'll keep it as is since SQLite supports it
    // Replace int4 with INTEGER
    stmt = stmt.replace(/\bint4\b/g, "INTEGER");
    // Replace varchar(255) with TEXT
    stmt = stmt.replace(/varchar\(\d+\)/g, "TEXT");
    // Replace timestamp with TEXT (SQLite stores dates as text)
    stmt = stmt.replace(/\btimestamp\b/g, "TEXT");
    // Replace date type (after quoted column name) with TEXT, but not the column name itself
    stmt = stmt.replace(/("\w+")\s+\bdate\b/g, "$1 TEXT");
  }

  // Handle INSERT: fix escaping differences
  if (stmt.match(/INSERT INTO/i)) {
    // PostgreSQL uses '' for escaping single quotes, SQLite does too - so this is compatible
    // Remove "public". prefix already handled above
  }

  return stmt;
}

// Filter out sequence-related statements and transform the rest
const transformed = statements
  .filter((stmt) => {
    const upper = stmt.toUpperCase().trim();
    return (
      !upper.startsWith("CREATE SEQUENCE") &&
      !upper.startsWith("DROP SEQUENCE") &&
      !upper.startsWith("ALTER SEQUENCE") &&
      !upper.startsWith("SELECT SETVAL")
    );
  })
  .map(transformStatement);

// Create SQLite database
const db = new Database(dbFile);
db.pragma("journal_mode = WAL");

db.exec("BEGIN;");
for (const stmt of transformed) {
  try {
    db.exec(stmt);
  } catch (err) {
    console.error("Error executing:", stmt.substring(0, 200));
    console.error(err.message);
    // Continue with other statements
  }
}
db.exec("COMMIT;");

// Verify
const tables = db
  .prepare("SELECT name FROM sqlite_master WHERE type='table'")
  .all();
console.log("Tables:", tables.map((t) => t.name).join(", "));

for (const table of tables) {
  const count = db.prepare(`SELECT COUNT(*) as c FROM "${table.name}"`).get();
  console.log(`  ${table.name}: ${count.c} rows`);
}

db.close();
console.log(`\nDatabase created: ${dbFile}`);
