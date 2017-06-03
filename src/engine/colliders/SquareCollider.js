/**
 * Base class for all SquareEngine colliders.
 * Its default implementation represents a simple square-based collider.
 */
class SquareCollider extends SquareObject {
    constructor(posX, posY, width, height, receivesCollision, givesCollision) {
        super();

        if (!posX) posX = 0;
        if (!posY) posY = 0;
        if (!width) width = 32;
        if (!height) height = 32;

        this.position = new SquareEngine(posX, posY);
        this.size = new SquareCoordinate(width, height);
        this.receivesCollision = !!receivesCollision;
        this.givesCollision = !!givesCollision;
        this.rect = new SquareRect();
    }

    /**
     * Configures this collider to attach to an actor.
     *
     * @param {SquareActor} actor
     */
    attachTo(actor) {
        this._actorTarget = actor;
    }

    /**
     * Configurs this collider to detach from any actors.
     */
    detatch() {
        this._actorTarget = null;
    }

    draw(d) {
        // Colliders can be drawn for debug purposes or just for fun
        if (this.givesCollision) {
            d.context.strokeStyle = '#07ff00';
            d.context.strokeRect(this.position.x, this.position.y, this.size.x, this.size.y);
        }

        if (this.receivesCollision) {
            d.context.strokeStyle = '#0007ff';
            d.context.strokeRect(this.position.x + 1, this.position.y + 1, this.size.x - 2, this.size.y - 2);
        }

        if (this.colliding) {
            if (this.collidingFlash) {
                d.context.strokeStyle = '#ff0000';
                d.context.strokeRect(this.position.x, this.position.y, this.size.x, this.size.y);
                this.collidingFlash = false;
            } else {
                this.collidingFlash = true;
            }
        }
    }

    update(u) {
        if (!this.givesCollision && !this.receivesCollision) {
            // Give up on life as we have no purpose
            return;
        }

        // Follow actor
        if (this._actorTarget) {
            this.position = this._actorTarget.position;
        }

        // Update basic rect shape
        this.rect.x = this.position.x;
        this.rect.y = this.position.y;
        this.rect.w = this.size.x;
        this.rect.h = this.size.y;

        // If we receive collision, check for collision state
        this.colliding = false;
        this.collidingWith = [];

        if (this.receivesCollision) {
            let collidables = SquareEngine.stage.getCollidables();

            for (let i = 0; i < collidables.length; i++) {
                let counterActor = collidables[i];
                let counterCollider = counterActor.collider;

                if (counterCollider === this) {
                    // Cannot collide with ourselves
                    continue;
                }

                if (counterCollider.collidesWith(this)) {
                    this.colliding = true;
                    this.collidingWith.push(counterActor);

                    let fastestActorX;
                    let fastestActorY;
                    let slowestActorX;
                    let slowestActorY;

                    if (Math.abs(counterActor.velocity.x) > Math.abs(this._actorTarget.velocity.x)) {
                        fastestActorX = counterActor;
                        slowestActorX = this._actorTarget;
                    } else {
                        fastestActorX = this._actorTarget;
                        slowestActorX = counterActor;
                    }

                    if (Math.abs(counterActor.velocity.y) > Math.abs(this._actorTarget.velocity.y)) {
                        fastestActorY = counterActor;
                        slowestActorY = this._actorTarget;
                    } else {
                        fastestActorY = this._actorTarget;
                        slowestActorY = counterActor;
                    }

                    slowestActorX.velocity.x = fastestActorX.velocity.x;
                    fastestActorX.velocity.x = (-fastestActorX.velocity.x / 2);

                    slowestActorY.velocity.y = fastestActorX.velocity.y;
                    fastestActorY.velocity.y = (-fastestActorY.velocity.y / 2);
                }
            }
        }
    }

    /**
     * Compares this collider to another, to see if a collision occurs.
     *
     * @param {SquareCollider} collider
     * @return {boolean} Returns TRUE if in a collision state, or FALSE otherwise.
     */
    collidesWith(collider) {
        return collider.rect.intersects(this.rect);
    }
}