const attackButton = document.querySelector("#swordButton");

function startAttack() {
  if(gameState.currency < 5) {
    particleController.addParticleOnElement("5💰", attackButton, "loss");
    return;
  }
  gameState.isAttacking = true;
  timeSinceLastAttack = 1;
  
  enemyAwaitAttack();
  
  decreaseCurrency(5);
}

let attackCooldown = 5000;
let timeSinceLastAttack = 0;

let attackAnimation = false;

let poisonStacks = [];
let poisonDuration = 5000;
let poisonEffectTick = 2000;
let timeSinceLastPoisonTick = 0;

gameloop.onTick(dt => {
  for(let index = 0; index < poisonStacks.length; index++) {
    poisonStacks[index] -= dt;
    if(poisonStacks[index] <= 0) {
      poisonStacks.splice(index, 1);
      index--;
    }
  }
  timeSinceLastPoisonTick += dt;
  if(timeSinceLastPoisonTick > poisonEffectTick && poisonStacks.length > 0) {
    let decrease = poisonStacks.length;
    gameState.enemyCurrency -= decrease;
    if(gameState.enemyCurrency < 0) {
      gameState.enemyCurrency = 0;
    }
    enemyCurrencyDisplay.innerHTML = gameState.enemyCurrency;
    particleController.addParticleOnElement(`-${decrease}`, enemyCurrencyDisplay, "loss enemy");
    increaseCurrency(decrease);
    timeSinceLastPoisonTick = 0;
  }
  
  
  let cooldown = attackCooldown * (1 - Math.log(gameState.swordCooldownUpgrades) / Math.log(5));
  
  if(cooldown < 0) {
    cooldown = 0;
  }
  if(!gameState.isAttacking && achievementController.completed.size > 1) {
    attackButton.disabled = false;
  }
  else {
    attackButton.disabled = true;
  }
  
  if(!attackAnimation && timeSinceLastAttack > 0) {
    timeSinceLastAttack += dt;
  }
  
  if(timeSinceLastAttack < cooldown) {
    let percentage = timeSinceLastAttack / cooldown * 100;
    let gradient = `linear-gradient(black ${percentage}%, #dddddd ${percentage}%)`;
    attackButton.style.background = gradient;
  }
  
  if(timeSinceLastAttack > cooldown) {
    attackButton.classList.add("attack"); // Mostly there since I can, not sure we need this with the gradient below.
    attackButton.disabled = true;
    timeSinceLastAttack = 0;
    
    
    attackAnimation = true;
    
    setTimeout(() => audioController.play("hit"), 480);
    setTimeout(() => {
      if(enemyBlocking) {
        particleController.addParticleOnElement("🛡️", enemyBlockButton);
        audioController.stop("hit");
        audioController.play("block");
        enemyBlocking = 0;
      }
      else {
        let increase = halveEnemyCurrency();
        increaseCurrency(increase);
        if(gameState.swordPoisonUpgrades > 0) {
          poisonStacks.push(poisonDuration + gameState.swordPoisonUpgrades * 5000);
        }
      }
      setTimeout(() => {
        attackButton.classList.remove("attack");
        setTimeout(() => {
          attackAnimation = false;
          gameState.isAttacking = false;
        }, 700);
      }, 300);
    }, 700);
  }
});

attackButton.addEventListener("click", function() {
  startAttack();
});