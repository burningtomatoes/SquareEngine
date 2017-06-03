class SquareCamera {
    constructor() {
        this.x = 0;
        this.y = 0;

        this.renderX = 0;
        this.renderY = 0;

        this.rumbleOn = false;
        this.rumbleOffset = 0;
        this.rumbleDuration = 0;
        this.rumbleIntensity = 1;

        this.speed = 0.1;
    }

    translateX(x) {
        return Math.round(x + this.renderX + this.rumbleOffset);
    }

    translateY(y) {
        return Math.round(y + this.renderY + this.rumbleOffset);
    }

    translateCoord(sqCoord) {
        sqCoord.x = this.translateX(sqCoord.x);
        sqCoord.y = this.translateY(sqCoord.y);
    }

    translateContext(context2d) {
        context2d.translate(+this.translateX(0), +this.translateY(0));
    }

    untranslateContext(context2d) {
        context2d.translate(-this.translateX(0), -this.translateY(0));
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }

    rumble(duration, intensity) {
        this.rumbleOn = true;
        this.rumbleOffset = 0;
        this.rumbleDuration = duration;
        this.rumbleIntensity = intensity;
    }

    update() {
        this._updateRumble();
        this._updatePosition();
    }

    _updateRumble() {
        if (this.rumbleOn) {
            this.rumbleDuration--;

            this.rumbleOffset = SquareMath.rand(-this.rumbleIntensity, +this.rumbleIntensity);

            if (this.rumbleDuration <= 0) {
                this.rumbleOn = false;
                this.rumbleOffset = 0;
            }
        }
    }

    _updatePosition() {
        this.renderX = SquareMath.lerp(this.renderX, this.x, this.speed);
        this.renderY = SquareMath.lerp(this.renderY, this.y, this.speed);
    }
}