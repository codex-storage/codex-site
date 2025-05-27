document.querySelector(".menu svg").addEventListener("click", function (e) {
  const menu = document.getElementsByClassName("menu")[0];
  menu.toggleAttribute("aria-expanded");
});

document
  .querySelector(".menu .icon + .icon")
  .addEventListener("click", function (e) {
    const menu = document.getElementsByClassName("menu")[0];
    menu.removeAttribute("aria-expanded");
  });
