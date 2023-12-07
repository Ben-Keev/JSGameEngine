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
}

// Export the Platform class as the default export of this module
export default Platform;
