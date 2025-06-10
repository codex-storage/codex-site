let index = 0;
let currentContributor = document.getElementById("contributor-0");
let isMouseHover = false;
let footer = document.querySelector(".team footer");

footer.addEventListener("mouseover", () => {
  isMouseHover = true;
});

footer.addEventListener("mouseout", () => {
  console.info("Mouse out of footer");
  // Reset the index to 0 when mouse leaves the footer
  isMouseHover = false;
});

currentContributor.classList.add("default");

function changeCoreContributor() {
  if (isMouseHover) {
    return false;
  }

  currentContributor.classList.remove("default");

  let nextContributor = document.getElementById("contributor-" + (index + 1));
  if (!nextContributor) {
    nextContributor = document.getElementById("contributor-0");
    index = 0;
  }

  nextContributor.classList.add("default");

  const nextContributorSrc = nextContributor
    .querySelector("img")
    .getAttribute("src");

  // Get the parent container
  const parentContainer = nextContributor.parentElement;

  // Calculate the horizontal scroll position
  const offsetLeft = nextContributor.offsetLeft;
  const containerWidth = parentContainer.offsetWidth;
  const contributorWidth = nextContributor.offsetWidth;

  parentContainer.scrollTo({
    left: offsetLeft - containerWidth / 2 + contributorWidth / 2,
    behavior: "smooth", // Enable smooth scrolling
  });

  const mainContributorImage = document.getElementById(
    "main-contributor-image"
  );
  mainContributorImage.setAttribute("src", nextContributorSrc);

  index++;
  currentContributor = nextContributor;
}

setInterval(changeCoreContributor, 5000);
