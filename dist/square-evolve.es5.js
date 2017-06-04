var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var DPS$0 = Object.defineProperties;var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;var SquareCamera = (function(){"use strict";var proto$0={};
    function SquareCamera() {
        this.x = 0;
        this.y = 0;

        this._renderX = 0;
        this._renderY = 0;

        this._rumbleOn = false;
        this._rumbleOffset = 0;
        this._rumbleDuration = 0;
        this._rumbleIntensity = 1;

        this.speed = 0.1;
    }DP$0(SquareCamera,"prototype",{"configurable":false,"enumerable":false,"writable":false});

    proto$0.translateX = function(x) {
        return Math.round(x + this._renderX + this._rumbleOffset);
    };

    proto$0.translateY = function(y) {
        return Math.round(y + this._renderY + this._rumbleOffset);
    };

    proto$0.translateCoord = function(sqCoord) {
        sqCoord.x = this.translateX(sqCoord.x);
        sqCoord.y = this.translateY(sqCoord.y);
    };

    proto$0.translateContext = function(context2d) {
        context2d.translate(+this.translateX(0), +this.translateY(0));
    };

    proto$0.untranslateContext = function(context2d) {
        context2d.translate(-this.translateX(0), -this.translateY(0));
    };

    proto$0.set = function(x, y) {
        this.x = x;
        this.y = y;
    };

    /**
     * Attaches the camera to an actor, causing that actor's position to be tracked.
     *
     * @param {SquareActor} actor
     */
    proto$0.attachTo = function(actor) {
        this._actorAttachment = actor;
    };

    /**
     * Detaches the camera from any actors.
     */
    proto$0.detach = function() {
        this._actorAttachment = null;
    };

    proto$0.rumble = function(duration, intensity) {
        this._rumbleOn = true;
        this._rumbleOffset = 0;
        this._rumbleDuration = duration;
        this._rumbleIntensity = intensity;
    };

    proto$0.update = function(u) {
        this._updateRumble(u);
        this._updateFollow(u);
        this._updatePosition(u);
    };

    proto$0._updateRumble = function(u) {
        if (this._rumbleOn) {
            this._rumbleDuration--;

            this._rumbleOffset = SquareMath.rand(-this._rumbleIntensity, +this._rumbleIntensity);

            if (this._rumbleDuration <= 0) {
                this._rumbleOn = false;
                this._rumbleOffset = 0;
            }
        }
    };

    proto$0._updateFollow = function(u) {
        if (this._actorAttachment) {
            this.x = (u.resolution.x / 2) - this._actorAttachment.position.x - 16;
            this.y = (u.resolution.y / 2) - this._actorAttachment.position.y - 16;
        }
    };

    proto$0._updatePosition = function(u) {
        this._renderX = SquareMath.lerp(this._renderX, this.x, this.speed);
        this._renderY = SquareMath.lerp(this._renderY, this.y, this.speed);
    };
MIXIN$0(SquareCamera.prototype,proto$0);proto$0=void 0;return SquareCamera;})();;var SquareCoordinate = (function(){"use strict";var proto$0={};
    function SquareCoordinate(x, y) {
        if (!x) x = 0;
        if (!y) y = 0;

        this.x = x;
        this.y = y;
    }DP$0(SquareCoordinate,"prototype",{"configurable":false,"enumerable":false,"writable":false});

    proto$0.clone = function() {
        return new SquareCoordinate(this.x, this.y);
    };
MIXIN$0(SquareCoordinate.prototype,proto$0);proto$0=void 0;return SquareCoordinate;})();;var SEVERITY_DEBUG = -1;
var SEVERITY_INFO = 0;
var SEVERITY_WARNING = 1;
var SEVERITY_ERROR = 2;

var SquareDiagnostics = (function(){"use strict";function SquareDiagnostics() {}DP$0(SquareDiagnostics,"prototype",{"configurable":false,"enumerable":false,"writable":false});var static$0={};
    static$0.enableDebug = function() {
        this._debugEnabled = true;
    };

    static$0.disableDebug = function() {
        this._debugEnabled = false;
    };

    function $static_debugEnabled_get$0() {
        return this._debugEnabled;
    };DPS$0(SquareDiagnostics,{debugEnabled: {"get": $static_debugEnabled_get$0, "configurable":true,"enumerable":true}});

    static$0.frameEnd = function() {
        if (!this.debugEnabled) {
            return;
        }

        var now = Date.now();

        if (!this.fpsTime) {
            this.frameCounter = 0;
            this.fpsResult = 0;
            this.fpsSkippedResult = 0;
            this.fpsDroppedResult = 0;
            this.fpsTime = now;
        }

        this.frameCounter++;

        this._afterFrame();
    };

    static$0.frameSkipped = function() {
        if (!this.debugEnabled) {
            return;
        }

        if (!this.framesSkipped) {
            this.framesSkipped = 0;
        }

        this.framesSkipped++;
        this._afterFrame();
    };

    static$0._afterFrame = function() {
        var now = Date.now();

        if ((now - this.fpsTime) >= 1000) {
            this.fpsResult = this.frameCounter;
            this.fpsSkippedResult = this.framesSkipped;
            this.fpsDroppedResult = SquareMath.clamp(SquareEngine.frameRateTarget - this.fpsResult, 0, SquareEngine.frameRateTarget);

            this.frameCounter = 0;
            this.framesSkipped = 0;

            this.fpsTime = now;

            this.logDebug('FPS result:', this.fpsResult);
        }
    };

    static$0.logDebug = function(message, extra) {
        this.logMessage(message, extra, SEVERITY_DEBUG);
    };

    static$0.logWarning = function(message, extra) {
        this.logMessage(message, extra, SEVERITY_WARNING);
    };

    static$0.logError = function(message, extra) {
        this.logMessage(message, extra, SEVERITY_ERROR);
    };

    static$0.logException = function(exception) {
        this.logMessage(exception, null, SEVERITY_ERROR);
        // TODO Throw to external system e.g. Sentry
    };

    static$0.logMessage = function(message, extra, severity) {
        if (severity === SEVERITY_DEBUG && !this.debugEnabled) {
            return;
        }

        if (!extra) {
            extra = '';
        }

        var fnLog = console.log;

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

        var dateNow = new Date();
        var timestampStr = dateNow.toLocaleTimeString();

        fnLog("[" + timestampStr + "] " + message, extra);
    };
MIXIN$0(SquareDiagnostics,static$0);static$0=void 0;return SquareDiagnostics;})();;var SquareDrawContext = (function(){"use strict";
    function SquareDrawContext() {
        this.context = SquareEngine.context;
        this.canvas = SquareEngine.canvas;
        this.resolution = SquareEngine.resolution;
    }DP$0(SquareDrawContext,"prototype",{"configurable":false,"enumerable":false,"writable":false});
;return SquareDrawContext;})();;/**
 * The static Square engine class that hosts components and powers the main game loop.
 */
var SquareEngine = (function(){"use strict";function SquareEngine() {}DP$0(SquareEngine,"prototype",{"configurable":false,"enumerable":false,"writable":false});var static$0={};
    /**
     * Starts the engine.
     *
     * @param id The ID of the canvas element the engine is binding to.
     */
    static$0.start = function(id) {
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
    };

    static$0.setFrameRateTarget = function(fpsTarget) {
        this._frameRateTarget = fpsTarget;
        this._frameInterval = 1000 / this._frameRateTarget;
        this._frameStartTime = 0;
    };

    function $static_frameRateTarget_get$0() {
        return this._frameRateTarget;
    };DPS$0(SquareEngine,{frameRateTarget: {"get": $static_frameRateTarget_get$0, "configurable":true,"enumerable":true}});

    /**
     * Performs the main game loop.
     */
    static$0.loop = function() {
        requestAnimationFrame(SquareEngine.loop);

        var now = Date.now();
        var delta = now - SquareEngine._frameStartTime;

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
    };

    /**
     * Game loop main update method.
     *
     * @param {SquareUpdateContext} u
     */
    static$0.update = function(u) {
        // Update camera
        this.camera.update(u);

        // Update the stage, which is where the game lives
        this.stage.update(u);

        // Update UI components
        for (var i = 0; i < this.uiComponents.length; i++) {
            this.uiComponents[i].update(u);
        }

        // Update input (NB: do this last so "now" and "then" state info is correct for the next frame)
        this.keyboard.update(u);
    };

    /**
     * Game loop main draw method.
     *
     * @param {SquareDrawContext} d
     */
    static$0.draw = function(d) {
        // Clear the frame
        d.context.clearRect(0, 0, d.resolution.x, d.resolution.y);

        // Apply camera translation, draw the game stage, and undo the translation
        this.camera.translateContext(d.context);
        this.stage.draw(d);
        this.camera.untranslateContext(d.context);

        // Draw UI components
        for (var i = 0; i < this.uiComponents.length; i++) {
            this.uiComponents[i].draw(d);
        }
    };

    /**
     * Syncs the render resolution to the on-page resolution of the canvas element.
     * Should be called whenever the <canvas> element is resized on page (e.g. window resize).
     */
    static$0.updateResolution = function() {
        // Use jQuery to calculate canvas size in the DOM (all available space)
        this.resolution.x = this.$canvas.outerWidth();
        this.resolution.y = this.$canvas.outerHeight();

        // Sync that info the the actual <canvas> element so it knows what rez to render at
        // We blindly match the scaled CSS size of the element
        this.canvas.width = this.resolution.x;
        this.canvas.height = this.resolution.y;

        SquareDiagnostics.logMessage('Canvas resolution set to:', this.resolution);
    };

    /**
     * @param {SquareUiComponent} uiComponent
     */
    static$0.addUiComponent = function(uiComponent) {
        if (!uiComponent instanceof SquareUiComponent) {
            console.warn('addUiComponent() failed: Variable is not an instance of SquareUiComponent class');
            return;
        }

        if (!this.uiComponents) {
            this.uiComponents = [];
        }

        this.uiComponents.push(uiComponent);
    };
MIXIN$0(SquareEngine,static$0);static$0=void 0;return SquareEngine;})();;var SquareMath = (function(){"use strict";function SquareMath() {}DP$0(SquareMath,"prototype",{"configurable":false,"enumerable":false,"writable":false});var static$0={};
    static$0.clamp = function(value, min, max) {
        if (value < min) {
            return min;
        }
        else if (value > max) {
            return max;
        }

        return value;
    };

    static$0.lerp = function(value1, value2, amount) {
        amount = amount < 0 ? 0 : amount;
        amount = amount > 1 ? 1 : amount;
        return value1 + (value2 - value1) * amount;
    };

    static$0.rand = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
MIXIN$0(SquareMath,static$0);static$0=void 0;return SquareMath;})();
;var SquareObject = (function(){"use strict";function SquareObject() {}DP$0(SquareObject,"prototype",{"configurable":false,"enumerable":false,"writable":false});var proto$0={};
    /**
     * Updates the object.
     */
    proto$0.update = function(context) {

    };

    /**
     * Draws the object.
     *
     * @param {SquareDrawContext} context
     */
    proto$0.draw = function(context) {

    };
MIXIN$0(SquareObject.prototype,proto$0);proto$0=void 0;return SquareObject;})();;/**
 * A simple rectangle.
 * Can be compared to other rectangles for collision.
 */
var SquareRect = (function(){"use strict";var proto$0={};
    function SquareRect(x, y, w, h) {
        if (!x) x = 0;
        if (!y) y = 0;
        if (!w) w = 0;
        if (!h) h = 0;

        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }DPS$0(SquareRect.prototype,{left: {"get": $left_get$0, "configurable":true,"enumerable":true}, right: {"get": $right_get$0, "configurable":true,"enumerable":true}, top: {"get": $top_get$0, "configurable":true,"enumerable":true}, bottom: {"get": $bottom_get$0, "configurable":true,"enumerable":true}});DP$0(SquareRect,"prototype",{"configurable":false,"enumerable":false,"writable":false});

    function $left_get$0() {
        return this.x;
    }

    function $right_get$0() {
        return this.x + this.w;
    }

    function $top_get$0() {
        return this.y;
    }

    function $bottom_get$0() {
        return this.y + this.h;
    }

    proto$0.intersects = function(r2) {
        var r1 = this;

        return !(r2.left > r1.right ||
        r2.right < r1.left ||
        r2.top > r1.bottom ||
        r2.bottom < r1.top);
    };
MIXIN$0(SquareRect.prototype,proto$0);proto$0=void 0;return SquareRect;})();;var SquareUiComponent = (function(super$0){"use strict";if(!PRS$0)MIXIN$0(SquareUiComponent, super$0);
    function SquareUiComponent() {
        super$0.call(this);
    }if(super$0!==null)SP$0(SquareUiComponent,super$0);SquareUiComponent.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":SquareUiComponent,"configurable":true,"writable":true}});DP$0(SquareUiComponent,"prototype",{"configurable":false,"enumerable":false,"writable":false});
;return SquareUiComponent;})(SquareObject);;var SquareUpdateContext = (function(){"use strict";
    function SquareUpdateContext() {
        this.resolution = SquareEngine.resolution;
        this.delta = 0;
        this.deltaTotal = 0;
    }DP$0(SquareUpdateContext,"prototype",{"configurable":false,"enumerable":false,"writable":false});
;return SquareUpdateContext;})();;/**
 * An actor can be anything that lives and acts on the game stage.
 * It can be a character, an object, or anything else.
 */
var SquareActor = (function(super$0){"use strict";if(!PRS$0)MIXIN$0(SquareActor, super$0);var proto$0={};
    /**
     * Constructs a new actor.
     */
    function SquareActor() {
        super$0.call(this);

        this.id = null;
        this.zLayer = 0;

        this.position = new SquareCoordinate(0, 0);
        this.drawPosition = new SquareCoordinate(0, 0);
        this.velocity = new SquareCoordinate(0, 0);

        /**
         * @type {SquareCollider|null}
         */
        this.collider = null;
    }if(super$0!==null)SP$0(SquareActor,super$0);SquareActor.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":SquareActor,"configurable":true,"writable":true}});DP$0(SquareActor,"prototype",{"configurable":false,"enumerable":false,"writable":false});

    /**
     * Quickly apply a simple particle effect on this actor (ex. blood splatter on impact, etc).
     *
     * A new particle emitter will be added to the stage, and it will be attached to this actor.
     * After the emitter is done, it will be destroyed automatically.
     *
     * @param {number} runtime The amount of frames this emitter should run for.
     * @return {SquareParticleEmitter}
     */
    proto$0.emitParticles = function(runtime) {
        var emitter = new SquareParticleEmitter();
        emitter.position = this.position.clone();
        emitter.emitterRemoveOnStop = true;
        emitter.emitterRuntime = runtime;
        SquareEngine.stage.addActor(emitter);
        emitter.start();
        return emitter;
    };

    /**
     * Attempt to remove the actor from the stage.
     */
    proto$0.remove = function() {
        if (this.id) {
            SquareEngine.stage.removeActorById(this.id);
        }
    };

    /**
     * Updates the actor.
     *
     * @param {SquareUpdateContext} u
     */
    proto$0.update = function(u) {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.drawPosition.x = Math.round(this.position.x);
        this.drawPosition.y = Math.round(this.position.y);
    };

    /**
     * Draws the actor.
     *
     * @param {SquareDrawContext} d
     */
    proto$0.draw = function(d) {
        // Nothing yet, but we may do some time for debug purposes
        // Keeping it here to hint to all SquareActor implementors to super call us
    };

    proto$0.hasCollider = function() {
        return this.collider !== null;
    };

    proto$0.givesCollision = function() {
        return this.collider && this.collider.givesCollision;
    };

    proto$0.receivesCollision = function() {
        return this.collider && this.collider.receivesCollision;
    };
MIXIN$0(SquareActor.prototype,proto$0);proto$0=void 0;return SquareActor;})(SquareObject);;/**
 * The stage contains actors and props. It is where our play takes place.
 */
var SquareStage = (function(super$0){"use strict";if(!PRS$0)MIXIN$0(SquareStage, super$0);var proto$0={};
    function SquareStage() {
        super$0.call(this);

        this.actorIdGenerator = 0;
        this.actors = {};
    }if(super$0!==null)SP$0(SquareStage,super$0);SquareStage.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":SquareStage,"configurable":true,"writable":true}, nextActorId: {"get": $nextActorId_get$0, "configurable":true,"enumerable":true}});DP$0(SquareStage,"prototype",{"configurable":false,"enumerable":false,"writable":false});

    /**
     * Gets (generates) the next actor ID by incrementing the generator.
     *
     * @returns {number}
     */
    function $nextActorId_get$0() {
        return this.actorIdGenerator++;
    }

    /**
     * Gets an actor by its stage ID.
     *
     * @param id
     * @returns {SquareActor|null} The actor, or NULL if not found.
     */
    proto$0.getActorById = function(id) {
        if (typeof this.actors[id] !== 'undefined') {
            return this.actors[id];
        }

        return null;
    };

    /**
     * Attempts to remove an actor by its stage ID.
     *
     * @param id
     */
    proto$0.removeActorById = function(id) {
        if (typeof this.actors[id] !== 'undefined') {
            this.actors[id].id = null;
            delete this.actors[id];
        }
    };

    /**
     * Gets a random actor on the stage.
     *
     * @returns {SquareActor}
     */
    proto$0.getRandomActor = function() {
        var actorIds = Object.keys(this.actors);
        return this.actors[actorIds[actorIds.length * Math.random() << 0]];
    };

    /**
     * Adds an actor to the stage.
     * An ID will be generated and attached to the object.
     *
     * @param {SquareActor} actor
     */
    proto$0.addActor = function(actor) {
        actor.id = this.nextActorId;
        this.actors[actor.id] = actor;

        SquareDiagnostics.logDebug('Stage: Added an actor to stage, ID #' + actor.id + ':', actor);
    };

    /**
     * Gets a list of actors that may be collided with on the stage.
     * Eligible actors must have a collider attached that is configured to provide collision.
     *
     * @returns {Array}
     */
    proto$0.getCollidables = function() {
        var list = [];

        for (var id in this.actors) {
            var actor = this.actors[id];

            if (actor.givesCollision()) {
                list.push(actor);
            }
        }

        return list;
    };

    /**
     * Updates the stage and all of its actors and props.
     *
     * @param {SquareUpdateContext} u
     */
    proto$0.update = function(u) {
        for (var id in this.actors) {
            var actor = this.actors[id];
            actor.update(u);
        }
    };

    /**
     * Draws the stage and all of its actors and props.
     *
     * @param {SquareDrawContext} d
     */
    proto$0.draw = function(d) {
        // Draw each actor on the stage, but by their self-defined Z order
        // The lowest Z layer number is drawn first, the higher the Z value the later it is drawn
        var zLayerThis = 0;
        var zLayerNext = null;
        var zLayerNextItems = [];
        var anythingLeftToDraw = true;

        // Fill next items with actors list
        zLayerNextItems = Object.values(this.actors).slice();

        if (zLayerNextItems.length > 0) {
            anythingLeftToDraw = true;
        }

        // Begin Z draw, layer by layer. Draw everything on our current Z layer, and index everything above it.
        while (anythingLeftToDraw) {
            var newNextItems = [];

            for (var i = 0; i < zLayerNextItems.length; i++) {
                var actor = zLayerNextItems[i];

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
    };
MIXIN$0(SquareStage.prototype,proto$0);proto$0=void 0;return SquareStage;})(SquareObject);;/**
 * Base class for all SquareEngine colliders.
 * Its default implementation represents a simple square-based collider.
 */
var SquareCollider = (function(super$0){"use strict";if(!PRS$0)MIXIN$0(SquareCollider, super$0);var proto$0={};
    function SquareCollider(posX, posY, width, height, receivesCollision, givesCollision) {
        super$0.call(this);

        if (!posX) posX = 0;
        if (!posY) posY = 0;
        if (!width) width = 32;
        if (!height) height = 32;

        this.position = new SquareEngine(posX, posY);
        this.size = new SquareCoordinate(width, height);
        this.receivesCollision = !!receivesCollision;
        this.givesCollision = !!givesCollision;
        this.rect = new SquareRect();
    }if(super$0!==null)SP$0(SquareCollider,super$0);SquareCollider.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":SquareCollider,"configurable":true,"writable":true}});DP$0(SquareCollider,"prototype",{"configurable":false,"enumerable":false,"writable":false});

    /**
     * Configures this collider to attach to an actor.
     *
     * @param {SquareActor} actor
     */
    proto$0.attachTo = function(actor) {
        this._actorTarget = actor;
    };

    /**
     * Configurs this collider to detach from any actors.
     */
    proto$0.detatch = function() {
        this._actorTarget = null;
    };

    proto$0.draw = function(d) {
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
    };

    proto$0.update = function(u) {
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
        if (!this.collidingWith) {
            this.collidingWith = [];
        }

        var wasColliding = this.colliding;
        var wasCollidingWith = this.collidingWith.slice();

        this.colliding = false;
        this.didCollide = false;
        this.collidingWith = [];

        if (this.receivesCollision) {
            var collidables = SquareEngine.stage.getCollidables();

            for (var i = 0; i < collidables.length; i++) {
                var counterActor = collidables[i];
                var counterCollider = counterActor.collider;

                if (counterCollider === this) {
                    // Cannot collide with ourselves
                    continue;
                }

                if (counterCollider.collidesWith(this)) {
                    this.colliding = true;
                    this.collidingWith.push(counterActor);

                    if (!wasColliding) {
                        this.didCollide = true;
                    }

                    if (wasCollidingWith.indexOf(counterActor) === -1) {
                        var fastestActorX = void 0;
                        var fastestActorY = void 0;
                        var slowestActorX = void 0;
                        var slowestActorY = void 0;

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
    };

    /**
     * Compares this collider to another, to see if a collision occurs.
     *
     * @param {SquareCollider} collider
     * @return {boolean} Returns TRUE if in a collision state, or FALSE otherwise.
     */
    proto$0.collidesWith = function(collider) {
        return collider.rect.intersects(this.rect);
    };
MIXIN$0(SquareCollider.prototype,proto$0);proto$0=void 0;return SquareCollider;})(SquareObject);;var SquareFrameInfoUiComponent = (function(super$0){"use strict";if(!PRS$0)MIXIN$0(SquareFrameInfoUiComponent, super$0);var proto$0={};
    function SquareFrameInfoUiComponent() {
        super$0.call(this);

        this.delta = 0;
    }if(super$0!==null)SP$0(SquareFrameInfoUiComponent,super$0);SquareFrameInfoUiComponent.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":SquareFrameInfoUiComponent,"configurable":true,"writable":true}});DP$0(SquareFrameInfoUiComponent,"prototype",{"configurable":false,"enumerable":false,"writable":false});

    proto$0.update = function(u) {
        this.delta = u.delta.toFixed(0);

        this.text = u.resolution.x + "x" + u.resolution.y + " / " + SquareDiagnostics.fpsResult
            + " FPS / " + this.delta + " ms";

        if (SquareDiagnostics.fpsSkippedResult > 0) {
            this.text += " / Fast, skipped " + SquareDiagnostics.fpsSkippedResult + " frames";
        }

        if (SquareDiagnostics.fpsDroppedResult > 0) {
            this.text += " / Slow, dropped " + SquareDiagnostics.fpsDroppedResult + " frames";
        }
    };

    proto$0.draw = function(d) {
        d.context.fillStyle = "#270027";
        d.context.fillText(this.text, 26, 26);
        d.context.fillText(this.text, 24, 24);
        d.context.fillStyle = "#f0f";
        d.context.fillText(this.text, 25, 25);
    };
MIXIN$0(SquareFrameInfoUiComponent.prototype,proto$0);proto$0=void 0;return SquareFrameInfoUiComponent;})(SquareUiComponent);;var SquareKeyboard = (function(super$0){"use strict";if(!PRS$0)MIXIN$0(SquareKeyboard, super$0);var proto$0={};
    function SquareKeyboard() {
        super$0.call(this);

        this.keysDownNow = [];

        // Set all keys (or roughly the range of key codes to expect) to "up" state when we start
        for (var i = 0; i < 255; i++) {
            this.keysDownNow[i] = false;
        }

        this.keysDownLast = this.keysDownNow.slice();

        this.bindWindowEvents();
    }if(super$0!==null)SP$0(SquareKeyboard,super$0);SquareKeyboard.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":SquareKeyboard,"configurable":true,"writable":true}});DP$0(SquareKeyboard,"prototype",{"configurable":false,"enumerable":false,"writable":false});

    proto$0.bindWindowEvents = function() {
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
    };

    proto$0.update = function(u) {
        // Update is called AFTER the rest of the frame finished updating, meaning "now" becomes "then" for next frame
        this.keysDownLast = this.keysDownNow.slice();
    };

    /**
     * Gets whether a key is currently in the down (pressed) state.
     *
     * @param keyCode
     * @returns {boolean}
     */
    proto$0.keyIsPressed = function(keyCode) {
        return !!this.keysDownNow[keyCode];
    };

    /**
     * Gets whether a key is currently in the up (released) state.
     *
     * @param keyCode
     * @returns {boolean}
     */
    proto$0.keyIsUp = function(keyCode) {
        return !this.keysDownNow[keyCode];
    };

    /**
     * Gets whether a key was in the down (pressed) state in the previous frame.
     *
     * @param keyCode
     * @returns {boolean}
     */
    proto$0.keyWasPressedBefore = function(keyCode) {
        return !!this.keysDownLast[keyCode];
    };

    /**
     * Gets whether a key was in the up (released) state in the previous frame.
     *
     * @param keyCode
     * @returns {boolean}
     */
    proto$0.keyWasUpBefore = function(keyCode) {
        return !this.keysDownLast[keyCode];
    };

    /**
     * Gets whether a key has just now been pressed down; it is down now but was up in the last frame.
     *
     * @param keyCode
     * @returns {boolean}
     */
    proto$0.keyWasPressedNow = function(keyCode) {
        return this.keyIsPressed(keyCode) && !this.keyWasPressedBefore(keyCode);
    };

    /**
     * Gets whether a key has just now been released up; it is up now but was down in the last frame.
     *
     * @param keyCode
     * @returns {boolean}
     */
    proto$0.keyWasReleasedNow = function(keyCode) {
        return this.keyIsUp(keyCode) && !this.keyWasUpBefore(keyCode);
    };
MIXIN$0(SquareKeyboard.prototype,proto$0);proto$0=void 0;return SquareKeyboard;})(SquareObject);;var SquareKeyCode = {
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
};;var SquareParticle = (function(super$0){"use strict";if(!PRS$0)MIXIN$0(SquareParticle, super$0);var proto$0={};
    function SquareParticle() {
        super$0.call(this);

        this.size = 6;
        this.color = '#fff';
        this.velocityMin = -5;
        this.velocityMax = +5;
        this.velocityContinuous = false;

        this.persist = false;
        this.stopped = false;
        this.didStart = false;
    }if(super$0!==null)SP$0(SquareParticle,super$0);SquareParticle.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":SquareParticle,"configurable":true,"writable":true}, isComplete: {"get": $isComplete_get$0, "configurable":true,"enumerable":true}});DP$0(SquareParticle,"prototype",{"configurable":false,"enumerable":false,"writable":false});

    function $isComplete_get$0() {
        return this.size < 1 || this.stopped;
    }

    proto$0.update = function(u) {
        if (!this.didStart) {
            this.velocity.x = SquareMath.rand(this.velocityMin, this.velocityMax);
            this.velocity.y = SquareMath.rand(this.velocityMin, this.velocityMax);
            this.didStart = true;
        }

        if (this.velocityContinuous) {
            this.velocity.x = SquareMath.lerp(this.velocity.x, SquareMath.rand(this.velocityMin, this.velocityMax), .5);
            this.velocity.y = SquareMath.lerp(this.velocity.y, SquareMath.rand(this.velocityMin, this.velocityMax), .5);
        }

        if (this.isComplete) {
            return;
        }

        super$0.prototype.update.call(this, u);

        if (!this.persist) {
            // If not persistent, decrease in size until dead
            this.size = SquareMath.lerp(this.size, 0, 0.1);
        } else {
            // Otherwise, we'll slow down until stopped
            this.velocity.x = SquareMath.lerp(this.velocity.x, 0, .05);
            this.velocity.y = SquareMath.lerp(this.velocity.y, 0, .05);

            if (Math.abs(this.velocity.x) < .5 && Math.abs(this.velocity.y) < .5) {
                this.stopped = true;
            }
        }
    };

    proto$0.draw = function(d) {
        if (this.size <= 0) {
            // Do not attempt to draw invisible particles
            return;
        }

        d.context.fillStyle = this.color;
        d.context.fillRect(this.position.x, this.position.y, this.size, this.size);
    };
MIXIN$0(SquareParticle.prototype,proto$0);proto$0=void 0;return SquareParticle;})(SquareActor);;var SquareParticleEmitter = (function(super$0){"use strict";if(!PRS$0)MIXIN$0(SquareParticleEmitter, super$0);var proto$0={};
    function SquareParticleEmitter() {
        super$0.call(this);

        this.particles = [];

        this.emitterStarted = false;
        this.emitterRuntime = Infinity;
        this.emitterRemoveOnStop = true;
        this.emitterParticleType = SquareParticle;
        this.emitterParticleAmount = 1;
        this.emitterParticleAmountMin = 0;
        this.emitterParticleAmountMax = 20;
        this.emitterParticleColor = '#ffffff';
        this.emitterParticleSizeMin = 4;
        this.emitterParticleSizeMax = 6;
        this.emitterParticleVelocityMin = -5;
        this.emitterParticleVelocityMax = +5;
        this.emitterParticleVelocityContinuous = false;
        this.emitterPersistent = false;
    }if(super$0!==null)SP$0(SquareParticleEmitter,super$0);SquareParticleEmitter.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":SquareParticleEmitter,"configurable":true,"writable":true}});DP$0(SquareParticleEmitter,"prototype",{"configurable":false,"enumerable":false,"writable":false});

    proto$0.start = function() {
        if (!this.id) {
            SquareDiagnostics.logDebug('Debug warning: Starting particle emitter that does not have a stage ID');
        }

        if (this.emitterRuntime <= 0) {
            SquareDiagnostics.logDebug('Debug warning: Starting particle emitter that has no runtime remaining');
        }

        this.particles = [];
        this.emitterStarted = true;
    };

    proto$0.stop = function() {
        if (this.emitterStarted) {
            this.emitterStarted = false;
        }

        if (this.emitterRemoveOnStop && this.particles.length === 0) {
            this.remove();
        }
    };

    proto$0.update = function(u) {
        // Update all existing particles
        for (var i = 0; i < this.particles.length; i++) {
            this.particles[i].update(u);
        }

        // Clean up dead particles
        var remainingParticles = [];

        for (var i$0 = 0; i$0 < this.particles.length; i$0++) {
            var particle = this.particles[i$0];

            if (particle.isComplete && !particle.persist) {
                continue;
            }

            remainingParticles.push(particle);
        }

        this.particles = remainingParticles;

        // If the emitter is not running or has "expired", call stop to clean ourselves up if needed
        if (!this.emitterStarted || this.emitterRuntime <= 0) {
            this.stop();
            return;
        }

        // Spawn new particles within the bounds of our config
        var particlesToGenerate = this.emitterParticleAmount;

        if (this.particles.length + particlesToGenerate < this.emitterParticleAmountMin) {
            particlesToGenerate = this.emitterParticleAmountMin;
        }

        for (var iNewPart = 0; iNewPart < particlesToGenerate && this.particles.length <= this.emitterParticleAmountMax; iNewPart++) {
            var newParticle = new this.emitterParticleType;
            newParticle.color = this.emitterParticleColor;
            newParticle.position = this.position.clone();
            newParticle.size = SquareMath.rand(this.emitterParticleSizeMin, this.emitterParticleSizeMax);
            newParticle.persist = this.emitterPersistent;
            newParticle.velocityMin = this.emitterParticleVelocityMin;
            newParticle.velocityMax = this.emitterParticleVelocityMax;
            newParticle.velocityContinuous = this.emitterParticleVelocityContinuous;

            this.particles.push(newParticle);

            newParticle.update(u);
        }

        // Decrement remaining time
        this.emitterRuntime--;
    };

    proto$0.draw = function(d) {
        for (var i = 0; i < this.particles.length; i++) {
            this.particles[i].draw(d);
        }
    };
MIXIN$0(SquareParticleEmitter.prototype,proto$0);proto$0=void 0;return SquareParticleEmitter;})(SquareActor);;$(document).ready(function () {
    SquareDiagnostics.enableDebug();

    SquareEngine.setFrameRateTarget(30);
    SquareEngine.start('game');

    if (SquareDiagnostics.debugEnabled) {
        SquareEngine.addUiComponent(new SquareFrameInfoUiComponent());
    }

    for (var i = 0; i < 333; i++) {
        SquareEngine.stage.addActor(new GuyActor());
    }

    var ourPlayer = SquareEngine.stage.getActorById(321);
    SquareEngine.camera.attachTo(ourPlayer);
    ourPlayer.isPlayer = true;
    ourPlayer.color = '#ffe547';

    ourPlayer.update(SquareEngine.updateContext);

    var particleTest = new SquareParticleEmitter();
    particleTest.emitterRuntime = Infinity;
    particleTest.emitterParticleAmountMin = 0;
    particleTest.emitterParticleAmountMax = Infinity;
    particleTest.emitterParticleSizeMin = 2;
    particleTest.emitterParticleSizeMax = 6;
    particleTest.emitterParticleVelocityMax = +15;
    particleTest.emitterParticleVelocityMin = -15;
    particleTest.emitterParticleVelocityContinuous = true;
    particleTest.emitterParticleColor = '#ff0000';
    particleTest.position = ourPlayer.position.clone();
    particleTest.start();

    SquareEngine.stage.addActor(particleTest);
});;var GuyActor = (function(super$0){"use strict";if(!PRS$0)MIXIN$0(GuyActor, super$0);var proto$0={};
    function GuyActor() {
        super$0.call(this);

        this.didInit = false;

        this.collider = new SquareCollider(0, 0, 32, 32, true, true);
        this.collider.attachTo(this);

        this.isPlayer = false;
        this.color = '#ffffff';

        this.size = 32;
    }if(super$0!==null)SP$0(GuyActor,super$0);GuyActor.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":GuyActor,"configurable":true,"writable":true}, isDead: {"get": $isDead_get$0, "configurable":true,"enumerable":true}});DP$0(GuyActor,"prototype",{"configurable":false,"enumerable":false,"writable":false});

    function $isDead_get$0() {
        return this.size < 1;
    }

    proto$0.update = function(u) {
        super$0.prototype.update.call(this, u);

        if (this.isDead) {
            if (this.id) {
                var deathExplode = this.emitParticles(1);
                deathExplode.emitterParticleSizeMin = 1;
                deathExplode.emitterParticleSizeMax = 3;
                deathExplode.emitterParticleAmountMin = 10;
                deathExplode.emitterPersistent = true;
                deathExplode.emitterParticleColor = this.color;
                deathExplode.start();

                this.remove();
            }

            return;
        }

        var isNew = false;

        while (!this.didInit) {
            this.position.x = SquareMath.rand(-u.resolution.x, u.resolution.x);
            this.position.y = SquareMath.rand(-u.resolution.y, u.resolution.y);

            this.velocity.x = SquareMath.rand(-10, +10) / 100;
            this.velocity.y = SquareMath.rand(-10, +10) / 100;

            this.collider.update(u);

            if (!this.collider.colliding) {
                this.didInit = true;
            }

            isNew = true;
        }

        if (isNew) {
            for (var i = 0; i < 600; i++) {
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
            this._chaosAi()
        }

        this.velocity.x = SquareMath.lerp(this.velocity.x, 0, .05);
        this.velocity.y = SquareMath.lerp(this.velocity.y, 0, .05);

        this.collider.update(u);

        if (this.collider.didCollide && this.isPlayer) {
            SquareEngine.camera.rumble(SquareEngine.frameRateTarget / 10, 10);
        }

        if (this.collider.didCollide) {
            var emitter = this.emitParticles(10);
            emitter.emitterParticleAmountMin = 10;
            emitter.emitterRuntime = 1;
            emitter.position.x += 12;
            emitter.position.y += 12;

            for (var i$1 = 0; i$1 < this.collider.collidingWith.length; i$1++) {
                var counterParty = this.collider.collidingWith[i$1];
                var impactSize = 1 + ((this.size - counterParty.size) / 10);

                if (impactSize < 1) {
                    impactSize = 1;
                }

                if (impactSize > counterParty.size) {
                    impactSize = counterParty.size;
                }

                counterParty.size -= impactSize;

                var sizeIncrease = (impactSize / 2);
                this.size += sizeIncrease;

                this._aiHunger -= 1000;
                counterParty._aiHunger += 1000;

                if (counterParty.collider) {
                    counterParty.collider.size.x -= impactSize;
                    counterParty.collider.size.y -= impactSize;
                }

                if (this.collider) {
                    this.collider.size.x += sizeIncrease;
                    this.collider.size.y += sizeIncrease;
                }
            }
        }
    };

    proto$0._chaosAi = function() {
        var maxSpeedY = 5;
        var maxSpeedX = 5;

        var maxSpeedChangeY = 1;
        var maxSpeedChangeX = 1;

        if (!this.collider.colliding) {
            if (!this._aiHunger) {
                this._aiHunger = SquareMath.rand(-5000, 5000);
            }

            // AI: FIND ANY TARGET, WE'RE A DUMB CUBE SO WE DON'T CARE WHAT IT IS
            if (!this._aiTarget && this._aiHunger >= 1000) {
                this._aiTarget = SquareEngine.stage.getRandomActor();
                this._aiInterest = SquareMath.rand(100, 5000);
            }

            this._aiInterest--;
            this._aiHunger++;

            if (this.size < 10) {
                this._aiHunger += 100;
            }

            // AI: CHECK IF TARGET IS (STILL) SUITABLE AND WE'RE STILL INTERESTED
            if (!this._aiTarget || !this._aiTarget instanceof GuyActor || !this._aiTarget.id || this._aiTarget.isDead ||
                this._aiTarget.id === this.id || this._aiInterest <= 0 || this._aiHunger < 0) {
                this._aiTarget = null;
            }

            if (this._aiTarget) {
                // AI: MOVE TO OUR TARGET
                if (this._aiTarget.position.x > this.position.x) {
                    this.velocity.x += maxSpeedChangeX;
                }

                if (this._aiTarget.position.x < this.position.x) {
                    this.velocity.x -= maxSpeedChangeX;
                }

                if (this._aiTarget.position.y > this.position.y) {
                    this.velocity.y += maxSpeedChangeY;
                }

                if (this._aiTarget.position.y < this.position.y) {
                    this.velocity.y -= maxSpeedChangeY;
                }
            } else {
                // WANDER LIKE BEFORE
                this.velocity.y += SquareMath.rand(-10, +10) / 10;
                this.velocity.x -= SquareMath.rand(-10, +10) / 10;
            }

            // SPEED CLAMP
            if (this.velocity.x <= -maxSpeedX) {
                this.velocity.x = -maxSpeedX;
            }

            if (this.velocity.x >= maxSpeedX) {
                this.velocity.x = maxSpeedX;
            }

            if (this.velocity.y <= -maxSpeedY) {
                this.velocity.y = -maxSpeedY;
            }

            if (this.velocity.y >= maxSpeedY) {
                this.velocity.y = maxSpeedY;
            }
        }
    };

    proto$0.draw = function(d) {
        if (!this.didInit) {
            return;
        }

        super$0.prototype.draw.call(this, d);

        d.context.fillStyle = this.color;
        d.context.fillRect(this.drawPosition.x, this.drawPosition.y, this.size, this.size);
    };
MIXIN$0(GuyActor.prototype,proto$0);proto$0=void 0;return GuyActor;})(SquareActor);