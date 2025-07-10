import {
  waitScript,
  waitStyle,
  waitForPageLoaded,
  loadGoogleFont,
} from "./helpers.js";

loadGoogleFont(
  "https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,100..900&display=swap"
);
loadGoogleFont(
  "https://fonts.googleapis.com/css2?family=Azeret+Mono:ital,wght@0,100..900;1,100..900&family=Inter:opsz,wght@14..32,100..900&display=swap"
);

/////////////////////////////////////////////////////////////////////////////////////////////////////////
async function addRandomText() {
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
  const randomNumber = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

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
  class TypeShuffle {
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
      console.info("fx6");
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
            console.info("finished");
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

  function createObserver(ts) {
    return new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Only run once per element
            ts.trigger("fx6");
          }
        });
      },
      {
        threshold: 0.5, // Adjust as needed (0.5 = 50% visible)
      }
    );
  }

  document.querySelectorAll("section header > p").forEach((p) => {
    const ts = new TypeShuffle(p);
    const observer = createObserver(ts);
    observer.observe(p);
  });

  document.querySelectorAll("section header > span").forEach((p) => {
    const ts = new TypeShuffle(p);
    const observer = createObserver(ts);
    observer.observe(p);
  });

  const discoverTs = new TypeShuffle(document.querySelector(".discover"));
  document.querySelector(".discover").onmouseenter = (e) =>
    discoverTs.trigger("fx6");

  if (window.innerWidth > 800) {
    document.querySelectorAll("#menu nav a").forEach((item) => {
      const ts = new TypeShuffle(item);
      ts.trigger("fx6");

      item.onmouseenter = (e) => {
        ts.trigger("fx6");
      };
    });
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function stickyMenu() {
  const header = document.querySelector("body > header");
  let lastScroll = 0;

  const validateHeader = () => {
    const windowY = window.scrollY;
    const windowH = window.innerHeight;

    if (windowY > windowH) {
      // We passed the first section, set a toggable class
      header.classList.add("is-fixed");
    } else {
      header.classList.remove("is-fixed", "can-animate");
    }

    if (windowY > windowH + 40) {
      header.classList.add("can-animate");
    } else {
      header.classList.remove("scroll-up");
    }

    if (windowY < lastScroll) {
      header.classList.add("scroll-up");
    } else {
      header.classList.remove("scroll-up");
    }

    lastScroll = windowY;
  };

  const throttle = (func, time = 100) => {
    let lastTime = 0;
    return () => {
      const now = new Date();
      if (now - lastTime >= time) {
        func();
        time = now;
      }
    };
  };

  window.addEventListener("scroll", throttle(validateHeader, 100));
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function footer() {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          await waitScript("https://cdn.jsdelivr.net/npm/underscore@1.13.7");

          (function (w, d) {
            const options = ["ⓒ", "🅾", "Ɗ", "ė", "✖"],
              hovers = ["hover", "hover2"],
              map = {};

            const setup = () => {
              w.onresize = _.debounce(() => redraw(), 250);

              d.onmousemove = (mev) => {
                addAnim(mev.target, mev.buttons);
              };
              const getEl = (x, y) => {
                if (map[x + "_" + y]) return map[x + "_" + y];
                let e = d.elementFromPoint(x, y);
                if (e) map[x + "_" + y] = e;
                return e;
              };
              const touchHandler = (tev) => {
                tev.preventDefault();
                for (let i = 0; i < tev.changedTouches.length; i++) {
                  let el = getEl(
                    tev.changedTouches[i].pageX,
                    tev.changedTouches[i].pageY
                  );
                  if (el) addAnim(el);
                }
              };
              d.addEventListener(
                "touchstart",
                _.debounce(touchHandler, 250),
                false
              );
              d.addEventListener("touchmove", touchHandler, false);
              redraw();
            };

            const addAnim = (target, buttonPressed) => {
              if (target.nodeName != "SPAN") return;
              target.className = _.sample(hovers);
              if (buttonPressed)
                target.style.color = "#000000".replace(/0/g, function () {
                  return (~~(Math.random() * 16)).toString(16);
                });
              target.innerHTML = _.sample(options);
              _.delay(() => {
                if (target.className.indexOf("hover") != -1) {
                  target.className = "";
                }
              }, 750);
            };

            const redraw = () => {
              const div = window.innerWidth < 800 ? 10 : 15;
              let wh = d.clientHeight,
                ww = window.outerWidth,
                /*These arrays are to workaround CodePen's infinite loop "feature", large for-loops seem to trigger the error even if the loop isn't actually infinite :/ - Creating arrays padded with zeroes and using forEach seems to work (for now!!).*/
                cols = new Array((ww / div) | 0).join("0").split(""),
                rows = new Array((wh / div) | 0).join("0").split(""),
                rh = [],
                top = 5;
              d.innerHTML = "";
              rows.forEach(() => {
                let spans = 0;
                cols.forEach(() => spans++);
                rh.push(spans);
              });
              rh.forEach((r) => {
                if (r == rh[0]) {
                  let row = '<div class="row">',
                    left = 10;
                  new Array(r)
                    .join("0")
                    .split("")
                    .forEach(() => {
                      row += `<span style="left:${left}px; top: ${top}px">+</span>`;
                      left += 15;
                    });
                  row += "</div>";
                  d.innerHTML += row;
                  top += 15;
                }
              });
            };

            setup();
          })(window, document.getElementById("background"));
        }
      });
    },
    {
      threshold: 0.1, // Adjust as needed (0.5 = 50% visible)
    }
  );

  observer.observe(document.querySelector(".blog"));
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
waitForPageLoaded().then(() => {
  addRandomText();
  stickyMenu();
  footer();
});
