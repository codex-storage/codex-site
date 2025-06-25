// import _ from "https://cdn.jsdelivr.net/npm/underscore@1.13.7/+esm";

// (function (w, d) {
//   const options = ["ⓒ", "🅾", "Ɗ", "ė", "✖"],
//     hovers = ["hover", "hover2"],
//     map = {};

//   const setup = () => {
//     w.onresize = _.debounce(() => redraw(), 250);

//     d.onmousemove = (mev) => {
//       addAnim(mev.target, mev.buttons);
//     };
//     const getEl = (x, y) => {
//       if (map[x + "_" + y]) return map[x + "_" + y];
//       let e = d.elementFromPoint(x, y);
//       if (e) map[x + "_" + y] = e;
//       return e;
//     };
//     const touchHandler = (tev) => {
//       tev.preventDefault();
//       for (let i = 0; i < tev.changedTouches.length; i++) {
//         let el = getEl(
//           tev.changedTouches[i].pageX,
//           tev.changedTouches[i].pageY
//         );
//         if (el) addAnim(el);
//       }
//     };
//     d.addEventListener("touchstart", _.debounce(touchHandler, 250), false);
//     d.addEventListener("touchmove", touchHandler, false);
//     redraw();
//   };

//   const addAnim = (target, buttonPressed) => {
//     if (target.nodeName != "SPAN") return;
//     target.className = _.sample(hovers);
//     if (buttonPressed)
//       target.style.color = "#000000".replace(/0/g, function () {
//         return (~~(Math.random() * 16)).toString(16);
//       });
//     target.innerHTML = _.sample(options);
//     _.delay(() => {
//       if (target.className.indexOf("hover") != -1) {
//         target.className = "";
//       }
//     }, 750);
//   };

//   const redraw = () => {
//     let wh = d.clientHeight,
//       ww = window.outerWidth,
//       /*These arrays are to workaround CodePen's infinite loop "feature", large for-loops seem to trigger the error even if the loop isn't actually infinite :/ - Creating arrays padded with zeroes and using forEach seems to work (for now!!).*/
//       cols = new Array((ww / 15) | 0).join("0").split(""),
//       rows = new Array((wh / 15) | 0).join("0").split(""),
//       rh = [],
//       top = 5;
//     d.innerHTML = "";
//     rows.forEach(() => {
//       let spans = 0;
//       cols.forEach(() => spans++);
//       rh.push(spans);
//     });
//     rh.forEach((r) => {
//       if (r == rh[0]) {
//         let row = '<div class="row">',
//           left = 10;
//         new Array(r)
//           .join("0")
//           .split("")
//           .forEach(() => {
//             row += `<span style="left:${left}px; top: ${top}px">+</span>`;
//             left += 15;
//           });
//         row += "</div>";
//         d.innerHTML += row;
//         top += 15;
//       }
//     });
//   };

//   setup();
// })(window, document.getElementById("background"));

// {
//   let footer = document.querySelector(".team footer");
//   if (footer) {
//     console.info("Registering team footer event");
//     let isDown = false;
//     let startX;
//     let scrollLeft;

//     footer.addEventListener("mousedown", (e) => {
//       isDown = true;
//       startX = e.pageX - footer.offsetLeft;
//       scrollLeft = footer.scrollLeft;
//     });
//     footer.addEventListener("mouseleave", () => {
//       isDown = false;
//     });
//     footer.addEventListener("mouseup", () => {
//       isDown = false;
//     });
//     footer.addEventListener("mousemove", (e) => {
//       if (!isDown) {
//         return;
//       }
//       e.preventDefault();
//       const x = e.pageX - footer.offsetLeft;
//       const walk = x - startX; //scroll-fast
//       footer.scrollLeft = scrollLeft - walk;
//     });
//   }
// }
/**
 * requestAnimationFrame
 */
window.requestAnimationFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

/**
 * Vector
 */
function Vector(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}

Vector.add = function (a, b) {
  return new Vector(a.x + b.x, a.y + b.y);
};

Vector.sub = function (a, b) {
  return new Vector(a.x - b.x, a.y - b.y);
};

Vector.scale = function (v, s) {
  return v.clone().scale(s);
};

Vector.random = function () {
  return new Vector(Math.random() * 2 - 1, Math.random() * 2 - 1);
};

Vector.prototype = {
  set: function (x, y) {
    if (typeof x === "object") {
      y = x.y;
      x = x.x;
    }
    this.x = x || 0;
    this.y = y || 0;
    return this;
  },

  add: function (v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  },

  sub: function (v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  },

  scale: function (s) {
    this.x *= s;
    this.y *= s;
    return this;
  },

  length: function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  },

  lengthSq: function () {
    return this.x * this.x + this.y * this.y;
  },

  normalize: function () {
    var m = Math.sqrt(this.x * this.x + this.y * this.y);
    if (m) {
      this.x /= m;
      this.y /= m;
    }
    return this;
  },

  angle: function () {
    return Math.atan2(this.y, this.x);
  },

  angleTo: function (v) {
    var dx = v.x - this.x,
      dy = v.y - this.y;
    return Math.atan2(dy, dx);
  },

  distanceTo: function (v) {
    var dx = v.x - this.x,
      dy = v.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  },

  distanceToSq: function (v) {
    var dx = v.x - this.x,
      dy = v.y - this.y;
    return dx * dx + dy * dy;
  },

  lerp: function (v, t) {
    this.x += (v.x - this.x) * t;
    this.y += (v.y - this.y) * t;
    return this;
  },

  clone: function () {
    return new Vector(this.x, this.y);
  },

  toString: function () {
    return "(x:" + this.x + ", y:" + this.y + ")";
  },
};

/**
 * GravityPoint
 */
function GravityPoint(x, y, radius, targets) {
  Vector.call(this, x, y);
  this.radius = radius;
  this.currentRadius = radius * 0.5;

  this._targets = {
    particles: targets.particles || [],
    gravities: targets.gravities || [],
  };
  this._speed = new Vector();
}

GravityPoint.RADIUS_LIMIT = 65;
GravityPoint.interferenceToPoint = true;

GravityPoint.prototype = (function (o) {
  var s = new Vector(0, 0),
    p;
  for (p in o) s[p] = o[p];
  return s;
})({
  gravity: 0.05,
  isMouseOver: false,
  dragging: false,
  destroyed: false,
  _easeRadius: 0,
  _dragDistance: null,
  _collapsing: false,

  hitTest: function (p) {
    return this.distanceTo(p) < this.radius;
  },

  startDrag: function (dragStartPoint) {
    this._dragDistance = Vector.sub(dragStartPoint, this);
    this.dragging = true;
  },

  drag: function (dragToPoint) {
    this.x = dragToPoint.x - this._dragDistance.x;
    this.y = dragToPoint.y - this._dragDistance.y;
  },

  endDrag: function () {
    this._dragDistance = null;
    this.dragging = false;
  },

  addSpeed: function (d) {
    this._speed = this._speed.add(d);
  },

  collapse: function (e) {
    this.currentRadius *= 1.75;
    this._collapsing = true;
  },

  render: function (ctx) {
    if (this.destroyed) return;

    var particles = this._targets.particles,
      i,
      len;

    for (i = 0, len = particles.length; i < len; i++) {
      particles[i].addSpeed(
        Vector.sub(this, particles[i]).normalize().scale(this.gravity)
      );
    }

    this._easeRadius =
      (this._easeRadius + (this.radius - this.currentRadius) * 0.07) * 0.95;
    this.currentRadius += this._easeRadius;
    if (this.currentRadius < 0) this.currentRadius = 0;

    if (this._collapsing) {
      this.radius *= 0.75;
      if (this.currentRadius < 1) this.destroyed = true;
      this._draw(ctx);
      return;
    }

    var gravities = this._targets.gravities,
      g,
      absorp,
      area = this.radius * this.radius * Math.PI,
      garea;

    for (i = 0, len = gravities.length; i < len; i++) {
      g = gravities[i];

      if (g === this || g.destroyed) continue;

      if (
        (this.currentRadius >= g.radius || this.dragging) &&
        this.distanceTo(g) < (this.currentRadius + g.radius) * 0.85
      ) {
        g.destroyed = true;
        this.gravity += g.gravity;

        absorp = Vector.sub(g, this).scale((g.radius / this.radius) * 0.5);
        this.addSpeed(absorp);

        garea = g.radius * g.radius * Math.PI;
        this.currentRadius = Math.sqrt((area + garea * 3) / Math.PI);
        this.radius = Math.sqrt((area + garea) / Math.PI);
      }

      g.addSpeed(Vector.sub(this, g).normalize().scale(this.gravity));
    }

    if (GravityPoint.interferenceToPoint && !this.dragging)
      this.add(this._speed);

    this._speed = new Vector();

    if (this.currentRadius > GravityPoint.RADIUS_LIMIT) this.collapse();

    this._draw(ctx);
  },

  _draw: function (ctx) {
    var grd, r;

    ctx.save();

    grd = ctx.createRadialGradient(
      this.x,
      this.y,
      this.radius,
      this.x,
      this.y,
      this.radius * 5
    );
    grd.addColorStop(0, "rgba(0, 0, 0, 0.1)");
    grd.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 5, 0, Math.PI * 2, false);
    ctx.fillStyle = grd;
    ctx.fill();

    r = Math.random() * this.currentRadius * 0.7 + this.currentRadius * 0.3;
    grd = ctx.createRadialGradient(
      this.x,
      this.y,
      r,
      this.x,
      this.y,
      this.currentRadius
    );
    grd.addColorStop(0, "rgba(0, 0, 0, 1)");
    grd.addColorStop(
      1,
      Math.random() < 0.2
        ? "rgba(255, 196, 0, 0.15)"
        : "rgba(103, 181, 191, 0.75)"
    );
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2, false);
    ctx.fillStyle = grd;
    ctx.fill();
    ctx.restore();
  },
});

/**
 * Particle
 */
function Particle(x, y, radius) {
  Vector.call(this, x, y);
  this.radius = radius;

  this._latest = new Vector();
  this._speed = new Vector();
}

Particle.prototype = (function (o) {
  var s = new Vector(0, 0),
    p;
  for (p in o) s[p] = o[p];
  return s;
})({
  addSpeed: function (d) {
    this._speed.add(d);
  },

  update: function () {
    if (this._speed.length() > 12) this._speed.normalize().scale(12);

    this._latest.set(this);
    this.add(this._speed);
  },

  // render: function(ctx) {
  //     if (this._speed.length() > 12) this._speed.normalize().scale(12);

  //     this._latest.set(this);
  //     this.add(this._speed);

  //     ctx.save();
  //     ctx.fillStyle = ctx.strokeStyle = '#fff';
  //     ctx.lineCap = ctx.lineJoin = 'round';
  //     ctx.lineWidth = this.radius * 2;
  //     ctx.beginPath();
  //     ctx.moveTo(this.x, this.y);
  //     ctx.lineTo(this._latest.x, this._latest.y);
  //     ctx.stroke();
  //     ctx.beginPath();
  //     ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
  //     ctx.fill();
  //     ctx.restore();
  // }
});

// Initialize

(function () {
  // Configs

  var BACKGROUND_COLOR = "#252725",
    PARTICLE_RADIUS = 1,
    G_POINT_RADIUS = 10,
    G_POINT_RADIUS_LIMITS = 65;

  // Vars

  var canvas,
    context,
    bufferCvs,
    bufferCtx,
    screenWidth,
    screenHeight,
    mouse = new Vector(),
    gravities = [],
    particles = [],
    grad,
    control;

  // Event Listeners

  function resize(e) {
    const footer = document.querySelector("body > footer");
    screenWidth = canvas.width = footer.clientWidth;
    screenHeight = canvas.height = footer.clientHeight;
    bufferCvs.width = screenWidth;
    bufferCvs.height = screenHeight;
    context = canvas.getContext("2d");
    bufferCtx = bufferCvs.getContext("2d");

    var cx = canvas.width * 0.5,
      cy = canvas.height * 0.5;

    grad = context.createRadialGradient(
      cx,
      cy,
      0,
      cx,
      cy,
      Math.sqrt(cx * cx + cy * cy)
    );
    grad.addColorStop(0, "rgba(0, 0, 0, 0)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0.35)");
  }

  function mouseMove(e) {
    mouse.set(e.clientX, e.clientY);

    var i,
      g,
      hit = false;
    for (i = gravities.length - 1; i >= 0; i--) {
      g = gravities[i];
      if ((!hit && g.hitTest(mouse)) || g.dragging) g.isMouseOver = hit = true;
      else g.isMouseOver = false;
    }

    canvas.style.cursor = hit ? "pointer" : "default";
  }

  function mouseDown(e) {
    for (var i = gravities.length - 1; i >= 0; i--) {
      if (gravities[i].isMouseOver) {
        gravities[i].startDrag(mouse);
        return;
      }
    }
    const rect = canvas.getBoundingClientRect();
    gravities.push(
      new GravityPoint(
        e.clientX - rect.left,
        e.clientY - rect.top,
        G_POINT_RADIUS,
        {
          particles: particles,
          gravities: gravities,
        }
      )
    );
  }

  function mouseUp(e) {
    for (var i = 0, len = gravities.length; i < len; i++) {
      if (gravities[i].dragging) {
        gravities[i].endDrag();
        break;
      }
    }
  }

  function doubleClick(e) {
    for (var i = gravities.length - 1; i >= 0; i--) {
      if (gravities[i].isMouseOver) {
        gravities[i].collapse();
        break;
      }
    }
  }

  // Functions

  function addParticle(num) {
    var i, p;
    for (i = 0; i < num; i++) {
      p = new Particle(
        Math.floor(Math.random() * screenWidth - PARTICLE_RADIUS * 2) +
          1 +
          PARTICLE_RADIUS,
        Math.floor(Math.random() * screenHeight - PARTICLE_RADIUS * 2) +
          1 +
          PARTICLE_RADIUS,
        PARTICLE_RADIUS
      );
      p.addSpeed(Vector.random());
      particles.push(p);
    }
  }

  function removeParticle(num) {
    if (particles.length < num) num = particles.length;
    for (var i = 0; i < num; i++) {
      particles.pop();
    }
  }

  control = {
    particleNum: 100,
  };

  // Init

  canvas = document.getElementById("c");
  bufferCvs = document.createElement("canvas");

  window.addEventListener("resize", resize, false);
  resize(null);

  addParticle(control.particleNum);

  canvas.addEventListener("mousemove", mouseMove, false);
  canvas.addEventListener("mousedown", mouseDown, false);
  canvas.addEventListener("mouseup", mouseUp, false);
  canvas.addEventListener("dblclick", doubleClick, false);

  // Start Update

  var loop = function () {
    var i, len, g, p;

    context.save();
    context.fillStyle = BACKGROUND_COLOR;
    context.fillRect(0, 0, screenWidth, screenHeight);
    context.fillStyle = grad;
    context.fillRect(0, 0, screenWidth, screenHeight);
    context.restore();

    for (i = 0, len = gravities.length; i < len; i++) {
      g = gravities[i];
      if (g.dragging) g.drag(mouse);
      g.render(context);
      if (g.destroyed) {
        gravities.splice(i, 1);
        len--;
        i--;
      }
    }

    bufferCtx.save();
    bufferCtx.globalCompositeOperation = "destination-out";
    bufferCtx.globalAlpha = 0.35;
    bufferCtx.fillRect(0, 0, screenWidth, screenHeight);
    bufferCtx.restore();

    // パーティクルをバッファに描画
    // for (i = 0, len = particles.length; i < len; i++) {
    //     particles[i].render(bufferCtx);
    // }
    len = particles.length;
    bufferCtx.save();
    bufferCtx.fillStyle = bufferCtx.strokeStyle = "#fff";
    bufferCtx.lineCap = bufferCtx.lineJoin = "round";
    bufferCtx.lineWidth = PARTICLE_RADIUS * 2;
    bufferCtx.beginPath();
    for (i = 0; i < len; i++) {
      p = particles[i];
      p.update();
      bufferCtx.moveTo(p.x, p.y);
      bufferCtx.lineTo(p._latest.x, p._latest.y);
    }
    bufferCtx.stroke();
    bufferCtx.beginPath();
    for (i = 0; i < len; i++) {
      p = particles[i];
      bufferCtx.moveTo(p.x, p.y);
      bufferCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, false);
    }
    bufferCtx.fill();
    bufferCtx.restore();

    // バッファをキャンバスに描画
    context.drawImage(bufferCvs, 0, 0);

    requestAnimationFrame(loop);
  };
  loop();
})();

///////////////////////////////////////////
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
    fx1: () => this.fx1(),
    fx2: () => this.fx2(),
    fx3: () => this.fx3(),
    fx4: () => this.fx4(),
    fx5: () => this.fx5(),
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
  /**
   * Effect 1 - clear cells and animate each line cells (delays per line and per cell)
   */
  fx1() {
    // max iterations for each cell to change the current value
    const MAX_CELL_ITERATIONS = 45;

    let finished = 0;

    // clear all cells values
    this.clearCells();

    // cell's loop animation
    // each cell will change its value MAX_CELL_ITERATIONS times
    const loop = (line, cell, iteration = 0) => {
      // cache the previous value
      cell.cache = cell.state;

      // set back the original cell value if at the last iteration
      if (iteration === MAX_CELL_ITERATIONS - 1) {
        cell.set(cell.original);
        ++finished;
        if (finished === this.totalChars) {
          this.isAnimating = false;
        }
      }
      // if the cell is the first one in its line then generate a random char
      else if (cell.position === 0) {
        // show specific characters for the first 9 iterations (looks cooler)
        cell.set(
          iteration < 9
            ? ["*", "-", "\u0027", "\u0022"][Math.floor(Math.random() * 4)]
            : this.getRandomChar()
        );
      }
      // get the cached value of the previous cell.
      // This will result in the illusion that the chars are sliding from left to right
      else {
        cell.set(line.cells[cell.previousCellPosition].cache);
      }

      // doesn't count if it's an empty space
      if (cell.cache != "&nbsp;") {
        ++iteration;
      }

      // repeat...
      if (iteration < MAX_CELL_ITERATIONS) {
        setTimeout(() => loop(line, cell, iteration), 15);
      }
    };

    // set delays for each cell animation
    for (const line of this.lines) {
      for (const cell of line.cells) {
        setTimeout(() => loop(line, cell), (line.position + 1) * 200);
      }
    }
  }
  fx2() {
    const MAX_CELL_ITERATIONS = 20;
    let finished = 0;
    const loop = (line, cell, iteration = 0) => {
      if (iteration === MAX_CELL_ITERATIONS - 1) {
        cell.set(cell.original);
        cell.DOM.el.style.opacity = 0;
        setTimeout(() => {
          cell.DOM.el.style.opacity = 1;
        }, 300);

        ++finished;
        if (finished === this.totalChars) {
          this.isAnimating = false;
        }
      } else {
        cell.set(this.getRandomChar());
      }

      ++iteration;
      if (iteration < MAX_CELL_ITERATIONS) {
        setTimeout(() => loop(line, cell, iteration), 40);
      }
    };

    for (const line of this.lines) {
      for (const cell of line.cells) {
        setTimeout(() => loop(line, cell), (cell.position + 1) * 30);
      }
    }
  }
  fx3() {
    const MAX_CELL_ITERATIONS = 10;
    let finished = 0;
    this.clearCells();

    const loop = (line, cell, iteration = 0) => {
      if (iteration === MAX_CELL_ITERATIONS - 1) {
        cell.set(cell.original);
        ++finished;
        if (finished === this.totalChars) {
          this.isAnimating = false;
        }
      } else {
        cell.set(this.getRandomChar());
      }

      ++iteration;
      if (iteration < MAX_CELL_ITERATIONS) {
        setTimeout(() => loop(line, cell, iteration), 80);
      }
    };

    for (const line of this.lines) {
      for (const cell of line.cells) {
        setTimeout(() => loop(line, cell), randomNumber(0, 2000));
      }
    }
  }
  fx4() {
    const MAX_CELL_ITERATIONS = 30;
    let finished = 0;
    this.clearCells();

    const loop = (line, cell, iteration = 0) => {
      cell.cache = cell.state;

      if (iteration === MAX_CELL_ITERATIONS - 1) {
        cell.set(cell.original);

        ++finished;
        if (finished === this.totalChars) {
          this.isAnimating = false;
        }
      } else if (cell.position === 0) {
        cell.set(["*", ":"][Math.floor(Math.random() * 2)]);
      } else {
        cell.set(line.cells[cell.previousCellPosition].cache);
      }

      if (cell.cache != "&nbsp;") {
        ++iteration;
      }

      if (iteration < MAX_CELL_ITERATIONS) {
        setTimeout(() => loop(line, cell, iteration), 15);
      }
    };

    for (const line of this.lines) {
      for (const cell of line.cells) {
        setTimeout(
          () => loop(line, cell),
          Math.abs(this.lines.length / 2 - line.position) * 400
        );
      }
    }
  }
  fx5() {
    // max iterations for each cell to change the current value
    const MAX_CELL_ITERATIONS = 30;
    let finished = 0;
    this.clearCells();

    const loop = (line, cell, iteration = 0) => {
      cell.cache = { state: cell.state, color: cell.color };

      if (iteration === MAX_CELL_ITERATIONS - 1) {
        cell.color = cell.originalColor;
        cell.DOM.el.style.color = cell.color;
        cell.set(cell.original);

        ++finished;
        if (finished === this.totalChars) {
          this.isAnimating = false;
        }
      } else if (cell.position === 0) {
        cell.color = ["#3e775d", "#61dca3", "#61b3dc"][
          Math.floor(Math.random() * 3)
        ];
        cell.DOM.el.style.color = cell.color;
        cell.set(
          iteration < 9
            ? ["*", "-", "\u0027", "\u0022"][Math.floor(Math.random() * 4)]
            : this.getRandomChar()
        );
      } else {
        cell.set(line.cells[cell.previousCellPosition].cache.state);

        cell.color = line.cells[cell.previousCellPosition].cache.color;
        cell.DOM.el.style.color = cell.color;
      }

      if (cell.cache.state != "&nbsp;") {
        ++iteration;
      }

      if (iteration < MAX_CELL_ITERATIONS) {
        setTimeout(() => loop(line, cell, iteration), 10);
      }
    };

    for (const line of this.lines) {
      for (const cell of line.cells) {
        setTimeout(() => loop(line, cell), (line.position + 1) * 200);
      }
    }
  }
  fx6() {
    // max iterations for each cell to change the current value
    const MAX_CELL_ITERATIONS = 15;
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
      } else {
        cell.set(this.getRandomChar());

        cell.color = ["#2b4539", "#61dca3", "#61b3dc"][
          Math.floor(Math.random() * 3)
        ];
        cell.DOM.el.style.color = cell.color;
      }

      ++iteration;
      if (iteration < MAX_CELL_ITERATIONS) {
        setTimeout(() => loop(line, cell, iteration), randomNumber(30, 110));
      }
    };

    for (const line of this.lines) {
      for (const cell of line.cells) {
        setTimeout(() => loop(line, cell), (line.position + 1) * 80);
      }
    }
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

const observer = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Only run once per element
        // obs.unobserve(entry.target);
        // Run the effect
        const ts = new TypeShuffle(entry.target);
        ts.trigger("fx6");
      }
    });
  },
  {
    threshold: 0.5, // Adjust as needed (0.5 = 50% visible)
  }
);

document
  .querySelectorAll("section header p")
  .forEach((p) => observer.observe(p));

document
  .querySelectorAll("section header span")
  .forEach((p) => observer.observe(p));
