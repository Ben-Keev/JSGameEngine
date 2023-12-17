import { AudioFiles } from './resources.js';
import GameObject from './gameObject.js';

class AudioManager extends GameObject {
  // Classic Singleton https://itnext.io/7-ways-to-create-singleton-in-javascript-db95a75fbb76
  static audioManager = new this();
  
  playAudio(key) {
    AudioFiles[key].play();
  }

  stopAudio(key) {
    AudioFiles[key].pause();
  }
}

export const gameManager = new AudioManager();