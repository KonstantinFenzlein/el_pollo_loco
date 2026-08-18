/**
* class IntervalHub
*/
class IntervalHub {
  static allIntervals = [];

  /**
  * Starts a new interval and stores it in the internal list.
  * @param {Function} func - The function to execute repeatedly.
  * @param {number} timer - Interval time in milliseconds.
  */
  static startInterval(func, timer) {
    const newInterval = setInterval(func, timer);
    IntervalHub.allIntervals.push(newInterval);
  }

  /** Stops all intervals that have been started and clears the internal list. */
  static stopAllIntervals() {
    IntervalHub.allIntervals.forEach(clearInterval);
    IntervalHub.allIntervals = [];
  }
}