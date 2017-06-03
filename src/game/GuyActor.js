class GuyActor extends SquareActor {
    constructor() {
        super();

        this.didInit = false;

        this.collider = new SquareCollider(0, 0, 32, 32, true, true);
        this.collider.attachTo(this);
    }

    update(u) {
        super.update(u);

        while (!this.didInit) {
            this.position.x = SquareMath.rand(-u.resolution.w, u.resolution.w);
            this.position.y = SquareMath.rand(-u.resolution.h, u.resolution.h);

            this.velocity.x = SquareMath.rand(-10, +10) / 100;
            this.velocity.y = SquareMath.rand(-10, +10) / 100;

            this.collider.update(u);

            if (!this.collider.colliding) {
                this.didInit = true;
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

        d.context.fillStyle = '#fff';
        d.context.fillRect(this.drawPosition.x, this.drawPosition.y, 32, 32);
    }
}