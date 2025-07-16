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

if (!window.Splitting) {
  await Promise.all([
    waitStyle(
      "https://cdn.jsdelivr.net/npm/splitting@1.1.0/dist/splitting.css"
    ),
    waitStyle(
      "https://cdn.jsdelivr.net/npm/splitting@1.1.0/dist/splitting-cells.css"
    ),
    waitScript(
      "https://cdn.jsdelivr.net/npm/splitting@1.1.0/dist/splitting.min.js"
    ),
  ]);
}

/**
 * Class representing one line
 */
class Line {
  // line position
  position = -1;
  // cells/chars
  cells = [];

  /**
   * Constructor.
   * @param {Element} DOM_el - the char element (<span>)
   */
  constructor(linePosition) {
    this.position = linePosition;
  }
}

/**
 * Class representing one cell/char
 */
class Cell {
  // DOM elements
  DOM = {
    // the char element (<span>)
    el: null,
  };
  // cell position
  position = -1;
  // previous cell position
  previousCellPosition = -1;
  // original innerHTML
  original;
  // current state/innerHTML
  state;
  color;
  originalColor;
  // cached values
  cache;

  /**
   * Constructor.
   * @param {Element} DOM_el - the char element (<span>)
   */
  constructor(DOM_el, { position, previousCellPosition } = {}) {
    this.DOM.el = DOM_el;
    this.original = this.DOM.el.innerHTML;
    this.state = this.original;
    this.color = this.originalColor = getComputedStyle(
      document.documentElement
    ).getPropertyValue("--color-text");
    this.position = position;
    this.previousCellPosition = previousCellPosition;
  }
  /**
   * @param {string} value
   */
  set(value) {
    this.state = value;
    this.DOM.el.innerHTML = this.state;
  }
}

/**
 * Class representing the TypeShuffle object
 */
export class TypeShuffle {
  // DOM elements
  DOM = {
    // the main text element
    el: null,
  };
  // array of Line objs
  lines = [];
  // array of letters and symbols
  lettersAndSymbols = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "!",
    "@",
    "#",
    "$",
    "&",
    "*",
    "(",
    ")",
    "-",
    "_",
    "+",
    "=",
    "/",
    "[",
    "]",
    "{",
    "}",
    ";",
    ":",
    "<",
    ">",
    ",",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
  ];
  // effects and respective methods
  effects = {
    fx6: () => this.fx6(),
  };
  totalChars = 0;

  /**
   * Constructor.
   * @param {Element} DOM_el - main text element
   */
  constructor(DOM_el) {
    this.DOM.el = DOM_el;
    // Apply Splitting (two times to have lines, words and chars)
    const results = Splitting({
      target: this.DOM.el,
      by: "lines",
    });
    results.forEach((s) => Splitting({ target: s.words }));

    // for every line
    for (const [linePosition, lineArr] of results[0].lines.entries()) {
      // create a new Line
      const line = new Line(linePosition);
      let cells = [];
      let charCount = 0;
      // for every word of each line
      for (const word of lineArr) {
        // for every character of each line
        for (const char of [...word.querySelectorAll(".char")]) {
          cells.push(
            new Cell(char, {
              position: charCount,
              previousCellPosition: charCount === 0 ? -1 : charCount - 1,
            })
          );
          ++charCount;
        }
      }
      line.cells = cells;
      this.lines.push(line);
      this.totalChars += charCount;
    }

    // TODO
    // window.addEventListener('resize', () => this.resize());
  }
  /**
   * clear all the cells chars
   */
  clearCells() {
    for (const line of this.lines) {
      for (const cell of line.cells) {
        cell.set("&nbsp;");
      }
    }
  }
  /**
   *
   * @returns {string} a random char from this.lettersAndSymbols
   */
  getRandomChar() {
    return this.lettersAndSymbols[
      Math.floor(Math.random() * this.lettersAndSymbols.length)
    ];
  }
  fx6() {
    for (const line of this.lines) {
      for (const cell of line.cells) {
        cell.cache = { state: cell.state, color: cell.color };
      }
    }
    // max iterations for each cell to change the current value
    const MAX_CELL_ITERATIONS = 10;
    let finished = 0;
    const loop = (line, cell, iteration = 0) => {
      cell.cache = { state: cell.state, color: cell.color };

      if (iteration === MAX_CELL_ITERATIONS - 1) {
        cell.set(cell.original);

        cell.color = cell.originalColor;
        cell.DOM.el.style.color = cell.color;

        ++finished;
        if (finished === this.totalChars) {
          this.isAnimating = false;
        }

        // const lines = this.lines;
        // setTimeout(function () {
        //   console.info("TypeShuffle fx6 finished");
        //   cell.set(cell.original);
        // }, 500);
      } else {
        cell.set(this.getRandomChar());

        cell.color = ["#2b4539", "#61dca3", "#61b3dc"][
          Math.floor(Math.random() * 3)
        ];
        cell.DOM.el.style.color = cell.color;
      }

      ++iteration;
      if (iteration < MAX_CELL_ITERATIONS) {
        setTimeout(() => loop(line, cell, iteration), 75);
      }
    };

    for (const line of this.lines) {
      for (const cell of line.cells) {
        setTimeout(() => loop(line, cell), (line.position + 1) * 10);
      }
    }
  }

  reset() {
    for (const line of this.lines) {
      for (const cell of line.cells) {
        cell.set(cell.original);
        cell.color = cell.originalColor;
        cell.DOM.el.style.color = cell.originalColor;
      }
    }
    this.isAnimating = false;
  }
  /**
   * call the right effect method (defined in this.effects)
   * @param {string} effect - effect type
   */
  trigger(effect = "fx1") {
    if (!(effect in this.effects) || this.isAnimating) return;
    this.isAnimating = true;
    this.effects[effect]();
  }
}
