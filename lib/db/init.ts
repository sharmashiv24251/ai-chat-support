import { createClient } from "@libsql/client";

const LOCAL_SQLITE_URL = "file:./sqlite.db";

// SQL to create tables if they don't exist
const CREATE_TABLES_SQL = `
CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL REFERENCES conversations(id),
  role TEXT NOT NULL CHECK(role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TEXT NOT NULL
);
`;

let initialized = false;

export async function initializeDatabase(): Promise<void> {
  if (initialized) return;

  const databaseUrl = process.env.DATABASE_URL || LOCAL_SQLITE_URL;

  try {
    const client = createClient({
      url: databaseUrl,
    });

    // Execute each statement separately
    const statements = CREATE_TABLES_SQL.split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const statement of statements) {
      await client.execute(statement);
    }

    console.log("Database tables initialized successfully");
    initialized = true;
  } catch (error) {
    console.error("Failed to initialize database tables:", error);
    throw error;
  }
}
