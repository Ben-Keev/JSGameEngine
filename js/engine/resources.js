// Create an Images object to hold the Image instances for the player and the enemy.
const Images = {
  player: new Image(), // The Image instance for the player.
  enemy: new Image(), // The Image instance for the enemy.
};

const Animations = {
  player: {
    walk: [new Image(), new Image(), new Image()],
    jump: [new Image()],
    idle: [new Image()]
  },

  enemy: {
    walk: [new Image(), new Image()],
  }
}

// Set the source of animations
// Copilot generated
// Iterates through every animation in Animations.player
for (let key in Animations.player) {
  if (Animations.player.hasOwnProperty(key)) {
    for (let i = 0; i < Animations.player[key].length; i++) {
      // Copilot generated
      Animations.player[key][i].src = `./resources/images/player/${key}-${i+1}.png`;
    }
  }
}

// Set the source of the player image.
Images.player.src = './resources/images/player/player.png'; // Update the image path

// Set the source of the enemy image.
Images.enemy.src = './resources/images/enemy/enemy.png'; // Update the image path

// Create an AudioFiles object to hold the file paths of the audio resources.
const AudioFiles = {
  jump: new Audio('./resources/audio/jump.mp3'), // The file path of the jump sound.
  collect: new Audio('./resources/audio/collect.mp3'), // The file path of the collect sound.
};

// Export the Images and AudioFiles objects so they can be imported and used in other modules.
export { Images, AudioFiles, Animations };