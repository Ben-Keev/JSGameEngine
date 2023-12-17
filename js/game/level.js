// Import necessary classes and resources
import Game from '../engine/game.js';
import Player from './player.js';
import Enemy from './enemy.js';
import PlayerUI from './playerUI.js';
import Platform from './platform.js';
import Collectible from './collectible.js';
import gameObject from '../engine/gameobject.js';
import Renderer from '../engine/renderer.js';
import Physics from '../engine/physics.js';

// Define a class Level that extends the Game class from the engine
class Level extends Game {
  
  // Define the constructor for this class, which takes one argument for the canvas ID
  constructor(canvasId, level) {
    // Call the constructor of the superclass (Game) with the canvas ID
    super(canvasId);
    
    this.currentLevel = level;

    this.viewingResults = false;
    this.inLevel = false;

    this.players = [];
    this.playerUIs = [];

    // No goal set yet, set to unattainable goal.
    this.goal = 99999;

    // Copilot generated
    // Listen for gamepad disconnect event to remove players
    window.addEventListener('gamepaddisconnected', (event) => {
      console.log('Gamepad disconnected:', event.gamepad, ' at index ', event.gamepad.index);
      
      // Find and remove the player with the disconnected gamepad index
      const disconnectedPlayer = this.gameObjects.find(obj => obj instanceof Player && obj.index === event.gamepad.index);
      
      if (disconnectedPlayer) {
        console.log('Removing player ' + event.gamepad.index)

        // Copilot generated
        // Remove the player and their UI from the game
        this.removeGameObject(disconnectedPlayer);

        const disconnectedPlayerUI = this.playerUIs.find(obj => obj.player === disconnectedPlayer);
        this.removeGameObject(disconnectedPlayerUI);

        // Remove the player & UI from the list of players
        const playerIndex = this.players.indexOf(disconnectedPlayer);
        this.players.splice(playerIndex, 1);

        const playerUIIndex = this.playerUIs.indexOf(disconnectedPlayerUI);
        this.playerUIs.splice(playerUIIndex, 1);
      }
    });

    // Listen for more gamepads connected. this will be used to add more players
    window.addEventListener('gamepadconnected', (event) => {
      console.log('Gamepad connected:', event.gamepad, ' at index ', event.gamepad.index);

      if (event.gamepad.index != 0) {
        console.log('Adding player ' + event.gamepad.index)
        const player = new Player(this.canvas.width / 2 - 25, this.canvas.height / 2 - 25, event.gamepad.index);
        this.addGameObject(player);

        const playerUI = new PlayerUI(10 + (event.gamepad.index * 300), 10, player);
        this.addGameObject(playerUI);

        this.players[event.gamepad.index] = player;
        this.playerUIs[event.gamepad.index] = playerUI;
      }
    });

    this.loadLevel(this.currentLevel);
    this.spawnPlayer1();
  }

  spawnPlayer1() {
    // Reset the game
    // Create a player object and add it to the game
    const player = new Player(this.canvas.width / 2 - 25, this.canvas.height / 2 - 25, 0);
    this.addGameObject(player);

    // Add the player UI object to the game
    const playerUI = new PlayerUI(10, 10, player);
    this.addGameObject(playerUI);

    // Set the game's camera target to the player
    this.camera.target = player;

    this.players[0] = player;
    this.playerUIs[0] = playerUI;
  }

  update() {
    // Call each game object's update method with the delta time.
    for (const gameObject of this.gameObjects) {
      gameObject.update(this.deltaTime);
    }
    // Filter out game objects that are marked for removal.
    this.gameObjects = this.gameObjects.filter(obj => !this.gameObjectsToRemove.includes(obj));
    // Clear the list of game objects to remove.
    this.gameObjectsToRemove = [];

    this.onCollectiblesCollected();

    // If the player is not viewing the results screen or in a level, load the next level
    if (!this.viewingResults && !this.inLevel) {
      this.loadLevel(this.currentLevel);
    }

    this.onAllPlayersDead();
    this.refocusCamera();
  }

  // Checks if players are dead. If so, refocus the camera
  refocusCamera() {
    for(let player of this.players) {
      if(player.lives <=0 && player == this.camera.target) { // Checks if the player is dead and is the camera target
        // Copilot Generated
        // Sets camera to the next player. if this exceeds the number of players, set to 0
        this.camera.target = this.players.indexOf(player) + 1 < this.players.length ? this.players[this.players.indexOf(player) + 1] : 0;
      }
    }
  }

  onAllPlayersDead() {
    // If all players are dead, reset the game
    if (this.players.every(player => player.lives <= 0)) { // copilot generated
      this.loadResultsScreen();
    }
  }

  onCollectiblesCollected() {
    // Checks if there are any collectibles left in the level. if missing, reload them
    const collectibles = this.gameObjects.filter(obj => obj instanceof Collectible);
    if (collectibles.length === 0 && this.inLevel) {
      switch (this.currentLevel) {
        case 1: // Respawn collectibles so the level is possible for all players
          this.generateCollectiblesLevel1();
          break;
        case 2:
          this.generateCollectiblesLevel2();
          break;
        default: // If all collectibles collected announce winner and create a new level
          this.loadResultsScreen();
          break;
      }
    }
  }
  
  // Unloads all gameObjects that constitue a level
  unloadCurrentLevel() {
    // Remove all game objects that aren't a player, player UI, or camera
    for (const gameObject of this.gameObjects) {
      if (!(gameObject instanceof Player || gameObject instanceof PlayerUI || gameObject === this.camera)) {
        this.removeGameObject(gameObject);
      }
    }
  }

  respawnPlayers() {
    // Respawn all players
    for (let player of this.players) {
      player.resetPlayerState();
      player.resetPlayerScore();
      player.getComponent(Physics).enabled = true;
      player.getComponent(Renderer).enabled = true;
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
    this.respawnPlayers();

    
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
    this.addGameObject(new Collectible(250, this.canvas.height - 100, 20, 20, 'gold', 'coin', 15));
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
    this.respawnPlayers();

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
    this.addGameObject(new Collectible(250, this.canvas.height - 100, 20, 20, 'gold', 'coin', 30));
    this.addGameObject(new Collectible(450, this.canvas.height - 100, 20, 20, 'green', 'speed', 100));
    this.addGameObject(new Collectible(650, this.canvas.height - 100, 20, 20, 'pink', 'health', 1));
    this.addGameObject(new Collectible(850, this.canvas.height - 100, 20, 20, 'blue', 'jump', 50));
  }

  // Copilot generated
  // Level 3 is a procedurally generated level with random platforms and collectibles
  loadLevel3() {
    this.inLevel = true;
    this.viewingResults = false;

    if (this.currentLevel >= 3) { // The player has continued through procedural levels.
      this.currentLevel++;
      console.log(this.currentLevel);
    } else {
      this.currentLevel = 3;
    }

    // The goal is now merely to collect all collectibles, we set it to something unattainable
    this.goal = 999;

    // Code to load level 3
    this.unloadCurrentLevel();
    this.respawnPlayers();
    
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
    const empty = new gameObject(this.canvas.width / 2 + 50, this.canvas.height / 2)
    this.addGameObject(empty)
    this.camera.target = empty;

    const scores = [];

    for(let i = 0; i < this.players.length; i++) {
      // Adjust player UI positions, store their X positions
      this.playerUIs[i].resultsText();

      // Change players spawn locations
      this.players[i].spawnX = this.playerUIs[i].getX() + 30;

      // Create a platform for players to land on
      this.addGameObject(new Platform(this.playerUIs[i].getX() + 30, this.canvas.height / 2, 200, 20));

      // Store each players' score
      this.players[i].resetPlayerState();

      // Reset the player's spawn location
      scores.push(this.players[i].score);
    }

    // Get the highest score. (Copilot generated)
    const highestScore = Math.max(...scores);

    // You must have gotten at least one point to win
    if (highestScore != 0) {
      for (let player of this.players) {      
        if(player.score === highestScore) {
          player.winner = true;
        } else {
          player.winner = false;
        }
      }
    }

    // Display the results screen for 5 seconds
    setTimeout(() => {
      this.viewingResults = false;

      // The new camera target is the winner
      for (let player of this.players) {
        // Reset spawn locations
        player.spawnX = this.canvas.width / 2 - 25;

        if(player.winner) {
          this.camera.target = player;
        }
      }

      for (let playerUI of this.gameObjects.filter(obj => obj instanceof PlayerUI)) {
        playerUI.gameText();
      }
    }, 5000);
  }

}

// Export the Level class as the default export of this module
export default Level;
