class SquareParticleEmitter extends SquareActor {
    constructor() {
        super();

        this.particles = [];

        this.emitterStarted = false;
        this.emitterRuntime = 10;
        this.emitterRemoveOnStop = true;
        this.emitterParticleType = SquareParticle;
        this.emitterParticleAmount = 1;
    }

    start() {
        if (!this.id) {
            SquareDiagnostics.logDebug('Debug warning: Starting particle emitter that does not have a stage ID');
        }

        if (this.emitterRuntime <= 0) {
            SquareDiagnostics.logDebug('Debug warning: Starting particle emitter that has no runtime remaining');
        }

        this.emitterStarted = true;
    }

    stop() {
        this.emitterStarted = false;

        if (this.emitterRemoveOnStop) {
            this.remove();
        }
    }

    update(u) {
        if (!this.emitterStarted) {
            return;
        }

        if (this.emitterRuntime <= 0) {
            this.stop();
            return;
        }

        for (let pI = 0; pI < this.emitterParticleAmount; pI++) {
            let newParticle = new this.emitterParticleType;
            newParticle.position = new SquareCoordinate(this.position.x, this.position.y);

            this.particles.push(newParticle);
        }

        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update(u);
        }

        this.emitterRuntime--;
    }

    draw(d) {
        if (!this.emitterStarted) {
            return;
        }

        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].draw(d);
        }
    }
}