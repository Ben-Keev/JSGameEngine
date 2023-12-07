import GameObject from '../engine/gameobject.js';
import Physics from '../engine/physics.js';

class Entity extends GameObject {
    constructor(x, y, renderer, physics) {
        super(x, y);

        this.addComponent(physics);
        this.addComponent(renderer);
    }

    update(deltaTime) {
        this.onCollisionEnter(this.getComponent(Physics).getCollidingObject());
        super.update(deltaTime);
    }

    onCollisionEnter(objectType) {
        
    }
}

export default Entity;
