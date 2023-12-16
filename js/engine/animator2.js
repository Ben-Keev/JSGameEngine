import Component from './component.js';
import Renderer from './renderer.js'; 

class Animator extends Component {
  constructor(entity, frames) {
    super();
    this.entity = entity;
    this.frames = frames;
    this.currentFrameIndex = 0;
  }

  async playAnimation() {
    while (true) {
      const frame = this.frames[this.currentFrameIndex];

      console.log(frame)
      this.entity.getComponent(Renderer).image = frame;

      this.currentFrameIndex = (this.currentFrameIndex + 1) % this.frames.length;

      await this.delay(3000); // Adjust the delay time between frames as needed
    }
  }

  draw(ctx) {

  }
  

  update(deltaTime) {

  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default Animator;