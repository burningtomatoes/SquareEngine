class SquareFrameInfoUiComponent extends SquareUiComponent {
    constructor() {
        super.constructor();

        this.delta = 0;
    }

    update(u) {
        this.delta = u.delta.toFixed(0);
        this.text = u.resolution.w + "x" + u.resolution.h + " / " + SquareDiagnostics.fpsResult
            + " FPS / " + this.delta + " ms";
    }

    draw(d) {
        d.context.fillStyle = "#270027";
        d.context.fillText(this.text, 26, 26);
        d.context.fillText(this.text, 24, 24);
        d.context.fillStyle = "#f0f";
        d.context.fillText(this.text, 25, 25);
    }
}