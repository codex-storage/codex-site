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
