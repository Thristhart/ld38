const researchSlider = document.querySelector("#researchControl");
const researchPointContainer = document.querySelector("#researchPointContainer");
const researchPointsLabel = document.querySelector("#researchPoints");

let researchTarget = 50;

function setResearchTarget() {
  researchTarget = 25 + Math.round(Math.random() * 75);
  calculateShadow();
}

function setResearchShadow(x, y, spread, opacity) {
  document.body.style.setProperty('--research-shadow', `${x}px ${y}px ${spread}px rgba(0, 0, 0, ${opacity})`);
}
function setResearchColor(r, g, b, a) {
  document.body.style.setProperty('--research-track-color', `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`);
}
function lerp(a, b, u) {
    return (1 - u) * a + u * b;
};

function calculateShadow() {
  let diff = researchTarget - researchSlider.value;
  
  if(Math.abs(diff) > 25 || sliding) {
    setResearchShadow(0, 0, 1, 0.3);
    setResearchColor(221, 221, 221, 1);
    return;
  }
  
  let closeness = 1 - Math.abs(diff / 25);
  let spread = closeness * 10;
  
  let x = 5;
  if(diff < 0) {
    x = -5;
  }
  x *= closeness;
  setResearchShadow(0, 0, spread, closeness);
  setResearchColor(lerp(221, 100, closeness), lerp(221, 149, closeness), lerp(221, 237, closeness), 1);
}

researchSlider.addEventListener("input", event => {
  calculateShadow();
});

let researchSliderCooldown = 2000;
let sliding = false;
let slideTarget = 0;
let slideStart = 0;
function animateSlider(target, start) {
  slideAnimationProgress = 0;
  sliding = true;
  slideTarget = target;
  slideStart = start;
  researchSlider.disabled = true;
  setResearchShadow(0, 0, 1, 0.3);
  setResearchColor(221, 221, 221, 1);
}

let slideAnimationProgress = 0;
gameloop.onTick(dt => {
  if(sliding) {
    researchSlider.value = lerp(slideStart, slideTarget, slideAnimationProgress / researchSliderCooldown)
    slideAnimationProgress += dt;
    if(slideAnimationProgress >= researchSliderCooldown) {
      sliding = false;
      researchSlider.disabled = false;
    }
  }
});

researchSlider.addEventListener("change", event => {
  let diff = Math.abs(researchTarget - researchSlider.value);
  if(diff === 0) {
    particleController.addParticleOnElement("RADICAL!", researchSlider, "gain");
    addResearch(5);
  }
  else if(diff <= 2) {
    particleController.addParticleOnElement("NICE!", researchSlider, "gain");
    addResearch(3);
  }
  else if(diff <= 5) {
    particleController.addParticleOnElement("OKAY!", researchSlider, "gain");
    addResearch(1);
  }
  else {
    particleController.addParticleOnElement("MISS!", researchSlider, "loss");
  }
  animateSlider(0, researchSlider.value);
  setResearchTarget();
})

function addResearch(points) {
  gameState.researchPoints += points;
  achievementController.fireEvent("researchChange", points);
  if(points > 0) {
    particleController.addParticleOnElement(`+${points}`, researchPointContainer, 'gain');
  }
  else {
    particleController.addParticleOnElement(`${points}`, researchPointContainer, 'loss');
  }
  let percentage = gameState.researchPoints;
  researchPointContainer.style.backgroundImage = `linear-gradient(to top, green 0%, #d8ffd8 ${percentage}%, white ${percentage}%`;
  researchPointsLabel.innerHTML = gameState.researchPoints;
}


setResearchTarget();