class GuyActor extends SquareActor {
    constructor() {
        super();
    }

    draw (context) {
        context.context.fillStyle = '#fff';
        context.context.fillRect(128, 128, 32, 32);
    }
}