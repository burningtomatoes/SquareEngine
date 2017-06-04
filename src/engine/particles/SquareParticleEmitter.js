class SquareParticleEmitter extends SquareActor {
    constructor() {
        super();

        this.particles = [];

        this.emitterStarted = false;
        this.emitterRuntime = Infinity;
        this.emitterRemoveOnStop = true;
        this.emitterParticleType = SquareParticle;
        this.emitterParticleAmount = 1;
        this.emitterParticleAmountMin = 0;
        this.emitterParticleAmountMax = 20;
        this.emitterParticleColor = '#ffffff';
    }

    start() {
        if (!this.id) {
            SquareDiagnostics.logDebug('Debug warning: Starting particle emitter that does not have a stage ID');
        }

        if (this.emitterRuntime <= 0) {
            SquareDiagnostics.logDebug('Debug warning: Starting particle emitter that has no runtime remaining');
        }

        this.particles = [];
        this.emitterStarted = true;
    }

    stop() {
        if (this.emitterStarted) {
            this.emitterStarted = false;
        }

        if (this.emitterRemoveOnStop && this.particles.length === 0) {
            this.remove();
        }
    }

    update(u) {
        // Update all existing particles
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update(u);
        }

        // Clean up dead particles
        let remainingParticles = [];

        for (let i = 0; i < this.particles.length; i++) {
            let particle = this.particles[i];

            if (particle.isComplete) {
                continue;
            }

            remainingParticles.push(particle);
        }

        this.particles = remainingParticles;

        // If the emitter is not running or has "expired", call stop to clean ourselves up if needed
        if (!this.emitterStarted || this.emitterRuntime <= 0) {
            this.stop();
            return;
        }

        // Spawn new particles within the bounds of our config
        let particlesToGenerate = this.emitterParticleAmount;

        if (this.particles.length + particlesToGenerate < this.emitterParticleAmountMin) {
            particlesToGenerate = this.emitterParticleAmountMin;
        }

        for (let iNewPart = 0; iNewPart < particlesToGenerate && this.particles.length >=
        this.emitterParticleAmountMin && this.particles.length <= this.emitterParticleAmountMax; iNewPart++) {
            let newParticle = new this.emitterParticleType;
            newParticle.color = this.emitterParticleColor;
            newParticle.position = this.position.clone();

            this.particles.push(newParticle);

            newParticle.update(u);
        }

        // Decrement remaining time
        this.emitterRuntime--;
    }

    draw(d) {
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].draw(d);
        }
    }
}