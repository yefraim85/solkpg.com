document.getElementById("year").textContent = new Date().getFullYear();

// Sticky nav background on scroll
const nav = document.getElementById("nav");
const onScroll = () => {
  nav.classList.toggle("is-scrolled", window.scrollY > 40);
};
document.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const navOverlay = document.getElementById("navOverlay");
const setMenuOpen = (open) => {
  navLinks.classList.toggle("is-open", open);
  navToggle.classList.toggle("is-active", open);
  navOverlay.classList.toggle("is-open", open);
};
navToggle.addEventListener("click", () => {
  setMenuOpen(!navLinks.classList.contains("is-open"));
});
navOverlay.addEventListener("click", () => setMenuOpen(false));
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

// Smooth scroll to an in-page anchor, including on landing from another page.
// Skipped on mobile — the JS-driven scroll fought with the fixed nav/slide-out
// menu there, so mobile falls back to native (CSS scroll-behavior) jumps.
const isMobileNav = () => window.matchMedia("(max-width: 720px)").matches;
const scrollToHash = (hash) => {
  if (!hash || hash === "#top") return;
  const target = document.querySelector(hash);
  if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
};
if (window.location.hash && !isMobileNav()) {
  window.requestAnimationFrame(() => scrollToHash(window.location.hash));
}
document.querySelectorAll('a[href^="#"], a[href*=".html#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    if (isMobileNav()) return;
    const [, hash] = link.getAttribute("href").split("#");
    const samePage = !link.getAttribute("href").includes(".html") ||
      link.pathname === window.location.pathname;
    if (samePage && hash) {
      e.preventDefault();
      scrollToHash("#" + hash);
      history.pushState(null, "", "#" + hash);
    }
  });
});

// Scroll-spy: highlight the nav link for the section currently in view
const spySections = ["vision", "experience", "facility", "team", "contact"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);
if (spySections.length) {
  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        document.querySelectorAll(".nav-links a").forEach((a) => {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + id);
        });
      });
    },
    { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
  );
  spySections.forEach((sec) => spyObserver.observe(sec));
}

// Scroll reveal
const revealEls = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealEls.forEach((el) => revealObserver.observe(el));
