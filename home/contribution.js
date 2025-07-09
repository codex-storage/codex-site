// const el = document.querySelector(".parallax-background");

// window.addEventListener("mousemove", (e) => {
//   const rect = el.getBoundingClientRect();
//   const x = e.clientX - rect.left;
//   const y = e.clientY - rect.top;

//   const centerX = rect.width / 2;
//   const centerY = rect.height / 2;

//   // Tilt range (adjust intensity here)
//   const maxTilt = 15;

//   const rotateX = ((centerY - y) / centerY) * maxTilt; // vertical tilt
//   const rotateY = ((x - centerX) / centerX) * maxTilt; // horizontal tilt

//   el.style.transform = `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1, 1, 1)`;
// });

// window.addEventListener("mouseleave", () => {
//   el.style.transform =
//     "perspective(500px) rotateX(2deg) rotateY(-10deg) scale3d(1, 1, 1)";
// });
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
