// Import the necessary classes from the 'engine' directory
import Entity from './entity.js';
import Renderer from '../engine/renderer.js';
import Physics from '../engine/physics.js';

// Define a new class, Platform, which extends (inherits from) GameObject
class Platform extends Entity {
  
  // Define the constructor for the Platform class. It takes arguments for the x and y coordinates,
  // width, height, and color (with a default value of 'gray' if no color is provided)
  constructor(x, y, width, height, color = 'gray') {
    
    // Call the constructor of the superclass (GameObject) with the x and y coordinates
    super(x, y, new Renderer(color, width, height), new Physics({ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }));

    // Set the tag property to 'platform'. This can be used to identify platforms later in the game logic
    this.tag = 'platform'; 
  }

  // Copilot adjusted to make work with multiple objects
  freezePhysicsVelocityY(object) {
    if (object instanceof Entity) { // Prevent null reference errors
      object.getComponent(Physics).velocity.y = 0;
      object.getComponent(Physics).acceleration.y = 0;
      object.y = this.y - object.getComponent(Renderer).height;
      object.isOnPlatform = true;
    }
  }

  // Copilot adjusted to make it work with multiple objects
  onCollisionEnter(objects) {
    objects.forEach((objectType) => {
      try { // Works on entities that can jump
        if (!objectType.isJumping) {
          this.freezePhysicsVelocityY(objectType);
        }
      } catch { // For all other types of entities
        this.freezePhysicsVelocityY(objectType);
      }
    });
  }
}
// Export the Platform class as the default export of this module
export default Platform;
