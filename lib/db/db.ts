import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

// Strip unsupported URL parameters for libSQL (e.g., sslmode from PostgreSQL URLs)
function sanitizeDatabaseUrl(url: string): string {
  // Skip sanitization for file-based SQLite URLs
  if (url.startsWith("file:")) {
    return url;
  }

  try {
    const parsedUrl = new URL(url);
    // Remove unsupported libSQL parameters
    const unsupportedParams = [
      "sslmode",
      "ssl",
      "sslcert",
      "sslkey",
      "sslrootcert",
    ];
    unsupportedParams.forEach((param) => parsedUrl.searchParams.delete(param));
    return parsedUrl.toString();
  } catch {
    // If URL parsing fails, return as-is
    return url;
  }
}

const databaseUrl = sanitizeDatabaseUrl(
  process.env.DATABASE_URL || "file:./sqlite.db"
);

const client = createClient({
  url: databaseUrl,
});

export const db = drizzle(client, { schema });
