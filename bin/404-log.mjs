#!/usr/bin/env node
// Fetch the log of 404 hits from the private ntfy.sh topic that js/notify-404.js
// pings. ntfy.sh caches recent messages (~12h on the free public server), so this
// prints what is still cached — it is a rolling recent log, not a full archive.
//
// Usage:
//   bin/404-log.mjs            # everything ntfy still has cached
//   bin/404-log.mjs 24h        # only the last 24 hours (also: 30m, 2h, 7d)
//   bin/404-log.mjs --json     # raw message objects, one JSON per line
//
// Needs Node 18+ (uses the built-in fetch) and outbound access to ntfy.sh.

const TOPIC = "solkpg-404-472f6470f7";

const args = process.argv.slice(2);
const asJson = args.includes("--json");
const since = args.find((a) => !a.startsWith("--")) || "all";

const url = `https://ntfy.sh/${TOPIC}/json?poll=1&since=${encodeURIComponent(since)}`;

const fmtTime = (unixSeconds) =>
  new Date(unixSeconds * 1000).toLocaleString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

try {
  const res = await fetch(url);
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

  if (messages.length === 0) {
    console.log("No 404 hits cached for this window.");
    process.exit(0);
  }

  for (const m of messages) {
    const body = (m.message || "").replace(/\n/g, "\n  ");
    console.log(`${fmtTime(m.time)}  ${m.title || "(no title)"}`);
    console.log(`  ${body}\n`);
  }

  console.log(`${messages.length} hit${messages.length === 1 ? "" : "s"} (since=${since}).`);
} catch (err) {
  console.error(`Could not reach ntfy.sh: ${err.message}`);
  process.exit(1);
}
