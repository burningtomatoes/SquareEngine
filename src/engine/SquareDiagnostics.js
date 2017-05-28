const SEVERITY_DEBUG = -1;
const SEVERITY_INFO = 0;
const SEVERITY_WARNING = 1;
const SEVERITY_ERROR = 2;

class SquareDiagnostics {
    static frameEnd() {
        let now = new Date().getTime();

        if (!this.fpsTime) {
            this.frameCounter = 0;
            this.fpsResult = 0;
            this.fpsTime = now;
        }

        this.frameCounter++;

        if ((now - this.fpsTime) >= 1000) {
            this.fpsResult = this.frameCounter;
            this.frameCounter = 0;
            this.fpsTime = now;

            this.logDebug('FPS result:', this.fpsResult);
        }
    }

    static logDebug(message, extra) {
        this.logMessage(message, extra, SEVERITY_INFO);
    }

    static logWarning(message, extra) {
        this.logMessage(message, extra, SEVERITY_WARNING);
    }

    static logError(message, extra) {
        this.logMessage(message, extra, SEVERITY_ERROR);
    }

    static logException(exception) {
        this.logMessage(exception, null, SEVERITY_ERROR);
        // TODO Throw to external system e.g. Sentry
    }

    static logMessage(message, extra, severity) {
        if (!extra) {
            extra = '';
        }

        let fnLog = console.log;

        switch (severity) {
            case SEVERITY_DEBUG:
                fnLog = console.log;
                break;
            case SEVERITY_INFO:
                fnLog = console.info;
                break;
            case SEVERITY_WARNING:
                fnLog = console.warn;
                break;
            case SEVERITY_ERROR:
                fnLog = console.error;
                break;
        }

        let dateNow = new Date();
        let timestampStr = dateNow.toLocaleTimeString();

        fnLog("[" + timestampStr + "] " + message, extra);
    }
}