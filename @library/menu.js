document
  .querySelector(".menu .icon:nth-child(2)")
  .addEventListener("click", function (e) {
    const menu = document.getElementsByClassName("menu")[0];
    menu.toggleAttribute("aria-expanded");
    window.document.documentElement.style.overflow = "hidden";
  });

console.info(document.querySelector(".menu .icon:nth-child(2)"));
document
  .querySelector(".menu .icon:nth-child(3)")
  .addEventListener("click", function (e) {
    const menu = document.getElementsByClassName("menu")[0];
    menu.removeAttribute("aria-expanded");
    window.document.documentElement.style.overflow = "auto";
  });
