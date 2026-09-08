#!/usr/bin/env node
// View the log of 404 hits recorded by js/notify-404.js.
//
// Two sources:
//   * Live ntfy cache (default) — quick ad-hoc check, but ntfy.sh only keeps
//     ~12h on the free public server, so it is a rolling recent view.
//   * The durable log kept in GitHub by .github/workflows/log-404s.yml — full
//     history. Fetch it first, e.g.:
//         git show sol-404-log:logs/404-hits.jsonl > 404-hits.jsonl
//         bin/404-log.mjs --file 404-hits.jsonl
//
// Usage:
//   bin/404-log.mjs                    # live: everything ntfy still has cached
//   bin/404-log.mjs 24h                # live: last 24 hours (also: 30m, 2h, 7d)
//   bin/404-log.mjs --json             # live: raw ntfy message objects (NDJSON)
//   bin/404-log.mjs --file <path.jsonl># read the durable JSONL log instead
//
// Needs Node 18+ (built-in fetch for live mode).

import { readFileSync } from "node:fs";

const TOPIC = "solkpg-404-472f6470f7";

const args = process.argv.slice(2);
const asJson = args.includes("--json");
const fileIdx = args.indexOf("--file");
const filePath = fileIdx !== -1 ? args[fileIdx + 1] : null;
const since = args.find((a) => !a.startsWith("--") && a !== filePath) || "all";

const fmtTime = (unixSeconds) =>
  new Date(unixSeconds * 1000).toLocaleString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

// Normalize either source into { time, path, referrer } for display.
const print = (hits, label) => {
  if (hits.length === 0) {
    console.log(`No 404 hits ${label}.`);
    return;
  }
  for (const h of hits) {
    console.log(`${fmtTime(h.time)}  SOL site - 404 hit`);
    console.log(`  Path: ${h.path || "(unknown)"}`);
    console.log(`  From: ${h.referrer || "direct / unknown"}\n`);
  }
  console.log(`${hits.length} hit${hits.length === 1 ? "" : "s"} (${label}).`);
};

const parseBody = (message = "") => ({
  path: (message.match(/^Path: (.*)$/m) || [])[1] ?? "",
  referrer: (message.match(/^From: (.*)$/m) || [])[1] ?? "",
});

if (filePath) {
  // Durable-log mode: read the JSONL written by bin/collect-404s.mjs.
  let hits;
  try {
    hits = readFileSync(filePath, "utf8")
      .split("\n")
      .filter((l) => l.trim())
      .map((l) => JSON.parse(l))
      .sort((a, b) => a.time - b.time);
  } catch (err) {
    console.error(`Could not read ${filePath}: ${err.message}`);
    process.exit(1);
  }
  if (asJson) {
    for (const h of hits) console.log(JSON.stringify(h));
  } else {
    print(hits, `from ${filePath}`);
  }
  process.exit(0);
}

// Live mode: poll the ntfy cache.
try {
  const res = await fetch(`https://ntfy.sh/${TOPIC}/json?poll=1&since=${encodeURIComponent(since)}`);
  if (!res.ok) {
    console.error(`ntfy responded ${res.status} ${res.statusText}`);
    process.exit(1);
  }

  const messages = (await res.text())
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line))
    .filter((m) => m.event === "message");

  if (asJson) {
    for (const m of messages) console.log(JSON.stringify(m));
    process.exit(0);
  }

  print(
    messages.map((m) => ({ time: m.time, ...parseBody(m.message) })),
    `since=${since}`
  );
} catch (err) {
  console.error(`Could not reach ntfy.sh: ${err.message}`);
  process.exit(1);
}
