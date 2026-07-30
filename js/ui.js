/**
* Opens the instructions dialog.
*/
function openDialog() {
  document.getElementById("instructionDialog").showModal();
}

/**
* Closes the instructions dialog.
*/
function closeDialog() {
  document.getElementById("instructionDialog").close();
}

/**
* Opens the impressum dialog.
*/
function openImpressum() {
  document.getElementById("impressumDialog").showModal();
}

/**
* Closes the impressum dialog.
*/
function closeDialogImpressum() {
  document.getElementById("impressumDialog").close();
}

/**
* Restarts the game: resets variables, stops all intervals and audio, re-initializes world.
*/
function restartGame() {
  const restartBtn = document.getElementById("restartBtn");
  hideLosingScreen();
  hideWinningScreen();
  IntervalHub.stopAllIntervals();  
  AudioHub.stopAll();
  keyboard = new Keyboard();
  clearCanvas();
  world = null;
  init();
  handleResponsiveMenu();
  if (!AudioHub.isMuted) {
    AudioHub.backgroundMusic.loop = true;
    AudioHub.backgroundMusic.play();
  }
  restartBtn.blur();
}

/**
* Toggles the mute state of the game.
*/
function toggleMute() {
  isMuted = !isMuted;
  const muteBtn = document.getElementById("muteBtn");
  if (isMuted) {
    AudioHub.mute();
    muteBtn.textContent = "🔇";
  } else {
    AudioHub.unmute();
    muteBtn.textContent = "🔊";
  }
  saveBoolean("isMuted", isMuted);
  muteBtn.blur();
}

/**
* Initializes the mute button based on saved settings.
*/
function initializeMuteButton() {
  const muteBtn = document.getElementById("muteBtn");
  const savedMute = getBoolean("isMuted");
  isMuted = savedMute !== null ? savedMute : false;
  if (isMuted) {
    AudioHub.mute();
    muteBtn.textContent = "🔇";
  } else {
    AudioHub.unmute();
    muteBtn.textContent = "🔊";
  }
}

/**
* Navigates to the home page.
*/
function goHome() {
  window.location.href = "index.html";
}

/**
* Toggles the visibility of mobile controls.
*/
function toggleMobileControls() {
  const contrlBtn = document.getElementById("toggleControlsBtn");
  const controls = document.querySelector(".mobile-controls");
  controls.classList.toggle("d-none");
  buttonsActive = !controls.classList.contains("d-none");
  if (!isMobileDevice()) saveBoolean("showControls", buttonsActive);
  contrlBtn.blur();
}