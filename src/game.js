$(document).ready(function () {
    SquareDiagnostics.enableDebug();

    SquareEngine.setFrameRateTarget(50);
    SquareEngine.start('game');

    if (SquareDiagnostics.debugEnabled) {
        SquareEngine.addUiComponent(new SquareFrameInfoUiComponent());
    }

    for (let i = 0; i < 333; i++) {
        SquareEngine.stage.addActor(new GuyActor());
    }
});