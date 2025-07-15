import {
  waitScript,
  waitForPageLoaded,
  waitStyle,
  addAutoplayProgressListeners,
  addPrevNextBtnsClickHandlers,
  addDotBtnsAndClickHandlers,
  setupTweenScale,
} from "../@global/helpers.js";

function videoPlayer() {
  const players = document.querySelectorAll(".video-player");

  players.forEach((player) => {
    const video = player.querySelector("video");
    const playButton = player.querySelector(".play-button");
    const pauseButton = player.querySelector(".pause-button");
    const progressBar = player.querySelector(".progress-bar");
    const dialog = player.querySelector("dialog");

    player.addEventListener("click", (event) => {
      event.stopPropagation();
      dialog.showModal();
      video.play();
    });

    dialog.addEventListener("mousedown", (event) => {
      if (event.target === dialog) {
        dialog.close();
        video.pause();
      }
    });

    dialog.addEventListener("cancel", () => {
      dialog.close();
      video.pause();
    });
  });
}

//////////////////////////////////////////////////////////////////////////////////////

function menu() {
  document
    .querySelector(".menu .icon:nth-child(2)")
    .addEventListener("click", function (e) {
      const menu = document.getElementsByClassName("menu")[0];
      menu.toggleAttribute("aria-expanded");
      window.document.documentElement.style.overflow = "hidden";
    });

  document
    .querySelector(".menu .icon:nth-child(3)")
    .addEventListener("click", function (e) {
      const menu = document.getElementsByClassName("menu")[0];
      menu.removeAttribute("aria-expanded");
      window.document.documentElement.style.overflow = "auto";
    });
}
//////////////////////////////////////////////////////////////////////////////////////
function news() {
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
}
//////////////////////////////////////////////////////////////////////////////////////
async function resources() {
  if (!window.gsap) {
    const isModule = true;
    await waitScript("/img/js/gsap.js", isModule);
  }

  const lerp = (a, b, n) => (1 - n) * a + n * b;

  // Gets the mouse position
  const getMousePos = (e) => {
    return {
      x: e.clientX,
      y: e.clientY,
    };
  };

  // This function generates a random string of a given length
  const getRandomString = (length) => {
    let result = "";
    let characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

  // Initialize mouse position object
  let mousepos = { x: 0, y: 0 };

  // Listen for mousemove events and update
  // 'mousepos' with the current mouse position
  window.addEventListener("mousemove", (ev) => {
    // Save the mouse position
    mousepos = getMousePos(ev);
  });

  // Class representing a DOM element
  // with some interactive behavior
  class Item {
    // Initialize DOM and style related properties
    DOM = {
      // main DOM element
      el: null,
      // decoration sub-element
      deco: null,
    };
    // tracks the x and y coordinates for animations
    renderedStyles = {
      x: { previous: 0, current: 0, amt: 0.1 },
      y: { previous: 0, current: 0, amt: 0.1 },
    };
    // random string of 2000 chars
    randomString = getRandomString(2000);
    // tracks scroll position
    scrollVal;
    // tracks size and position of the DOM element
    rect;

    constructor(DOM_el) {
      this.DOM.el = DOM_el;
      this.DOM.deco = this.DOM.el.querySelector(".resource-img div");
      // calculates initial size and position
      this.calculateSizePosition();
      // sets up event listeners
      this.initEvents();
    }

    // Calculate and store the current scroll
    // position and size/position of the DOM element
    calculateSizePosition() {
      // current scroll
      this.scrollVal = { x: window.scrollX, y: window.scrollY };
      // size/position
      this.rect = this.DOM.el.getBoundingClientRect();
    }

    // Register event listeners for resize, mousemove,
    // mouseenter and mouseleave
    initEvents() {
      // On resize, recalculate the size and position
      window.addEventListener("resize", () => this.calculateSizePosition());

      // On mousemove over the element, generate a
      // new random string
      this.DOM.el.addEventListener("mousemove", () => {
        // Get a new random string
        this.randomString = getRandomString(2000);
      });

      // On mouseenter, fade in the deco element and
      // start the animation loop
      this.DOM.el.addEventListener("mouseenter", () => {
        gsap.to(this.DOM.deco, {
          duration: 0.5,
          ease: "power3",
          opacity: 1,
        });
        const isFirstTick = true;
        this.loopRender(isFirstTick);
      });

      // On mouseleave, stop the animation loop and
      // fade out the deco element
      this.DOM.el.addEventListener("mouseleave", () => {
        this.stopRendering();

        gsap.to(this.DOM.deco, {
          duration: 0.5,
          ease: "power3",
          opacity: 0,
        });
      });
    }

    // Request a new animation frame to start or
    // continue the render loop
    loopRender(isFirstTick = false) {
      if (!this.requestId) {
        this.requestId = requestAnimationFrame(() => this.render(isFirstTick));
      }
    }

    // Cancel any ongoing render loop
    stopRendering() {
      if (this.requestId) {
        window.cancelAnimationFrame(this.requestId);
        this.requestId = undefined;
      }
    }

    // Render the current frame
    render(isFirstTick) {
      // Clear requestId for the next frame
      this.requestId = undefined;

      // Calculate the difference between the current
      // scroll position and the stored one
      const scrollDiff = {
        x: this.scrollVal.x - window.scrollX,
        y: this.scrollVal.y - window.scrollY,
      };

      // Calculate the new translation values based on
      // the mouse position, scroll difference and
      // the element's position
      this.renderedStyles["x"].current =
        mousepos.x - (scrollDiff.x + this.rect.left);
      this.renderedStyles["y"].current =
        mousepos.y - (scrollDiff.y + this.rect.top);

      // If it's the first animation tick, set the
      // previous values to be the same as the current ones
      if (isFirstTick) {
        this.renderedStyles["x"].previous = this.renderedStyles["x"].current;
        this.renderedStyles["y"].previous = this.renderedStyles["y"].current;
      }

      // Update the previous value to be a linear
      // interpolation between the previous and current values
      for (const key in this.renderedStyles) {
        this.renderedStyles[key].previous = lerp(
          this.renderedStyles[key].previous,
          this.renderedStyles[key].current,
          this.renderedStyles[key].amt
        );
      }

      // Apply the new styles to the DOM element
      // using CSS variables
      gsap.set(this.DOM.el, {
        "--x": this.renderedStyles["x"].previous,
        "--y": this.renderedStyles["y"].previous,
      });

      // Set the deco element's innerHTML to the random string
      this.DOM.deco.innerHTML = this.randomString;

      // Request the next frame
      this.loopRender();
    }
  }

  [...document.querySelectorAll(".resource-img")].forEach(
    (img) => new Item(img)
  );
}
//////////////////////////////////////////////////////////////////////////////////////
function about() {
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
}
//////////////////////////////////////////////////////////////////////////////////////
async function blog() {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          obs.unobserve(entry.target);

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

          if (!window.gsap) {
            const isModule = true;
            await waitScript("/img/js/gsap.js", isModule);
          }

          Splitting();

          const lettersAndSymbols = [
            "a",
            "b",
            "c",
            "d",
            "e",
            "f",
            "g",
            "h",
            "i",
            "j",
            "k",
            "l",
            "m",
            "n",
            "o",
            "p",
            "q",
            "r",
            "s",
            "t",
            "u",
            "v",
            "w",
            "x",
            "y",
            "z",
            "!",
            "@",
            "#",
            "$",
            "%",
            "^",
            "&",
            "*",
            "-",
            "_",
            "+",
            "=",
            ";",
            ":",
            "<",
            ">",
            ",",
          ];

          const articles = document.querySelectorAll(".blog article");

          function shuffleLetters(char) {
            gsap.killTweensOf(char);
            gsap.fromTo(
              char,
              {
                //   opacity: 0,
              },
              {
                duration: 0.03,
                innerHTML: () =>
                  lettersAndSymbols[
                    Math.floor(Math.random() * lettersAndSymbols.length)
                  ],
                repeat: 3,
                repeatRefresh: true,
                opacity: 1,
                repeatDelay: 0.05,
                onComplete: () => {
                  gsap.set(char, {
                    innerHTML: char.dataset.initial,
                    delay: 0.03,
                  });
                },
              }
            );
            setTimeout(() => {
              gsap.set(char, { innerHTML: char.dataset.initial, delay: 0.03 });
            }, 250);
          }

          function saveInitialState(char) {
            char.dataset.initial = char.innerHTML;
          }

          articles.forEach((article) => {
            const date = article.querySelectorAll(
              `small[data-splitting] .char`
            );
            let title = article.querySelectorAll(`h5[data-splitting] .char`);
            if (title.length === 0) {
              title = article.querySelectorAll(`h4[data-splitting] .char`);
            }
            const text = article.querySelectorAll(`p[data-splitting] .char`);

            date.forEach(saveInitialState);
            title.forEach(saveInitialState);
            text.forEach(saveInitialState);

            article.addEventListener("mouseenter", (e) => {
              date.forEach(shuffleLetters);
              title.forEach(shuffleLetters);
              text.forEach(shuffleLetters);
            });
          });

          articles.forEach((article) => {
            article.addEventListener("mouseleave", (e) => {
              const date = article.querySelectorAll(
                `small[data-splitting] .char`
              );
              let title = article.querySelectorAll(`h5[data-splitting] .char`);
              if (title.length === 0) {
                title = article.querySelectorAll(`h4[data-splitting] .char`);
              }
              const text = article.querySelectorAll(`p[data-splitting] .char`);

              date.forEach(shuffleLetters);
              title.forEach(shuffleLetters);
              text.forEach(shuffleLetters);
            });
          });
        }
      });
    },
    {
      threshold: 0.5,
    }
  );

  observer.observe(document.querySelector(".blog"));
  console.info("Blog observer initialized");
}
//////////////////////////////////////////////////////////////////////////////////////
function contribution() {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        const img = document.querySelector(".parallax-background");
        const listener = (e) => {
          const centerX = window.innerWidth / 2;
          const centerY = window.innerHeight / 2;

          const offsetX = e.clientX - centerX;
          const offsetY = e.clientY - centerY;

          const maxTiltX = 25; // left-right
          const maxTiltY = 15; // up-down

          const rotateY = (offsetX / centerX) * maxTiltX; // left-right
          const rotateX = -(offsetY / centerY) * maxTiltY; // up-down

          img.style.transform = `
    perspective(500px)
    rotateX(${rotateX.toFixed(2)}deg)
    rotateY(${rotateY.toFixed(2)}deg)
    translateX(${(offsetX / 4).toFixed(2)}px)
    scale3d(1, 1, 1)
  `;
        };
        if (entry.isIntersecting) {
          img.style.display = "block";

          window.addEventListener("mousemove", listener);
        } else {
          img.style.display = "none";
          window.removeEventListener("mousemove", listener);
        }
      });
    },
    {
      threshold: 0.1, // Adjust as needed (0.5 = 50% visible)
    }
  );

  observer.observe(document.querySelector(".contribution"));
}
//////////////////////////////////////////////////////////////////////////////////////
function faq() {
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
}
//////////////////////////////////////////////////////////////////////////////////////
function team() {
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
        const options = {
          loop: true,
          dragFree: true,
          align: "center",
          startIndex: 0,
        };
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
              const i = window.innerWidth > 800 ? index + 2 : index + 5;
              emblaApi.scrollTo(index);
              c.classList.remove("active");
              c = contributor;
              c.classList.add("active");
              currentSelectedIndex = index;
            };
          });

        let currentSelectedIndex = 0;
        emblaApi.on("select", () => {
          console.info("Active contributor:", currentSelectedIndex);

          c.classList.remove("active");
          if (currentSelectedIndex == 14) {
            currentSelectedIndex = 0;
          } else {
            currentSelectedIndex++;
          }
          c = document.getElementById("contributor-" + currentSelectedIndex);
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
}
//////////////////////////////////////////////////////////////////////////////////////
function usescases() {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          obs.unobserve(entry.target);

          const isModule = true;
          if (window.gsap === undefined) {
            await waitScript("/img/js/gsap.js", isModule);
          }

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
            const removePrevNextBtnsClickHandlers =
              addPrevNextBtnsClickHandlers(emblaApi, prevBtn, nextBtn);
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
              const item =
                document.querySelectorAll(".usecase-icon path")[index];

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
}
//////////////////////////////////////////////////////////////////////////////////////
function sectionTransitions() {
  const about = document.querySelector(".about");
  const body = document.querySelector("body > main > article");

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          body.style.backgroundColor = "var(--green-12)";
          body.style.backgroundSize = "cover";
          body.style.backgroundRepeat = "no-repeat";
          body.style.backgroundPosition = "center";
          body.style.backgroundBlendMode = "darken";
          about.style.opacity = "1";
          console.info(
            "About section is intersecting",
            body.style.backgroundColor
          );
          setTimeout(() => {
            // about.style.backgroundImage = "url(/img/about.webp)";
            // about.style.backgroundColor = "var(--green-12)";
          }, 600);
          // about.style.backgroundImage = "url(/img/about.webp)";
        } else {
          about.style.opacity = "0.5";
          body.style.backgroundSize = "";
          body.style.backgroundRepeat = "";
          body.style.backgroundPosition = "";
          body.style.backgroundBlendMode = "";
          about.style.backgroundImage = "";
          about.style.backgroundColor = "";
        }
      });
    },
    {
      threshold: 0.5,
    }
  );

  observer.observe(about);

  const hero = document.querySelector(".hero");

  new IntersectionObserver(
    (entries) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          body.style.backgroundColor = "var(--dark-30)";
          setTimeout(() => {
            hero.style.backgroundColor = "var(--dark-30)";
          }, 600);
          hero.style.opacity = "1";
        } else {
          hero.style.backgroundColor = "";
          hero.style.opacity = "0";
        }
      });
    },
    {
      threshold: 0.5,
    }
  ).observe(document.querySelector(".hero"));

  const usecases = document.querySelector(".usecases");

  new IntersectionObserver(
    (entries) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          console.info("Usecases section is intersecting");
          body.style.backgroundColor = "#2a4635";
          usecases.style.opacity = "1";

          setTimeout(() => {
            // body.style.background = `radial-gradient(95.83% 248.64% at 2.67% 4.08%, #2a4635 0%,#010614 100%)`;
          }, 600);
        } else {
          usecases.style.opacity = "0.2";
          // body.style.background = "transparent";
        }
      });
    },
    {
      threshold: 0.5,
    }
  ).observe(usecases);

  const featured = document.querySelector(".featured");

  new IntersectionObserver(
    (entries) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          body.style.backgroundColor = "rgba(240, 240, 240, 1)";
          console.info(
            "Featured section is intersecting",
            body.style.backgroundColor
          );
          setTimeout(() => {
            // body.style.background = `radial-gradient(95.83% 248.64% at 2.67% 4.08%, #2a4635 0%,#010614 100%)`;
          }, 600);
        }
      });
    },
    {
      threshold: 0.5,
    }
  ).observe(featured);

  const ui = document.querySelector(".ui");

  new IntersectionObserver(
    (entries) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          body.style.backgroundColor = "#000000";
          setTimeout(() => {
            // body.style.background = `radial-gradient(95.83% 248.64% at 2.67% 4.08%, #2a4635 0%,#010614 100%)`;
          }, 600);
        }
      });
    },
    {
      threshold: 0.5,
    }
  ).observe(ui);

  const team = document.querySelector(".team");

  new IntersectionObserver(
    (entries) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          body.style.backgroundColor = "#fff";
        }
      });
    },
    {
      threshold: 0.5,
    }
  ).observe(team);

  const contributors = document.querySelector(".contributors");

  new IntersectionObserver(
    (entries) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          body.style.backgroundColor = "#1b1b1b";
        }
      });
    },
    {
      threshold: 0.5,
    }
  ).observe(contributors);

  const faq = document.querySelector(".faq");

  new IntersectionObserver(
    (entries) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          body.style.backgroundColor = "rgba(240, 240, 240, 1)";
        }
      });
    },
    {
      threshold: 0.5,
    }
  ).observe(faq);

  const blog = document.querySelector(".blog");

  new IntersectionObserver(
    (entries) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          body.style.backgroundColor = "#fff";

          setTimeout(() => {
            blog.style.background = `#fff`;
          }, 600);
        } else {
        }
      });
    },
    {
      threshold: 0.5,
    }
  ).observe(blog);
}

waitForPageLoaded().then(() => {
  videoPlayer();
  if (window.innerWidth <= 800) {
    menu();
  }
  news();
  resources();
  about();
  blog();
  contribution();
  faq();
  team();
  usescases();
  sectionTransitions();
});
