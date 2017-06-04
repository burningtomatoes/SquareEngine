class GuyActor extends SquareActor {
    constructor() {
        super();

        this.didInit = false;

        this.collider = new SquareCollider(0, 0, 32, 32, true, true);
        this.collider.attachTo(this);

        this.isPlayer = false;
        this.color = '#ffffff';

        this.size = 32;
    }

    get isDead() {
        return this.size < 1;
    }

    update(u) {
        super.update(u);

        if (this.isDead) {
            if (this.id) {
                let deathExplode = this.emitParticles(1);
                deathExplode.emitterParticleSizeMin = 1;
                deathExplode.emitterParticleSizeMax = 3;
                deathExplode.emitterParticleAmountMin = 10;
                deathExplode.emitterPersistent = true;
                deathExplode.emitterParticleColor = this.color;
                deathExplode.start();

                this.remove();
            }

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
            this._chaosAi()
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

                let sizeIncrease = (impactSize / 2);
                this.size += sizeIncrease;

                this._aiHunger -= 1000;
                counterParty._aiHunger += 1000;

                if (counterParty.collider) {
                    counterParty.collider.size.x -= impactSize;
                    counterParty.collider.size.y -= impactSize;
                }

                if (this.collider) {
                    this.collider.size.x += sizeIncrease;
                    this.collider.size.y += sizeIncrease;
                }
            }
        }
    }

    _chaosAi() {
        let maxSpeedY = 5;
        let maxSpeedX = 5;

        let maxSpeedChangeY = 1;
        let maxSpeedChangeX = 1;

        if (!this.collider.colliding) {
            if (!this._aiHunger) {
                this._aiHunger = SquareMath.rand(-5000, 5000);
            }

            // AI: FIND ANY TARGET, WE'RE A DUMB CUBE SO WE DON'T CARE WHAT IT IS
            if (!this._aiTarget && this._aiHunger >= 1000) {
                this._aiTarget = SquareEngine.stage.getRandomActor();
                this._aiInterest = SquareMath.rand(100, 5000);
            }

            this._aiInterest--;
            this._aiHunger++;

            if (this.size < 10) {
                this._aiHunger += 100;
            }

            // AI: CHECK IF TARGET IS (STILL) SUITABLE AND WE'RE STILL INTERESTED
            if (!this._aiTarget || !this._aiTarget instanceof GuyActor || !this._aiTarget.id || this._aiTarget.isDead ||
                this._aiTarget.id === this.id || this._aiInterest <= 0 || this._aiHunger < 0) {
                this._aiTarget = null;
            } else {
                this.color = '#ffaaaa'; // the color of anger
            }

            if (this._aiTarget) {
                // AI: MOVE TO OUR TARGET
                if (this._aiTarget.position.x > this.position.x) {
                    this.velocity.x += maxSpeedChangeX;
                }

                if (this._aiTarget.position.x < this.position.x) {
                    this.velocity.x -= maxSpeedChangeX;
                }

                if (this._aiTarget.position.y > this.position.y) {
                    this.velocity.y += maxSpeedChangeY;
                }

                if (this._aiTarget.position.y < this.position.y) {
                    this.velocity.y -= maxSpeedChangeY;
                }
            } else {
                // WANDER LIKE BEFORE
                this.velocity.y += SquareMath.rand(-10, +10) / 10;
                this.velocity.x -= SquareMath.rand(-10, +10) / 10;

                this.color = '#fff'; // the color of boredom
            }

            // SPEED CLAMP
            if (this.velocity.x <= -maxSpeedX) {
                this.velocity.x = -maxSpeedX;
            }

            if (this.velocity.x >= maxSpeedX) {
                this.velocity.x = maxSpeedX;
            }

            if (this.velocity.y <= -maxSpeedY) {
                this.velocity.y = -maxSpeedY;
            }

            if (this.velocity.y >= maxSpeedY) {
                this.velocity.y = maxSpeedY;
            }
        }
    }

    draw(d) {
        if (!this.didInit) {
            return;
        }

        super.draw(d);

        d.context.fillStyle = this.color;
        d.context.fillRect(this.drawPosition.x, this.drawPosition.y, this.size, this.size);
    }
}