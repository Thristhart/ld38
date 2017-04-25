
const blockButton = document.querySelector('#shieldButton')

function block() {
  gameState.isBlocking = 2000 * gameState.shieldDurationUpgrades; //milliseconds
  blocksRemaining = 1 + gameState.shieldDurabilityUpgrades;
  blockButton.classList.add("activated"); // Make the button look "turned on"
  blockButton.disabled = true;
}

function stopBlocking() {
  gameState.isBlocking = 0;
}

gameloop.onTick(dt => {
  if(gameState.isBlocking <= 0 && achievementController.completed.size > 1) {
    blockButton.classList.remove("activated");
    blockButton.disabled = false;
    gameState.isBlocking = 0;
  }
  else {
    gameState.isBlocking -= dt;
  }
});
let blocksRemaining = 1;
function checkBlock() {
  if(gameState.isBlocking > 0)
  {
    blocksRemaining--;
    if(blocksRemaining <= 0) {
      stopBlocking();
    }
    particleController.addParticleOnElement("🛡️", blockButton)    
    audioController.play("block");
    gameState.consecutiveBlocks += 1;
    achievementController.fireEvent("block");
    return true;
  }
  else
  {
    let decrease = halveCurrency();
    gameState.enemyCurrency += decrease;
    enemyCurrencyDisplay.innerHTML = gameState.enemyCurrency;
    particleController.addParticleOnElement(`+${decrease}`, enemyCurrencyDisplay, "gain enemy");
    gameState.consecutiveBlocks = 0;
    achievementController.fireEvent("missBlock");
    
    shakeScreen();
    return false;
  }
}

blockButton.addEventListener("click", function() {
  if(gameState.isBlocking <= 0)
  {
    block();
  }
})