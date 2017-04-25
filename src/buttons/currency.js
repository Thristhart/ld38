
const currencyDisplay = document.querySelector("#currency");

function increaseCurrency(change) {
  gameState.currency += change;
  currencyDisplay.innerHTML = gameState.currency;
  achievementController.fireEvent("currencyChange", change);
  if(change > 0) {
    particleController.addParticleOnElement(`+${change}`, currencyDisplay, 'gain');
  }
  else {
    particleController.addParticleOnElement(`${change}`, currencyDisplay, 'loss');
  }
}

function decreaseCurrency(change) {
  return increaseCurrency(-change);
}

function halveCurrency() {
  let currency = Math.floor(gameState.currency / 2);
  decreaseCurrency(currency);
  return currency;
}

let timeSinceLastCurrency = 0;
let currencyCooldown = 250;
centerButton.addEventListener("click", function() {
  if(timeSinceLastCurrency > currencyCooldown) {
    increaseCurrency(1);
    timeSinceLastCurrency = 0;
  }
});

gameloop.onTick(dt => {
  if(timeSinceLastCurrency < currencyCooldown) {
    centerButton.setAttribute("disabled", true);
  }
  else {
    centerButton.removeAttribute("disabled");
  }
  timeSinceLastCurrency += dt;
})