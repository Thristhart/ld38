const overlay = document.querySelector("#overlay");
const achieveLog = document.querySelector("#achievementLog");

const documentedAchievements = 
`Earn 💰
Get to 5 💰
Successfully 🛡️ a ⚔️
Get to 50 💰
Successfully 🛡️ 6 ⚔️s in a row
Keep <span class='enemy'>💰</span> below 5 for 5 seconds`;

const achievementDisplays = {};

function cheat(amount) {
  let count = 0;
  for(let cheevo in achievementDisplays) {
    achievementController.achieve(cheevo);
    count++;
    if(amount && count >= amount) {
      return;
    }
  }
}

documentedAchievements.split("\n").forEach(cheevo => {
  let container = document.createElement("div");
  container.classList.add("cheevo");
  container.innerHTML = cheevo;
  
  achieveLog.appendChild(container);
  
  achievementDisplays[cheevo] = container;
});

const achievementController = {
  eventListeners: {},
  completed: new Set(),
  fireEvent: function(eventName, ...args) {
    if(achievementController.eventListeners[eventName]) {
      achievementController.eventListeners[eventName].forEach(callback => callback(...args));
    }
  },
  on: function(eventName, callback) {
    if(achievementController.eventListeners[eventName]) {
      achievementController.eventListeners[eventName].push(callback);
    }
    else {
      achievementController.eventListeners[eventName] = [callback];
    }
  },
  achieve: function(achievement) {
    if(!achievementController.completed.has(achievement)) {
      // ding
      console.log(achievement);
      achievementController.popup(achievement);
      achievementController.completed.add(achievement);
      
      audioController.play("cheevo");
      
      setDisplayScale();
      
      if(achievementController.completed.size >= 2) {
        gameState.enemyActive = true;
      }
    }
  },
  
  popup: function(text) {
    const popup = document.createElement("div");
    popup.classList.add("popup");
    popup.innerHTML = text;
    overlay.appendChild(popup);
    let display = achievementDisplays[text];
    if(display) {
      display.classList.add("complete");
    }
    setTimeout(() => {
      popup.classList.add("fade");
      popup.addEventListener("transitionend", () => {
        overlay.removeChild(popup);
      });
    }, 2000);
  },
};

achievementController.on("currencyChange", (increase) => {
  if(gameState.currency >= 1)
  {
    achievementController.achieve("Earn 💰");
  }
  if(gameState.currency >= 5) {
    achievementController.achieve("Get to 5 💰");
  }
  if(gameState.currency >= 50) {
    achievementController.achieve("Get to 50 💰");
  }
});

const consecutiveCheevo = "Successfully 🛡️ 6 ⚔️s in a row";
achievementController.on("block", () => {
  achievementController.achieve("Successfully 🛡️ a ⚔️");
  if(!achievementController.completed.has(consecutiveCheevo)) {
    achievementDisplays[consecutiveCheevo].innerHTML = `${consecutiveCheevo} (${gameState.consecutiveBlocks}/6)`;
  }
  if(gameState.consecutiveBlocks >= 6)
  {
    achievementController.achieve(consecutiveCheevo);
    achievementDisplays[consecutiveCheevo].innerHTML = consecutiveCheevo;
  }
})

achievementController.on("missBlock", () => {
  if(!achievementController.completed.has(consecutiveCheevo)) {
    achievementDisplays[consecutiveCheevo].innerHTML = `${consecutiveCheevo} (${gameState.consecutiveBlocks}/6)`;
  }
});

let timeSinceEnemyAt5 = 0;
const keepMoneyLowCheevo = "Keep <span class='enemy'>💰</span> below 5 for 5 seconds";

gameloop.onTick(dt => {
  if(achievementController.completed.has(keepMoneyLowCheevo)) {
    return;
  }
  if(gameState.enemyCurrency >= 5) {
    if(timeSinceEnemyAt5 !== 0) {
      achievementDisplays[keepMoneyLowCheevo].innerHTML = `${keepMoneyLowCheevo} (0/5)`;
    }
    timeSinceEnemyAt5 = 0;
  }
  else {
    timeSinceEnemyAt5 += dt;
    if(timeSinceEnemyAt5 > 5000) {
      achievementController.achieve(keepMoneyLowCheevo);
      achievementDisplays[keepMoneyLowCheevo].innerHTML = keepMoneyLowCheevo;
    }
    else {
      achievementDisplays[keepMoneyLowCheevo].innerHTML = `${keepMoneyLowCheevo} (${(timeSinceEnemyAt5 / 1000).toFixed(1)}/5)`;
    }
  }
});