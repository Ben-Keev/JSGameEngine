import Entity from './entity.js';

// Import the GameObject class from the 'engine' directory
import GameObject from '../engine/gameobject.js';

// Import the Renderer class from the 'engine' directory
import Renderer from '../engine/renderer.js';

// Import the Physics class from the 'engine' directory
import Physics from '../engine/physics.js';

// Import the Images object from the 'engine' directory. This object contains all the game's image resources
import {Images} from '../engine/resources.js';

// Import the Player and Platform classes from the current directory
import Player from './player.js';

// Define a new class, Enemy, which extends (i.e., inherits from) GameObject
class Enemy extends Entity {

  // Define the constructor for this class, which takes two arguments for the x and y coordinates
  constructor(x, y, renderer = new Renderer('green', 50, 50, Images.enemy.idle[0]), physics = new Physics({ x: 50, y: 0 }, { x: 0, y: 0 })) {
    // Call the constructor of the superclass (GameObject) with the x and y coordinates
    super(x, y, renderer, physics);
        
    // Initialize variables related to enemy's movement
    this.movementDistance = 0;
    this.movementLimit = 100;
    this.movingRight = true;
  }

  // Define an update method that will run every frame of the game. It takes deltaTime as an argument
  // which represents the time passed since the last frame
  update(deltaTime) {
    // Get the Physics component of this enemy
    const physics = this.getComponent(Physics);

    // Check if the enemy is moving to the right
    if (this.movingRight) {
      // If it hasn't reached its movement limit, make it move right
      if (this.movementDistance < this.movementLimit) {
        physics.velocity.x = 50;
        this.movementDistance += Math.abs(physics.velocity.x) * deltaTime;
        this.getComponent(Renderer).gameObject.direction = 1;
      } else {
        // If it reached the limit, make it move left
        this.movingRight = false;
        this.movementDistance = 0;
      }
    } else {
      // If it hasn't reached its movement limit, make it move left
      if (this.movementDistance < this.movementLimit) {
        physics.velocity.x = -50;
        this.movementDistance += Math.abs(physics.velocity.x) * deltaTime;
        this.getComponent(Renderer).gameObject.direction = -1;
      } else {
        // If it reached the limit, make it move right
        this.movingRight = true;
        this.movementDistance = 0;
      }
    }

    // Handle collisions with platforms
    this.isOnPlatform = false;  // Reset this before checking collisions with platforms


    // Call the update method of the superclass (GameObject), passing along deltaTime
    super.update(deltaTime);
  }

  attackPlayer(player) {
    if (!player.isInvulnerable) {
      player.lives -= 1; 
      player.makeInvulnerable(2000);
    }
  }

  onCollisionEnter(objects) {
    objects.forEach((object) => {
      if (object instanceof Player) {
        this.attackPlayer(object);
      }
    })
  }
}

// Export the Enemy class as the default export of this module
export default Enemy;