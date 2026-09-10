// Runs on every visit to the 404 page and records the hit two ways:
//   1. Instant alert — pings a private ntfy.sh topic (subscribe at
//      https://ntfy.sh/solkpg-404-472f6470f7 or in the ntfy app) so a broken link
//      is noticed the moment someone follows it.
//   2. Durable record — fires a Vercel Web Analytics "404" event carrying the bad
//      path and referrer. View it in the project's Analytics dashboard under Events
//      (filter eventName = "404"); it persists there, unlike the ~12h ntfy cache.
// The window.va shim is set up in 404.html's <head>, so the event is queued even if
// the analytics script hasn't finished loading yet.
(() => {
  const path = `${location.pathname}${location.search}`;
  const referrer = document.referrer || "direct / unknown";

  // 1. Instant alert via ntfy.
  try {
    fetch("https://ntfy.sh/solkpg-404-472f6470f7", {
      method: "POST",
      body: `Path: ${path}\nFrom: ${referrer}`,
      headers: { "Title": "SOL site - 404 hit", "Tags": "warning" },
    }).catch(() => {});
  } catch (e) {}

  // 2. Durable record via Vercel Web Analytics.
  try {
    window.va && window.va("event", { name: "404", data: { path, referrer } });
  } catch (e) {}
})();
