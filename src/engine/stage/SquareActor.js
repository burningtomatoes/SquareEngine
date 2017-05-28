/**
 * An actor can be anything that lives and acts on the game stage.
 * It can be a character, an object, or anything else.
 */
class SquareActor extends SquareObject {
    /**
     * Constructs a new actor.
     */
    constructor() {
        super();

        this.id = null;
        this.zLayer = 0;

        this.position = new SquareCoordinate(0, 0);
        this.drawPosition = new SquareCoordinate(0, 0);
        this.velocity = new SquareCoordinate(0, 0);
    }

    /**
     * Updates the actor.
     *
     * @param {SquareUpdateContext} u
     */
    update(u) {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.drawPosition.x = Math.round(this.position.x);
        this.drawPosition.y = Math.round(this.position.y);
    }

    /**
     * Draws the actor.
     *
     * @param {SquareDrawContext} d
     */
    draw(d) {

    }
}