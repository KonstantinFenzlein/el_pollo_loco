let canvas;
let ctx;
let world;
let keyboard = new Keyboard();
let startImage = new Image();
let isMuted = false;
let isFullscreen = false;
const lvl1 = level1;
let isReadyToStart = false;


/**
* Creates Level 1 with all enemies, objects, backgrounds, coins, and bottles.
* @returns {Level} The created level object.
*/
function createLevel1() {
  return new Level(
  [
  new Chicken(),
  new Chicken(),
  new Chicken(),
  new Chicken(),
  new Chicken(),
  new Chicken(),
  new Chicks(),
  new Chicks(),
  new Chicks(),
  new Chicks(),
  new Chicks(),
  new Chicks(),
  new Chicks(),
  new Chicks(),
  ],
  [new Endboss()],
  [
  new Cloud(),
  new Cloud(),
  new Cloud(),
  new Cloud(),
  new Cloud(),
  new Cloud(),
  ],
  [
  new BackgroundObject("img_pollo_locco/img/5_background/layers/air.png", -719),
  new BackgroundObject("img_pollo_locco/img/5_background/layers/3_third_layer/2.png", -719),
  new BackgroundObject("img_pollo_locco/img/5_background/layers/2_second_layer/2.png", -719),
  new BackgroundObject("img_pollo_locco/img/5_background/layers/1_first_layer/2.png", -719),
  new BackgroundObject("img_pollo_locco/img/5_background/layers/air.png", 0),
  new BackgroundObject("img_pollo_locco/img/5_background/layers/3_third_layer/1.png", 0),
  new BackgroundObject("img_pollo_locco/img/5_background/layers/2_second_layer/1.png", 0),
  new BackgroundObject("img_pollo_locco/img/5_background/layers/1_first_layer/1.png", 0),
  new BackgroundObject("img_pollo_locco/img/5_background/layers/air.png", 719),
  new BackgroundObject("img_pollo_locco/img/5_background/layers/3_third_layer/2.png", 719),
  new BackgroundObject("img_pollo_locco/img/5_background/layers/2_second_layer/2.png", 719),
  new BackgroundObject("img_pollo_locco/img/5_background/layers/1_first_layer/2.png", 719),
  new BackgroundObject("img_pollo_locco/img/5_background/layers/air.png", 719 * 2),
  new BackgroundObject("img_pollo_locco/img/5_background/layers/3_third_layer/1.png", 719 * 2),
  new BackgroundObject("img_pollo_locco/img/5_background/layers/2_second_layer/1.png", 719 * 2),
  new BackgroundObject("img_pollo_locco/img/5_background/layers/1_first_layer/1.png", 719 * 2),
  new BackgroundObject("img_pollo_locco/img/5_background/layers/air.png", 719 * 3),
  new BackgroundObject("img_pollo_locco/img/5_background/layers/3_third_layer/2.png", 719 * 3),
  new BackgroundObject("img_pollo_locco/img/5_background/layers/2_second_layer/2.png", 719 * 3),
  new BackgroundObject("img_pollo_locco/img/5_background/layers/1_first_layer/2.png", 719 * 3),
  ],
  [
  new Coins(), new Coins(), new Coins(), new Coins(), new Coins(),
  new Coins(), new Coins(), new Coins(), new Coins(), new Coins(),
  ],
  [
  new Bottles(), new Bottles(), new Bottles(), new Bottles(), new Bottles(),
  new Bottles(), new Bottles(), new Bottles(), new Bottles(), new Bottles(),
  ]
  );
}
/**
* Initializes the canvas and draws the start image.
*/
window.onload = function () {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");
  startImage.onload = function () {ctx.drawImage(startImage, 0, 0, canvas.width, canvas.height);};
  checkAssetsAndEnableButton();
};

/**
* Periodically checks if Hubs and Level data are available.
*/
function checkAssetsAndEnableButton() {
  const checkInterval = setInterval(() => {
  if (typeof ImageHub !== 'undefined' && typeof AudioHub !== 'undefined' && typeof level1 !== 'undefined') {
    const btn = document.getElementById("startBtn");
    if (btn) {
    btn.disabled = false;
    btn.style.opacity = "1";
    btn.style.cursor = "pointer";
    btn.innerText = "play";
    isReadyToStart = true;
    clearInterval(checkInterval); 
    }
  }
  }, 200); 
}
  
document.addEventListener("fullscreenchange", handleFullscreenChange);
document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

/**
* Handles the transition to and from fullscreen mode.
*/
function handleFullscreenChange() {
  const btn = document.getElementById("fullScreenBtn");
  if (document.fullscreenElement) {
    isFullscreen = true;
    btn.textContent = "❌";
  } else {
    isFullscreen = false;
    btn.textContent = "📺";
  }
}

/**
* Initializes the game by creating the level and world.
*/
function init() {
  const level = createLevel1();
  world = new World(canvas, keyboard, level);
}

/**
* Hides the start button.
*/
function hideStartButton() {
   document.getElementById("startBtn")?.classList.add("d-none");
}

/**
* Shows all game controls.
*/
function showGameControls() {
  showDesktopButtons();
  updateMobileControlsVisibility();
}

/**
* Shows desktop control buttons.
*/
function showDesktopButtons() {
  document.getElementById("muteBtn").classList.remove("d-none");
  document.getElementById("restartBtn").classList.remove("d-none");
  document.getElementById("homeBtn").classList.remove("d-none");
  document.getElementById("fullScreenBtn").classList.remove("d-none");
  document.getElementById("toggleControlsBtn").classList.remove("d-none");
}

/**
* Clears the canvas.
*/
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
* Starts the background music.
*/
function startBackgroundMusic() {
  AudioHub.backgroundMusic.loop = true;
  AudioHub.backgroundMusic.volume = 0.1;
  AudioHub.backgroundMusic.play();
}

/**
* Starts the game: hides start button, clears canvas, initializes world and music.
*/
function startGame() {
  if (!isReadyToStart) return;
  init();
  hideStartButton(); 
  clearCanvas();  
  startBackgroundMusic();
  showGameControls();
  initializeMuteButton();
  handleResponsiveMenu();
}

let buttonsActive = false;

window.addEventListener("keydown", (e) => { 
  if (e.keyCode == 39) keyboard.RIGHT = true;
  if (e.keyCode == 37) keyboard.LEFT = true;
  if (e.keyCode == 38) keyboard.UP = true;
  if (e.keyCode == 40) keyboard.DOWN = true;
  if (e.keyCode == 32) keyboard.SPACE = true;
  if (e.keyCode == 68) keyboard.D = true;
});

window.addEventListener("keyup", (e) => {
  if (e.keyCode == 39) keyboard.RIGHT = false;
  if (e.keyCode == 37) keyboard.LEFT = false;
  if (e.keyCode == 38) keyboard.UP = false;
  if (e.keyCode == 40) keyboard.DOWN = false;
  if (e.keyCode == 32) keyboard.SPACE = false;
  if (e.keyCode == 68) keyboard.D = false;
});

/**
* Adds start and end event listeners to a button.
*/
function addButtonListeners(btn, startHandler, endHandler) {
  ["touchstart", "mousedown"].forEach((evt) =>btn.addEventListener(evt, startHandler));
  ["touchend", "mouseup", "touchcancel", "mouseleave"].forEach((evt) =>btn.addEventListener(evt, endHandler));
}

/**
* Shows the losing screen and stops all intervals after a delay.
*/
function showLosingScreen() {
  document.getElementById("loosingScreen").classList.remove("d-none");  
  IntervalHub.stopAllIntervals();
}

/**
* Hides the losing screen.
*/
function hideLosingScreen() {
  document.getElementById("loosingScreen").classList.add("d-none");
}

/**
* Shows the winning screen and stops all intervals after a delay.
*/
function showWinningScreen() {
  document.getElementById("winningScreen").classList.remove("d-none");
  IntervalHub.stopAllIntervals();
}

/**
* Hides the winning screen and stops all intervals.
*/
function hideWinningScreen() {
  document.getElementById("winningScreen").classList.add("d-none");
  IntervalHub.stopAllIntervals();
}

/**
* Toggles fullscreen mode for the game canvas.
*/
function goFullscreen() {
  const fullScreenBtn = document.getElementById("fullScreenBtn");
  const container = document.querySelector(".canvas-container");
  const gameState = document.getElementById("loosingScreen");
  const winningState = document.getElementById("winningScreen");
  if (!document.fullscreenElement) {
    container.requestFullscreen();
    gameState.classList.add("loosing-screen-fullscreen");
    winningState.classList.add("winning-screen-fullscreen");
  } else {
    document.exitFullscreen();
    gameState.classList.remove("loosing-screen-fullscreen");
    winningState.classList.remove("winning-screen-fullscreen");
  }
  fullScreenBtn.blur();
}

/**
* Checks the window width and toggles the canvas menu buttons.
*/
function handleResponsiveMenu() {
  const canvasMenu = document.getElementById("canvasMenuReplika");
  if (!canvasMenu) return;
  if (window.innerWidth > 1000 || world) { 
    canvasMenu.classList.add("d-none");
  } else {
    canvasMenu.classList.remove("d-none");
  }
}

window.addEventListener("resize", handleResponsiveMenu);
window.addEventListener("load", handleResponsiveMenu);