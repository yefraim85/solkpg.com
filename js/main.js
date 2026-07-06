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

// Smooth scroll to an in-page anchor, including on landing from another page
const scrollToHash = (hash) => {
  if (!hash || hash === "#top") return;
  const target = document.querySelector(hash);
  if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
};
if (window.location.hash) {
  window.requestAnimationFrame(() => scrollToHash(window.location.hash));
}
document.querySelectorAll('a[href^="#"], a[href*=".html#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
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

// Contact form (placeholder submit handler)
const form = document.getElementById("contactForm");
const toast = document.getElementById("toast");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  toast.classList.add("is-visible");
  form.reset();
  setTimeout(() => toast.classList.remove("is-visible"), 3200);
});
