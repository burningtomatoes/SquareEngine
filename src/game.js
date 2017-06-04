$(document).ready(function () {
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
    ourPlayer.color = '#ffe547';

    ourPlayer.update(SquareEngine.updateContext);

    let particleTest = new SquareParticleEmitter();
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
});