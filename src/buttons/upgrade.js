const upgradeShieldButton = document.querySelector("#upgradeShield");
const upgradeSwordButton = document.querySelector("#upgradeSword");

const upgradeShieldButtonR = document.querySelector("#upgradeShieldResearch");
const upgradeSwordButtonR = document.querySelector("#upgradeSwordResearch");

const shieldUpgradesLabel = document.querySelector("#shieldUpgradesLabel");
const swordUpgradesLabel = document.querySelector("#swordUpgradesLabel");

const shieldUpgradesLabelR = document.querySelector("#shieldUpgradesLabel");
const swordUpgradesLabelR = document.querySelector("#swordUpgradesLabel");

const upgradeShieldNumber = document.querySelector("#upgradeShieldCost");
const upgradeSwordNumber = document.querySelector("#upgradeSwordCost");

const upgradeShieldNumberR = document.querySelector("#upgradeShieldResearchCost");
const upgradeSwordNumberR = document.querySelector("#upgradeSwordResearchCost");


upgradeShieldButton.addEventListener("click", () => {
  if(gameState.currency >= gameState.shieldDurationUpgradeCost) {
    decreaseCurrency(gameState.shieldDurationUpgradeCost);
    gameState.shieldDurationUpgrades++;
    gameState.shieldDurationUpgradeCost+=5;
    upgradeShieldNumber.innerHTML = gameState.shieldDurationUpgradeCost;
  }
  else {
    particleController.addParticleOnElement(`${gameState.shieldDurationUpgradeCost}💰`, upgradeShieldButton, "loss");
  }
  
  let upgrades = "";
  for(let i = 1; i < gameState.shieldDurationUpgrades; i++) {
    upgrades += "⌛";
  }
  for(let i = 0; i < gameState.shieldDurabilityUpgrades; i++) {
    upgrades += "🛡️";
  }
  shieldUpgradesLabel.innerHTML = upgrades;
});


upgradeSwordButton.addEventListener("click", () => {
  if(gameState.currency >= gameState.swordCooldownUpgradeCost) {
    decreaseCurrency(gameState.swordCooldownUpgradeCost);
    gameState.swordCooldownUpgrades++;
    gameState.swordCooldownUpgradeCost+=5;
    upgradeSwordNumber.innerHTML = gameState.swordCooldownUpgradeCost;
  }
  else {
    particleController.addParticleOnElement(`${gameState.swordCooldownUpgradeCost}💰`, upgradeSwordButton, "loss");
  }
  
  let upgrades = "";
  for(let i = 1; i < gameState.swordCooldownUpgrades; i++) {
    upgrades += "⌛";
  }
  for(let i = 0; i < gameState.swordPoisonUpgrades; i++) {
    upgrades += "☠️";
  }
  swordUpgradesLabel.innerHTML = upgrades;
});

upgradeShieldButtonR.addEventListener("click", () => {
  if(gameState.researchPoints >= gameState.shieldDurabilityUpgradeCost) {
    addResearch(-(gameState.shieldDurabilityUpgradeCost));
    gameState.shieldDurabilityUpgrades++;
    gameState.shieldDurabilityUpgradeCost+=5;
    upgradeShieldNumberR.innerHTML = gameState.shieldDurabilityUpgradeCost;
  }
  else {
    particleController.addParticleOnElement(`${gameState.shieldDurabilityUpgradeCost}⚗️`, upgradeShieldButtonR, "loss");
  }
  
  let upgrades = "";
  for(let i = 1; i < gameState.shieldDurationUpgrades; i++) {
    upgrades += "⌛";
  }
  for(let i = 0; i < gameState.shieldDurabilityUpgrades; i++) {
    upgrades += "🛡️";
  }
  shieldUpgradesLabel.innerHTML = upgrades;
});


upgradeSwordButtonR.addEventListener("click", () => {
  if(gameState.researchPoints >= gameState.swordPoisonUpgradeCost) {
    addResearch(-(gameState.swordPoisonUpgradeCost));
    gameState.swordPoisonUpgrades++;
    gameState.swordPoisonUpgradeCost+=5;
    upgradeSwordNumberR.innerHTML = gameState.swordPoisonUpgradeCost;
  }
  else {
    particleController.addParticleOnElement(`${gameState.swordPoisonUpgradeCost}⚗️`, upgradeSwordButtonR, "loss");
  }
  let upgrades = "";
  for(let i = 1; i < gameState.swordCooldownUpgrades; i++) {
    upgrades += "⌛";
  }
  for(let i = 0; i < gameState.swordPoisonUpgrades; i++) {
    upgrades += "☠️";
  }
  swordUpgradesLabel.innerHTML = upgrades;
});