import GameObject from '../engine/gameobject.js';
import UI from '../engine/ui.js';
import Player from './player.js';

// The PlayerUI class extends GameObject.
class PlayerUI extends GameObject {
  constructor(x, y, player) {
    super(x, y); // Call the constructor of the GameObject class.

    this.player = player; // Store a reference to the player object.

    // Offsets for when text must be centered
    this.offsetX = window.innerWidth / 2 - 450;
    this.offsetY = window.innerHeight / 2 - 250;
    
    // Create a new UI component with initial text and add it to this object's components.
    this.ScoreUI = new UI('Lives: 3 Score: 0', x, y);
    this.WinnerUI = new UI('Player ' + (this.player.index + 1) + ' Wins!', x, y - 50)

    this.addComponent(this.ScoreUI);

    this.WinnerUI.enabled = false;
    this.addComponent(this.WinnerUI);
  }

  // The update method is called every frame.
  update(deltaTime) {
    // Update the text of the UI component to reflect the player's current lives and score.
    this.ScoreUI.setText(`Lives: ${this.player.lives} Score: ${this.player.score}`);
    this.WinnerUI.enabled = this.player.winner; // Winner text shows up if the player is a winner.
  }

  getX() {
    return this.ScoreUI.x;
  }

  // Centers the UI's position for result screen
  resultsText() {
    this.ScoreUI.x += this.offsetX;
    this.ScoreUI.y += this.offsetY;
    this.WinnerUI.x += this.offsetX;
    this.WinnerUI.y += this.offsetY;
  }

  // Resets the UI's position for game screen
  gameText() {
    this.ScoreUI.x -= this.offsetX;
    this.ScoreUI.y -= this.offsetY;
    this.WinnerUI.x -= this.offsetX;
    this.WinnerUI.y -= this.offsetY;
  }
}

export default PlayerUI; // Export the PlayerUI class for use in other modules.