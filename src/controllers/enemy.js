let moneyInterval = 700;
let timeSinceLastMoney = 0;

let enemyBlockInterval = 7500;

let enemyBlockDuration = 2000;
let enemyBlockSensative = false;
let playerTimeSinceLastAttack = 0;

let enemyAttackCharge = 0;
let enemyAttackChargeTime = 5000;
let enemyAttackAnimation = false;

let enemyBlocking = 0;

const enemyAttackButton = document.querySelector("#enemySwordButton");
const enemyBlockButton = document.querySelector("#enemyShieldButton");
const enemyCenterButton = document.querySelector("#enemyCenterButton");
const enemyCurrencyDisplay = document.querySelector("#enemyCurrency");

function halveEnemyCurrency() {
  let decrease = Math.floor(gameState.enemyCurrency / 2);
  gameState.enemyCurrency -= decrease;
  enemyCurrencyDisplay.innerHTML = gameState.enemyCurrency;
  particleController.addParticleOnElement(`-${decrease}`, enemyCurrencyDisplay, "loss enemy");
  
  return decrease;
}

gameloop.onTick(dt => {
  if(!gameState.enemyActive) {
    return;
  }
  
  timeSinceLastMoney += dt;
  playerTimeSinceLastAttack += dt;
  
  if(enemyAttackCharge > 0) {
    enemyAttackCharge += dt;
    let percentage = enemyAttackCharge / enemyAttackChargeTime * 100;
    let gradient = `linear-gradient(#dddddd ${percentage}%, black ${percentage}%)`;
    enemyAttackButton.style.background = gradient;
  }
  
  if(!enemyAttackAnimation && enemyAttackCharge === 0 && gameState.enemyCurrency >= 5) {
    gameState.enemyCurrency -= 5;
    enemyCurrencyDisplay.innerHTML = gameState.enemyCurrency;
    particleController.addParticleOnElement("-5", enemyCurrencyDisplay, "loss enemy");
    
    enemyAttackCharge = 1;
  }
  if(enemyAttackCharge > enemyAttackChargeTime) {
    enemyAttackCharge = 0;
    enemyAttackButton.classList.add("attack");
    enemyAttackAnimation = true;
    
    setTimeout(() => audioController.play("hit"), 480);
    setTimeout(() => {
      let blocked = checkBlock();
      if(blocked) {
        audioController.stop("hit");
      }
      
      setTimeout(() => {
        enemyAttackButton.classList.remove("attack");
        setTimeout(() => {
          enemyAttackAnimation = false;
        }, 700);
      }, 300);
    }, 700);
  }
  
  if(timeSinceLastMoney > moneyInterval) {
    timeSinceLastMoney = 0;
    enemyCenterButton.classList.add("fakePress");
    setTimeout(() => enemyCenterButton.classList.remove("fakePress"), 200);
    
    gameState.enemyCurrency += 1;
    enemyCurrencyDisplay.innerHTML = gameState.enemyCurrency;
    particleController.addParticleOnElement("+1", enemyCurrencyDisplay, "gain enemy");
  }
  
  if(enemyBlocking <= 0) {
    enemyBlockButton.classList.remove("activated");
    enemyBlocking = 0;
  }
  else {
    enemyBlocking -= dt;
  }
  
  if(enemyBlockSensative === true)
  {
    if(playerTimeSinceLastAttack > (enemyBlockInterval - (500 * achievementController.completed.size))) {
      enemyBlockButton.classList.add("fakePress");
      setTimeout(() => enemyBlockButton.classList.remove("fakePress"), 200);
      enemyBlockButton.classList.add("activated");
      
      enemyBlocking = enemyBlockDuration;
      enemyBlockSensative = false;
    }
  }
});

function enemyAwaitAttack()
{
  if(enemyBlockSensative===false)
  {
    playerTimeSinceLastAttack = 0;
    enemyBlockSensative = true;
  }
}