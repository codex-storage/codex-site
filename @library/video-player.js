const players = document.querySelectorAll(".video-player");
console.info(players);

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
      console.info("Closing dialog");
      dialog.close();
      video.pause();
    }
  });

  dialog.addEventListener("cancel", () => {
    dialog.close();
    video.pause();
  });
});
