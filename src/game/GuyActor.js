class GuyActor extends SquareActor {
    constructor() {
        super();

        this.position.y = 128;
        this.position.x = 128;

        this.velocity.x = .5;
        this.velocity.y = .1;
    }

    update(u) {
        super.update(u);

        this.velocity.y += 0.001;
        this.velocity.x -= 0.001;
    }

    draw(d) {
        super.draw(d);

        d.context.fillStyle = '#fff';
        d.context.fillRect(this.drawPosition.x, this.drawPosition.y, 32, 32);
    }
}