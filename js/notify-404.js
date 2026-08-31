// Pings a private ntfy.sh topic whenever a real visitor hits this 404 page.
// Subscribe at https://ntfy.sh/solkpg-404-472f6470f7 (or the ntfy app) to get notified.
(() => {
  const topic = "solkpg-404-472f6470f7";
  const message = `Path: ${location.pathname}${location.search}\nFrom: ${document.referrer || "direct / unknown"}`;
  try {
    fetch(`https://ntfy.sh/${topic}`, {
      method: "POST",
      body: message,
      headers: {
        "Title": "SOL site - 404 hit",
        "Tags": "warning",
      },
    }).catch(() => {});
  } catch (e) {}
})();
