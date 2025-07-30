// crashGame/crashEngine.js
class CrashGameEngine {
  constructor() {
    this.isRunning = false;
    this.crashPoint = null;
    this.multiplier = 1.0;
    this.interval = null;
  }

  start(callback) {
    this.isRunning = true;
    this.crashPoint = this._generateCrashPoint();
    this.multiplier = 1.0;

    this.interval = setInterval(() => {
      if (this.multiplier >= this.crashPoint) {
        clearInterval(this.interval);
        this.isRunning = false;
        callback("CRASHED");
      } else {
        this.multiplier += 0.01;
        callback(this.multiplier.toFixed(2));
      }
    }, 100);
  }

  getCrashPoint() {
    return this.crashPoint;
  }

  getMultiplier() {
    return this.multiplier;
  }

  _generateCrashPoint() {
    const r = Math.random();
    return parseFloat((1 + 2 * r).toFixed(2)); // between 1.00 - 3.00
  }
}

export default CrashGameEngine;
