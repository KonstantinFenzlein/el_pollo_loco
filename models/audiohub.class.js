/**
* class Audiohub
*/

class AudioHub {
  static isMuted = false;
  static backgroundMusic = new Audio("./sounds/backgroundmusic/acoustic-mexican-guitar-218610.mp3");

  static characterDamage = new Audio("./sounds/character/characterDamage.mp3");
  static characterDead = new Audio("./sounds/character/characterDead.wav");
  static characterJump = new Audio("./sounds/character/characterJump.wav");
  static characterRun = new Audio("./sounds/character/characterRun.mp3");
  static characterSnoring = new Audio("./sounds/character/characterSnoring.mp3");

  static chickenDead = new Audio("./sounds/chicken/chickenDead.mp3");
  static chickenDead2 = new Audio("./sounds/chicken/chickenDead2.mp3");

  static bottleCollectSound = new Audio("./sounds/collectibles/bottleCollectSound.wav");
  static coinCollectSound = new Audio("./sounds/collectibles/collectSound.wav");

  static bottleBreak = new Audio("./sounds/throwable/bottleBreak.mp3");

  static endbossSound = new Audio("./sounds/endboss/endbossApproach.wav");
  static endbossIdle = new Audio("./sounds/endboss/chickenIdle.mp3");
  static endbossDeath = new Audio("./sounds/endboss/endbossDeath.mp3");

  static gameStart = new Audio("./sounds/game/gameStart.mp3");

  static allSounds = [
    AudioHub.characterDamage,
    AudioHub.characterDead,
    AudioHub.characterJump,
    AudioHub.characterRun,
    AudioHub.characterSnoring,
    AudioHub.chickenDead,
    AudioHub.chickenDead2,
    AudioHub.bottleCollectSound,
    AudioHub.coinCollectSound,
    AudioHub.bottleBreak,
    AudioHub.endbossSound,
    AudioHub.endbossDeath,
    AudioHub.endbossIdle,
    AudioHub.gameStart,
    AudioHub.backgroundMusic,
  ];

  /**
  * Plays a single audio sound if the system is not muted.
  * Resets the sound to the beginning and sets volume to 0.2.
  * @param {HTMLAudioElement} sound - The audio element to play.
  */
  static playOne(sound) {
    if (!AudioHub.isMuted) {
    if(sound.readyState == 4){
      sound.volume = 0.2;
      sound.currentTime = 0;
      sound.play().catch(() => {});;
    }    
    }
  }

  /**
  * Stops and resets all audio sounds.
  */
  static stopAll() {
    AudioHub.allSounds.forEach((sound) => {
    if (!sound.paused) {
      sound.pause();
    }
    sound.currentTime = 0;
    });
  }

  /**
  * Stops a single audio sound.
  * @param {HTMLAudioElement} sound - The audio element to stop.
  */
  static stopOne(sound) {
    if (!sound.paused) {
    sound.pause();
    }
  }

  /**
  * Mutes all sounds and sets the volume of every audio element to 0.
  */
  static mute() {
    AudioHub.isMuted = true;
    AudioHub.allSounds.forEach((sound) => {
      sound.volume = 0.0;
    });
  }

  /**
  * Unmutes all sounds and sets the volume of every audio element to 0.2.
  */
  static unmute() {
    AudioHub.isMuted = false;
    AudioHub.allSounds.forEach((sound) => {
      sound.volume = 0.2;
    });
    if (AudioHub.backgroundMusic.paused) {
      AudioHub.backgroundMusic.loop = true;
      AudioHub.backgroundMusic.play().catch(() => {});
    }
  }
}