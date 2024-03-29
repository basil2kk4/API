 /* ============================= toggle style switcher ============================= */
const styleSwitcherToggle = document.querySelector(".style-switcher-toggler");

styleSwitcherToggle.addEventListener("click", () => {
  document.querySelector(".style-switcher").classList.toggle("open");
})
// hide style switcher on scroll
window.addEventListener("scroll", () => {
  if (document.querySelector(".style-switcher").classList.contains("open")) {
    document.querySelector(".style-switcher").classList.remove("open");
  }
})
/* ============================= theme colors ============================= */
const colors = document.getElementsByClassName('color');

for (let i = 0; i < colors.length; i++) {
  colors[i].addEventListener('click', changeColor)
}
function changeColor() {
  const color = this.getAttribute('data-color');
  document.documentElement.style.setProperty('--pink-color', color);
}
/* ============================= theme light and dark mode ============================= */
const dayNight = document.querySelector(".day-night");
dayNight.addEventListener("click", () => {
  dayNight.querySelector("i").classList.toggle("fa-sun");
  dayNight.querySelector("i").classList.toggle("fa-moon");
  document.body.classList.toggle("dark");
})
window.addEventListener("load", () => {
  if (document.body.classList.contains("dark")) {
    dayNight.querySelector("i").classList.add("fa-sun")
  }
  else {
    dayNight.querySelector("i").classList.add("fa-moon")
  }
})