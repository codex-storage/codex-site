import { waitScript } from "../@global/helpers.js";

const observer = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach(async (entry) => {
      if (entry.isIntersecting) {
        obs.unobserve(entry.target);

        await waitScript("/img/js/vanilla-tilt.js");

        VanillaTilt.init(document.querySelector("#about-tilt"), {
          max: 10,
          glare: true,
          perspective: 500,
          startY: 2,
          startX: 15,
          speed: 400,
        });
      }
    });
  },
  {
    threshold: 0.5,
  }
);

observer.observe(document.querySelector(".about"));
