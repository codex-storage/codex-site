import { addAutoplayProgressListeners } from "./embla-autoplay.js";
import { waitScript } from "../@global/helpers.js";
import { addPrevNextBtnsClickHandlers } from "./embla-buttons.js";

const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(async (entry) => {
    if (entry.isIntersecting) {
      obs.unobserve(entry.target);

      if (window.EmblaCarousel === undefined) {
        await waitScript(
          "https://cdn.jsdelivr.net/npm/embla-carousel@8.6.0/embla-carousel.umd.min.js"
        );
      }

      await waitScript(
        "https://cdn.jsdelivr.net/npm/embla-carousel-autoplay@8.6.0/embla-carousel-autoplay.umd.min.js"
      );

      const emblaNode = document.querySelector(".team .embla");
      const options = { loop: false, dragFree: true };
      const prevBtn = document.querySelector("#embla-prev-team");
      const nextBtn = document.querySelector("#embla-next-team");
      const progressNode = document.querySelector("#embla-progress");
      const emblaApi = EmblaCarousel(emblaNode, options, [
        EmblaCarouselAutoplay({ playOnInit: 1, delay: 3000 }),
      ]);
      const removePrevNextBtnsClickHandlers = addPrevNextBtnsClickHandlers(
        emblaApi,
        prevBtn,
        nextBtn
      );

      const removeProgressListeners = addAutoplayProgressListeners(
        emblaApi,
        progressNode
      );

      let c = document.getElementById("contributor-0");
      c.classList.add("active");

      document
        .querySelectorAll(".contributor")
        .forEach((contributor, index) => {
          contributor.onclick = () => {
            emblaApi.scrollTo(index);
            c.classList.remove("active");
            c = contributor;
            c.classList.add("active");
          };
        });

      emblaApi.on("select", () => {
        c.classList.remove("active");
        const activeIndex = emblaApi.selectedScrollSnap();
        c = document.getElementById("contributor-" + activeIndex);
        c.classList.add("active");
      });

      let hasStopped = false;

      document.querySelector(".team .embla").onmouseenter = () => {
        emblaApi?.plugins().autoplay.stop();
      };

      document.querySelector(".team .embla").onmouseleave = () => {
        if (!hasStopped) {
          emblaApi?.plugins().autoplay.play();
        }
      };

      document.getElementById("embla-play-team").onclick = () => {
        hasStopped = !hasStopped;
        if (hasStopped) {
          emblaApi?.plugins().autoplay.stop();
        } else {
          emblaApi?.plugins().autoplay.play();
        }
        document.getElementById("embla-play-team").classList.toggle("stop");
      };

      emblaApi
        .on("destroy", removePrevNextBtnsClickHandlers)
        .on("destroy", removeProgressListeners);
    }
  });
});

observer.observe(document.querySelector(".team"));
