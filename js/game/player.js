// Importing necessary components and resources
import Entity from './entity.js';
import Renderer from '../engine/renderer.js';
import Physics from '../engine/physics.js';
import { Images } from '../engine/resources.js';
import ActionHandler from '../engine/actionHandler.js';
import Action from '../engine/action.js';
import {audioManager} from '../engine/audioManager.js';

// Defining a class Player that extends GameObject
class Player extends Entity {
  // Constructor initializes the game object and add necessary components
  constructor(x, y, index, renderer = new Renderer('blue', 50, 50, Images['player'+index].idle[0]), physics = new Physics({ x: 0, y: 0 }, { x: 0, y: 0 })) {
    super(x, y, renderer, physics); // Call parent's constructor

    this.physics = this.getComponent(Physics);
    this.renderer = this.getComponent(Renderer);
    
    this.addComponent(new ActionHandler(index)); // Add input for handling user input
    this.input = this.getComponent(ActionHandler);
    this.input.addAction(new Action('jump', 'ArrowUp', 0)); // Add jump action
    
    this.winner = false;

    this.spawnX = x;

    // Keeps track of the player number
    this.index = index;

    // Initialize all the player specific properties
    this.direction = 1;
    
    this.lives = 3;
    this.score = 0;
    
    this.isOnPlatform = false;
    
    this.isJumping = false;
    this.jumpForce = 400;
    this.jumpTime = 0.3;
    this.jumpTimer = 0;
    
    this.speed = 200;
    
    this.isInvulnerable = false;
  }

  // The update function runs every frame and contains game logic
  update(deltaTime) {

    this.movementHandler();
    this.jumpHandler(deltaTime);
  
    // Handle collisions with platforms
    this.isOnPlatform = false;  // Reset this before checking collisions with platforms
  
    // Check if player has fallen off the bottom of the screen
    if (this.y > this.game.canvas.height) {

      if (!this.game.viewingResults) { // Don't deduct lives in result screen
        --this.lives;
      }

      this.resetPlayerState();
    }

    if(this.lives <= 0) {
      this.renderer.enabled = false;
      this.physics.enabled = false;
    }

    // If a player has reached the goal, load a new level
    if (this.score >= this.game.goal) {
      this.game.transitionLevel(this.game.currentLevel + 1);
    }

    super.update(deltaTime);
  }

  movementHandler() {
    const movementAxes = this.input.getMovementAxes(); // Get movement axes from input component

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
    if (this.input.isActionDown('jump') && this.isOnPlatform) {
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
    this.x = this.spawnX;
    this.y = this.game.canvas.height / 2;
    this.getComponent(Physics).velocity = { x: 0, y: 0 };
    this.getComponent(Physics).acceleration = { x: 0, y: 0 };
    this.direction = 1;
    this.isOnPlatform = false;
    this.isJumping = false;
    this.jumpTimer = 0;

    // Remove powerup benefits
    this.speed = 200;
    this.jumpForce = 400;
  }

  resetPlayerScore() {
    this.lives = 3;
    this.score = 0;
  }
}

export default Player;
