class GuyActor extends SquareActor {
    constructor() {
        super();

        this.didInit = false;

        this.collider = new SquareCollider(0, 0, 32, 32, true, true);
        this.collider.attachTo(this);

        this.isPlayer = false;
    }

    update(u) {
        super.update(u);

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

            isNew =true;
        }

        if (isNew) {
            for (let i = 0; i < 600; i++) {
                this.velocity.y += SquareMath.rand(-10, +10) / 1000;
                this.velocity.x -= SquareMath.rand(-10, +10) / 1000;
            }
        }

        this.velocity.y += SquareMath.rand(-10, +10) / 1000;
        this.velocity.x -= SquareMath.rand(-10, +10) / 1000;

        this.collider.update(u);
    }

    draw(d) {
        if (!this.didInit) {
            return;
        }

        super.draw(d);

        d.context.fillStyle = this.isPlayer ? '#ff0000' : '#fff';
        d.context.fillRect(this.drawPosition.x, this.drawPosition.y, 32, 32);
    }
}