// Import entity
import Entity from './entity.js';

// Import the Renderer class from the 'engine' directory
import Renderer from '../engine/renderer.js';

// Import the Physics class from the 'engine' directory
import Physics from '../engine/physics.js';

// Player must be recognised
import Player from './player.js';

import ParticleSystem from '../engine/particleSystem.js';


// Define a new class, Collectible, which extends (i.e., inherits from) GameObject
class Collectible extends Entity {

  // tag represents the type of collectible
  constructor(x, y, width, height, color = 'gold', tag = 'coin', value = 1) {
    
    // Call the constructor of the superclass (GameObject) with the x and y coordinates
    super(x, y, new Renderer(color, width, height), new Physics({ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }));

    this.color = color;

    this.tag = tag;

    // Set the 'value' property of this collectible. This could be used to score points when the collectible is collected.
    this.value = value;
  }

  emitCollectParticles() {
    // Create a particle system at the collectible's position when a collectible is collected
    const particleSystem = new ParticleSystem(this.x, this.y, this.color, 20, 1, 0.5);
    this.game.addGameObject(particleSystem);
  }

  triggerCollected() {
    this.emitCollectParticles();
    this.game.removeGameObject(this);
  }

  // The powerup will vary based on tag
  triggerPowerUp(player) {
    // Copilot generated switch case
    switch (this.tag) {
      case 'coin':
        player.score += this.value;
        break;
      case 'health':
        player.lives += this.value;
        player.score++;
        break;
      case 'speed':
        player.speed += this.value;
        player.score++;
        break;
      case 'jump':
        player.jumpForce += this.value;
        player.score++;
        break;
    }
  }

  // Copilot generated
  onCollisionEnter(objects) {
    objects.forEach((object) => {
      if (object instanceof Player) {
        this.triggerPowerUp(object);
        this.triggerCollected();
      }
    });
  }
}

// Export the Collectible class as the default export of this module
export default Collectible;