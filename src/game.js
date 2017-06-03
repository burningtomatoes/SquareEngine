$(document).ready(function () {
    SquareEngine.addUiComponent(new SquareFrameInfoUiComponent());
    SquareEngine.setFrameRateTarget(50);
    SquareEngine.start('game');

    for (let i = 0; i < 333; i++) {
        SquareEngine.stage.addActor(new GuyActor());
    }
});