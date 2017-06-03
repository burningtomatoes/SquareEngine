$(document).ready(function () {
    SquareEngine.addUiComponent(new SquareFrameInfoUiComponent());
    SquareEngine.setFrameRateTarget(30);
    SquareEngine.start('game');

    for (let i = 0; i < 100; i++) {
        SquareEngine.stage.addActor(new GuyActor());
    }
});