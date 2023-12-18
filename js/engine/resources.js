const Images = { // Ready for animations at anytime, given an working Animation class
  player0: {
    idle: [new Image()]
  },

  player1: {
    idle: [new Image()]
  },

  player2: {
    idle: [new Image()]
  },

  enemy: {
    idle: [new Image()],
  }
}

// Set the source of Images
// Copilot generated
// Iterates through every image in Images.player
// Ready for easy inclusion of animation frames
for (let key in Images) {
  if (Images.hasOwnProperty(key)) {
    for (let subKey in Images[key]) {
      if (Images[key].hasOwnProperty(subKey)) {
        for (let i = 0; i < Images[key][subKey].length; i++) {
          // Copilot generated
          Images[key][subKey][i].src = `./resources/images/${key}/${subKey}-${i+1}.png`;
        }
      }
    }
  }
}

// Create an AudioFiles object to hold the file paths of the audio resources.
const AudioFiles = {
  jump: new Audio('./resources/audio/jump.mp3'), // The file path of the jump sound.
};

// Export the Images and AudioFiles objects so they can be imported and used in other modules.
export { Images, AudioFiles};