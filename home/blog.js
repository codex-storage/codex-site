Splitting();

console.info("Splitting text into lines and words");

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
        lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)],
      repeat: 3,
      repeatRefresh: true,
      opacity: 1,
      repeatDelay: 0.05,
      onComplete: () => {
        gsap.set(char, { innerHTML: char.dataset.initial, delay: 0.03 });
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

document.addEventListener("DOMContentLoaded", (e) => {
  if (window.matchMedia("(pointer: coarse)").matches == false) {
    articles.forEach((article) => {
      console.info(article);
      const date = article.querySelectorAll(`small[data-splitting] .char`);
      let title = article.querySelectorAll(`h5[data-splitting] .char`);
      if (title.length === 0) {
        title = article.querySelectorAll(`h4[data-splitting] .char`);
      }
      const text = article.querySelectorAll(`p[data-splitting] .char`);

      date.forEach((char) => (char.dataset.initial = char.innerHTML));
      title.forEach((char) => (char.dataset.initial = char.innerHTML));
      text.forEach((char) => (char.dataset.initial = char.innerHTML));
    });

    articles.forEach((article) => {
      article.addEventListener("mouseenter", (e) => {
        const date = article.querySelectorAll(`small[data-splitting] .char`);
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

    articles.forEach((article) => {
      article.addEventListener("mouseleave", (e) => {
        const date = article.querySelectorAll(`small[data-splitting] .char`);
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
