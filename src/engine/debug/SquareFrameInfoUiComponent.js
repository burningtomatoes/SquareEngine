class SquareFrameInfoUiComponent extends SquareUiComponent {
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
}