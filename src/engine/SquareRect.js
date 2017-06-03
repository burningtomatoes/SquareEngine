/**
 * A simple rectangle.
 * Can be compared to other rectangles for collision.
 */
class SquareRect {
    constructor(x, y, w, h) {
        if (!x) x = 0;
        if (!y) y = 0;
        if (!w) w = 0;
        if (!h) h = 0;

        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    get left() {
        return this.x;
    }

    get right() {
        return this.x + this.w;
    }

    get top() {
        return this.y;
    }

    get bottom() {
        return this.y + this.h;
    }

    intersects(r2) {
        let r1 = this;

        return !(r2.left > r1.right ||
        r2.right < r1.left ||
        r2.top > r1.bottom ||
        r2.bottom < r1.top);
    }
}