const gameloop = {
  lastTick: null,
  tickListeners: [],
  tick: function(time) {
    requestAnimationFrame(gameloop.tick);
    
    let dt;
    if(gameloop.lastTick === null) {
      gameloop.lastTick = time;
      dt = 16.667;
    }
    else {
      dt = time - gameloop.lastTick;
    }
    gameloop.tickListeners.forEach(callback => callback(dt));
    
    gameloop.lastTick = time;
  },
  onTick: function(callback) {
    gameloop.tickListeners.push(callback);
  },
};

requestAnimationFrame(gameloop.tick);