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
}