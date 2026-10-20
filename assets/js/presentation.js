const slides = [...document.querySelectorAll(".slide")];
const progress = document.querySelector("#deck-progress");
const previous = document.querySelector("#prev-slide");
const next = document.querySelector("#next-slide");
let active = Number(window.location.hash.replace("#slide-", "")) || 1;

progress.innerHTML = slides.map((_, index) => `<span class="progress-dot" data-progress="${index + 1}"></span>`).join("");

function showSlide(number, updateUrl = true) {
  active = Math.max(1, Math.min(slides.length, number));
  slides.forEach((slide, index) => slide.classList.toggle("is-active", index + 1 === active));
  document.querySelectorAll(".progress-dot").forEach((dot) => dot.classList.toggle("is-active", Number(dot.dataset.progress) === active));
  if (updateUrl) history.replaceState(null, "", `#slide-${active}`);
}

previous.addEventListener("click", () => showSlide(active - 1));
next.addEventListener("click", () => showSlide(active + 1));
document.addEventListener("keydown", (event) => {
  if (["ArrowRight", " ", "PageDown"].includes(event.key)) { event.preventDefault(); showSlide(active + 1); }
  if (["ArrowLeft", "PageUp"].includes(event.key)) { event.preventDefault(); showSlide(active - 1); }
  if (event.key === "Home") showSlide(1);
  if (event.key === "End") showSlide(slides.length);
});
window.addEventListener("hashchange", () => showSlide(Number(window.location.hash.replace("#slide-", "")) || 1, false));
showSlide(active, false);
