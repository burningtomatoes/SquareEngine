class SquareCamera {
    constructor() {
        this.x = 0;
        this.y = 0;

        this._renderX = 0;
        this._renderY = 0;

        this._rumbleOn = false;
        this._rumbleOffset = 0;
        this._rumbleDuration = 0;
        this._rumbleIntensity = 1;

        this.speed = 0.1;
    }

    translateX(x) {
        return Math.round(x + this._renderX + this._rumbleOffset);
    }

    translateY(y) {
        return Math.round(y + this._renderY + this._rumbleOffset);
    }

    translateCoord(sqCoord) {
        sqCoord.x = this.translateX(sqCoord.x);
        sqCoord.y = this.translateY(sqCoord.y);
    }

    translateContext(context2d) {
        context2d.translate(+this.translateX(0), +this.translateY(0));
    }

    untranslateContext(context2d) {
        context2d.translate(-this.translateX(0), -this.translateY(0));
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Attaches the camera to an actor, causing that actor's position to be tracked.
     *
     * @param {SquareActor} actor
     */
    attachTo(actor) {
        this._actorAttachment = actor;
    }

    /**
     * Detaches the camera from any actors.
     */
    detach() {
        this._actorAttachment = null;
    }

    rumble(duration, intensity) {
        this._rumbleOn = true;
        this._rumbleOffset = 0;
        this._rumbleDuration = duration;
        this._rumbleIntensity = intensity;
    }

    update(u) {
        this._updateRumble(u);
        this._updateFollow(u);
        this._updatePosition(u);
    }

    _updateRumble(u) {
        if (this._rumbleOn) {
            this._rumbleDuration--;

            this._rumbleOffset = SquareMath.rand(-this._rumbleIntensity, +this._rumbleIntensity);

            if (this._rumbleDuration <= 0) {
                this._rumbleOn = false;
                this._rumbleOffset = 0;
            }
        }
    }

    _updateFollow(u) {
        if (this._actorAttachment) {
            this.x = (u.resolution.x / 2) - this._actorAttachment.position.x - 16;
            this.y = (u.resolution.y / 2) - this._actorAttachment.position.y - 16;
        }
    }

    _updatePosition(u) {
        this._renderX = SquareMath.lerp(this._renderX, this.x, this.speed);
        this._renderY = SquareMath.lerp(this._renderY, this.y, this.speed);
    }
};class SquareCoordinate {
    constructor(x, y) {
        if (!x) x = 0;
        if (!y) y = 0;

        this.x = x;
        this.y = y;
    }

    clone() {
        return new SquareCoordinate(this.x, this.y);
    }
};const SEVERITY_DEBUG = -1;
const SEVERITY_INFO = 0;
const SEVERITY_WARNING = 1;
const SEVERITY_ERROR = 2;

class SquareDiagnostics {
    static enableDebug() {
        this._debugEnabled = true;
    }

    static disableDebug() {
        this._debugEnabled = false;
    }

    static get debugEnabled() {
        return this._debugEnabled;
    }

    static frameEnd() {
        if (!this.debugEnabled) {
            return;
        }

        let now = Date.now();

        if (!this.fpsTime) {
            this.frameCounter = 0;
            this.fpsResult = 0;
            this.fpsSkippedResult = 0;
            this.fpsDroppedResult = 0;
            this.fpsTime = now;
        }

        this.frameCounter++;

        this._afterFrame();
    }

    static frameSkipped() {
        if (!this.debugEnabled) {
            return;
        }

        if (!this.framesSkipped) {
            this.framesSkipped = 0;
        }

        this.framesSkipped++;
        this._afterFrame();
    }

    static _afterFrame() {
        let now = Date.now();

        if ((now - this.fpsTime) >= 1000) {
            this.fpsResult = this.frameCounter;
            this.fpsSkippedResult = this.framesSkipped;
            this.fpsDroppedResult = SquareMath.clamp(SquareEngine.frameRateTarget - this.fpsResult, 0, SquareEngine.frameRateTarget);

            this.frameCounter = 0;
            this.framesSkipped = 0;

            this.fpsTime = now;

            this.logDebug('FPS result:', this.fpsResult);
        }
    }

    static logDebug(message, extra) {
        this.logMessage(message, extra, SEVERITY_DEBUG);
    }

    static logWarning(message, extra) {
        this.logMessage(message, extra, SEVERITY_WARNING);
    }

    static logError(message, extra) {
        this.logMessage(message, extra, SEVERITY_ERROR);
    }

    static logException(exception) {
        this.logMessage(exception, null, SEVERITY_ERROR);
        // TODO Throw to external system e.g. Sentry
    }

    static logMessage(message, extra, severity) {
        if (severity === SEVERITY_DEBUG && !this.debugEnabled) {
            return;
        }

        if (!extra) {
            extra = '';
        }

        let fnLog = console.log;

        switch (severity) {
            case SEVERITY_DEBUG:
                fnLog = console.log;
                break;
            case SEVERITY_INFO:
                fnLog = console.info;
                break;
            case SEVERITY_WARNING:
                fnLog = console.warn;
                break;
            case SEVERITY_ERROR:
                fnLog = console.error;
                break;
        }

        let dateNow = new Date();
        let timestampStr = dateNow.toLocaleTimeString();

        fnLog("[" + timestampStr + "] " + message, extra);
    }
};class SquareDrawContext {
    constructor() {
        this.context = SquareEngine.context;
        this.canvas = SquareEngine.canvas;
        this.resolution = SquareEngine.resolution;
    }
};/**
 * The static Square engine class that hosts components and powers the main game loop.
 */
class SquareEngine {
    /**
     * Starts the engine.
     *
     * @param id The ID of the canvas element the engine is binding to.
     */
    static start(id) {
        SquareDiagnostics.logMessage('Starting SquareEngine. Hello world!');

        // Bind the static engine instance to the canvas
        this.canvas = document.getElementById(id);

        if (!this.canvas) {
            SquareDiagnostics.logError('Engine start failed: Canvas element not found on page', id);
            return;
        }

        // Configure the canvas to fill up all available space on page
        this.$canvas = $(this.canvas);

        this.$canvas
            .css('display', 'block')
            .css('position', 'absolute')
            .css('top', '0')
            .css('left', '0')
            .css('right', '0')
            .css('bottom', '0')
            .css('width', '100%')
            .css('height', '100%')
            .show();

        // Set up 2d drawing context
        this.canvas.fillStyle = "#00f";
        this.context = this.canvas.getContext('2d');

        // Bind resolution change data
        this.resolution = new SquareCoordinate(0, 0);

        $(window).resize(function () {
            SquareEngine.updateResolution();
        });

        SquareEngine.updateResolution();

        // Initialize game camera
        this.camera = new SquareCamera();

        // Prepare game loop context data
        this.drawContext = new SquareDrawContext();
        this.updateContext = new SquareUpdateContext();

        if (!this.uiComponents) {
            this.uiComponents = [];
        }

        if (!this._frameRateTarget) {
            this.setFrameRateTarget(30);
        }

        // Initialize core components
        this.stage = new SquareStage();
        this.keyboard = new SquareKeyboard();

        // Start the game loop
        SquareEngine.loop();
    }

    static setFrameRateTarget(fpsTarget) {
        this._frameRateTarget = fpsTarget;
        this._frameInterval = 1000 / this._frameRateTarget;
        this._frameStartTime = 0;
    }

    static get frameRateTarget() {
        return this._frameRateTarget;
    }

    /**
     * Performs the main game loop.
     */
    static loop() {
        requestAnimationFrame(SquareEngine.loop);

        let now = Date.now();
        let delta = now - SquareEngine._frameStartTime;

        if (delta >= SquareEngine._frameInterval) {
            SquareEngine.updateContext.delta = (delta - SquareEngine.updateContext.delta);
            SquareEngine.updateContext.deltaTotal = delta;

            SquareEngine._frameStartTime = now - (delta % SquareEngine._frameInterval);

            SquareEngine.update(SquareEngine.updateContext);
            SquareEngine.draw(SquareEngine.drawContext);

            SquareDiagnostics.frameEnd();

            SquareEngine.updateContext.delta = 0;
        } else {
            SquareDiagnostics.frameSkipped();

            SquareEngine.updateContext.delta = delta;
            SquareEngine.updateContext.deltaTotal = delta;
        }
    }

    /**
     * Game loop main update method.
     *
     * @param {SquareUpdateContext} u
     */
    static update(u) {
        // Update camera
        this.camera.update(u);

        // Update the stage, which is where the game lives
        this.stage.update(u);

        // Update UI components
        for (let i = 0; i < this.uiComponents.length; i++) {
            this.uiComponents[i].update(u);
        }

        // Update input (NB: do this last so "now" and "then" state info is correct for the next frame)
        this.keyboard.update(u);
    }

    /**
     * Game loop main draw method.
     *
     * @param {SquareDrawContext} d
     */
    static draw(d) {
        // Clear the frame
        d.context.clearRect(0, 0, d.resolution.x, d.resolution.y);

        // Apply camera translation, draw the game stage, and undo the translation
        this.camera.translateContext(d.context);
        this.stage.draw(d);
        this.camera.untranslateContext(d.context);

        // Draw UI components
        for (let i = 0; i < this.uiComponents.length; i++) {
            this.uiComponents[i].draw(d);
        }
    }

    /**
     * Syncs the render resolution to the on-page resolution of the canvas element.
     * Should be called whenever the <canvas> element is resized on page (e.g. window resize).
     */
    static updateResolution() {
        // Use jQuery to calculate canvas size in the DOM (all available space)
        this.resolution.x = this.$canvas.outerWidth();
        this.resolution.y = this.$canvas.outerHeight();

        // Sync that info the the actual <canvas> element so it knows what rez to render at
        // We blindly match the scaled CSS size of the element
        this.canvas.width = this.resolution.x;
        this.canvas.height = this.resolution.y;

        SquareDiagnostics.logMessage('Canvas resolution set to:', this.resolution);
    }

    /**
     * @param {SquareUiComponent} uiComponent
     */
    static addUiComponent(uiComponent) {
        if (!uiComponent instanceof SquareUiComponent) {
            console.warn('addUiComponent() failed: Variable is not an instance of SquareUiComponent class');
            return;
        }

        if (!this.uiComponents) {
            this.uiComponents = [];
        }

        this.uiComponents.push(uiComponent);
    }
};class SquareMath {
    static clamp(value, min, max) {
        if (value < min) {
            return min;
        }
        else if (value > max) {
            return max;
        }

        return value;
    }

    static lerp(value1, value2, amount) {
        amount = amount < 0 ? 0 : amount;
        amount = amount > 1 ? 1 : amount;
        return value1 + (value2 - value1) * amount;
    }

    static rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
;class SquareObject {
    /**
     * Updates the object.
     */
    update(context) {

    }

    /**
     * Draws the object.
     *
     * @param {SquareDrawContext} context
     */
    draw(context) {

    }
};/**
 * A simple rectangle.
 * Can be compared to other rectangles for collision.
 */
class SquareRect {
    constructor(x, y, w, h) {
        if (!x) x = 0;
        if (!y) y = 0;
        if (!w) w = 0;
        if (!h) h = 0;

        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    get left() {
        return this.x;
    }

    get right() {
        return this.x + this.w;
    }

    get top() {
        return this.y;
    }

    get bottom() {
        return this.y + this.h;
    }

    intersects(r2) {
        let r1 = this;

        return !(r2.left > r1.right ||
        r2.right < r1.left ||
        r2.top > r1.bottom ||
        r2.bottom < r1.top);
    }
};class SquareUiComponent extends SquareObject {
    constructor() {
        super();
    }
};class SquareUpdateContext {
    constructor() {
        this.resolution = SquareEngine.resolution;
        this.delta = 0;
        this.deltaTotal = 0;
    }
};/**
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
     * Quickly apply a simple particle effect on this actor (ex. blood splatter on impact, etc).
     *
     * A new particle emitter will be added to the stage, and it will be attached to this actor.
     * After the emitter is done, it will be destroyed automatically.
     *
     * @param {number} runtime The amount of frames this emitter should run for.
     */
    emitParticles(runtime) {
        let emitter = new SquareParticleEmitter();
        emitter.position = this.position.clone();
        emitter.emitterRemoveOnStop = true;
        emitter.emitterRuntime = runtime;
        SquareEngine.stage.addActor(emitter);
        emitter.start();
    }

    /**
     * Attempt to remove the actor from the stage.
     */
    remove() {
        if (this.id) {
            SquareEngine.stage.removeActorById(this.id);
        }
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
};/**
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
     * Attempts to remove an actor by its stage ID.
     *
     * @param id
     */
    removeActorById(id) {
        if (typeof this.actors[id] !== 'undefined') {
            this.actors[id].id = null;
            delete this.actors[id];
        }
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
     * Gets a list of actors that may be collided with on the stage.
     * Eligible actors must have a collider attached that is configured to provide collision.
     *
     * @returns {Array}
     */
    getCollidables() {
        let list = [];

        for (let id in this.actors) {
            let actor = this.actors[id];

            if (actor.givesCollision()) {
                list.push(actor);
            }
        }

        return list;
    }

    /**
     * Updates the stage and all of its actors and props.
     *
     * @param {SquareUpdateContext} u
     */
    update(u) {
        for (let id in this.actors) {
            let actor = this.actors[id];
            actor.update(u);
        }
    }

    /**
     * Draws the stage and all of its actors and props.
     *
     * @param {SquareDrawContext} d
     */
    draw(d) {
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
                    actor.draw(d);

                    if (actor.hasCollider() && SquareDiagnostics.debugEnabled) {
                        actor.collider.draw(d);
                    }
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
};/**
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
        let wasColliding = this.colliding;

        this.colliding = false;
        this.didCollide = false;
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

                    if (!wasColliding) {
                        this.didCollide = true;
                    }

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
};class SquareFrameInfoUiComponent extends SquareUiComponent {
    constructor() {
        super();

        this.delta = 0;
    }

    update(u) {
        this.delta = u.delta.toFixed(0);

        this.text = u.resolution.x + "x" + u.resolution.y + " / " + SquareDiagnostics.fpsResult
            + " FPS / " + this.delta + " ms";

        if (SquareDiagnostics.fpsSkippedResult > 0) {
            this.text += " / Fast, skipped " + SquareDiagnostics.fpsSkippedResult + " frames";
        }

        if (SquareDiagnostics.fpsDroppedResult > 0) {
            this.text += " / Slow, dropped " + SquareDiagnostics.fpsDroppedResult + " frames";
        }
    }

    draw(d) {
        d.context.fillStyle = "#270027";
        d.context.fillText(this.text, 26, 26);
        d.context.fillText(this.text, 24, 24);
        d.context.fillStyle = "#f0f";
        d.context.fillText(this.text, 25, 25);
    }
};class SquareKeyboard extends SquareObject {
    constructor() {
        super();

        this.keysDownNow = [];

        // Set all keys (or roughly the range of key codes to expect) to "up" state when we start
        for (let i = 0; i < 255; i++) {
            this.keysDownNow[i] = false;
        }

        this.keysDownLast = this.keysDownNow.slice();

        this.bindWindowEvents();
    }

    bindWindowEvents() {
        // Unfortunately, there seems to be no way in JavaScript to get keyboard state info without listening to
        // events on the window. This is a poor solution, but we have no other options.

        window.addEventListener("keydown", function (e) {
            // Key was pressed
            this.keysDownNow[e.keyCode] = true;
        }.bind(this));

        window.addEventListener("keyup", function (e) {
            // Key was released
            this.keysDownNow[e.keyCode] = false;
        }.bind(this));
    }

    update(u) {
        // Update is called AFTER the rest of the frame finished updating, meaning "now" becomes "then" for next frame
        this.keysDownLast = this.keysDownNow.slice();
    }

    /**
     * Gets whether a key is currently in the down (pressed) state.
     *
     * @param keyCode
     * @returns {boolean}
     */
    keyIsPressed(keyCode) {
        return !!this.keysDownNow[keyCode];
    }

    /**
     * Gets whether a key is currently in the up (released) state.
     *
     * @param keyCode
     * @returns {boolean}
     */
    keyIsUp(keyCode) {
        return !this.keysDownNow[keyCode];
    }

    /**
     * Gets whether a key was in the down (pressed) state in the previous frame.
     *
     * @param keyCode
     * @returns {boolean}
     */
    keyWasPressedBefore(keyCode) {
        return !!this.keysDownLast[keyCode];
    }

    /**
     * Gets whether a key was in the up (released) state in the previous frame.
     *
     * @param keyCode
     * @returns {boolean}
     */
    keyWasUpBefore(keyCode) {
        return !this.keysDownLast[keyCode];
    }

    /**
     * Gets whether a key has just now been pressed down; it is down now but was up in the last frame.
     *
     * @param keyCode
     * @returns {boolean}
     */
    keyWasPressedNow(keyCode) {
        return this.keyIsPressed(keyCode) && !this.keyWasPressedBefore(keyCode);
    }

    /**
     * Gets whether a key has just now been released up; it is up now but was down in the last frame.
     *
     * @param keyCode
     * @returns {boolean}
     */
    keyWasReleasedNow(keyCode) {
        return this.keyIsUp(keyCode) && !this.keyWasUpBefore(keyCode);
    }
};let SquareKeyCode = {
    CANCEL: 3,
    HELP: 6,
    BACK_SPACE: 8,
    TAB: 9,
    CLEAR: 12,
    RETURN: 13,
    ENTER: 14,
    SHIFT: 16,
    CONTROL: 17,
    ALT: 18,
    PAUSE: 19,
    CAPS_LOCK: 20,
    ESCAPE: 27,
    SPACE: 32,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    PRINTSCREEN: 44,
    INSERT: 45,
    DELETE: 46,
    NUM0: 48,
    NUM1: 49,
    NUM2: 50,
    NUM3: 51,
    NUM4: 52,
    NUM5: 53,
    NUM6: 54,
    NUM7: 55,
    NUM8: 56,
    NUM9: 57,
    SEMICOLON: 59,
    EQUALS: 61,
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90,
    CONTEXT_MENU: 93,
    NUMPAD0: 96,
    NUMPAD1: 97,
    NUMPAD2: 98,
    NUMPAD3: 99,
    NUMPAD4: 100,
    NUMPAD5: 101,
    NUMPAD6: 102,
    NUMPAD7: 103,
    NUMPAD8: 104,
    NUMPAD9: 105,
    MULTIPLY: 106,
    ADD: 107,
    SEPARATOR: 108,
    SUBTRACT: 109,
    DECIMAL: 110,
    DIVIDE: 111,
    F1: 112,
    F2: 113,
    F3: 114,
    F4: 115,
    F5: 116,
    F6: 117,
    F7: 118,
    F8: 119,
    F9: 120,
    F10: 121,
    F11: 122,
    F12: 123,
    F13: 124,
    F14: 125,
    F15: 126,
    F16: 127,
    F17: 128,
    F18: 129,
    F19: 130,
    F20: 131,
    F21: 132,
    F22: 133,
    F23: 134,
    F24: 135,
    NUM_LOCK: 144,
    SCROLL_LOCK: 145,
    COMMA: 188,
    PERIOD: 190,
    SLASH: 191,
    BACK_QUOTE: 192,
    OPEN_BRACKET: 219,
    BACK_SLASH: 220,
    CLOSE_BRACKET: 221,
    QUOTE: 222,
    META: 224,
};;class SquareParticle extends SquareActor {
    constructor() {
        super();

        this.velocity.x = SquareMath.rand(-5, +5);
        this.velocity.y = SquareMath.rand(-5, +5);
        this.size = 14;
    }

    update(u) {
        super.update(u);

        this.size = SquareMath.lerp(this.size, 0, 0.2);
    }

    draw(d) {
        d.context.fillStyle = '#fff';
        d.context.fillRect(this.position.x, this.position.y, this.size, this.size);
    }
};class SquareParticleEmitter extends SquareActor {
    constructor() {
        super();

        this.particles = [];

        this.emitterStarted = false;
        this.emitterRuntime = 10;
        this.emitterRemoveOnStop = true;
        this.emitterParticleType = SquareParticle;
        this.emitterParticleAmount = 1;
    }

    start() {
        if (!this.id) {
            SquareDiagnostics.logDebug('Debug warning: Starting particle emitter that does not have a stage ID');
        }

        if (this.emitterRuntime <= 0) {
            SquareDiagnostics.logDebug('Debug warning: Starting particle emitter that has no runtime remaining');
        }

        this.emitterStarted = true;
    }

    stop() {
        this.emitterStarted = false;

        if (this.emitterRemoveOnStop) {
            this.remove();
        }
    }

    update(u) {
        if (!this.emitterStarted) {
            return;
        }

        if (this.emitterRuntime <= 0) {
            this.stop();
            return;
        }

        for (let pI = 0; pI < this.emitterParticleAmount; pI++) {
            let newParticle = new this.emitterParticleType;
            newParticle.position = new SquareCoordinate(this.position.x, this.position.y);

            this.particles.push(newParticle);
        }

        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update(u);
        }

        this.emitterRuntime--;
    }

    draw(d) {
        if (!this.emitterStarted) {
            return;
        }

        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].draw(d);
        }
    }
};$(document).ready(function () {
    SquareDiagnostics.enableDebug();

    SquareEngine.setFrameRateTarget(30);
    SquareEngine.start('game');

    if (SquareDiagnostics.debugEnabled) {
        SquareEngine.addUiComponent(new SquareFrameInfoUiComponent());
    }

    for (let i = 0; i < 333; i++) {
        SquareEngine.stage.addActor(new GuyActor());
    }

    let ourPlayer = SquareEngine.stage.getActorById(321);
    SquareEngine.camera.attachTo(ourPlayer);
    ourPlayer.isPlayer = true;
});;class GuyActor extends SquareActor {
    constructor() {
        super();

        this.didInit = false;

        this.collider = new SquareCollider(0, 0, 32, 32, true, true);
        this.collider.attachTo(this);

        this.isPlayer = false;
    }

    update(u) {
        super.update(u);

        let isNew = false;

        while (!this.didInit) {
            this.position.x = SquareMath.rand(-u.resolution.x, u.resolution.x);
            this.position.y = SquareMath.rand(-u.resolution.y, u.resolution.y);

            this.velocity.x = SquareMath.rand(-10, +10) / 100;
            this.velocity.y = SquareMath.rand(-10, +10) / 100;

            this.collider.update(u);

            if (!this.collider.colliding) {
                this.didInit = true;
            }

            isNew =true;
        }

        if (isNew) {
            for (let i = 0; i < 600; i++) {
                this.velocity.y += SquareMath.rand(-10, +10) / 1000;
                this.velocity.x -= SquareMath.rand(-10, +10) / 1000;
            }
        }

        if (this.isPlayer) {
            if (SquareEngine.keyboard.keyIsPressed(SquareKeyCode.RIGHT)) {
                this.velocity.x++;
            }
            if (SquareEngine.keyboard.keyIsPressed(SquareKeyCode.LEFT)) {
                this.velocity.x--;
            }
            if (SquareEngine.keyboard.keyIsPressed(SquareKeyCode.DOWN)) {
                this.velocity.y++;
            }
            if (SquareEngine.keyboard.keyIsPressed(SquareKeyCode.UP)) {
                this.velocity.y--;
            }
        } else {
            this.velocity.y += SquareMath.rand(-10, +10) / 10;
            this.velocity.x -= SquareMath.rand(-10, +10) / 10;
        }

        this.velocity.x = SquareMath.lerp(this.velocity.x, 0, .05);
        this.velocity.y = SquareMath.lerp(this.velocity.y, 0, .05);

        this.collider.update(u);

        if (this.collider.didCollide && this.isPlayer) {
            SquareEngine.camera.rumble(SquareEngine.frameRateTarget / 10, 10);
        }

        if (this.collider.didCollide) {
            this.emitParticles(10);
        }
    }

    draw(d) {
        if (!this.didInit) {
            return;
        }

        super.draw(d);

        d.context.fillStyle = this.isPlayer ? '#ff0000' : '#fff';
        d.context.fillRect(this.drawPosition.x, this.drawPosition.y, 32, 32);
    }
}