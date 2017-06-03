/**
 * The stage contains actors and props. It is where our play takes place.
 */
class SquareStage extends SquareObject {
    constructor() {
        super();

        this.actorIdGenerator = 0;
        this.actors = {};
    }

    /**
     * Gets (generates) the next actor ID by incrementing the generator.
     *
     * @returns {number}
     */
    get nextActorId() {
        return this.actorIdGenerator++;
    }

    /**
     * Gets an actor by its stage ID.
     *
     * @param id
     * @returns {SquareActor|null} The actor, or NULL if not found.
     */
    getActorById(id) {
        if (typeof this.actors[id] !== 'undefined') {
            return this.actors[id];
        }

        return null;
    }

    /**
     * Adds an actor to the stage.
     * An ID will be generated and attached to the object.
     *
     * @param {SquareActor} actor
     */
    addActor(actor) {
        actor.id = this.nextActorId;
        this.actors[actor.id] = actor;

        SquareDiagnostics.logDebug('Stage: Added an actor to stage, ID #' + actor.id + ':', actor);
    }

    /**
     * Updates the stage and all of its actors and props.
     *
     * @param {SquareUpdateContext} updateContext
     */
    update(updateContext) {
        for (let id in this.actors) {
            let actor = this.actors[id];
            actor.update(updateContext);
        }
    }

    /**
     * Draws the stage and all of its actors and props.
     *
     * @param {SquareDrawContext} drawContext
     */
    draw(drawContext) {
        // Draw each actor on the stage, but by their self-defined Z order
        // The lowest Z layer number is drawn first, the higher the Z value the later it is drawn
        let zLayerThis = 0;
        let zLayerNext = null;
        let zLayerNextItems = [];
        let anythingLeftToDraw = true;

        // Fill next items with actors list
        zLayerNextItems = Object.values(this.actors).slice();

        if (zLayerNextItems.length > 0) {
            anythingLeftToDraw = true;
        }

        // Begin Z draw, layer by layer. Draw everything on our current Z layer, and index everything above it.
        while (anythingLeftToDraw) {
            let newNextItems = [];

            for (let i = 0; i < zLayerNextItems.length; i++) {
                let actor = zLayerNextItems[i];

                if (actor.zLayer <= zLayerThis) {
                    // Item Z is on our layer, draw it
                    actor.draw(drawContext);
                } else {
                    // Item Z is above our layer, retain it for a subsequent draw
                    zLayerNextItems.push(actor);

                    if (zLayerNext === null || actor.zLayer < zLayerNext) {
                        // First higher Z detected, or lowest "next" Z we can see
                        zLayerNext = actor.zLayer;
                    }
                }
            }

            // Prepare for next layer draw
            if (zLayerNext !== null) {
                zLayerNextItems = newNextItems;
                zLayerThis = zLayerNext;
                zLayerNext = null;

                anythingLeftToDraw = true;
            } else {
                anythingLeftToDraw = false;
            }
        }
    }
}