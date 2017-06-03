class SquareKeyboard extends SquareObject {
    constructor() {
        super();

        this.keysDownNow = [];

        // Set all keys (or roughly the range of key codes to expect) to "up" state when we start
        for (let i = 0; i < 255; i++) {
            this.keysDownNow[i] = false;
        }

        this.keysDownLast = this.keysDownNow.slice();

        this.bindWindowEvents();
    }

    bindWindowEvents() {
        // Unfortunately, there seems to be no way in JavaScript to get keyboard state info without listening to
        // events on the window. This is a poor solution, but we have no other options.

        window.addEventListener("keydown", function (e) {
            // Key was pressed
            this.keysDownNow[e.keyCode] = true;
        }.bind(this));

        window.addEventListener("keyup", function (e) {
            // Key was released
            this.keysDownNow[e.keyCode] = false;
        }.bind(this));
    }

    update(u) {
        // Update is called AFTER the rest of the frame finished updating, meaning "now" becomes "then" for next frame
        this.keysDownLast = this.keysDownNow.slice();
    }

    /**
     * Gets whether a key is currently in the down (pressed) state.
     *
     * @param keyCode
     * @returns {boolean}
     */
    keyIsPressed(keyCode) {
        return !!this.keysDownNow[keyCode];
    }

    /**
     * Gets whether a key is currently in the up (released) state.
     *
     * @param keyCode
     * @returns {boolean}
     */
    keyIsUp(keyCode) {
        return !this.keysDownNow[keyCode];
    }

    /**
     * Gets whether a key was in the down (pressed) state in the previous frame.
     *
     * @param keyCode
     * @returns {boolean}
     */
    keyWasPressedBefore(keyCode) {
        return !!this.keysDownLast[keyCode];
    }

    /**
     * Gets whether a key was in the up (released) state in the previous frame.
     *
     * @param keyCode
     * @returns {boolean}
     */
    keyWasUpBefore(keyCode) {
        return !this.keysDownLast[keyCode];
    }

    /**
     * Gets whether a key has just now been pressed down; it is down now but was up in the last frame.
     *
     * @param keyCode
     * @returns {boolean}
     */
    keyWasPressedNow(keyCode) {
        return this.keyIsPressed(keyCode) && !this.keyWasPressedBefore(keyCode);
    }

    /**
     * Gets whether a key has just now been released up; it is up now but was down in the last frame.
     *
     * @param keyCode
     * @returns {boolean}
     */
    keyWasReleasedNow(keyCode) {
        return this.keyIsUp(keyCode) && !this.keyWasUpBefore(keyCode);
    }
}