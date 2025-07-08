const usecases = document.querySelectorAll(".usecases ul li");
const items = document.querySelectorAll(".usecases .content");

gsap.registerPlugin(MorphSVGPlugin);

const archives = document.getElementById("archives");

function animateIcon(tag) {
  gsap.to(archives, {
    duration: 0.5,
    morphSVG: "#" + tag,
    ease: "power2.out",
  });
}

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

function createScriptElement(src, onloadCallback) {
  const script = document.createElement("script");
  script.src = src;
  script.onload = onloadCallback;
  document.head.appendChild(script);
}

const addTogglePrevNextBtnsActive = (emblaApi, prevBtn, nextBtn) => {
  const togglePrevNextBtnsState = () => {
    if (emblaApi.canScrollPrev()) prevBtn.removeAttribute("disabled");
    else prevBtn.setAttribute("disabled", "disabled");

    if (emblaApi.canScrollNext()) nextBtn.removeAttribute("disabled");
    else nextBtn.setAttribute("disabled", "disabled");
  };

  emblaApi
    .on("select", togglePrevNextBtnsState)
    .on("init", togglePrevNextBtnsState)
    .on("reInit", togglePrevNextBtnsState);

  return () => {
    prevBtn.removeAttribute("disabled");
    nextBtn.removeAttribute("disabled");
  };
};

const addPrevNextBtnsClickHandlers = (emblaApi, prevBtn, nextBtn) => {
  const scrollPrev = () => {
    emblaApi.scrollPrev();
  };
  const scrollNext = () => {
    emblaApi.scrollNext();
  };
  prevBtn.addEventListener("click", scrollPrev, false);
  nextBtn.addEventListener("click", scrollNext, false);

  const removeTogglePrevNextBtnsActive = addTogglePrevNextBtnsActive(
    emblaApi,
    prevBtn,
    nextBtn
  );

  return () => {
    removeTogglePrevNextBtnsActive();
    prevBtn.removeEventListener("click", scrollPrev, false);
    nextBtn.removeEventListener("click", scrollNext, false);
  };
};

const addDotBtnsAndClickHandlers = (emblaApi, dotsNode) => {
  let dotNodes = [];

  const addDotBtnsWithClickHandlers = () => {
    dotsNode.innerHTML = emblaApi
      .scrollSnapList()
      .map(() => '<button class="dot" type="button"></button>')
      .join("");

    const scrollTo = (index) => {
      emblaApi.scrollTo(index);
    };

    dotNodes = Array.from(dotsNode.querySelectorAll(".dot"));
    dotNodes.forEach((dotNode, index) => {
      dotNode.addEventListener("click", () => scrollTo(index), false);
    });
  };

  const toggleDotBtnsActive = () => {
    const previous = emblaApi.previousScrollSnap();
    const selected = emblaApi.selectedScrollSnap();
    dotNodes[previous].removeAttribute("aria-selected");
    dotNodes[selected].setAttribute("aria-selected", "true");
  };

  emblaApi
    .on("init", addDotBtnsWithClickHandlers)
    .on("reInit", addDotBtnsWithClickHandlers)
    .on("init", toggleDotBtnsActive)
    .on("reInit", toggleDotBtnsActive)
    .on("select", toggleDotBtnsActive);

  return () => {
    dotsNode.innerHTML = "";
  };
};

const TWEEN_FACTOR_BASE = 0.52;
let tweenFactor = 0;
let tweenNodes = [];

const numberWithinRange = (number, min, max) =>
  Math.min(Math.max(number, min), max);

const setTweenNodes = (emblaApi) => {
  tweenNodes = emblaApi.slideNodes().map((slideNode) => {
    return slideNode;
  });
};

const setTweenFactor = (emblaApi) => {
  tweenFactor = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
};

const tweenScale = (emblaApi, eventName) => {
  const engine = emblaApi.internalEngine();
  const scrollProgress = emblaApi.scrollProgress();
  const slidesInView = emblaApi.slidesInView();
  const isScrollEvent = eventName === "scroll";

  emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
    let diffToTarget = scrollSnap - scrollProgress;
    const slidesInSnap = engine.slideRegistry[snapIndex];

    slidesInSnap.forEach((slideIndex) => {
      if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

      if (engine.options.loop) {
        engine.slideLooper.loopPoints.forEach((loopItem) => {
          const target = loopItem.target();

          if (slideIndex === loopItem.index && target !== 0) {
            const sign = Math.sign(target);

            if (sign === -1) {
              diffToTarget = scrollSnap - (1 + scrollProgress);
            }
            if (sign === 1) {
              diffToTarget = scrollSnap + (1 - scrollProgress);
            }
          }
        });
      }

      const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor);
      const scale = numberWithinRange(tweenValue, 0, 1).toString();
      const tweenNode = tweenNodes[slideIndex];
      const opacity = numberWithinRange(tweenValue, 0, 1).toString();
      tweenNode.style.transform = `scale(${scale})`;
      tweenNode.style.opacity = opacity;
    });
  });
};

const setupTweenScale = (emblaApi) => {
  setTweenNodes(emblaApi);
  setTweenFactor(emblaApi);
  tweenScale(emblaApi);

  emblaApi
    .on("reInit", setTweenNodes)
    .on("reInit", setTweenFactor)
    .on("reInit", tweenScale)
    .on("scroll", tweenScale)
    .on("slideFocus", tweenScale);

  return () => {
    tweenNodes.forEach((slide) => slide.removeAttribute("style"));
  };
};

const addAutoplayProgressListeners = (emblaApi, progressNode) => {
  const progressBarNode = document.querySelector(".embla-progress-bar");

  let animationName = "";
  let timeoutId = 0;
  let rafId = 0;

  const startProgress = (emblaApi) => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;

    const timeUntilNext = autoplay.timeUntilNext();
    if (timeUntilNext === null) return;

    if (!animationName) {
      const style = window.getComputedStyle(progressBarNode);
      animationName = style.animationName;
    }

    progressBarNode.style.animationName = "none";
    progressBarNode.style.transform = "translate3d(0,0,0)";

    rafId = window.requestAnimationFrame(() => {
      timeoutId = window.setTimeout(() => {
        progressBarNode.style.animationName = animationName;
        progressBarNode.style.animationDuration = `${timeUntilNext}ms`;
      }, 0);
    });

    progressNode.removeAttribute("aria-hidden");
  };

  const stopProgress = (emblaApi) => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;

    progressNode.setAttribute("aria-hidden", "true");
  };

  emblaApi
    .on("autoplay:timerset", startProgress)
    .on("autoplay:timerstopped", stopProgress);

  return () => {
    emblaApi
      .off("autoplay:timerset", startProgress)
      .off("autoplay:timerstopped", stopProgress);
  };
};

createScriptElement(
  "https://unpkg.com/embla-carousel/embla-carousel.umd.js",
  () => {
    createScriptElement(
      " https://unpkg.com/embla-carousel-autoplay/embla-carousel-autoplay.umd.js",
      () => {
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
          console.log("Active slide changed to:", activeIndex);
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
    );
  }
);

if (window.innerWidth <= 1000) {
  createScriptElement(
    "https://unpkg.com/embla-carousel/embla-carousel.umd.js",
    () => {
      const emblaNode = document.querySelector(".usecases .embla");
      const options = { loop: false };
      const dots = document.querySelector(".usecases #embla-dots");
      const prevBtn = emblaNode.querySelector("#embla-prev");
      const nextBtn = emblaNode.querySelector("#embla-next");
      const emblaApi = EmblaCarousel(emblaNode, options, []);
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
  );
}

// gsap.registerPlugin(DrawSVGPlugin);

// const tl = gsap
//   .timeline({
//     repeat: -1,
//     defaults: { duration: 3, ease: "power1.inOut" },
//   })
//   .set("#svg", { opacity: 1 })
//   .from("path", { drawSVG: "0% 0%" })
//   .to("path", { drawSVG: "100% 100%" });
// console.log(tl);

// gsap
//   .timeline({
//     repeat: -1,
//     defaults: { duration: 3, ease: "power1.inOut" },
//   })
//   .set("#svg-stage", { opacity: 1 })
//   .from("path", { drawSVG: "0% 0%" })
//   .to("path", { drawSVG: "100% 100%" });
// console.log(tl);

// gsap.from("#maskedShape", {
//   duration: 2,
//   opacity: 0,
//   scale: 0.7,
//   transformOrigin: "center center",
//   ease: "power2.out",
// });
