const viewport = document.querySelector("#viewport");
const display = document.querySelector("#display");

const centerButton = document.querySelector("#centerButton");
const reference_box = centerButton.getBoundingClientRect();

const gameState = {
  scale: 1,
  currency: 0,
  isBlocking: 0,
  consecutiveBlocks: 0,
  enemyCurrency: 10,
  
  researchPoints: 0,
  
  swordCooldownUpgradeCost: 25,
  shieldDurationUpgradeCost: 25,
  swordCooldownUpgrades: 1,
  shieldDurationUpgrades: 1,
  
  swordPoisonUpgradeCost: 10,
  shieldDurabilityUpgradeCost: 10,
  swordPoisonUpgrades: 0,
  shieldDurabilityUpgrades: 0,
};

function getFillScale() {
  let viewBox = viewport.getBoundingClientRect();
  
  let scale = viewBox.width / reference_box.width;
  return scale;
}

const scaleArray = [
  0.66,
  0.47,
  0.33,
  0.22,
  0.16,
  0.12,
  0.08,
];
function getTargetScale() {
  let cheevoCount = achievementController.completed.size;
  
  let percentage = scaleArray[cheevoCount];
  
  return getFillScale() * percentage;
}

function setDisplayScale() {
  gameState.scale = getTargetScale();
  display.style.transform = `scale(${gameState.scale})`;
  overlay.style.fontSize = `${4 * gameState.scale}px`;
  let listener = (event) => {
    if(event.target !== display) {
      return;
    }
    // TODO: iterate through buttons and check visibility here, then setAttribute disabled if off screen
    let buttons = Array.from(document.querySelectorAll("button"));
    buttons.forEach(button => {
      if(!button.classList.contains("enemy")) {
        let rect = button.getBoundingClientRect();
        let viewBox = viewport.getBoundingClientRect();
        
        let centerX = rect.left + rect.width / 2;
        let centerY = rect.top + rect.height / 2;
        
        if(centerX > viewBox.left && centerX < viewBox.right && centerY > viewBox.top && centerY < viewBox.bottom) {
          button.removeAttribute("disabled");
        }
        else {
          button.setAttribute("disabled", "disabled");
        }
      }
    });
    
    display.removeEventListener("transitionend", listener);
  };
  display.addEventListener("transitionend", listener);
}

function onResize() {
  setDisplayScale();
}

function shakeScreen() {
  viewport.classList.add("shake");
  let listener = () => {
    viewport.classList.remove("shake");
    viewport.removeEventListener("animationend", listener);
  };
  viewport.addEventListener("animationend", listener);
}

window.addEventListener("resize", onResize);

setDisplayScale();
window.addEventListener("load", () => {
  display.classList.add("loaded");
})