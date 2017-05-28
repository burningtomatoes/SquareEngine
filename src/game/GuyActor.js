class GuyActor extends SquareActor {
    constructor() {
        super();

        this.velocity.x = .25;
    }

    draw(d) {
        d.context.fillStyle = '#fff';
        d.context.fillRect(this.drawPosition.x, this.drawPosition.y, 32, 32);
    }
}