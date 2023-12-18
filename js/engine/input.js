// This class depends on the Component, which is a separate module and needs to be imported.
import Component from './component.js';

// The Input class is responsible for handling keyboard and gamepad input.
class Input extends Component {
  // The constructor initializes a new instance of the Input class.
  constructor(index) {
    // Call the constructor of the parent class (Component).
    super();

    this.index = index;

    // An object to store the state of each key. The keys are the keyboard key codes, and the values are boolean indicating whether the key is down.
    this.keys = {};
    // The index of the gamepad that this input component is listening to.

    // Add event listeners for the keydown and keyup events.
    // When a keydown event is fired, the corresponding key in the keys object is set to true.
    // When a keyup event is fired, the corresponding key in the keys object is set to false.
    document.addEventListener('keydown', (event) => (this.keys[event.code] = true));
    document.addEventListener('keyup', (event) => (this.keys[event.code] = false));
  }

  // Takes a String
  isKeyDown(key) {
    if (this.enabled) {
      // If the key is in the keys object and its value is true, return true. Otherwise, return false.
      return this.keys[key] || false;
    }
  }

  // This method returns the current state of the gamepad this input component is listening to, or null if there is no such gamepad.
  getGamepad() {
    try { // succeeds if there's a gamepad at an index
      // Get the list of all gamepads...
      const gamepads = navigator.getGamepads();
      // And return the gamepad at the stored index.
      return gamepads[this.index];
    } catch { // if not, return null
      return null;
    }
  }

  // This method checks if a particular button on the gamepad is down.
  // Must take a string too..
  isGamepadButtonDown(buttonIndex) {
    if (this.enabled) {
      // Get the current state of the gamepad.
      const gamepad = this.getGamepad();
      // If a gamepad is available and the button at the given index is pressed, return true. Otherwise, return false.
      if (gamepad && gamepad.buttons[buttonIndex]) {
        return gamepad.buttons[buttonIndex].pressed;
      }
      return false;
    }  
  }

}

// The Input class is then exported as the default export of this module.
export default Input;