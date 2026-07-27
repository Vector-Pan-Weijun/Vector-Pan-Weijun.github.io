document.documentElement.classList.add("js");

const body = document.body;
const toggle = document.querySelector(".language-toggle");

toggle.addEventListener("click", () => {
  const isZh = body.classList.toggle("zh");
  document.documentElement.lang = isZh ? "zh-CN" : "en";
  toggle.textContent = isZh ? "EN" : "中文";
  toggle.setAttribute("aria-pressed", String(isZh));
  localStorage.setItem("portfolio-language", isZh ? "zh" : "en");
});

if (localStorage.getItem("portfolio-language") === "zh") toggle.click();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

const progressBar = document.querySelector(".scroll-progress span");
const updateProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
};
updateProgress();
window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);

const navLinks = [...document.querySelectorAll("nav a[href^='#']")];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, { rootMargin: "-35% 0px -55%", threshold: 0 });
document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));

const internshipTabs = [...document.querySelectorAll("[data-internship-tab]")];
const internshipSlides = [...document.querySelectorAll("[data-internship-slide]")];
const activateInternshipSlide = (index) => {
  internshipTabs.forEach((tab, tabIndex) => {
    const active = tabIndex === index;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  internshipSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === index);
  });
};
internshipTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateInternshipSlide(index));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(event.key)) return;
    event.preventDefault();
    const direction = ["ArrowDown", "ArrowRight"].includes(event.key) ? 1 : -1;
    const next = (index + direction + internshipTabs.length) % internshipTabs.length;
    internshipTabs[next].focus();
    activateInternshipSlide(next);
  });
});

document.querySelectorAll(
  ".workflow div, .project-card, .timeline-item, .skill-grid article, .internship-outcomes article"
).forEach((panel) => {
  panel.classList.add("interactive-panel");
  panel.addEventListener("pointermove", (event) => {
    const rect = panel.getBoundingClientRect();
    panel.style.setProperty("--pointer-x", `${event.clientX - rect.left}px`);
    panel.style.setProperty("--pointer-y", `${event.clientY - rect.top}px`);
  });
});

const dialog = document.querySelector(".lightbox");
const dialogImage = dialog.querySelector("img");
const dialogCaption = dialog.querySelector("p");

document.querySelectorAll(".image-button").forEach((button) => {
  button.addEventListener("click", () => {
    const image = button.querySelector("img");
    const caption = button.closest("figure").querySelector("figcaption");
    dialogImage.src = image.src;
    dialogImage.alt = image.alt;
    const languageCaption = caption?.querySelector(body.classList.contains("zh") ? ".lang-zh" : ".lang-en");
    dialogCaption.textContent = languageCaption?.textContent || caption?.textContent || image.alt;
    dialog.showModal();
  });
});

dialog.querySelector(".lightbox-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
