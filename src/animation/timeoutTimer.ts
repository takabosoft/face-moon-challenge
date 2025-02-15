
export class TimeoutTimer {
    private timerId?: number;

    constructor() { }

    start(durationSec: number): Promise<void> {
        return new Promise<void>(resolve => {
            this.stop();
            this.timerId = window.setTimeout(() => {
                this.timerId = undefined;
                resolve();
            }, durationSec * 1000)
        });
    }

    stop() {
        if (this.timerId != null) {
            window.clearTimeout(this.timerId);
            this.timerId = undefined;
        }
    }
}