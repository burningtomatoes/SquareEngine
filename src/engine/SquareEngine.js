/**
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
        this.resolution = {
            w: 0,
            h: 0
        };

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
        requestAnimationFrame(SquareEngine.loop.bind(this));

        let now = Date.now();
        let delta = now - this._frameStartTime;

        if (delta >= this._frameInterval) {
            SquareEngine.updateContext.delta = (delta - SquareEngine.updateContext.delta);
            SquareEngine.updateContext.deltaTotal = delta;

            this._frameStartTime = now - (delta % this._frameInterval);

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
        d.context.clearRect(0, 0, d.resolution.w, d.resolution.h);

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
        this.resolution.w = this.$canvas.outerWidth();
        this.resolution.h = this.$canvas.outerHeight();

        // Sync that info the the actual <canvas> element so it knows what rez to render at
        // We blindly match the scaled CSS size of the element
        this.canvas.width = this.resolution.w;
        this.canvas.height = this.resolution.h;

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
}