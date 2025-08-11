import {
  waitScript,
  waitStyle,
  waitForPageLoaded,
  loadGoogleFont,
  TypeShuffle,
} from "./helpers.js";

loadGoogleFont(
  "https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,100..900&display=swap"
);
loadGoogleFont(
  "https://fonts.googleapis.com/css2?family=Azeret+Mono:ital,wght@0,100..900;1,100..900&family=Inter:opsz,wght@14..32,100..900&display=swap"
);

/////////////////////////////////////////////////////////////////////////////////////////////////////////
async function addRandomText() {
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

  // document.querySelectorAll("section header > p").forEach((p) => {
  //   const ts = new TypeShuffle(p);
  //   const observer = createObserver(ts);
  //   observer.observe(p);
  // });

  // document.querySelectorAll("section header > span").forEach((p) => {
  //   const ts = new TypeShuffle(p);
  //   const observer = createObserver(ts);
  //   observer.observe(p);
  // });

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
async function footer() {



}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
async function addSmoothScroll() {
  document.querySelector("body > main").setAttribute("id", "smooth-wrapper");
  document
    .querySelector("body > main > article")
    .setAttribute("id", "smooth-content");
  await waitStyle("https://unpkg.com/lenis@1.3.4/dist/lenis.css");
  await waitScript("https://unpkg.com/lenis@1.3.4/dist/lenis.min.js");
  const lenis = new Lenis({
    smooth: true,
    anchors: true,
    autoRaf: true,
    content: document.querySelector("#smooth-content"),
  });
  if (!window.gsap) {
    await waitScript(
      "https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"
    );
  }

  await waitScript(
    "https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js"
  );

  await waitScript(
    "https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollSmoother.min.js"
  );
  // Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
  // lenis.on("scroll", ScrollTrigger.update);

  // // Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
  // // This ensures Lenis's smooth scroll animation updates on each GSAP tick
  // gsap.ticker.add((time) => {
  //   lenis.raf(time * 1000); // Convert time from seconds to milliseconds
  // });

  // // Disable lag smoothing in GSAP to prevent any delay in scroll animations
  // gsap.ticker.lagSmoothing(0);
  // gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

  // let smoother = ScrollSmoother.create({
  //   smooth: 1,
  //   smoothTouch: 0.3,
  //   effects: true,
  //   // smoothTouch: 0.1,
  //   // normalizeScroll: true,
  // });
  // gsap.to(".footer", {
  //   yPercent: -10,
  //   ease: "none",
  //   scrollTrigger: {
  //     trigger: "#footer",
  //     start: "top bottom", // when footer enters view
  //     end: "+=15%", // until fully visible
  //   },
  // });

  if (document.querySelector(".blog")) {
    gsap.set(".footer", { yPercent: -50 });
    const uncover = gsap.timeline({ paused: true });
    uncover.to(".footer", { yPercent: 0, ease: "none" });
    ScrollTrigger.create({
      trigger: ".blog",
      start: "bottom bottom",
      end: "+=45%",
      animation: uncover,
      scrub: true,
    });
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function newsletter() {
  const form = document.querySelector("footer form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const emailInput = form.querySelector("input[type='email']");
      const email = emailInput.value.trim();
      emailInput.classList.remove("error");

      if (!email) {
        emailInput.classList.add("error");
        return;
      }

      try {
        const res = await fetch(
          "https://blog.codex.storage/ghost/api/content/members/signup/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          }
        );
        if (!res.ok) {
          emailInput.classList.add("error");
        } else {
          emailInput.value = "";
        }
        // Optionally show success feedback here
      } catch (err) {
        emailInput.classList.add("error");
      }
    });
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
waitForPageLoaded().then(() => {
  addRandomText();
  stickyMenu();
  footer();
  addSmoothScroll();
  newsletter();
});
