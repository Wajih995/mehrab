import "server-only";

import fs from "node:fs";
import path from "node:path";

/**
 * Tiny JSON file persistence for DEMO mode (no DATABASE_URL).
 *
 * Admin edits (products, menus) survive dev-server restarts by being
 * mirrored to `.data/*.json` (gitignored). With DATABASE_URL set these
 * helpers are never called — Prisma owns the data.
 */
const DATA_DIR = path.join(process.cwd(), ".data");

export function loadJson<T>(name: string): T | null {
  try {
    const raw = fs.readFileSync(path.join(DATA_DIR, `${name}.json`), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null; // missing or corrupt file → caller falls back to the seed
  }
}

export function saveJson(name: string, value: unknown): void {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(
      path.join(DATA_DIR, `${name}.json`),
      JSON.stringify(value, null, 2)
    );
  } catch (err) {
    console.error(`Could not persist .data/${name}.json`, err);
  }
}
