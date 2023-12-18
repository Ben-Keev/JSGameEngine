import GameObject from './gameObject.js';
import Collectible from '../game/collectible.js';
import Player from '../game/player.js';
import PlayerUI from '../game/playerUI.js';
import Renderer from './renderer.js';
import Physics from './physics.js';

class GameManager {

  static gameManager = new this();

  // Helps to manage moving players between scenes and handling their interactions.
  constructor() {
    this.players = [];
    this.playerUIs = [];
    this.queue = []; // Queue of players waiting to join
  }

  update(deltaTime) {
    // If the player is not viewing the results screen or in a level, load the next level
    if (!this.game.viewingResults && !this.game.inLevel) {
      this.game.loadLevel(this.game.currentLevel);
    }

    this.onCollectiblesCollected();

    this.onAllPlayersDead();

    // Add players from the queue
    if(this.queue.length > 0) {
      this.addPlayer(this.queue.shift());
    }

    try { // Failsafe in case a player disconnects while this check occurs.
      for(let player of this.players) {
        if( player.lives <=0 && player == this.game.camera.target) { // Checks if the player is dead and is the camera target
          this.refocusCamera();
        }
      }  
    } catch (error) {
      console.log(error);
    }
  }

  onCollectiblesCollected() {
    // Checks if there are any collectibles left in the level. if missing, reload them
    const collectibles = this.game.gameObjects.filter(obj => obj instanceof Collectible);
      if (collectibles.length === 0 && this.game.inLevel) {
        switch (this.game.currentLevel) {
          case 1: // Respawn collectibles so the level is possible for all players
            this.game.generateCollectiblesLevel1();
            break;
          case 2:
            this.game.generateCollectiblesLevel2();
            break;
          default: // If all collectibles collected announce winner and create a new level
            this.game.loadResultsScreen();
            break;
        }
     }
  }

  addPlayer(index, isCameraTarget = false) {
    // If there are no players, the new player will be the camera target
    if (this.players.length === 0) {
      isCameraTarget = true;
    }
    
    // Do not add a player if they already exist or there are too many players
    // Do not add a player if the game is viewing the results screen
    if (this.players.some(player => player.index === index) || this.players.length == 3) { //Copilot generated
      return; // Do nothing
    } else if (this.game.viewingResults || this.game.isPaused) { // Cannot join on result screen or while paused, make player wait.
      this.queue.push(index);
    } else { // Player can join. Add them to the game.
      const player = new Player(this.game.canvas.width / 2 - 25, this.game.canvas.height / 2 - 25, index);
      this.game.addGameObject(player);
  
      const playerUI = new PlayerUI(10 + (index * 300), 10, player);
      this.game.addGameObject(playerUI);

      if (isCameraTarget) {
        this.game.camera.target = player;
      }

      // insert player at index to avoid overwriting players
      this.players.splice(index, 0, player);
      this.playerUIs.splice(index, 0, playerUI);  
    }
  }

  removePlayer(player) {
    // Copilot generated
    // Remove the player and their UI from the game
    this.game.removeGameObject(player);

    const playerUIToRemove = this.playerUIs.find(playerUI => playerUI.player.index === player.index);
    this.game.removeGameObject(playerUIToRemove);

    this.players.splice(player.index, 1);
    this.playerUIs.splice(player.index, 1);

    // Set a new camera target if the disconnected player was the original target
    if (player == this.game.camera.target) {
      this.refocusCamera();
    }
  }

  onAllPlayersDead() {
    // If all players are dead and not on results screen, show the results screen
    // There must be players in the game to check if they are dead
    if (this.players.length > 0) {
      if (this.players.every(player => player.lives <= 0) && !this.game.viewingResults) { // copilot generated
        this.game.loadResultsScreen();
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
    
    // Checks if players are dead. If so, refocus the camera
  refocusCamera() {
    // Copilot Generated
    // Sets camera to the next player. if this exceeds the number of players, set to 0
    this.game.camera.target = this.players.indexOf(this.game.camera.target) + 1 < this.players.length ? this.players[this.players.indexOf(this.game.camera.target) + 1] : 0;
  }

  tallyScores() {
    const scores = [];

    for(let player of this.players) {
      scores.push(player.score);
    }

    return Math.max(...scores);
  }

  setWinners() {        
    // Get the highest score. (Copilot generated)
    const highestScore = this.tallyScores(); 

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
  }
}

export const gameManager = new GameManager();