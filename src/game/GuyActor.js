class GuyActor extends SquareActor {
    constructor() {
        super();

        this.didInit = false;

        this.collider = new SquareCollider(0, 0, 32, 32, true, true);
        this.collider.attachTo(this);

        this.isPlayer = false;

        this.size = 32;
    }

    get isDead() {
        return this.size < 1;
    }

    update(u) {
        super.update(u);

        if (this.isDead) {
            this.remove();
            return;
        }

        let isNew = false;

        while (!this.didInit) {
            this.position.x = SquareMath.rand(-u.resolution.x, u.resolution.x);
            this.position.y = SquareMath.rand(-u.resolution.y, u.resolution.y);

            this.velocity.x = SquareMath.rand(-10, +10) / 100;
            this.velocity.y = SquareMath.rand(-10, +10) / 100;

            this.collider.update(u);

            if (!this.collider.colliding) {
                this.didInit = true;
            }

            isNew = true;
        }

        if (isNew) {
            for (let i = 0; i < 600; i++) {
                this.velocity.y += SquareMath.rand(-10, +10) / 1000;
                this.velocity.x -= SquareMath.rand(-10, +10) / 1000;
            }
        }

        if (this.isPlayer) {
            if (SquareEngine.keyboard.keyIsPressed(SquareKeyCode.RIGHT)) {
                this.velocity.x++;
            }
            if (SquareEngine.keyboard.keyIsPressed(SquareKeyCode.LEFT)) {
                this.velocity.x--;
            }
            if (SquareEngine.keyboard.keyIsPressed(SquareKeyCode.DOWN)) {
                this.velocity.y++;
            }
            if (SquareEngine.keyboard.keyIsPressed(SquareKeyCode.UP)) {
                this.velocity.y--;
            }
        } else {
            if (!this.collider.colliding) {
                this.velocity.y += SquareMath.rand(-10, +10) / 10;
                this.velocity.x -= SquareMath.rand(-10, +10) / 10;
            }
        }

        this.velocity.x = SquareMath.lerp(this.velocity.x, 0, .05);
        this.velocity.y = SquareMath.lerp(this.velocity.y, 0, .05);

        this.collider.update(u);

        if (this.collider.didCollide && this.isPlayer) {
            SquareEngine.camera.rumble(SquareEngine.frameRateTarget / 10, 10);
        }

        if (this.collider.didCollide) {
            let emitter = this.emitParticles(10);
            emitter.emitterParticleAmountMin = 10;
            emitter.emitterRuntime = 1;
            emitter.position.x += 12;
            emitter.position.y += 12;

            for (let i = 0; i < this.collider.collidingWith.length; i++) {
                let counterParty = this.collider.collidingWith[i];
                let impactSize = 1 + ((this.size - counterParty.size) / 10);

                if (impactSize < 1) {
                    impactSize = 1;
                }

                if (impactSize > counterParty.size) {
                    impactSize = counterParty.size;
                }

                counterParty.size -= impactSize;
                this.size += impactSize;

                if (counterParty.collider) {
                    counterParty.collider.size.x -= impactSize;
                    counterParty.collider.size.y -= impactSize;
                }

                if (this.collider) {
                    this.collider.size.x += impactSize;
                    this.collider.size.y += impactSize;
                }
            }
        }
    }

    draw(d) {
        if (!this.didInit) {
            return;
        }

        super.draw(d);

        d.context.fillStyle = this.isPlayer ? '#ff0000' : '#fff';
        d.context.fillRect(this.drawPosition.x, this.drawPosition.y, this.size, this.size);
    }
}