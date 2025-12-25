import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const LOCAL_SQLITE_URL = "file:./sqlite.db";

// Supported libSQL URL schemes
const SUPPORTED_SCHEMES = [
  "libsql:",
  "wss:",
  "ws:",
  "https:",
  "http:",
  "file:",
];

// Get a valid libSQL database URL, falling back to local SQLite for unsupported schemes
function getDatabaseUrl(url: string): string {
  // Check if URL starts with a supported scheme
  const isSupported = SUPPORTED_SCHEMES.some((scheme) =>
    url.startsWith(scheme)
  );

  if (!isSupported) {
    console.warn(
      `DATABASE_URL uses unsupported scheme. LibSQL supports: ${SUPPORTED_SCHEMES.join(
        ", "
      )}. Falling back to local SQLite.`
    );
    return LOCAL_SQLITE_URL;
  }

  // Skip further processing for file-based SQLite URLs
  if (url.startsWith("file:")) {
    return url;
  }

  try {
    const parsedUrl = new URL(url);
    // Remove unsupported libSQL parameters (e.g., from PostgreSQL URLs)
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

const databaseUrl = getDatabaseUrl(
  process.env.DATABASE_URL || "file:./sqlite.db"
);

const client = createClient({
  url: databaseUrl,
});

export const db = drizzle(client, { schema });
