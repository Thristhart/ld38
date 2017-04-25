const particleController = {
  particles: new Set(),
  addParticle: function(text, x, y, extraClass) {
    const particle = document.createElement("span");
    particle.classList.add("particle");
    if(extraClass) {
      extraClass.split(" ").forEach(klass => {
        particle.classList.add(klass);
      });
    }
    particle.innerHTML = text;
    particle.style.left = `${x - Math.random() * 10}px`;
    particle.style.top = `${y - Math.random() * 20}px`;
    particle.ttl = Math.random() * 500 + 1000;
    particle.style.animationDuration = `${particle.ttl}ms`;
    particle.lifetime = 0;
    particleController.particles.add(particle);
    overlay.appendChild(particle);
  },
  addParticleOnElement: function(text, element, extraClass) {
    let rect = element.getBoundingClientRect();
    return particleController.addParticle(text, rect.left, rect.top, extraClass);
  },
  updateParticle: function(particle, dt) {
    particle.lifetime += dt;
    if(particle.lifetime > particle.ttl) {
      particleController.particles.delete(particle);
      overlay.removeChild(particle);
      return;
    }
    particle.style.opacity = 1 - particle.lifetime / particle.ttl;
  },
};

gameloop.onTick(function(dt) {
  particleController.particles.forEach(particle => particleController.updateParticle(particle, dt));
});