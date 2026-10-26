const themeToggle = document.querySelector(".theme-toggle");

const setDarkMode = (enabled) => {
  document.body.classList.toggle("is-dark", enabled);
  themeToggle.setAttribute("aria-pressed", String(enabled));
};

setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
themeToggle.hidden = false;
themeToggle.addEventListener("click", () => {
  setDarkMode(!document.body.classList.contains("is-dark"));
});

const resourceSections = [...document.querySelectorAll(".resource-collection")];
const collectionToggle = document.querySelector(".collection-toggle");
const collectionToggleLabel = collectionToggle.querySelector("span");

const syncCollectionToggle = () => {
  const allOpen = resourceSections.every((section) => section.open);
  collectionToggle.setAttribute("aria-expanded", String(allOpen));
  collectionToggleLabel.textContent = allOpen ? "Collapse all" : "Expand all";
};

collectionToggle.addEventListener("click", () => {
  const shouldOpen = !resourceSections.every((section) => section.open);
  resourceSections.forEach((section) => {
    section.open = shouldOpen;
  });
  syncCollectionToggle();
});

resourceSections.forEach((section) => {
  section.addEventListener("toggle", syncCollectionToggle);
});
syncCollectionToggle();
collectionToggle.hidden = false;
