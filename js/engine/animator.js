import Component from './component.js';
import Renderer from './renderer.js';

class Animator2 extends Component {
    constructor(animations, parentEntity) {
        super();
        this.animations = animations;
        this.parentEntity = parentEntity;
        this.currentAnimation = 'idle';
    }

    // Animations with only a condition.
    // Speed is time between frames given in miliseconds
    // playAnimation(name, timeout, condition) {
    //     if (this.enabled) {
    //         if (condition) {
    //             for (let i = 0; i < this.animations[name].length; i++) {
    //                 console.log(i);
    //                 setInterval(() => {
    //                     this.parentEntity.getComponent(Renderer).image = this.animations[name][i];
    //                 }, timeout * i);
    //             }
    //         } else {
    //             console.log("Yo!")
    //             this.parentEntity.getComponent(Renderer).image = this.animations['idle'][0];    
    //         }
    //     }
    // }

    playAnimation(name, timeout, condition) {
        if (this.enabled) {
            const animationFrames = this.animations[this.currentAnimation];
            let frameIndex = 0;

            
            const animateFrame = async () => {
                this.parentEntity.getComponent(Renderer).image = animationFrames[frameIndex];
                frameIndex++;
                if (frameIndex < animationFrames.length) {
                    await this.delay(200);
                }
            };

            animateFrame();
        }
    }

    changeAnimation(name, condition) {
        if (condition) {
            this.currentAnimation = name;
        }
    }

    draw(ctx) {

    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    // Second answer. Using async functions https://stackoverflow.com/questions/3583724/how-do-i-add-a-delay-in-a-javascript-loop
    timer(ms) {
        return new Promise(res => setTimeout(res, ms));
    }

    //this.playAnimation(name, timeout, this.animations[name].length - 1);

    // async playAnimation(name, timeout, i) {
    //     await timer(timeout);
    //     this.parentEntity.getComponent(Renderer).image = this.animations[name][i];                    
    // }

    // // i is the number of frames in the animation
    // playAnimation(name, timeout, i) {
    //     // Timed iterations https://stackoverflow.com/questions/3583724/how-do-i-add-a-delay-in-a-javascript-loop
    //     setTimeout(() => {
    //         // Iterate through calling itself
    //         this.parentEntity.getComponent(Renderer).image = this.animations[name][i];            
    //         if(i--) this.playAnimation(name, i);
    //     }, timeout * i);
    // }

    // playAnimation(name, i) {
    //     this.parentEntity.getComponent(Renderer).image = this.animations[name][i];
    // }

    // update() {
    //     for (let i = 0; i < this.animations[name].length; i++) {
    //         setTimeout(() => {
    //             this.parentEntity.getComponent(Renderer).image = this.animations[name][i];
    //         }, timeout);
    //     }
    // }

    // // Animations which have a float that affect timing
    // playAnimation(name, timeout, condition, value) {
    //     console.log("Yo!")

    // }

}

export default Animator;