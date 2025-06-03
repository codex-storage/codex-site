const tags = document.querySelectorAll(".tags span");

function containsTag(classList, tags) {
  let found = false;
  classList.forEach((cls) => {
    if (tags.includes(cls)) {
      found = true;
      return true;
    }
  });

  return found;
}

tags.forEach((tag) => {
  tag.addEventListener("click", () => {
    const isActive = tag.hasAttribute("aria-selected");
    const actives = isActive ? [] : [tag.innerText.toLowerCase()];

    document.querySelectorAll(".tags span").forEach((t) => {
      if (t.hasAttribute("aria-selected") && t !== tag) {
        actives.push(t.innerText.toLowerCase());
      }
    });

    const details = document.querySelectorAll(".faq details");
    const currentTag = tag.innerText.toLowerCase();
    console.info(isActive, actives);
    details.forEach((d) => {
      if (actives.length === 0) {
        d.removeAttribute("aria-hidden");
      } else if (containsTag(d.classList, actives)) {
        d.removeAttribute("aria-hidden");
      } else {
        d.setAttribute("aria-hidden", true);
      }
    });

    tag.toggleAttribute("aria-selected");
  });
});
