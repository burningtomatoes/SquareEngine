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

        /**
         * @type {SquareCollider|null}
         */
        this.collider = null;
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
        // Nothing yet, but we may do some time for debug purposes
        // Keeping it here to hint to all SquareActor implementors to super call us
    }

    hasCollider() {
        return this.collider !== null;
    }

    givesCollision() {
        return this.collider && this.collider.givesCollision;
    }

    receivesCollision() {
        return this.collider && this.collider.receivesCollision;
    }
}