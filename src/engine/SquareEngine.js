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

        // Prepare game loop context data
        this.drawContext = new SquareDrawContext();
        this.updateContext = new SquareUpdateContext();

        // Initialize core components
        this.stage = new SquareStage();

        // Start the game loop
        SquareEngine.loop();
    }

    /**
     * Performs the main game loop.
     */
    static loop() {
        SquareEngine.update();
        SquareEngine.draw(SquareEngine.drawContext);

        SquareDiagnostics.frameEnd();

        requestAnimationFrame(SquareEngine.loop);
    }

    /**
     * Game loop main update method.
     *
     * @param {SquareUpdateContext} updateContext
     */
    static update(updateContext) {
        // Update the stage, which is where the game lives
        this.stage.update(updateContext);
    }

    /**
     * Game loop main draw method.
     *
     * @param {SquareDrawContext} drawContext
     */
    static draw(drawContext) {
        // Clear the frame
        drawContext.context.clearRect(0, 0, drawContext.resolution.w, drawContext.resolution.h);

        // Draw res / fps diag stuff
        drawContext.context.fillStyle = "#f0f";
        drawContext.context.fillText(this.resolution.w + "x" + this.resolution.h + " / " + SquareDiagnostics.fpsResult
            + " / " + SquareDiagnostics.frameCounter, 15, 15);

        // Draw the stage, which is where the game lives
        this.stage.draw(drawContext);
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
}