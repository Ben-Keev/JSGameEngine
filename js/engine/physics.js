// Import the required modules and classes.
import Component from './component.js';
import Renderer from './renderer.js';

// The Physics class extends Component and handles the physics behavior of a game object.
class Physics extends Component {
  // The constructor initializes the physics component with optional initial velocity, acceleration, and gravity.
  constructor(velocity = { x: 0, y: 0 }, acceleration = { x: 0, y: 0 }, gravity = { x: 0, y: 300 }) {
    super(); // Call the parent constructor.
    this.velocity = velocity; // Initialize the velocity.
    this.acceleration = acceleration; // Initialize the acceleration.
    this.gravity = gravity; // Initialize the gravity.
  }

  // The update method handles how the component's state changes over time.
  update(deltaTime) {
    if (this.enabled) {
      // Update velocity based on acceleration and gravity.
      this.velocity.x += this.acceleration.x * deltaTime;
      this.velocity.y += (this.acceleration.y + this.gravity.y) * deltaTime;
      // Move the game object based on the velocity.
      this.gameObject.x += this.velocity.x * deltaTime;
      this.gameObject.y += this.velocity.y * deltaTime;
    }
  }

  // The isColliding method checks if this game object is colliding with another game object.
  isColliding(otherPhysics) {
    if (this.enabled) {
      // Get the bounding boxes of both game objects.
      const [left, right, top, bottom] = this.getBoundingBox();
      
      if(otherPhysics !== undefined) {
      const [otherLeft, otherRight, otherTop, otherBottom] = otherPhysics.getBoundingBox();
  
      // Check if the bounding boxes overlap. If they do, return true. If not, return false.
      return left < otherRight && right > otherLeft && top < otherBottom && bottom > otherTop;
      }
    }

    return false;
  }

  // Copilot generated
  // The getCollidingObject method checks if this game object is colliding with any other game object and returns the colliding object.
  getCollidingObjects() {
    const collidingObjects = [];

    if (this.enabled) {
      // Get all the game objects in the scene.
      const gameObjects = this.gameObject.game.gameObjects;
  
      // Iterate through each game object.
      for (const gameObject of gameObjects) {
        // Skip if the game object is the same as this game object.
        if (gameObject === this.gameObject) {
          continue;
        }
  
        // Get the Physics component of the other game object.
        const otherPhysics = gameObject.getComponent(Physics);
  
        // Check if this game object is colliding with the other game object.
        // Must be an entity to collide
        if (this.isColliding(otherPhysics)) {
          // Add the colliding object to the array.
          collidingObjects.push(gameObject);
        }
      }
    }

    // Return the array of colliding game objects.
    return collidingObjects;
  }

  // The getBoundingBox method returns the bounding box of the game object in terms of its left, right, top, and bottom edges.
  getBoundingBox() {
    if (this.enabled) {
      // Get the Renderer component of the game object to get its width and height.
      const renderer = this.gameObject.getComponent(Renderer);
      // Calculate the left, right, top, and bottom edges of the bounding box.
      const left = this.gameObject.x;
      const right = this.gameObject.x + renderer.width;
      const top = this.gameObject.y;
      const bottom = this.gameObject.y + renderer.height;

      // Return the bounding box.
      return [left, right, top, bottom];      
    }

    return [0, 0, 0, 0];
  }
}

// The Physics class is then exported as the default export of this module.
export default Physics;