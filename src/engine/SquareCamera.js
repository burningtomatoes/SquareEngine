class SquareCamera {
    constructor() {
        this.x = 0;
        this.y = 0;

        this._renderX = 0;
        this._renderY = 0;

        this._rumbleOn = false;
        this._rumbleOffset = 0;
        this._rumbleDuration = 0;
        this._rumbleIntensity = 1;

        this.speed = 0.1;
    }

    translateX(x) {
        return Math.round(x + this._renderX + this._rumbleOffset);
    }

    translateY(y) {
        return Math.round(y + this._renderY + this._rumbleOffset);
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

    /**
     * Attaches the camera to an actor, causing that actor's position to be tracked.
     *
     * @param {SquareActor} actor
     */
    attachTo(actor) {
        this._actorAttachment = actor;
    }

    /**
     * Detaches the camera from any actors.
     */
    detach() {
        this._actorAttachment = null;
    }

    rumble(duration, intensity) {
        this._rumbleOn = true;
        this._rumbleOffset = 0;
        this._rumbleDuration = duration;
        this._rumbleIntensity = intensity;
    }

    update(u) {
        this._updateRumble(u);
        this._updateFollow(u);
        this._updatePosition(u);
    }

    _updateRumble(u) {
        if (this._rumbleOn) {
            this._rumbleDuration--;

            this._rumbleOffset = SquareMath.rand(-this._rumbleIntensity, +this._rumbleIntensity);

            if (this._rumbleDuration <= 0) {
                this._rumbleOn = false;
                this._rumbleOffset = 0;
            }
        }
    }

    _updateFollow(u) {
        if (this._actorAttachment) {
            this.x = (u.resolution.x / 2) - this._actorAttachment.position.x - 16;
            this.y = (u.resolution.y / 2) - this._actorAttachment.position.y - 16;
        }
    }

    _updatePosition(u) {
        this._renderX = SquareMath.lerp(this._renderX, this.x, this.speed);
        this._renderY = SquareMath.lerp(this._renderY, this.y, this.speed);
    }
}