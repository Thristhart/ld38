const audioController = {
  sounds: {},
  play: function(soundName) {
    audioController.stop(soundName);
    audioController.sounds[soundName].play();
  },
  stop: function(soundName) {
    audioController.sounds[soundName].pause();
    audioController.sounds[soundName].currentTime = 0;
  },
  load: function(path) {
    const audio = document.createElement("audio");
    audio.src = path;
    audio.volume = 0.1;
    return audio;
  },
};

audioController.sounds["cheevo"] = audioController.load("./static/cheevo.mp3");
audioController.sounds["block"] = audioController.load("./static/block.mp3");
audioController.sounds["hit"] = audioController.load("./static/sword hit.mp3");

const barkTimes = [23.98,24.28,24.58,25.18,25.48,25.78,26.38,26.83,27.28,27.88,28.48,47.97,48.27,48.57,49.17,49.47,49.77,50.37,50.82,50.97,51.27,51.57,52.02,52.17,52.47,67.16,67.46,67.76,68.36,68.66,68.96,69.56,70.01,70.16,70.46,70.76,71.21,71.36,71.66,71.96,72.41,72.86,74.36,74.81,75.26];

const doggo = document.querySelector("#doggo");
const jukebox = document.querySelector("#jukebox");

let barking = false;
function bark() {
  if(barking) {
    return;
  }
  barking = true;
  doggo.classList.add("bark");
  setTimeout(() => {
    barking = false;
    doggo.classList.remove("bark");
  }, 200);
}

gameloop.onTick(() => {
  if(achievementController.completed.size < 6) {
    return;
  }
  barkTimes.forEach(barkTime => {
    if(Math.abs(jukebox.currentTime - barkTime) < 0.02) {
      bark();
    }
  });
});