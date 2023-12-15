import Input from './input.js';
import Action from './action.js';

// Determines if any inputs match actions inputted.
class ActionHandler extends Input {
    constructor() {
        super();
        this.actions = [];
    }

    addAction(action) {
        this.actions.push(action);
    }

    // Copilot Generated
    isActionDown(actionName) {
        if (this.enabled) {
            // Finds the action with a name that equals the actionName parameter.
            const action = this.actions.find((action) => action.name === actionName);
    
            // If an action was found, check if it is down.
            if (action) {
                // Checks if the buttonBinding matches on gamepad
                if (this.isGamepadButtonDown(action.buttonBinding)) {
                    return true;
                }
    
                if (!this.getGamepad()) { // Keyboard is disabled while gamepad connected
                    // Checks if the keyBinding matches on keyboard
                    if (this.isKeyDown(action.keyBinding)) {
                        return true;
                    }
                }
            }
        }

        // If component disabled, no action was found, or bindings do not match, return false.
        return false;
    }

    // Copilot Generated
    // Returns an object giving x and y axes for movement.
    getMovementAxes() {
        if (this.enabled) {
            // Get the current state of the gamepad.
            const gamepad = this.getGamepad();
    
            // If a gamepad is available, return the axes. This means gamepad movement will override keyboard movement.
            if (gamepad) {
                return {
                    x: gamepad.axes[0],
                    y: gamepad.axes[1]
                };
            }
    
            // If no gamepad is available, return the keyboard axes.
            return {
                x: this.isKeyDown('ArrowRight') - this.isKeyDown('ArrowLeft'),
                y: this.isKeyDown('ArrowUp') - this.isKeyDown('ArrowDown')
            };
        }

        return {
            x: 0,
            y: 0
        };
    }
}

export default ActionHandler;
