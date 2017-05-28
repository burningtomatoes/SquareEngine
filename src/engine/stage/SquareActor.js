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
    }
}