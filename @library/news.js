const slider = document.getElementById("news");
let isDown = false;
let startX;
let scrollLeft;

slider.addEventListener("mousedown", (e) => {
  isDown = true;
  slider.classList.add("active");
  startX = e.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
});

slider.addEventListener("mouseleave", () => {
  isDown = false;
});

slider.addEventListener("mouseup", () => {
  isDown = false;
});

slider.addEventListener("mousemove", (e) => {
  if (!isDown) {
    return;
  }
  e.preventDefault();
  const x = e.pageX - slider.offsetLeft;
  const walk = x - startX;
  slider.scrollLeft = scrollLeft - walk;
});

function animateScrollLeft(element, to, duration = 500) {
  const start = element.scrollLeft;
  const change = to - start;
  const startTime = performance.now();

  function animateScroll(currentTime) {
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    element.scrollLeft = start + change * easeInOutQuad(progress);

    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  }

  // Easing function
  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  requestAnimationFrame(animateScroll);
}

const newsLeft = document.getElementById("news-left");
if (newsLeft) {
  newsLeft.addEventListener("click", function () {
    if (newsLeft.hasAttribute("aria-disabled")) {
      return;
    }

    const newsRight = document.getElementById("news-right");
    if (newsRight) {
      newsLeft.setAttribute("aria-disabled", true);
    }

    newsRight.removeAttribute("aria-disabled");
    animateScrollLeft(slider, 0, 800);
  });
}

const newsRight = document.getElementById("news-right");
if (newsRight) {
  newsRight.addEventListener("click", function () {
    if (newsRight.hasAttribute("aria-disabled")) {
      return;
    }

    const newsLeft = document.getElementById("news-left");
    if (newsLeft) {
      newsLeft.removeAttribute("aria-disabled");
    }

    newsRight.setAttribute("aria-disabled", true);
    animateScrollLeft(slider, 500, 800);
  });
}
