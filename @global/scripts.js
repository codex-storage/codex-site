import _ from "https://cdn.jsdelivr.net/npm/underscore@1.13.7/+esm";

(function (w, d) {
  const options = ["ⓒ", "🅾", "Ɗ", "ė", "✖"],
    hovers = ["hover", "hover2"],
    map = {};

  const setup = () => {
    console.info("setup");
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
    d.addEventListener("touchstart", _.debounce(touchHandler, 250), false);
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
    let wh = d.clientHeight + 9,
      ww = window.innerWidth + 10,
      /*These arrays are to workaround CodePen's infinite loop "feature", large for-loops seem to trigger the error even if the loop isn't actually infinite :/ - Creating arrays padded with zeroes and using forEach seems to work (for now!!).*/
      cols = new Array((ww / 15) | 0).join("0").split(""),
      rows = new Array((wh / 15) | 0).join("0").split(""),
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

{
  let footer = document.querySelector(".team footer");
  if (footer) {
    console.info("Registering team footer event");
    let isDown = false;
    let startX;
    let scrollLeft;

    footer.addEventListener("mousedown", (e) => {
      isDown = true;
      startX = e.pageX - footer.offsetLeft;
      scrollLeft = footer.scrollLeft;
    });
    footer.addEventListener("mouseleave", () => {
      isDown = false;
    });
    footer.addEventListener("mouseup", () => {
      isDown = false;
    });
    footer.addEventListener("mousemove", (e) => {
      if (!isDown) {
        return;
      }
      e.preventDefault();
      const x = e.pageX - footer.offsetLeft;
      const walk = x - startX; //scroll-fast
      footer.scrollLeft = scrollLeft - walk;
    });
  }
}
