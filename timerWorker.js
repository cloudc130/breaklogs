let timerInterval = null;
let startTime = null;
let status = null;
let allowedMinutes = 0;
let alarmPlayed = false;
let notifyLastMinute = false;
let notifyExceeded = false;
let lastReminderMinute = null;
let expectedBreakTime = null; // New variable
let expectedLunchTime = null; // New variable
let breakNotificationSent = false; // New flag
let lunchNotificationSent = false; // New flag
let phtStartTime = null; // New global variable
let phtStopTime = null;   // New global variable

self.onmessage = function (e) {
  const { action, data } = e.data;

  if (action === "start" || action === "restore") {
    status = data.status;
    startTime = data.startTime || Date.now(); // restore may pass saved startTime
    allowedMinutes = data.allowedMinutes || 0;
    expectedBreakTime = data.expectedBreakTime || null; // Capture the new data
    expectedLunchTime = data.expectedLunchTime || null; // Capture the new data
    phtStartTime = data.phtStartTime; // Store the PHT start time
    phtStopTime = data.phtStopTime;   // Store the PHT stop time
    breakNotificationSent = false;
    lunchNotificationSent = false;
    alarmPlayed = false;
    notifyLastMinute = false;
    notifyExceeded = false;
    lastReminderMinute = null;

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const elapsedMinutes = Math.floor(elapsed / 60000);

      // Always tick
      self.postMessage({ type: "tick", elapsed, status, phtStartTime, phtStopTime });

      checkScheduledNotifications();

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
  } else if (action === "updateSchedule") {
    // 👇 NEW: Handle the schedule update
    expectedBreakTime = data.expectedBreakTime;
    expectedLunchTime = data.expectedLunchTime;
    breakNotificationSent = false;
    lunchNotificationSent = false;
  }

  if (action === "stop") {
    clearInterval(timerInterval);
    timerInterval = null;
    self.postMessage({ type: "stopped", status });
  }
};

function checkScheduledNotifications() {
  // Use toLocaleString to get the time in the 'Asia/Manila' time zone (PHT)
  const now = new Date();
  const options = { timeZone: 'Asia/Manila', hour: '2-digit', minute: '2-digit', hour12: false };
  const phtTime = now.toLocaleTimeString('en-US', options);

  // Parse the PHT time string to get the hour and minute
  const [phtHour, phtMinute] = phtTime.split(':');
  const currentTimeInPHT = `${phtHour}:${phtMinute}`;

  // Check for break time notification
  if (expectedBreakTime && currentTimeInPHT === expectedBreakTime && !breakNotificationSent) {
    self.postMessage({
      type: "schedule_notification",
      message: "Hey, it's time for your scheduled break!",
      scheduleType: "break"
    });
    breakNotificationSent = true;
  }

  // Check for lunch time notification
  if (expectedLunchTime && currentTimeInPHT === expectedLunchTime && !lunchNotificationSent) {
    self.postMessage({
      type: "schedule_notification",
      message: "Hey, it's time for your scheduled lunch!",
      scheduleType: "lunch"
    });
    lunchNotificationSent = true;
  }
}
