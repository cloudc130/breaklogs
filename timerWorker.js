let timerInterval = null;
let startTime = null;
let status = null;
let allowedMinutes = 0;
let alarmPlayed = false;
let notifyLastMinute = false;
let notifyExceeded = false;
let lastReminderMinute = null;

self.onmessage = function (e) {
  const { action, data } = e.data;

  if (action === "start" || action === "restore") {
    status = data.status;
    startTime = data.startTime || Date.now(); // restore may pass saved startTime
    allowedMinutes = data.allowedMinutes || 0;
    alarmPlayed = false;
    notifyLastMinute = false;
    notifyExceeded = false;
    lastReminderMinute = null;

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const elapsedMinutes = Math.floor(elapsed / 60000);

      // Always tick
      self.postMessage({ type: "tick", elapsed, status });

      // BIO special case: no fixed limit
      if (status === "bio") {
        if (elapsed >= 5 * 60000 && !notifyExceeded) {
          notifyExceeded = true;
          self.postMessage({
            type: "notify",
            message: `Reminder: Your Bio timer has reached 5 minutes.`
          });
        }
        return; // skip break/lunch logic
      }

      // BREAK/LUNCH with duration
      if (status === "break" || status === "lunch") {
        if (allowedMinutes > 0) {
          const limitMs = allowedMinutes * 60000;

          // Notify 1 minute before end
          if (
            !notifyLastMinute &&
            elapsed >= limitMs - 60000 &&
            elapsed < limitMs
          ) {
            notifyLastMinute = true;
            self.postMessage({
              type: "notify",
              message: `You have 1 minute left of your ${status}.`
            });
          }

          // Alarm exactly at limit
          if (!alarmPlayed && elapsed >= limitMs && elapsed < limitMs + 1000) {
            alarmPlayed = true;
            self.postMessage({
              type: "alarm",
              message: `Your ${status} time has ended.`
            });
          }

          // Notify again at 1 minute past limit
          if (
            !notifyExceeded &&
            elapsed >= limitMs + 60000 &&
            elapsed < limitMs + 120000
          ) {
            notifyExceeded = true;
            self.postMessage({
              type: "notify",
              message: `You have exceeded your ${status} time by 1 minute.`
            });
          }

          // Ongoing reminder every 5 minutes past limit
          if (elapsed > limitMs + 120000) {
            if (
              lastReminderMinute === null ||
              elapsedMinutes >= lastReminderMinute + 5
            ) {
              lastReminderMinute = elapsedMinutes;
              self.postMessage({
                type: "notify",
                message: `Reminder: Your ${status} timer is still running and has exceeded the limit by ${
                  elapsedMinutes - allowedMinutes
                } minutes.`
              });
            }
          }
        }
      }
    }, 1000);
  }

  if (action === "stop") {
    clearInterval(timerInterval);
    timerInterval = null;
    self.postMessage({ type: "stopped", status });
  }
};
