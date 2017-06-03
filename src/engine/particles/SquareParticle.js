class SquareParticle extends SquareActor {
    constructor() {
        super();

        this.velocity.x = SquareMath.rand(-5, +5);
        this.velocity.y = SquareMath.rand(-5, +5);
        this.size = 14;
    }

    update(u) {
        super.update(u);

        this.size = SquareMath.lerp(this.size, 0, 0.1);
    }

    draw(d) {
        d.context.fillStyle = '#fff';
        d.context.fillRect(this.position.x, this.position.y, this.size, this.size);
    }
}