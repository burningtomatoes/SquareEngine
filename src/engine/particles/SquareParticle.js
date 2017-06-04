class SquareParticle extends SquareActor {
    constructor() {
        super();

        this.velocity.x = SquareMath.rand(-5, +5);
        this.velocity.y = SquareMath.rand(-5, +5);
        this.size = 6;
        this.color = '#fff';
    }

    get isComplete() {
        return this.size < 1;
    }

    update(u) {
        if (this.isComplete) {
            return;
        }

        super.update(u);

        this.size = SquareMath.lerp(this.size, 0, 0.1);
    }

    draw(d) {
        if (this.isComplete) {
            // Done, nothing to draw
            return;
        }

        d.context.fillStyle = this.color;
        d.context.fillRect(this.position.x, this.position.y, this.size, this.size);
    }
}