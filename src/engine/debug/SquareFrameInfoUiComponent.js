class SquareFrameInfoUiComponent extends SquareUiComponent {
    draw(d) {
        d.context.fillStyle = "#f0f";
        d.context.fillText(d.resolution.w + "x" + d.resolution.h + " / " + SquareDiagnostics.fpsResult
            + " / " + SquareDiagnostics.frameCounter, 15, 15);
    }
}