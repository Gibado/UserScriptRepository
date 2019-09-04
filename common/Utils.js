if (Utils === undefined) {
    var Utils = {};
}

/**
 * Checks on an interval if a condition is meet and then executes a callback function
 * @param checkTime How long to wait (in milliseconds) between checking the condition
 * @param condition Function that returns a boolean to determine if the callback function should be called
 * @param callback Function to execute when the conditions are meet
 */
Utils.conditionalRun = function(checkTime, condition, callback) {
    setTimeout(function() {
        if (condition()) {
            callback();
        } else {
            Utils.conditionalRun(checkTime, condition, callback);
        }
    }, checkTime);
};

/**
 * Checks on a continuous interval if a condition is meet and then executes a callback function
 * @param checkTime How long to wait (in milliseconds) between checking the condition
 * @param condition Function that returns a boolean to determine if the callback function should be called
 * @param callback Function to execute when the conditions are meet
 */
Utils.intervalConditionalRun = function (checkTime, condition, callback) {
    setInterval(function() {
        if (condition()) {
            callback();
        }
    }, checkTime);
};