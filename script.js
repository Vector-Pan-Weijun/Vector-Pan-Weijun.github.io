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

const dialog = document.querySelector(".lightbox");
const dialogImage = dialog.querySelector("img");
const dialogCaption = dialog.querySelector("p");

document.querySelectorAll(".image-button").forEach((button) => {
  button.addEventListener("click", () => {
    const image = button.querySelector("img");
    const caption = button.closest("figure").querySelector("figcaption");
    dialogImage.src = image.src;
    dialogImage.alt = image.alt;
    dialogCaption.textContent = caption?.textContent || image.alt;
    dialog.showModal();
  });
});

dialog.querySelector(".lightbox-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
