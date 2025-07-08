import { waitScript } from "../@global/helpers.js";
import { setupTweenScale } from "./embla-tween.js";
import { addPrevNextBtnsClickHandlers } from "./embla-buttons.js";
import { addDotBtnsAndClickHandlers } from "./embla-dots.js";

const observer = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach(async (entry) => {
      if (entry.isIntersecting) {
        obs.unobserve(entry.target);

        const isModule = true;
        await waitScript("/img/js/gsap.js", isModule);
        await waitScript("/img/js/MorphSVGPlugin.js", isModule);

        gsap.registerPlugin(MorphSVGPlugin);

        const archives = document.getElementById("archives");

        function animateIcon(tag) {
          gsap.to(archives, {
            duration: 0.5,
            morphSVG: "#" + tag,
            ease: "power2.out",
          });
        }

        const usecases = document.querySelectorAll(".usecases ul li");
        const items = document.querySelectorAll(".usecases .content");

        usecases.forEach((usecase) => {
          usecase.addEventListener("click", (e) => {
            usecases.forEach((usecase) => {
              usecase.classList.remove("li-initial");
              usecase.removeAttribute("aria-selected");
            });

            usecase.setAttribute("aria-selected", "true");

            const index = usecase.dataset.index;

            items.forEach((item) => {
              item.classList.remove("initial");
              item.removeAttribute("aria-selected");
            });

            const content = document.getElementById(`content-${index}`);
            content.setAttribute("aria-selected", "true");
            animateIcon(content.dataset.tag);
          });
        });

        if (window.innerWidth <= 1000) {
          if (window.EmblaCarousel === undefined) {
            await waitScript(
              "https://cdn.jsdelivr.net/npm/embla-carousel@8.6.0/embla-carousel.umd.min.js"
            );
          }

          const emblaNode = document.querySelector(".usecases .embla");
          const options = { loop: false };
          const dots = document.querySelector(".usecases #embla-dots");
          const prevBtn = emblaNode.querySelector("#embla-prev");
          const nextBtn = emblaNode.querySelector("#embla-next");
          const emblaApi = window.EmblaCarousel(emblaNode, options, []);
          const removeTweenScale = setupTweenScale(emblaApi);
          const removePrevNextBtnsClickHandlers = addPrevNextBtnsClickHandlers(
            emblaApi,
            prevBtn,
            nextBtn
          );
          const removeDotBtnsAndClickHandlers = addDotBtnsAndClickHandlers(
            emblaApi,
            dots
          );

          emblaApi
            .on("destroy", removeTweenScale)
            .on("destroy", removePrevNextBtnsClickHandlers)
            .on("destroy", removeDotBtnsAndClickHandlers);

          let lastIndex = 0;

          function logSlidesInView(emblaApi) {
            const [first, last = first] = emblaApi.slidesInView();

            if (first == lastIndex && last == lastIndex) {
              return;
            }

            const index = first == lastIndex ? last : first;
            const item = document.querySelectorAll(".usecase-icon path")[index];

            animateIcon(item.id);
            lastIndex = index;
          }

          emblaApi.on("slidesInView", logSlidesInView);
        }
      }
    });
  },
  {
    threshold: 0.5,
  }
);

observer.observe(document.querySelector(".usecases"));
