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
  });
});

function createScriptElement(src, onloadCallback) {
  const script = document.createElement("script");
  script.src = src;
  script.onload = onloadCallback;
  document.head.appendChild(script);
}

if (window.innerWidth <= 1000) {
  createScriptElement(
    "https://unpkg.com/embla-carousel/embla-carousel.umd.js",
    () => {
      console.info("Embla Carousel started");

      const emblaNode = document.querySelector(".embla");
      const options = { loop: false };
      const emblaApi = EmblaCarousel(emblaNode, options);
      console.log(emblaApi);
    }
  );
}
