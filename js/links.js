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

const resourceSections = document.querySelectorAll(".resource-collection");

document.querySelector("#expandAll").addEventListener("click", () => {
  resourceSections.forEach((section) => {
    section.open = true;
  });
});

document.querySelector("#collapseAll").addEventListener("click", () => {
  resourceSections.forEach((section) => {
    section.open = false;
  });
});

document.querySelector(".collection-actions").hidden = false;
