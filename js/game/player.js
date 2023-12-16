// Importing necessary components and resources
import Entity from './entity.js';
import Renderer from '../engine/renderer.js';
import Physics from '../engine/physics.js';
import { Animations } from '../engine/resources.js';
import ActionHandler from '../engine/actionHandler.js';
import Action from '../engine/action.js';
import { audioManager } from '../engine/audioManager.js';
import Animator from '../engine/animator2.js';

// Defining a class Player that extends GameObject
class Player extends Entity {
  // Constructor initializes the game object and add necessary components
  constructor(x, y, renderer = new Renderer('blue', 50, 50, Animations.player.idle[0]), physics = new Physics({ x: 0, y: 0 }, { x: 0, y: 0 })) {
    super(x, y, renderer, physics); // Call parent's constructor

    this.physics = this.getComponent(Physics);
    this.renderer = this.getComponent(Renderer);
    
    this.addComponent(new ActionHandler()); // Add input for handling user input
    this.input = this.getComponent(ActionHandler);
    this.input.addAction(new Action('Jump', 'ArrowUp', 0)); // Add jump action
    
    this.addComponent(new Animator(this, Animations.player)); // Add animator for handling animations
    this.animator = this.getComponent(Animator);

    // Initialize all the player specific properties
    this.direction = 1;
    
    this.lives = 3;
    this.score = 0;
    
    this.isOnPlatform = false;
    
    this.isJumping = false;
    this.jumpForce = 400;
    this.jumpTime = 0.3;
    this.jumpTimer = 0;
    
    this.speed = 100;
    
    this.isInvulnerable = false;
  }

  // Does not function, as pause toggles too quickly
  // pauseHandler() {
  //   console.log(this.input.wasActionDown('Pause'))
  //   // Handle pausing the game
  //   if (this.input.wasActionDown('Pause')) {
  //     this.game.togglePause(); // Call togglePause() from game.js
  //   }
  // }

  // The update function runs every frame and contains game logic
  update(deltaTime) {

    this.movementHandler();
    this.jumpHandler(deltaTime);
  
    // Handle collisions with platforms
    this.isOnPlatform = false;  // Reset this before checking collisions with platforms
  
    // Check if player has fallen off the bottom of the screen
    if (this.y > this.game.canvas.height) {
      this.resetPlayerState();
    }

    // Check if player has no lives left
    if (this.lives <= 0) {
      location.reload();
    }

    // Check if player has collected all collectibles
    if (this.score >= 3) {
      location.reload();
    }

    super.update(deltaTime);
  }

  movementHandler() {
    const movementAxes = this.input.getMovementAxes(); // Get movement axes from input component

    //this.getComponent(Animator).changeAnimation('walk', movementAxes.x > 0.1 || movementAxes.x < -0.1);

    // Handle player movement
    if (movementAxes.x > 0.1 || movementAxes.x < -0.1) {
      // Map.sign returns 1 with the same sign as the argument, and -1 with the opposite sign
      this.physics.velocity.x = this.speed * Math.sign(movementAxes.x);
      this.direction = -Math.sign(movementAxes.x);
    } else {
      this.physics.velocity.x = 0;
    }    
  }

  jumpHandler(deltaTime) {
    // Handle player jumping
    if (this.input.isActionDown('Jump') && this.isOnPlatform) {
      this.startJump();
      audioManager.playAudio('jump');
    }

    if (this.isJumping) {
      this.updateJump(deltaTime);
    }
  }

  startJump() {
    // Initiate a jump if the player is on a platform
    if (this.isOnPlatform) { 
      this.isJumping = true;
      this.jumpTimer = this.jumpTime;
      this.getComponent(Physics).velocity.y = -this.jumpForce;
      this.isOnPlatform = false;
    }
  }
  
  updateJump(deltaTime) {
    // Updates the jump progress over time
    this.jumpTimer -= deltaTime;
    if (this.jumpTimer <= 0 || this.getComponent(Physics).velocity.y > 0) {
      this.isJumping = false;
    }
  }

  // Might be used by enemy or collectible
  makeInvulnerable(timeout) {
    if (!this.isInvulnerable) {
      this.isInvulnerable = true;
      // Make player vulnerable again after 2 seconds
      setTimeout(() => {
        this.isInvulnerable = false;
      }, timeout);
    }
  }

  resetPlayerState() {
    // Reset the player's state, repositioning it and nullifying movement
    this.x = this.game.canvas.width / 2;
    this.y = this.game.canvas.height / 2;
    this.getComponent(Physics).velocity = { x: 0, y: 0 };
    this.getComponent(Physics).acceleration = { x: 0, y: 0 };
    this.direction = 1;
    this.isOnPlatform = false;
    this.isJumping = false;
    this.jumpTimer = 0;
  }

  resetGame() {
    // Reset the game state, which includes the player's state
    this.lives = 3;
    this.score = 0;
    this.resetPlayerState();
  }
}

export default Player;
