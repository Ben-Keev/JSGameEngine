// Import necessary classes and resources
import Game from '../engine/game.js';
import Player from './player.js';
import Enemy from './enemy.js';
import PlayerUI from './playerUI.js';
import Platform from './platform.js';
import gameObject from '../engine/gameobject.js';
import Collectible from './collectible.js';
import { gameManager } from '../engine/gameManager.js';

// Define a class Level that extends the Game class from the engine
class Level extends Game {
  
  // Define the constructor for this class, which takes one argument for the canvas ID
  constructor(canvasId, level) {
    // Call the constructor of the superclass (Game) with the canvas ID
    super(canvasId);
    
    this.currentLevel = level;

    // No goal set yet, set to unattainable goal.
    this.goal = 99999;

    this.loadLevel(this.currentLevel);
    gameManager.addPlayer(0, true);
  }
  
  // Unloads all gameObjects that constitue a level
  unloadCurrentLevel() {
    // Remove all game objects that aren't a player, player UI, or camera
    for (const gameObject of this.gameObjects) {
      if (!(gameObject instanceof Player || gameObject instanceof PlayerUI)) {
        this.removeGameObject(gameObject);
      }
    }
  }

  // Loads result screen, then the next level
  transitionLevel(level) {
    this.loadResultsScreen();
    this.currentLevel = level;
  }

  loadLevel(level) {
    switch (level) {
      case 1:
        this.loadLevel1();
        break;
      case 2:
        this.loadLevel2();
        break;
      case 3:
        this.loadLevel3();
        break;
      default:
        this.loadLevel3();
        break;
    }
  }

  loadLevel1() {
    this.currentLevel = 1;
    this.inLevel = true;
    this.viewingResults = false;

    this.unloadCurrentLevel()
    gameManager.respawnPlayers();
    
    this.goal = 15;

    // Define the platform's width and the gap between platforms
    const platformWidth = 200;
    const gap = 100;

    // Create platforms and add them to the game
    const platforms = [
      new Platform(0, this.canvas.height - 20, platformWidth, 20),
      new Platform(platformWidth + gap, this.canvas.height - 20, platformWidth, 20),
      new Platform(2 * (platformWidth + gap), this.canvas.height - 20, platformWidth, 20),
      new Platform(3 * (platformWidth + gap), this.canvas.height - 20, platformWidth, 20),
      new Platform(4 * (platformWidth + gap), this.canvas.height - 20, platformWidth, 20),
    ];

    for (const platform of platforms) {
      this.addGameObject(platform);
    }

    // Create enemies and add them to the game
    this.addGameObject(new Enemy(50, this.canvas.height - 90));
    this.addGameObject(new Enemy(platformWidth + gap + 50, this.canvas.height - 90));
    this.addGameObject(new Enemy(2 * (platformWidth + gap) + 50, this.canvas.height - 90));

    // Create collectibles and add them to the game
    this.generateCollectiblesLevel1();
  }

  generateCollectiblesLevel1() {
    this.addGameObject(new Collectible(250, this.canvas.height - 100, 20, 20, 'gold', 'coin', 1));
    this.addGameObject(new Collectible(450, this.canvas.height - 100, 20, 20, 'green', 'speed', 100));
    this.addGameObject(new Collectible(650, this.canvas.height - 100, 20, 20, 'pink', 'health', 1));
    this.addGameObject(new Collectible(850, this.canvas.height - 100, 20, 20, 'blue', 'jump', 50));
    this.addGameObject(new Collectible(1050, this.canvas.height - 100, 20, 20, 'gold', 'coin', 3));
  }

  loadLevel2() {
    this.inLevel = true;
    this.viewingResults = false;

    this.currentLevel = 2;
    this.goal = 30;

    this.unloadCurrentLevel()
    gameManager.respawnPlayers();

    // Define the platform's width and the gap between platforms
    const platformWidth = 300;
    const gap = 100;

    const platforms = [
      new Platform(0, this.canvas.height - 20, platformWidth, 20, 'gold'),
      new Platform(platformWidth + gap, this.canvas.height - 20, platformWidth, 20, 'gold'),
      new Platform(2 * (platformWidth + gap), this.canvas.height - 20, platformWidth, 20, 'gold'),
      new Platform(3 * (platformWidth + gap), this.canvas.height - 20, platformWidth, 20, 'gold'),
      new Platform(4 * (platformWidth + gap), this.canvas.height - 20, platformWidth, 20, 'gold'),
    ];

    for (const platform of platforms) {
      this.addGameObject(platform);
    }

    // Create collectibles and add them to the game
    this.generateCollectiblesLevel2();
  }

  generateCollectiblesLevel2() {
    this.addGameObject(new Collectible(250, this.canvas.height - 100, 20, 20, 'gold', 'coin', 10));
    this.addGameObject(new Collectible(450, this.canvas.height - 100, 20, 20, 'green', 'speed', 200));
    this.addGameObject(new Collectible(650, this.canvas.height - 100, 20, 20, 'pink', 'health', 2));
    this.addGameObject(new Collectible(850, this.canvas.height - 100, 20, 20, 'blue', 'jump', 75));
  }

  // Copilot generated
  // Level 3 is a procedurally generated level with random platforms and collectibles
  loadLevel3() {
    this.inLevel = true;
    this.viewingResults = false;

    if (this.currentLevel >= 3) { // The player has continued through procedural levels.
      this.currentLevel++;
    } else {
      this.currentLevel = 3;
    }

    // The goal is now merely to collect all collectibles, we set it to something unattainable
    this.goal = 999;

    // Code to load level 3
    this.unloadCurrentLevel();
    gameManager.respawnPlayers();
    
    // Define the platform's width and the gap between platforms
    const platformWidth = 300;
    const gap = 100;
        
    // Platforms
    // -----------------------

    const platforms = [];

    // Always spawn a platform beneath the player
    platforms.push(new Platform(this.canvas.width / 2 - 25, this.canvas.height / 2 + 50, platformWidth, 20));
    
    // Randomly generate platforms
    for (let i = 0; i < Math.random() * 10; i++) {
      const x = Math.random() * (this.canvas.width - platformWidth);
      const y = Math.random() * (this.canvas.height - 100);
      const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
      platforms.push(new Platform(x, y, platformWidth, 20, color));
    }
    
    for (const platform of platforms) {
      this.addGameObject(platform);
    }

    // Collectibles
    // -----------------------

    const collectibles = [];

    const collectibleTypesAndValues = {
      coin: 1,
      speed: 100,
      health: 1,
      jump: 50
    };

    let platformCounter = 0;
    for (let i = 0; i < Math.random() * platforms.length; i++) {
      if (platformCounter === platforms.length - 1) {
        platformCounter = 0;
      }

      const x = platforms[platformCounter].x + Math.random() * (platformWidth - 20);
      const y = platforms[platformCounter].y + Math.random() * -10 - 100;
      const type = Object.keys(collectibleTypesAndValues)[Math.floor(Math.random() * 4)];
      const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
      const value = collectibleTypesAndValues[type];
    
      collectibles.push(new Collectible(x, y, 20, 20, color, type, value));      
      platformCounter++;
    }
    
    for (const collectible of collectibles) {
      this.addGameObject(collectible);
    }

    // Enemies
    // Enemies should spawn on top of a platform, in the middle of it.
    // Copilot generated
    // -----------------------

    const enemies = [];

    for (let i = 0; i < Math.random() * 8 && i < platforms.length; i++) {
      const x = platforms[i].x + platformWidth / 2 - 25;
      const y = platforms[i].y - 50;
      enemies.push(new Enemy(x, y));
    }

    for (const enemy of enemies) {
      this.addGameObject(enemy);
    }
  }

  loadResultsScreen() {
    // Remove the goal.
    this.goal = 999999;

    this.unloadCurrentLevel();
    this.viewingResults = true;
    this.inLevel = false;

    // Add an empty entity for the camera to target
    const empty = new gameObject(this.canvas.width / 2 + 50, this.canvas.height / 2);
    this.addGameObject(empty);
    this.camera.target = empty;

    for(let i = 0; i < gameManager.players.length; i++) {
      // Adjust player UI positions, store their X positions
      gameManager.playerUIs[i].resultsText();

      // Change players spawn locations
      gameManager.players[i].spawnX = gameManager.playerUIs[i].getX() + 30;

      // Create a platform for players to land on
      this.addGameObject(new Platform(gameManager.playerUIs[i].getX() + 30, this.canvas.height / 2, 200, 20));

      // Store each players' score
      gameManager.players[i].resetPlayerState();
    }

    gameManager.setWinners();

    // Display the results screen for 5 seconds
    setTimeout(() => {
      this.viewingResults = false;

      // The new camera target is the winner
      for (let player of gameManager.players) {
        // Reset spawn locations
        player.spawnX = this.canvas.width / 2 - 25;

        if (gameManager.players.every(player => !player.winner)) {
          // If no one won, set the camera to a random player
          this.camera.target = gameManager.players[Math.floor(Math.random() * gameManager.players.length)];
        } else if (player.winner) { // else, set the camera to the winner
          this.camera.target = player;
        }
      }

      for (let playerUI of gameManager.playerUIs) {
        playerUI.gameText();
      }
    }, 5000);
  }

}

// Export the Level class as the default export of this module
export default Level;
