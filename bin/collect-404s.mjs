#!/usr/bin/env node
// Merge the latest cached 404 hits from the private ntfy.sh topic into a durable
// JSONL log. Idempotent: dedupes by ntfy message id, so it is safe to run on a
// schedule (see .github/workflows/log-404s.yml) even though ntfy keeps re-serving
// the same ~12h of cached messages on every poll. This is what turns ntfy's
// ephemeral cache into a permanent, append-only log kept in GitHub.
//
// Usage: node bin/collect-404s.mjs <path-to-log.jsonl>
// The file is created if missing and rewritten sorted by time (oldest first).
// A transient ntfy outage is not fatal — the existing log is left untouched.
//
// Needs Node 18+ (built-in fetch) and outbound access to ntfy.sh.

import { readFileSync, writeFileSync, existsSync } from "node:fs";

const TOPIC = "solkpg-404-472f6470f7";
const logPath = process.argv[2];

if (!logPath) {
  console.error("usage: node bin/collect-404s.mjs <path-to-log.jsonl>");
  process.exit(2);
}

const parseBody = (message = "") => ({
  path: (message.match(/^Path: (.*)$/m) || [])[1] ?? "",
  referrer: (message.match(/^From: (.*)$/m) || [])[1] ?? "",
});

// Load existing records, keyed by ntfy message id.
const byId = new Map();
if (existsSync(logPath)) {
  for (const line of readFileSync(logPath, "utf8").split("\n")) {
    if (!line.trim()) continue;
    try {
      const rec = JSON.parse(line);
      if (rec.id) byId.set(rec.id, rec);
    } catch {
      /* skip malformed line */
    }
  }
}
const before = byId.size;

// Fetch whatever ntfy still has cached; a network/HTTP failure is non-fatal.
let text;
try {
  const res = await fetch(`https://ntfy.sh/${TOPIC}/json?poll=1&since=all`);
  if (!res.ok) {
    console.error(`ntfy responded ${res.status} ${res.statusText}; log left unchanged.`);
    process.exit(0);
  }
  text = await res.text();
} catch (err) {
  console.error(`Could not reach ntfy.sh (${err.message}); log left unchanged.`);
  process.exit(0);
}

for (const line of text.split("\n")) {
  if (!line.trim()) continue;
  let m;
  try {
    m = JSON.parse(line);
  } catch {
    continue;
  }
  if (m.event !== "message" || !m.id || byId.has(m.id)) continue;
  const { path, referrer } = parseBody(m.message);
  byId.set(m.id, { id: m.id, time: m.time, iso: new Date(m.time * 1000).toISOString(), path, referrer });
}

const records = [...byId.values()].sort((a, b) => a.time - b.time);
writeFileSync(logPath, records.map((r) => JSON.stringify(r)).join("\n") + (records.length ? "\n" : ""));

const added = byId.size - before;
console.error(`Added ${added} new hit${added === 1 ? "" : "s"}; ${records.length} total.`);
