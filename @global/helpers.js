export const waitForVariable = (V, checkInterval = 100) => {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (window[V] !== undefined) {
        clearInterval(interval);
        resolve(window[V]);
      }
    }, checkInterval);
  });
};

export const waitScript = (src, isModule = false) => {
  return new Promise((resolve) => {
    console.info("Loading script:", src);
    const script = document.createElement("script");
    script.src = src;
    if (isModule) {
      script.type = "module";
    }
    script.onload = resolve;
    document.head.appendChild(script);
  });
};

export const waitStyle = (href) => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
};

export function waitForPageLoaded() {
  return new Promise((resolve) => {
    if (document.readyState === "complete") {
      // Page already loaded
      resolve();
    } else {
      // Wait for load event
      window.addEventListener("load", () => resolve(), { once: true });
    }
  });
}

export function loadGoogleFont(href) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

export const addAutoplayProgressListeners = (emblaApi, progressNode) => {
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

export const addTogglePrevNextBtnsActive = (emblaApi, prevBtn, nextBtn) => {
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

export const addPrevNextBtnsClickHandlers = (emblaApi, prevBtn, nextBtn) => {
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

export const addDotBtnsAndClickHandlers = (emblaApi, dotsNode) => {
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

export const setupTweenScale = (emblaApi) => {
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
