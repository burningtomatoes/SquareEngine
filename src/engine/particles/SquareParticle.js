class SquareParticle extends SquareActor {
    constructor() {
        super();

        this.size = 6;
        this.color = '#fff';
        this.velocityMin = -5;
        this.velocityMax = +5;
        this.velocityContinuous = false;

        this.persist = false;
        this.stopped = false;
        this.didStart = false;
    }

    get isComplete() {
        return this.size < 1 || this.stopped;
    }

    update(u) {
        if (!this.didStart) {
            this.velocity.x = SquareMath.rand(this.velocityMin, this.velocityMax);
            this.velocity.y = SquareMath.rand(this.velocityMin, this.velocityMax);
            this.didStart = true;
        }

        if (this.velocityContinuous) {
            this.velocity.x = SquareMath.lerp(this.velocity.x, SquareMath.rand(this.velocityMin, this.velocityMax), .5);
            this.velocity.y = SquareMath.lerp(this.velocity.y, SquareMath.rand(this.velocityMin, this.velocityMax), .5);
        }

        if (this.isComplete) {
            return;
        }

        super.update(u);

        if (!this.persist) {
            // If not persistent, decrease in size until dead
            this.size = SquareMath.lerp(this.size, 0, 0.1);
        } else {
            // Otherwise, we'll slow down until stopped
            this.velocity.x = SquareMath.lerp(this.velocity.x, 0, .05);
            this.velocity.y = SquareMath.lerp(this.velocity.y, 0, .05);

            if (Math.abs(this.velocity.x) < .5 && Math.abs(this.velocity.y) < .5) {
                this.stopped = true;
            }
        }
    }

    draw(d) {
        if (this.size <= 0) {
            // Do not attempt to draw invisible particles
            return;
        }

        d.context.fillStyle = this.color;
        d.context.fillRect(this.position.x, this.position.y, this.size, this.size);
    }
}