let timerInterval;
let startTime;
let initialStartTime; // To store the very first start time
let stopTime; // To store the exact stop time
let isRunning = false;
let isLoading = false; 
let loggedInUserId = "";
const apiUrl = "https://script.google.com/macros/s/AKfycbwz8RFdHxl5FEexE7vIuGpW5hMKFRTzrXavHuxIqvJ7RwpIlpwdkbffe62fnfYUCH38hQ/exec";
let lastStatus = "";                                                                                                                                                            
let lastAlertTime = 0;
let settingsButton; // Declare it here
let resetPasswordDialog;
let resetPasswordMenuItem;
let oldPasswordField;
let newPasswordField;
let confirmNewPasswordField;
let resetPasswordConfirmOldBtn;
let resetPasswordSetNewBtn;
let resetPasswordCancelBtn;
let resetPasswordNewCancelBtn; // New cancel button for the second screen
let resetPasswordOldSection;
let resetPasswordNewSection;
let oldPasswordError;
let newPasswordError;
let userInfoButton;
let userInfoDialog;
let userInfoOverlay;
let userInfoAgentName;
let userInfoUserId;
let userInfoShiftSchedule;
let userInfoAllowedBreakDuration;
let userInfoAllowedLunchDuration;
let closeUserInfoDialogBtn;
let changeBackgroundMenuItem;
let changeBackgroundDialog;
let closeChangeBackgroundDialogBtn;
let backgroundOptionsContainer;
let resetBackgroundBtn;
let timerWorker = new Worker("timerWorker.js");

const backgroundOptions = [
    { name: 'Default', url: '', thumbnail: '' }, // Empty URL for default, will reset to CSS body background
    { name: 'Abstract Blue', url: 'https://i.ibb.co/My4c0qwG/abstract-blue.jpg', thumbnail: 'https://i.ibb.co/My4c0qwG/abstract-blue.jpg' },
    { name: 'Night Sky', url: 'https://i.ibb.co/M42ZfvG/night-sky.jpg', thumbnail: 'https://i.ibb.co/M42ZfvG/night-sky.jpg' },
    { name: 'Geometric', url: 'https://i.ibb.co/Cpymx1Sp/geometric.jpg', thumbnail: 'https://i.ibb.co/Cpymx1Sp/geometric.jpg' },
    { name: 'Pink', url: 'https://i.ibb.co/wZNWJBsb/pink.jpg', thumbnail: 'https://i.ibb.co/wZNWJBsb/pink.jpg' },
    { name: 'Sci-Fi Grid GIF', url: 'https://i.ibb.co/k28Byfm0/sci-fi.gif', thumbnail: 'https://i.ibb.co/k28Byfm0/sci-fi.gif' },
    { name: 'BDO7', url: 'https://i.ibb.co/4wWBRscb/bdo7.gif', thumbnail: 'https://i.ibb.co/4wWBRscb/bdo7.gif' },
    { name: 'Enchanted', url: 'https://i.ibb.co/gMfxqg8f/enchanted.gif', thumbnail: 'https://i.ibb.co/gMfxqg8f/enchanted.gif' },
    { name: 'Anime', url: 'https://i.ibb.co/TDP252nM/anime.gif', thumbnail: 'https://i.ibb.co/TDP252nM/anime.gif' },
    { name: 'Coffee', url: 'https://i.ibb.co/mVkJnDFQ/coffee.jpg', thumbnail: 'https://i.ibb.co/mVkJnDFQ/coffee.jpg' },
    { name: 'Flower', url: 'https://i.ibb.co/CKjQMbH4/flowers.gif', thumbnail: 'https://i.ibb.co/CKjQMbH4/flowers.gif' },
    { name: 'Girl', url: 'https://i.ibb.co/Kj6vz7B3/girl.gif', thumbnail: 'https://i.ibb.co/Kj6vz7B3/girl.gif' },
    { name: 'Car', url: 'https://i.ibb.co/tPDHtTYr/car.gif', thumbnail: 'https://i.ibb.co/tPDHtTYr/car.gif' },
    { name: 'Cloud', url: 'https://i.ibb.co/KcTXKdNy/cloud.gif', thumbnail: 'https://i.ibb.co/KcTXKdNy/cloud.gif' },
    { name: 'Pigeon', url: 'https://i.ibb.co/Lzrr05N8/pigeon.gif', thumbnail: 'https://i.ibb.co/Lzrr05N8/pigeon.gif' },
    { name: 'Sunset', url: 'https://i.ibb.co/qLMh6k0S/sunset.jpg', thumbnail: 'https://i.ibb.co/qLMh6k0S/sunset.jpg' },
    { name: 'Blue', url: 'https://i.ibb.co/qMbYrs8n/blue.gif', thumbnail: 'https://i.ibb.co/qMbYrs8n/blue.gif' },
    { name: 'One Piece', url: 'https://i.ibb.co/MDWBQwDL/one-piece.gif', thumbnail: 'https://i.ibb.co/MDWBQwDL/one-piece.gif' },
    { name: 'Naruto', url: 'https://i.ibb.co/LdhqBHKK/naruto.gif', thumbnail: 'https://i.ibb.co/LdhqBHKK/naruto.gif' },
    { name: 'Dog', url: 'https://i.ibb.co/q3nWYNDP/dog.gif', thumbnail: 'https://i.ibb.co/q3nWYNDP/dog.gif' },
    { name: 'Peaceful', url: 'https://i.ibb.co/F2gc0XF/peaceful.gif', thumbnail: 'https://i.ibb.co/F2gc0XF/peaceful.gif' },
    { name: 'Lebron', url: 'https://i.ibb.co/WpxPsxS9/lebron.jpg', thumbnail: 'https://i.ibb.co/WpxPsxS9/lebron.jpg' },
    { name: 'Kobe', url: 'https://i.ibb.co/h11YWcQc/kobe.jpg', thumbnail: 'https://i.ibb.co/h11YWcQc/kobe.jpg' },
    { name: 'Cat', url: 'https://i.ibb.co/wZf8cBJ5/cat.jpg', thumbnail: 'https://i.ibb.co/wZf8cBJ5/cat.jpg' },
    { name: 'Gato', url: 'https://i.ibb.co/zTJpdDBQ/gato.jpg', thumbnail: 'https://i.ibb.co/zTJpdDBQ/gato.jpg' },
    { name: 'Catz', url: 'https://i.ibb.co/ZpTCWCVf/catz.jpg', thumbnail: 'https://i.ibb.co/ZpTCWCVf/catz.jpg' },
    { name: 'Dog', url: 'https://i.ibb.co/MxLMX249/dog.jpg', thumbnail: 'https://i.ibb.co/MxLMX249/dog.jpg' },
    { name: 'Sad_Dog', url: 'https://i.ibb.co/ZpPTFd86/sad-dog.jpg', thumbnail: 'https://i.ibb.co/ZpPTFd86/sad-dog.jpg' },
    { name: 'Aso', url: 'https://i.ibb.co/JRNZ25CH/aso.jpg', thumbnail: 'https://i.ibb.co/JRNZ25CH/aso.jpg' },
];                                                                                                                                                                                                                            

const timerDisplay = document.getElementById("timer");

const reloadedForUpdate = localStorage.getItem("reloadedForUpdate") === "true";

// Function to show the birthday surprise
function showBirthdaySurprise(loggedInUserId) {
    // We are checking for the specific agent ID 0999
    if (loggedInUserId === "0218") {
        // Use Intl.DateTimeFormat to get the date in PHT
        const phtDate = new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Manila' });
        const birthday = new Date('2025-09-24').toLocaleDateString('en-US', { timeZone: 'Asia/Manila' });

        // Check if the current date is the birthday
        if (phtDate === birthday) {
            // Create the surprise overlay
            const surpriseOverlay = document.createElement('div');
            surpriseOverlay.className = 'surprise-overlay'; // Removed 'show' initially
            surpriseOverlay.innerHTML = `
                <div class="surprise-dialog">
                    <h2>🥳 Happy Birthday, Loveeeyyyyyyy! 🥳</h2>
                    <p>I wish you everything happy. I hope you know that I love you from the very depths of my heart. May the universe always be kind to you even when it is not to me. ❤️ I LOVE YOUUUUUUUU ❤️ </p>
                    <button id="closeSurpriseBtn">Close</button>
                </div>
            `;
            document.body.appendChild(surpriseOverlay);

            // Add the 'show' class after a short delay to trigger the fade-in animation
            setTimeout(() => {
                surpriseOverlay.classList.add('show');
            }, 10);

            // Add event listener for the close button
            document.getElementById('closeSurpriseBtn').addEventListener('click', () => {
                const closeBtn = document.getElementById('closeSurpriseBtn');
                let countdown = 5;

                // Disable the button and start the countdown
                closeBtn.disabled = true;
                closeBtn.textContent = `Closing in ${countdown}...`;

                console.log("Birthday surprise dialog will close in 5 seconds.");

                // Update the countdown every second
                const countdownInterval = setInterval(() => {
                    countdown--;
                    if (countdown > 0) {
                        closeBtn.textContent = `Closing in ${countdown}...`;
                    } else {
                        clearInterval(countdownInterval); // Stop the countdown
                        closeBtn.textContent = "Closing...";
                        
                        // Start the actual closing process after the delay
                        surpriseOverlay.classList.remove('show');
                        
                        // Remove the element from the DOM after the CSS transition is complete
                        surpriseOverlay.addEventListener('transitionend', () => {
                            surpriseOverlay.remove();
                            console.log("Birthday surprise dialog closed.");
                        }, { once: true });
                    }
                }, 1000);
            });
        }
    }
}

function showGoodDayMessage(loggedInUserId) {
    const specificUserId = "0218"; 

    // Check if the user is the specific agent and it's their birthday
    if (loggedInUserId === specificUserId) {
        
        // Create the message dialog
        const messageOverlay = document.createElement('div');
        messageOverlay.className = 'surprise-overlay show'; // Reuses the same styling
        messageOverlay.innerHTML = `
            <div class="surprise-dialog">
                <h2>🌞 Good Day my Loveeeeeyyyyyy!</h2>
                <p>Have a great day po. Love na love kitaaa ❤️!</p>
            </div>
        `;
        document.body.appendChild(messageOverlay);

        // Automatically remove the element after 6 seconds
        setTimeout(() => {
            messageOverlay.classList.remove('show');

            // Remove the element from the DOM after the CSS transition is complete
            messageOverlay.addEventListener('transitionend', () => {
                messageOverlay.remove();
            }, { once: true });
            
        }, 6000); // 6000 milliseconds = 6 seconds
    }
}

// If the flag exists, it means we've just reloaded to apply an update.
// Clear the flag immediately so we don't reload again.
if (reloadedForUpdate) {
    localStorage.removeItem("reloadedForUpdate");
    console.log("Service Worker update applied. Reload flag cleared.");
}

if ("serviceWorker" in navigator) {
  // Flag to prevent a reload loop
  let reloadedForUpdate = localStorage.getItem("reloadedForUpdate") === "true";

  // If the page has reloaded for an update, clear the flag and proceed as normal
  if (reloadedForUpdate) {
    localStorage.removeItem("reloadedForUpdate");
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((reg) => {
        console.log("Service Worker registered:", reg.scope);

        // Periodically check for updates
        setInterval(() => {
          console.log("Checking for Service Worker updates...");
          reg.update();
        }, 5 * 60 * 1000); // every 5 minutes

        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          console.log("New Service Worker found...");

          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed") {
              if (navigator.serviceWorker.controller) {
                console.log("New version installed. Activating...");
                newWorker.postMessage({ action: "skipWaiting" });

                // Set a flag before reloading to prevent a loop
                localStorage.setItem("reloadedForUpdate", "true");
                
                // Reload the page only after a new service worker takes control
                // The flag will prevent the listener from causing a loop
                navigator.serviceWorker.addEventListener("controllerchange", () => {
                    if (localStorage.getItem("reloadedForUpdate") === "true") {
                        console.log("New Service Worker controlling the page. Reloading...");
                        window.location.reload();
                    }
                });

              } else {
                console.log("Service Worker installed for the first time. Content is now cached offline.");
              }
            }
          });
        });
      })
      .catch((err) => console.error("Service Worker registration failed:", err));
  });
}

async function isActuallyOnline() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000); // 3s timeout
    await fetch("https://script.google.com/macros/s/AKfycbwz8RFdHxl5FEexE7vIuGpW5hMKFRTzrXavHuxIqvJ7RwpIlpwdkbffe62fnfYUCH38hQ/exec", {
      method: "GET",
      cache: "no-cache",
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return true;
  } catch (err) {
    console.warn("Connectivity check failed:", err);
    return false;
  }
}

window.addEventListener("online", async () => {
  console.log("Network event: online detected, verifying connection...");
  if (await isActuallyOnline()) {
    console.log("Confirmed internet access. Resuming log worker.");
    logWorker.postMessage({ action: "flush" });
  } else {
    console.warn("Still no internet access. Will retry check in 10s.");
    setTimeout(async () => {
      if (await isActuallyOnline()) logWorker.postMessage({ action: "flush" });
    }, 10000);
  }
});

function getDeviceType() {
    const userAgent = navigator.userAgent;
    const mobileKeywords = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    const isMobileUserAgent = mobileKeywords.test(userAgent);
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;

    const isSmallScreen = screenWidth < 768 || screenHeight < 768;

    if (isMobileUserAgent || isSmallScreen) {
        return "Mobile";
    } else {
        return "PC";
    }
}

timerWorker.onmessage = function(e) {
  const { type, elapsed, message, status, phtStartTime, phtStopTime } = e.data;

  // Keep legacy timerDisplay guarded (it may not exist, we kept a hidden placeholder)
  const timerDisplay = document.getElementById("timer");

  const warningTextElement = document.getElementById("timerWarning") || createTimerWarningElement();

  if (type === "tick") {
    // Compute allowed minutes first
    let allowedMinutes = 0;
    if (status === "break") {
      allowedMinutes = parseInt(localStorage.getItem("breakDuration"), 10) || 0;
    } else if (status === "lunch") {
      allowedMinutes = parseInt(localStorage.getItem("lunchDuration"), 10) || 0;
    }

    // Update overlay (new UI)
    updateOverlay(elapsed, status, allowedMinutes, phtStartTime, phtStopTime);

    // Legacy inline timer (kept hidden); guard null
    if (timerDisplay) {
      timerDisplay.textContent = formatTime(elapsed);
    }

    // Exceeded warning (legacy)
    if (allowedMinutes > 0 && elapsed > allowedMinutes * 60 * 1000) {
      if (timerDisplay) timerDisplay.classList.add("exceeded");
      warningTextElement.textContent = `You have exceeded your allowed ${status} time. Please stop the timer.`;
    } else {
      if (timerDisplay) timerDisplay.classList.remove("exceeded");
      warningTextElement.textContent = "";
    }
  }

  if (type === "notify") {
    showSystemNotification(message);
  }

  if (type === "alarm") {
    playAlarm();
    showSystemNotification(message);
  }

  if (type === "schedule_notification") {
    showSystemNotification(message);
  }

  if (type === "stopped") {
    // Hide focused mode when worker stops
    if (timerOverlay) timerOverlay.style.display = "none";

    if (timerDisplay) {
      timerDisplay.textContent = "00:00:00";
      timerDisplay.classList.remove("exceeded");
    }
    const warningTextElement = document.getElementById("timerWarning");
    if (warningTextElement) warningTextElement.textContent = "";
  }
};


const timerOverlay = document.getElementById("timerOverlay");
const overlayTimer = document.getElementById("overlayTimer");
const overlayStatus = document.getElementById("overlayStatus");
const overlayStopBtn = document.getElementById("overlayStopBtn");
const colors = ["#00bcd4", "#ffffff", "#4caf50", "#9c27b0", "#ffeb3b", "#e0376fff", "#3f51b5", "#1a9199f6"];

const circle = document.querySelector(".progress-ring__circle");
const circumference = 2 * Math.PI * 54; // r=54
circle.style.strokeDasharray = circumference;
let currentColorIndex = 0;

// Open overlay when timer clicked
document.getElementById("timer").addEventListener("click", () => {
  if (isRunning) {
    timerOverlay.style.display = "flex";
  }
});

overlayTimer.addEventListener("click", () => {
  currentColorIndex = (currentColorIndex + 1) % colors.length;
  circle.style.stroke = colors[currentColorIndex];
});


// Close overlay when Stop clicked (and also stop timer)
if (overlayStopBtn) {
  overlayStopBtn.addEventListener("click", () => {
    const stop = document.getElementById("stopBtn");
    if (stop) stop.click();
    if (timerOverlay) timerOverlay.style.display = "none";
  });
}

// Update overlay with timer info
function updateOverlay(elapsed, status, allowedMinutes, phtStartTime, phtStopTime) {
  overlayTimer.textContent = formatTime(elapsed);
  overlayStatus.textContent = status;

  const ring = document.querySelector(".progress-ring");
  const overlayAllowed = document.getElementById("overlayAllowed");

    const startTimeInfo = document.getElementById("startTimeInfo");
    const stopTimeInfo = document.getElementById("stopTimeInfo");

    // Display PHT start time
    if (startTimeInfo && phtStartTime) {
        startTimeInfo.textContent = `Started: ${phtStartTime}`;
    }

    // Display PHT stop time OR exceeded time
    if (stopTimeInfo) {
        if (allowedMinutes > 0 && elapsed > allowedMinutes * 60 * 1000) {
            // Timer has exceeded the allowed duration
            const exceededTime = elapsed - (allowedMinutes * 60 * 1000);
            stopTimeInfo.textContent = `Exceeded: ${formatTime(exceededTime)}`;
        } else {
            // Timer is still within the allowed duration
            stopTimeInfo.textContent = phtStopTime ? `Ends at: ${phtStopTime}` : '';
        }
    }



  if (allowedMinutes > 0) {
    overlayAllowed.textContent = `Duration: ${allowedMinutes} min`;
  } else {
    overlayAllowed.textContent = "Duration: N/A";
  }

  if (allowedMinutes > 0) {
    // Break/Lunch mode
    ring.classList.remove("spin");

    // Reset dasharray to full circle
    circle.style.strokeDasharray = circumference;
    const progress = Math.min(elapsed / (allowedMinutes * 60 * 1000), 1);
    const offset = circumference - progress * circumference;
    circle.style.strokeDashoffset = offset;

    if (elapsed >= allowedMinutes * 60 * 1000) {
      circle.style.stroke = "red";
      overlayTimer.classList.add("exceeded");
    } else {
      circle.style.stroke = colors[currentColorIndex]; // user’s color choi
      overlayTimer.classList.remove("exceeded");
    }

  } else {
    // Bio mode = infinite arc spinner
    ring.classList.add("spin");
    circle.style.stroke = colors[currentColorIndex]; // user’s color choi

    // Show only a small arc
    circle.style.strokeDasharray = "80 259"; // arc (80px) + gap (259px)
    circle.style.strokeDashoffset = 0;

    overlayTimer.classList.remove("exceeded");
  }
}

function resetProgressRingColor() {
  currentColorIndex = 0;
  circle.style.stroke = colors[currentColorIndex]; // reset to default teal
}

function applyOverlayBackground() {
  const savedBg = localStorage.getItem("selectedBackground");

  if (savedBg) {
    timerOverlay.style.backgroundImage = `url('${savedBg}')`;
    timerOverlay.style.backgroundSize = "cover";
    timerOverlay.style.backgroundPosition = "center";
    timerOverlay.style.backgroundRepeat = "no-repeat";
    timerOverlay.style.backgroundAttachment = "fixed";
  } else {
    // fallback if no background selected
    timerOverlay.style.backgroundImage = "none";
    timerOverlay.style.backgroundColor = "black";
  }
}

function toggleLoading(isLoading) { // <--- The parameter is named 'isLoading' here
    const container = document.querySelector('.container');
    if (container) {
        if (isLoading) { // <--- Use 'isLoading' here
            container.classList.add('loading-active');
        } else {
            container.classList.remove('loading-active');
        }
    }
    // Update the global isLoading flag
    window.isLoading = isLoading; // <--- And use 'isLoading' here as well
    updateSettingsButtonVisibility();
}

function updateSettingsButtonVisibility() {
    if (!settingsButton) {
        console.error("updateSettingsButtonVisibility: settingsButton is null or undefined!");
        return;
    }

    if (isRunning) {
        // RULE: During an active timer -> Gone (display: none)
        settingsButton.style.display = 'none';
        // Reset other properties in case they were set by a previous state
        settingsButton.style.pointerEvents = 'auto';
        settingsButton.style.opacity = '1';
    } else if (window.isLoading) { // Use window.isLoading to ensure you're reading the global flag
        // RULE: During loading (and timer is NOT active) -> Visible, but disabled
        settingsButton.style.display = 'block'; // Make it visible
        settingsButton.style.pointerEvents = 'none'; // Make it unclickable
        settingsButton.style.opacity = '0.5'; // Dim it to indicate disabled
    } else {
        // RULE: Once timer is stopped AND status is sent (not loading) -> Reappear and Enabled
        settingsButton.style.display = 'block'; // Make it visible
        settingsButton.style.pointerEvents = 'auto'; // Make it clickable
        settingsButton.style.opacity = '1'; // Full opacity
    }
}

// Function to create a custom dialog
function createCustomDialog(
    message,
    confirmCallback,
    cancelCallback,
    confirmText = "Yes",
    cancelText = confirmCallback ? "No" : "Close"
) {
    const overlay = document.createElement("div");
    overlay.className = "overlay";
    overlay.style.display = "block";
    document.body.appendChild(overlay);

    const dialog = document.createElement("div");
    dialog.className = "custom-dialog";

    const messageElement = document.createElement("p");
    messageElement.innerHTML = message;
    dialog.appendChild(messageElement);

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";
    dialog.appendChild(buttonContainer);

    function removeDialog() {
        if (document.body.contains(overlay)) {
            document.body.removeChild(overlay);
        }
        if (document.body.contains(dialog)) {
            document.body.removeChild(dialog);
        }
    }

    if (confirmCallback) {
        const confirmButton = document.createElement("button");
        confirmButton.textContent = confirmText; // ✅ custom label
        confirmButton.className = "custom-dialog-button confirm-button";
        confirmButton.addEventListener("click", () => {
            removeDialog();
            confirmCallback();
        });
        buttonContainer.appendChild(confirmButton);
    }

    const cancelButton = document.createElement("button");
    cancelButton.textContent = cancelText; // ✅ custom label
    cancelButton.className = "custom-dialog-button cancel-button";
    cancelButton.addEventListener("click", () => {
        removeDialog();
        if (cancelCallback) cancelCallback();
    });
    buttonContainer.appendChild(cancelButton);

    dialog.appendChild(buttonContainer);
    document.body.appendChild(dialog);
}


// showAlert function remains the same
function showAlert(message) {
    createCustomDialog(message);
}

function showAboutDialog() {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.style.display = 'block';
    document.body.appendChild(overlay);

    const dialog = document.createElement('div');
    dialog.className = 'custom-dialog';
    dialog.id = 'aboutDialog'; // Give it a unique ID

    const header = document.createElement('h2');
    header.textContent = "Mabrox Agent Break Tracker";
    dialog.appendChild(header);

    // Add a paragraph for the app name and description
    const appInfoParagraph = document.createElement('p');
    appInfoParagraph.innerHTML = "<strong>Agent Break Tracker</strong><br>Keep track of your breaks and lunch efficiently.";
    dialog.appendChild(appInfoParagraph);

    // --- MODIFICATION HERE ---
    const versionParagraph = document.createElement('p');
    versionParagraph.className = 'version-text'; // <--- Add this line to apply the class
    const currentAppVersion = getCurrentAppVersion(); // Get the current version dynamically
    versionParagraph.textContent = `Version: ${currentAppVersion || 'N/A'}`; // Display it. Use 'N/A' as a fallback.
    dialog.appendChild(versionParagraph);

    const developedByParagraph = document.createElement('p');
    developedByParagraph.textContent = "Developed by: Elvin Josua P. Heveling"; // Replace with your info
    dialog.appendChild(developedByParagraph);

    const developedWithParagraph = document.createElement('p');
    developedWithParagraph.textContent = "Developed with: JavaScript, HTML, CSS"; // Tech stack
    dialog.appendChild(developedWithParagraph);

    const testersParagraph = document.createElement('p');
    testersParagraph.textContent = "Special thanks to our testers: Ginbeer, Sean, Mark Christian, JM"; // Add tester names
    dialog.appendChild(testersParagraph);

    const aiAssistanceParagraph = document.createElement('p');
    aiAssistanceParagraph.textContent = "AI Assistance: Gemini"; // Acknowledge Gemini
    dialog.appendChild(aiAssistanceParagraph);

    const contactParagraph = document.createElement('p');
    contactParagraph.textContent = "Contact: breaklogs.mabrox@gmail.com"; // Replace with your contact info
    dialog.appendChild(contactParagraph);

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.id = 'closeAboutBtn'; // Unique ID for the close button
    closeButton.className = 'custom-dialog-button';
    dialog.appendChild(closeButton);

    document.body.appendChild(dialog);

    closeButton.addEventListener('click', () => {
        removeAboutDialog();
    });

    overlay.addEventListener('click', () => {
        removeAboutDialog();
    });
}

function removeAboutDialog() {
    const overlay = document.querySelector('.overlay');
    const dialog = document.getElementById('aboutDialog');
    if (overlay) document.body.removeChild(overlay);
    if (dialog) document.body.removeChild(dialog);
}

function showScheduleUpdateDialog(showCloseButton = false) { // Default to false if not provided
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.style.display = 'block';
    document.body.appendChild(overlay);

    const dialog = document.createElement('div');
    dialog.className = 'custom-dialog';
    dialog.id = 'scheduleDialog';

    const header = document.createElement('h2');
    header.textContent = "To use the Agent Break Tracker please update your schedule";
    dialog.appendChild(header);

    // Shift Start and Shift End (remain the same)
    const shiftStartLabel = document.createElement('label');
    shiftStartLabel.textContent = "Shift Start:";
    const shiftStartInput = document.createElement('input');
    shiftStartInput.type = 'time';
    shiftStartInput.id = 'dialogShiftStart';

    const shiftEndLabel = document.createElement('label');
    shiftEndLabel.textContent = "Shift End:";
    const shiftEndInput = document.createElement('input');
    shiftEndInput.type = 'time';
    shiftEndInput.id = 'dialogShiftEnd';

    const expectedBreakLabel = document.createElement('label');
    expectedBreakLabel.textContent = "Expected Break Time:";
    const breakOptionalText = document.createElement('span'); // Create a span element
    breakOptionalText.textContent = " (Optional)";
    breakOptionalText.className = "optional-text"; // Add a class for styling
    expectedBreakLabel.appendChild(breakOptionalText); // Append the span to the label

    const expectedBreakInput = document.createElement('input');
    expectedBreakInput.type = 'time';
    expectedBreakInput.id = 'dialogExpectedBreakTime';
    expectedBreakInput.className = 'small-duration-input';

    const expectedLunchLabel = document.createElement('label');
    expectedLunchLabel.textContent = "Expected Lunch Time:";
    const lunchOptionalText = document.createElement('span'); // Create a span element
    lunchOptionalText.textContent = " (Optional)";
    lunchOptionalText.className = "optional-text"; // Add a class for styling
    expectedLunchLabel.appendChild(lunchOptionalText); // Append the span to the label

    const expectedLunchInput = document.createElement('input');
    expectedLunchInput.type = 'time';
    expectedLunchInput.id = 'dialogExpectedLunchTime';
    expectedLunchInput.className = 'small-duration-input';

    // --- NEW: Duration Preset Selection ---
    const durationPresetLabel = document.createElement('label');
    durationPresetLabel.textContent = "Choose Break/Lunch Preset:";
    const durationPresetSelect = document.createElement('select');
    durationPresetSelect.id = 'dialogDurationPreset';

    const optionDefault = document.createElement('option');
    optionDefault.value = '';
    optionDefault.textContent = 'Select an option';
    optionDefault.selected = true;
    optionDefault.disabled = true; // Make default option unselectable
    durationPresetSelect.appendChild(optionDefault);

    const optionVosker = document.createElement('option');
    optionVosker.value = 'vosker';
    optionVosker.textContent = 'Vosker (30m Break, 30m Lunch)';
    optionVosker.style.fontWeight = 'bold'; // <--- Add this line for bolding
    durationPresetSelect.appendChild(optionVosker);

    const optionRegular = document.createElement('option');
    optionRegular.value = 'regular';
    optionRegular.textContent = 'Regular (15m Break, 60m Lunch)';
    optionRegular.style.fontWeight = 'bold'; // <--- Add this line for bolding
    durationPresetSelect.appendChild(optionRegular);

    const optionCustom = document.createElement('option');
    optionCustom.value = 'custom';
    optionCustom.textContent = 'Custom Duration';
    optionCustom.style.fontStyle = 'italic'; // <--- Add this line for italic
    durationPresetSelect.appendChild(optionCustom);

    // --- NEW: Custom Duration Input Fields (initially hidden) ---
    const customDurationsDiv = document.createElement('div');
    customDurationsDiv.id = 'customDurationsContainer';
    customDurationsDiv.style.display = 'none'; // Hidden by default

    const customBreakLabel = document.createElement('label');
    customBreakLabel.textContent = "Custom Break Duration (minutes):";
    const customBreakInput = document.createElement('input');
    customBreakInput.type = 'number';
    customBreakInput.id = 'dialogCustomBreakDuration';
    customBreakInput.min = '0';
    customBreakInput.placeholder = '15';
    customBreakInput.className = 'small-duration-input'; // <-- ADD THIS LINE

    const customLunchLabel = document.createElement('label');
    customLunchLabel.textContent = "Custom Lunch Duration (minutes):";
    const customLunchInput = document.createElement('input');
    customLunchInput.type = 'number';
    customLunchInput.id = 'dialogCustomLunchDuration';
    customLunchInput.min = '0';
    customLunchInput.placeholder = '30';
    customLunchInput.className = 'small-duration-input'; // <-- ADD THIS LINE

    customDurationsDiv.appendChild(customBreakLabel);
    customDurationsDiv.appendChild(customBreakInput);
    customDurationsDiv.appendChild(customLunchLabel);
    customDurationsDiv.appendChild(customLunchInput);

    const updateButton = document.createElement('button');
    updateButton.textContent = 'Update Schedule';
    updateButton.id = 'dialogUpdateScheduleBtn';
    updateButton.className = 'custom-dialog-button confirm-button';

    dialog.appendChild(shiftStartLabel);
    dialog.appendChild(shiftStartInput);
    dialog.appendChild(shiftEndLabel);
    dialog.appendChild(shiftEndInput);
    dialog.appendChild(expectedBreakLabel);
    dialog.appendChild(expectedBreakInput);
    dialog.appendChild(expectedLunchLabel);
    dialog.appendChild(expectedLunchInput);
    dialog.appendChild(durationPresetLabel); // Append the preset select
    dialog.appendChild(durationPresetSelect);
    dialog.appendChild(customDurationsDiv); // Append the container for custom fields
    dialog.appendChild(updateButton);

    if (showCloseButton) {
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close'; // <--- Change back to text
        closeButton.className = 'custom-dialog-button cancel-button'; // <--- Use the cancel-button class
        // Removed aria-label as it's less critical for visible text button
        closeButton.addEventListener('click', () => {
            removeScheduleDialog();
        });
        dialog.appendChild(closeButton); // <--- Append the Close button after the Update button
    }

    document.body.appendChild(dialog);

    // --- NEW: Event listener for preset selection to show/hide custom fields ---
    durationPresetSelect.addEventListener('change', () => {
        if (durationPresetSelect.value === 'custom') {
            customDurationsDiv.style.display = 'block';
        } else {
            customDurationsDiv.style.display = 'none';
        }
    });

    updateButton.addEventListener('click', async () => {
        const shiftStart = document.getElementById('dialogShiftStart').value;
        const shiftEnd = document.getElementById('dialogShiftEnd').value;
        const selectedPreset = document.getElementById('dialogDurationPreset').value;
        const expectedBreakTime = document.getElementById('dialogExpectedBreakTime').value;
        const expectedLunchTime = document.getElementById('dialogExpectedLunchTime').value;

        let breakDuration, lunchDuration;

        // Determine break and lunch durations based on preset or custom input
        if (selectedPreset === 'vosker') {
            breakDuration = '30';
            lunchDuration = '30';
        } else if (selectedPreset === 'regular') {
            breakDuration = '15';
            lunchDuration = '60';
        } else if (selectedPreset === 'custom') {
            breakDuration = document.getElementById('dialogCustomBreakDuration').value;
            lunchDuration = document.getElementById('dialogCustomLunchDuration').value;

            // Validate custom inputs
            if (!breakDuration || !lunchDuration || isNaN(breakDuration) || isNaN(lunchDuration) || parseInt(breakDuration) < 0 || parseInt(lunchDuration) < 0) {
                showAlert("Please enter valid positive numbers for custom break and lunch durations.");
                return;
            }
        } else {
            // This covers the case where "Select an option" is still selected
            showAlert("Please select a break/lunch duration preset or custom option.");
            return;
        }

        // Validate shift times and combined duration selection
        if (!shiftStart || !shiftEnd) {
            showAlert("Please enter your Shift Start and Shift End times.");
            return;
        }

        updateButton.textContent = "Updating...";
        updateButton.disabled = true;

        const updateScheduleUrl = `${apiUrl}?action=updateSchedule&userId=${loggedInUserId}&shiftStart=${shiftStart}&shiftEnd=${shiftEnd}&breakDuration=${breakDuration}&lunchDuration=${lunchDuration}`;

        try {
            const updateResult = await fetchData(updateScheduleUrl);
            updateButton.textContent = "Update Schedule";
            updateButton.disabled = false;

            if (updateResult && updateResult.success) {
                // Store schedule in localStorage
                localStorage.setItem("shiftStart", shiftStart);
                localStorage.setItem("shiftEnd", shiftEnd);
                localStorage.setItem("breakDuration", breakDuration);
                localStorage.setItem("lunchDuration", lunchDuration);
                localStorage.setItem("expectedBreakTime", expectedBreakTime);
                localStorage.setItem("expectedLunchTime", expectedLunchTime);

                timerWorker.postMessage({
                    action: "updateSchedule",
                    data: {
                        expectedBreakTime: expectedBreakTime,
                        expectedLunchTime: expectedLunchTime
                    }
                });

                removeScheduleDialog();
                document.getElementById("controls").style.display = "block";
                document.getElementById("logoutBtn").style.display = "inline-block";
                timerDisplay.style.display = "block";
                timerDisplay.textContent = "00:00:00";
            } else {
                showAlert("Error updating schedule: " + (updateResult ? updateResult.message : "Unknown error"));
            }
        } catch (error) {
            updateButton.textContent = "Update Schedule";
            updateButton.disabled = false;
            showAlert("Error communicating with the server to update schedule.");
        } finally {
            toggleLoading(false); // Stop loading animation after logging attempt
        }
    });
}

function removeScheduleDialog() {
    const overlay = document.querySelector('.overlay');
    const dialog = document.getElementById('scheduleDialog');
    if (overlay) document.body.removeChild(overlay);
    if (dialog) document.body.removeChild(dialog);
    
}

function askNotificationPermissionDialog() {
  if (!("Notification" in window)) {
    console.warn("This browser does not support desktop notifications.");
    return;
  }

  // Only show if not already decided
  if (Notification.permission === "default") {
    createCustomDialog(
      "To get break and lunch reminders, please enable notifications.",
      () => {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            console.log("Notifications enabled ✅");
            localStorage.setItem("notificationsEnabled", "true");
          } else {
            console.warn("Notifications denied ❌");
            localStorage.setItem("notificationsEnabled", "false");
          }
        });
      },
      () => {
        console.log("User chose not to enable notifications now.");
        localStorage.setItem("notificationsEnabled", "false");
      },
      "Enable Notifications", // confirm button
      "Not Now"               // cancel button
    );
  }
}

document.getElementById('passwordToggle').addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    const toggleText = document.getElementById('toggleText');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleText.textContent = 'Hide';
    } else {
        passwordInput.type = 'password';
        toggleText.textContent = 'Show';
    }
});


async function fetchData(url, retryCount = 3, baseDelay = 1500, maxDelay = 5000) {
    let attempts = 0;
    toggleLoading(true);

    while (attempts < retryCount) {
        try {
            attempts++;
            console.log(`Fetch attempt ${attempts} to: ${url}`);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(`Fetch attempt ${attempts} successful:`, data);

            return data;
        } catch (error) {
            console.error(`Fetch error (attempt ${attempts}):`, error);

            if (attempts < retryCount) {
                // Exponential backoff with cap and jitter
                const delay = Math.min(baseDelay * Math.pow(2, attempts - 1), maxDelay);
                const jitter = Math.floor(Math.random() * 300); // up to 300ms
                const totalDelay = delay + jitter;

                console.log(`Retrying in ${totalDelay}ms...`);
                await new Promise(resolve => setTimeout(resolve, totalDelay));
            } else {
                console.log(`All ${retryCount} fetch attempts failed.`);
                showAlert("Unable to connect to the server. Please try again later.");
                return null;
            }
        }
    }

    toggleLoading(false);
    return null;
}

document.getElementById("loginBtn").addEventListener("click", async function() {
    let userId = document.getElementById("userId").value.trim();
    let password = document.getElementById("password").value.trim();
    let device = getDeviceType();

    if (!/^\d{4}$/.test(userId)) {
        showAlert("Error: User ID must be a 4-digit number.");
        return;
    }

    if (!password) {
        showAlert("Error: Password cannot be empty.");
        return;
    }

    userId = userId.padStart(4, '0');

    const storedLoggedInUserId = localStorage.getItem("loggedInUserId");

    if (storedLoggedInUserId && storedLoggedInUserId !== userId) {
        showAlert("Another agent is already logged in on this browser. Please ask them to log out first.");
        return;
    }

    document.getElementById("loginBtn").textContent = "Logging in...";
    document.getElementById("loginBtn").disabled = true;

    const loginUrl = `${apiUrl}?action=login&userId=${userId}&password=${password}&device=${device}`;

    try {
        const loginData = await fetchData(loginUrl);

        document.getElementById("loginBtn").textContent = "Login";
        document.getElementById("loginBtn").disabled = false;

        if (loginData && loginData.success) {
            loggedInUserId = userId;
            localStorage.setItem("loggedInUserId", loggedInUserId);
            localStorage.setItem("agentId", loggedInUserId);
            localStorage.setItem("loggedInUserName", loginData.name);
            document.getElementById("agentName").textContent = "Welcome, " + loginData.name;
            document.getElementById("controls").style.display = "block";
            document.getElementById("logoutBtn").style.display = "inline-block";
            document.getElementById("userId").style.display = "none";
            document.getElementById("password").style.display = "none";
            document.getElementById("loginBtn").style.display = "none";
            document.getElementById("passwordToggle").style.display = "none";

            timerDisplay.style.display = "block";
            timerDisplay.textContent = "00:00:00";

            showScheduleUpdateDialog();
            showBirthdaySurprise(loggedInUserId);
            showGoodDayMessage(loggedInUserId);

            if (loginData.blocked) { // Check if the 'blocked' property exists and is true
                showAlert("This user is currently blocked from logging in.");
                // Optionally, you might want to revert the UI changes made upon successful login
                localStorage.removeItem("loggedInUserId");
                localStorage.removeItem("agentId");
                localStorage.removeItem("loggedInUserName");
                document.getElementById("agentName").textContent = "";
                document.getElementById("controls").style.display = "none";
                document.getElementById("logoutBtn").style.display = "none";
                document.getElementById("userId").style.display = "block";
                document.getElementById("password").style.display = "flex";
                document.getElementById("loginBtn").style.display = "block";
                document.getElementById("passwordToggle").style.display = "block";
                timerDisplay.style.display = "none";
            }

        } else if (loginData && loginData.blocked) { // Handle blocked status even if login fails for other reasons
            showAlert("This user is currently blocked from logging in. Please contact your administrator for assistance.");
            timerDisplay.style.display = "none";
        }
        else {
            showAlert("Error: Invalid Login ID or Password.");
            timerDisplay.style.display = "none";
        }
    } catch (error) {
        document.getElementById("loginBtn").textContent = "Login";
        document.getElementById("loginBtn").disabled = false;
        timerDisplay.style.display = "none";
        // fetchData already handles error display.
    } finally {
        toggleLoading(false); // Stop loading animation after logging attempt
    }
});

document.getElementById("historyBtn").addEventListener("click", async function() {
    // Disable all relevant buttons and inputs immediately
    disableTimerButtons();

    // Set history button specific loading text
    document.getElementById("historyBtn").textContent = "Loading...";

    const historyUrl = `${apiUrl}?action=history&userId=${loggedInUserId}`;

    // Resend any pending logs before fetching history

    try {
        const historyData = await fetchData(historyUrl);

        if (historyData && historyData.success) { // Check if historyData is not null
            displayHistory(historyData.history);
            document.getElementById("historyDisplay").style.display = "block";
            // The buttons will be re-enabled in the finally block
        } else {
            // Assuming showAlert is a function that displays an alert or custom dialog
            showAlert("Error retrieving history.");
        }
    } catch (error) {
        // Catch any network errors
        console.error("Network error fetching history:", error);
        showAlert("Network error retrieving history.");
    } finally {
        // This block runs whether the try or catch block finished
        enableTimerButtons(); // Re-enable all relevant buttons and inputs
        toggleLoading(false); // Stop loading animation after logging attempt
        document.getElementById("historyBtn").textContent = "History"; // Set text back to "History"
    }
});

document.addEventListener("DOMContentLoaded", async function () {
    const storedLoggedInUserId = localStorage.getItem("loggedInUserId");
    const storedLoggedInUserName = localStorage.getItem("loggedInUserName");
    const storedShiftStart = localStorage.getItem("shiftStart"); // Check for stored schedule
    const storedShiftEnd = localStorage.getItem("shiftEnd");
    const storedBreakDuration = localStorage.getItem("breakDuration");
    const storedLunchDuration = localStorage.getItem("lunchDuration");
    const isRunning = localStorage.getItem("isRunning") === "true";
    const savedStatus = localStorage.getItem("status");

    const userIdInput = document.getElementById("userId");
    const passwordContainer = document.querySelector(".input-container");
    const loginButton = document.getElementById("loginBtn");
    const controlsDiv = document.getElementById("controls");
    const logoutButton = document.getElementById("logoutBtn");
    const agentNameH2 = document.getElementById("agentName");
    const companyLogo = document.getElementById('companyLogo');
    const settingsMenu = document.getElementById('settingsMenu');
    const resetScheduleButton = document.getElementById('resetScheduleBtn');

    settingsButton = document.getElementById("settingsBtn"); // Assign it here once DOM is ready
    console.log("DOMContentLoaded: settingsButton element is:", settingsButton); // Check if it's found

    resetPasswordDialog = document.getElementById("resetPasswordDialog");
    resetPasswordMenuItem = document.getElementById("resetPasswordMenuItem");
    oldPasswordField = document.getElementById("oldPasswordField");
    newPasswordField = document.getElementById("newPasswordField");
    confirmNewPasswordField = document.getElementById("confirmNewPasswordField");
    resetPasswordConfirmOldBtn = document.getElementById("resetPasswordConfirmOldBtn");
    resetPasswordCancelBtn = document.getElementById("resetPasswordCancelBtn");
    resetPasswordSetNewBtn = document.getElementById("resetPasswordSetNewBtn");
    resetPasswordNewCancelBtn = document.getElementById("resetPasswordNewCancelBtn"); // Get reference for new cancel button
    resetPasswordOldSection = document.getElementById("resetPasswordOldSection");
    resetPasswordNewSection = document.getElementById("resetPasswordNewSection");
    oldPasswordError = document.getElementById("oldPasswordError");
    newPasswordError = document.getElementById("newPasswordError");
    userInfoButton = document.getElementById('userInfoButton');
    userInfoDialog = document.getElementById('userInfoDialog');
    userInfoAgentName = document.getElementById('userInfoAgentName');
    userInfoUserId = document.getElementById('userInfoUserId');
    userInfoShiftSchedule = document.getElementById('userInfoShiftSchedule');
    userInfoAllowedBreakDuration = document.getElementById('userInfoAllowedBreakDuration');
    userInfoAllowedLunchDuration = document.getElementById('userInfoAllowedLunchDuration');
    closeUserInfoDialogBtn = document.getElementById('closeUserInfoDialogBtn');
    changeBackgroundMenuItem = document.getElementById('changeBackgroundMenuItem');
    changeBackgroundDialog = document.getElementById('changeBackgroundDialog');
    closeChangeBackgroundDialogBtn = document.getElementById('closeChangeBackgroundDialogBtn');
    backgroundOptionsContainer = document.getElementById('backgroundOptions');
    resetBackgroundBtn = document.getElementById('resetBackgroundBtn');
    askNotificationPermissionDialog();


    if (changeBackgroundMenuItem) {
        changeBackgroundMenuItem.addEventListener('click', () => {
            settingsMenu.style.display = 'none';
            showChangeBackgroundDialog();
        });
    }

    if (closeChangeBackgroundDialogBtn) {
        closeChangeBackgroundDialogBtn.addEventListener('click', hideChangeBackgroundDialog);
    }

    if (backgroundOptionsContainer) {
        backgroundOptionsContainer.addEventListener('click', (event) => {
            const selectedOption = event.target.closest('.background-option');
            if (selectedOption) {
                const url = selectedOption.dataset.bgUrl;
                applyBackground(url); // Apply the background immediately on click
                selectBackgroundOption(selectedOption); // Visually select it
                // Optionally close dialog after selection: hideChangeBackgroundDialog();
            }
        });
    }

    if (resetBackgroundBtn) {
        resetBackgroundBtn.addEventListener('click', () => {
            resetBackground();
            hideChangeBackgroundDialog();
        });
    }


        // --- User Info Dialog Event Listeners ---
    if (userInfoButton) {
        userInfoButton.addEventListener('click', () => {
            showUserInfoDialog();
            // Optional: Hide settings menu if the button is within it
            if (settingsMenu) settingsMenu.style.display = 'none';
        });
    } else {
        console.error('ERROR: userInfoButton not found in DOM when trying to attach listener.');
    }

    if (closeUserInfoDialogBtn) {
        closeUserInfoDialogBtn.addEventListener('click', hideUserInfoDialog);
    }

    if (userInfoOverlay) {
        userInfoOverlay.addEventListener('click', hideUserInfoDialog); // Click overlay to close
    }

    if (resetPasswordMenuItem) {
    resetPasswordMenuItem.addEventListener("click", function(event) {
        event.preventDefault(); // Prevent default link behavior
        showResetPasswordDialog();
        settingsMenu.style.display = 'none';
    });
}

// Add event listener for the cancel buttons
   if (resetPasswordCancelBtn) {
    resetPasswordCancelBtn.addEventListener("click", hideResetPasswordDialog);
   }
   if (resetPasswordNewCancelBtn) { // For the new cancel button
    resetPasswordNewCancelBtn.addEventListener("click", hideResetPasswordDialog);
   }
   if (resetPasswordConfirmOldBtn) {
    resetPasswordConfirmOldBtn.addEventListener("click", verifyOldPassword);
   }

   if (resetPasswordSetNewBtn) {
    resetPasswordSetNewBtn.addEventListener("click", setNewPassword);
}

// Add event listener for the new cancel button in the new password section
if (resetPasswordNewCancelBtn) {
    resetPasswordNewCancelBtn.addEventListener("click", () => {
        if (resetPasswordDialog) resetPasswordDialog.style.display = 'none';
        if (overlay) overlay.style.display = 'none'; // Hide overlay if you use one
        // Also clear fields when cancelling
        if (oldPasswordField) oldPasswordField.value = '';
        if (newPasswordField) newPasswordField.value = '';
        if (confirmNewPasswordField) confirmNewPasswordField.value = '';
        if (oldPasswordError) oldPasswordError.style.display = 'none';
        if (newPasswordError) newPasswordError.style.display = 'none';

        // Reset to old section state if cancelling from new password screen
        if (resetPasswordOldSection) resetPasswordOldSection.style.display = 'block';
        if (resetPasswordNewSection) resetPasswordNewSection.style.display = 'none';
    });
}


    if (companyLogo) {
        companyLogo.addEventListener('click', showAboutDialog);
    }

    if (storedLoggedInUserId && storedLoggedInUserName) {
        // --- User is logged in ---
        loggedInUserId = storedLoggedInUserId;
        userIdInput.style.display = "none";
        passwordContainer.style.display = "none";
        loginButton.style.display = "none";


        agentNameH2.textContent = "Welcome, " + storedLoggedInUserName;
        controlsDiv.style.display = "block";
        logoutButton.style.display = "inline-block";
        timerDisplay.style.display = "block";

        timerDisplay.style.display = "block"; // <<< SHOW TIMER DISPLAY

        // Check if schedule is stored, if not, show the dialog again
        if (!storedShiftStart || !storedShiftEnd || !storedBreakDuration || !storedLunchDuration) {
            showScheduleUpdateDialog(false);
        }   
        if (isRunning && savedStatus) {
            restoreTimer();
            console.log("Timer restored on page load for status:", savedStatus);
        } else {
            timerDisplay.textContent = "00:00:00";
        }

        showBirthdaySurprise(storedLoggedInUserId);
        showGoodDayMessage(loggedInUserId);

    } else {
        // --- User is logged out ---
        userIdInput.style.display = "block";
        passwordContainer.style.display = "flex";
        loginButton.style.display = "block";


        controlsDiv.style.display = "none";
        logoutButton.style.display = "none";
        agentNameH2.textContent = "";
        timerDisplay.style.display = "none";
    }

        // NEW: Settings button click handler
    if (settingsButton) {
        settingsButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent document click from immediately closing it
            settingsMenu.style.display = settingsMenu.style.display === 'block' ? 'none' : 'block';
        });
    }

    // NEW: Reset Schedule button click handler
    if (resetScheduleButton) {
         resetScheduleButton.addEventListener('click', () => {
        // --- NEW: Check for pending log in local storage ---
            const pendingLogs = JSON.parse(localStorage.getItem("pendingLogs") || "[]");
if (pendingLogs.length > 0) {
    showAlert("Cannot reset schedule: There are unsent logs. Please contact support.");
    console.error("Reset schedule blocked: Pending logs exist in localStorage:", pendingLogs);
    return;
}
        // --- END NEW CHECK ---

           removeScheduleDialog();
           showScheduleUpdateDialog(true); // Pass true to show the close button
           settingsMenu.style.display = 'none';
           });
    }

        if (userIdInput && loginButton) {
        // Listen on userId input (pressing Enter here moves to password, or logs in if password is empty)
        userIdInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                // If password field exists and is visible, move focus to it
                const passwordInput = document.getElementById('password');
                if (passwordInput && passwordInput.style.display !== 'none') {
                    passwordInput.focus();
                } else {
                    // Otherwise, try to log in (e.g., if password field is hidden after login)
                    loginButton.click();
                }
            }
        });
    }

    if (document.getElementById("password") && loginButton) {
        document.getElementById("password").addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent default form submission
                loginButton.click(); // Programmatically click the login button
            }
        });
    }

    // 2. For Reset Password - Old Password Confirmation
    if (oldPasswordField && resetPasswordConfirmOldBtn) {
        oldPasswordField.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                resetPasswordConfirmOldBtn.click();
            }
        });
    }

    // 3. For Reset Password - New Password Confirmation
    // Listener on the last input field of the new password section
    if (confirmNewPasswordField && resetPasswordSetNewBtn) {
        confirmNewPasswordField.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                resetPasswordSetNewBtn.click();
            }
        });
    }
    
    // NEW: Close settings menu if clicked outside
    document.addEventListener('click', (event) => {
        if (settingsMenu && settingsMenu.style.display === 'block' && !settingsMenu.contains(event.target) && event.target !== settingsButton) {
            settingsMenu.style.display = 'none';
        }
    });
    // END NEW
    // --- NEW: Add Auto-Update Logic Calls Here ---
    checkForUpdatesAndRefresh(); // Check once on page load
    setInterval(checkForUpdatesAndRefresh, CHECK_INTERVAL_MS);
    updateSettingsButtonVisibility(); // Initial call
    populateBackgroundOptions(); // Populate options when the page loads
    loadSavedBackground(); // Load any saved background on page load
});


function showChangeBackgroundDialog() {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.style.display = 'block';
    document.body.appendChild(overlay);

    if (changeBackgroundDialog) {
        changeBackgroundDialog.style.display = 'block';
        document.body.classList.add('dialog-open'); // Add class to body to prevent scrolling
    }
}

function hideChangeBackgroundDialog() {
    if (changeBackgroundDialog) {
        changeBackgroundDialog.style.display = 'none';
        document.body.classList.remove('dialog-open');
    }

    const overlay = document.querySelector('.overlay');
    if (overlay) {
        document.body.removeChild(overlay);
    }
}

function populateBackgroundOptions() {
    if (!backgroundOptionsContainer) return;

    backgroundOptionsContainer.innerHTML = ''; // Clear existing options

    backgroundOptions.forEach(option => {
        const optionDiv = document.createElement('div');
        optionDiv.classList.add('background-option');
        optionDiv.dataset.bgUrl = option.url;

        const img = document.createElement('img');
        img.dataset.src = option.thumbnail || option.url; // store instead of immediate load
        img.alt = option.name;
        img.title = option.name;

        optionDiv.appendChild(img);
        backgroundOptionsContainer.appendChild(optionDiv);
    });

    // Lazy-load observer
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src; // load real image
                img.onload = () => img.classList.add('loaded'); // fade in
                obs.unobserve(img); // stop observing once loaded
            }
        });
    }, { rootMargin: '50px 0px' }); // preload slightly before visible

    document.querySelectorAll('.background-option img').forEach(img => {
        observer.observe(img);
    });
}

function applyBackground(url) {
    const body = document.body;
    if (url) {
        body.style.backgroundImage = `url('${url}')`;
        body.style.backgroundSize = 'cover';
        body.style.backgroundRepeat = 'no-repeat';
        body.style.backgroundAttachment = 'fixed'; // Keep background fixed when scrolling
        localStorage.setItem('selectedBackground', url); // Save to local storage
    } else {
        // Reset to default (defined in CSS or no background)
        body.style.backgroundImage = '';
        body.style.backgroundSize = '';
        body.style.backgroundRepeat = '';
        body.style.backgroundAttachment = '';
        localStorage.removeItem('selectedBackground'); // Remove from local storage
    }
    updateSelectedBackgroundOption(url); // Update visual selection
}

function loadSavedBackground() {
    const savedUrl = localStorage.getItem('selectedBackground');
    if (savedUrl) {
        applyBackground(savedUrl);
    } else {
        // Ensure default styling if no background is saved
        resetBackground();
    }
}

function selectBackgroundOption(selectedElement) {
    // Remove 'selected' class from all options
    document.querySelectorAll('.background-option').forEach(option => {
        option.classList.remove('selected');
    });
    // Add 'selected' class to the clicked element
    if (selectedElement) {
        selectedElement.classList.add('selected');
    }
}

function updateSelectedBackgroundOption(currentUrl) {
    document.querySelectorAll('.background-option').forEach(option => {
        if (option.dataset.bgUrl === currentUrl) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });
}

function resetBackground() {
    applyBackground(''); // Call applyBackground with an empty string to reset
}


function showResetPasswordDialog() {
    // Show the overlay first (reusing existing logic from displayHistory)
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.style.display = 'block';
    document.body.appendChild(overlay);

    // Show the dialog
    if (resetPasswordDialog) {
        resetPasswordDialog.style.display = "block";
    }

    // Always start with the old password section
    if (resetPasswordOldSection) resetPasswordOldSection.style.display = 'block';
    if (resetPasswordNewSection) resetPasswordNewSection.style.display = 'none';

    // Clear any previous inputs or errors
    if (oldPasswordField) oldPasswordField.value = '';
    if (newPasswordField) newPasswordField.value = '';
    if (confirmNewPasswordField) confirmNewPasswordField.value = '';
    if (oldPasswordError) oldPasswordError.style.display = 'none';
    if (newPasswordError) newPasswordError.style.display = 'none';

    // Focus on the first input field
    if (oldPasswordField) oldPasswordField.focus();
}

function hideResetPasswordDialog() {
    // Hide the dialog
    if (resetPasswordDialog) {
        resetPasswordDialog.style.display = "none";
    }
    // Hide and remove the overlay
    const overlay = document.querySelector('.overlay');
    if (overlay) {
        document.body.removeChild(overlay);
    }
}

async function verifyOldPassword() {
    console.log('verifyOldPassword function called.'); // Confirms function execution

    const oldPassword = oldPasswordField.value.trim();
    oldPasswordError.style.display = 'none'; // Hide previous errors

    if (!oldPassword) {
        oldPasswordError.textContent = 'Please enter your old password.';
        oldPasswordError.style.display = 'block';
        console.log('Validation failed: Old password is empty.'); // Added log
        return;
    }

    console.log('Attempting to show loading indicator.'); // Added log
    toggleLoading(true); // Show loading indicator

    let data = null; // Initialize data to null
    try {
        console.log('loggedInUserId before URL construction:', loggedInUserId); // IMPORTANT: Check userId value
        const url = `${apiUrl}?action=verifyOldPassword&userId=${encodeURIComponent(loggedInUserId)}&oldPassword=${encodeURIComponent(oldPassword)}`;
        console.log('Constructed URL for fetchData:', url); // IMPORTANT: Check the full URL

        // Changed to a GET request by only passing the URL
        data = await fetchData(url); 

        // !!! IMPORTANT DEBUG LOG: See what data is returned from fetchData !!!
        console.log('Response data from App Script (verifyOldPassword):', data);

        if (data && data.success) { // Check if data exists AND App Script indicates success
            showAlert("Old password verified successfully!", 3000);
            
            // Transition to the new password section
            if (resetPasswordOldSection) resetPasswordOldSection.style.display = 'none';
            if (resetPasswordNewSection) resetPasswordNewSection.style.display = 'block';
            
            // Clear new password fields and focus
            if (newPasswordField) newPasswordField.value = '';
            if (confirmNewPasswordField) confirmNewPasswordField.value = '';
            if (newPasswordError) newPasswordError.style.display = 'none'; // Clear any old new password errors
            if (newPasswordField) newPasswordField.focus();

        } else {
            // This block executes if:
            // 1. fetchData returned null (meaning it failed after all retries or had a serious issue)
            // 2. fetchData returned data, but data.success was false (App Script explicitly denied)

            if (data === null) {
                // fetchData itself would have already shown a general network error alert (if it reached the end of retries).
                oldPasswordError.textContent = 'Verification failed: Could not connect to server or response error.';
                oldPasswordError.style.display = 'block';
                console.error('Data from fetchData was null. Check network or App Script deployment/response format.'); // Specific error log
            } else {
                // App Script responded, but with success: false
                // Use the message from App Script, or a generic one if no message is provided
                oldPasswordError.textContent = data.message || 'Incorrect old password. Please try again.';
                oldPasswordError.style.display = 'block';
                console.log('App Script returned success: false. Message:', data.message); // Specific error log
                if (data.message) { // Only show general alert if there's a specific message
                    showAlert(data.message, 4000);
                }
            }
        }
    } catch (error) {
        // This catch block is for unexpected errors within verifyOldPassword's own logic,
        // as fetchData's internal catch handles network errors.
        console.error('An unexpected error occurred in verifyOldPassword function:', error);
        showAlert("An unexpected client-side error occurred during password verification.", 5000);
        oldPasswordError.textContent = 'An unexpected error occurred.';
        oldPasswordError.style.display = 'block';
    } finally {
        console.log('Hiding loading indicator.'); // Added log
        toggleLoading(false); // Hide loading indicator
    }
}

async function setNewPassword() {
    const newPassword = newPasswordField.value;
    const confirmNewPassword = confirmNewPasswordField.value;
    newPasswordError.style.display = 'none'; // Hide previous errors

    if (!newPassword || !confirmNewPassword) {
        newPasswordError.textContent = 'Both new password fields cannot be empty.';
        newPasswordError.style.display = 'block';
        return false; // Indicate failure
    }

    if (newPassword !== confirmNewPassword) {
        newPasswordError.textContent = 'New password and confirm password do not match.';
        newPasswordError.style.display = 'block';
        return false; // Indicate failure
    }

    if (newPassword.length < 6) { // Example: minimum 6 characters
        newPasswordError.textContent = 'New password must be at least 6 characters long.';
        newPasswordError.style.display = 'block';
        return false; // Indicate failure
    }

    toggleLoading(true); // Show global loading indicator

    // --- Visual feedback indicators, similar to logStatus ---
    let successIndicator = document.createElement("div");
    successIndicator.textContent = "Sending...";
    successIndicator.style.color = "blue";
    document.getElementById("controls").appendChild(successIndicator); // Assuming 'controls' is where you want these messages

    // Prepare the data to send in the request body as JSON
    const requestData = {
        action: "setNewPassword",
        userId: loggedInUserId,
        newPassword: newPassword
    };

    let isSuccess = false; // Flag to track perceived success

    try {
        console.log('Sending direct fetch POST request (with no-cors mode, data in body) to:', apiUrl);
        console.log('Request body data:', requestData);

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            mode: 'no-cors', // Still in no-cors mode
            body: JSON.stringify(requestData) // Data sent as JSON body
        });

        console.log('Response object (with no-cors mode):', response);

        if (response.type === 'opaque') {
            isSuccess = true; // Request successfully initiated, treat as success from client perspective
        } else {
            // This path would rarely be hit in 'no-cors' unless there's an unexpected browser-level response type
            console.error('Fetch did not result in an opaque response (but no explicit network error):', response);
            isSuccess = false;
        }

    } catch (error) {
        console.error('An unexpected client-side error occurred in setNewPassword function (no-cors attempt):', error);
        isSuccess = false; // Network error or other fetch error
    } finally {
        toggleLoading(false); // Hide global loading indicator
        successIndicator.remove(); // Remove the "Sending..." indicator

        // Clear password fields regardless of success/failure
        if (oldPasswordField) oldPasswordField.value = '';
        if (newPasswordField) newPasswordField.value = '';
        if (confirmNewPasswordField) confirmNewPasswordField.value = '';

        // --- Hide the password dialog ---
        if (resetPasswordDialog) {
            resetPasswordDialog.style.display = 'none';
        }

        // --- NEW: Remove any general overlay that might be active ---
        const generalOverlay = document.querySelector('.overlay');
        if (generalOverlay) {
            generalOverlay.remove(); // Remove the element from the DOM
            console.log('General overlay removed.');
        }

        if (isSuccess) {
            let successMessageDiv = document.createElement("div"); // Similar to logStatus
            successMessageDiv.textContent = "Password updated successfully!";
            successMessageDiv.style.color = "green";
            document.getElementById("controls").appendChild(successMessageDiv);
            showAlert("Password updated successfully!", 6000, 'success');
            setTimeout(() => { successMessageDiv.remove(); }, 3000); // Remove success message after 3 seconds
            return true; // Indicate client-side perceived success
        } else {
            let errorMessageDiv = document.createElement("div"); // Similar to logStatus
            errorMessageDiv.textContent = "Failed to update password. Check console for details.";
            errorMessageDiv.style.color = "red";
            document.getElementById("controls").appendChild(errorMessageDiv);
            showAlert("Failed to update password after attempt. Check console for browser errors.", 5000, 'error');
            setTimeout(() => { errorMessageDiv.remove(); }, 5000); // Remove error message after 5 seconds
            newPasswordError.textContent = 'Password update failed.'; // Update specific error field
            newPasswordError.style.display = 'block'; // Make it visible
            return false; // Indicate client-side failure
        }
    }
}

function showUserInfoDialog() {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.style.display = 'block';
    document.body.appendChild(overlay);
    // Retrieve individual user data from localStorage
    const agentName = localStorage.getItem('loggedInUserName');
    const userId = localStorage.getItem('loggedInUserId');
    const shiftStart = localStorage.getItem('shiftStart');
    const shiftEnd = localStorage.getItem('shiftEnd');
    const breakDuration = localStorage.getItem('breakDuration');
    const lunchDuration = localStorage.getItem('lunchDuration');

    // Combine shift schedule for display
    const shiftSchedule = (shiftStart && shiftEnd) ? `${shiftStart} - ${shiftEnd}` : 'N/A';

    // Populate the dialog with retrieved data (with checks for null elements)
    if (userId && agentName) {
        if (userInfoAgentName) userInfoAgentName.textContent = agentName;
        if (userInfoUserId) userInfoUserId.textContent = userId;
        if (userInfoShiftSchedule) userInfoShiftSchedule.textContent = shiftSchedule;
        if (userInfoAllowedBreakDuration) userInfoAllowedBreakDuration.textContent = breakDuration ? `${breakDuration} mins` : 'N/A';
        if (userInfoAllowedLunchDuration) userInfoAllowedLunchDuration.textContent = lunchDuration ? `${lunchDuration} mins` : 'N/A';
    } else {
        // Fallback if data is not found
        if (userInfoAgentName) userInfoAgentName.textContent = 'Not Available';
        if (userInfoUserId) userInfoUserId.textContent = 'Not Available';
        if (userInfoShiftSchedule) userInfoShiftSchedule.textContent = 'Not Available';
        if (userInfoAllowedBreakDuration) userInfoAllowedBreakDuration.textContent = 'Not Available';
        if (userInfoAllowedLunchDuration) userInfoAllowedLunchDuration.textContent = 'Not Available';
        showAlert("User info not found in local storage. Please log in.", 4000, 'error');
    }

    // Display the dialog and its custom overlay
    if (userInfoDialog) userInfoDialog.style.display = 'block';
}

function hideUserInfoDialog() {
    const overlay = document.querySelector('.overlay');
    if (userInfoDialog) userInfoDialog.style.display = 'none';
    if (overlay) document.body.removeChild(overlay);
}

let activeButton = null; // Store reference to the active button

function autoSyncPendingLogs() {
    console.log("Triggering worker to resend logs...");
    logWorker.postMessage({ action: "resendLogs" });
}

async function startTimer(status) {
    if (isRunning) return;

    // Prevent empty timers for break/lunch
    if (status === "break" || status === "lunch") {
        let allowedMinutes = parseInt(localStorage.getItem(status + "Duration"), 10) || 0;
        if (allowedMinutes <= 0) {
            createCustomDialog(
                `Your ${status} duration is not set. Please update your schedule first.`,
                () => showScheduleUpdateDialog(true),
                () => console.log(`${status} timer start canceled — schedule not set.`),
                "Update Schedule",
                "Cancel"
            );
            return;
        }
    }

    const confirmationMessage = `Are you sure you want to start the 
        <span class="dialog-status-text">
            <img src="${status}.png" alt="${status} icon" class="dialog-status-icon">
            ${status.charAt(0).toUpperCase() + status.slice(1)}
            <img src="${status}.png" alt="${status} icon" class="dialog-status-icon">
        </span> timer?`;

    createCustomDialog(
        confirmationMessage,
        async () => {
            console.log("startTimer() confirm callback for:", status);

            startTime = Date.now();
            initialStartTime = startTime;
            const startTimestamp = new Date(startTime + (8 * 60 * 60 * 1000))
                .toISOString()
                .replace("T", " ")
                .split(".")[0];

            isRunning = true;
            lastStatus = status;
            updateSettingsButtonVisibility();

            const agentNameElement = document.getElementById("agentName");
            const loggedInUserName = localStorage.getItem("loggedInUserName");
            if (agentNameElement && loggedInUserName) {
                agentNameElement.innerHTML =
                    `Hi, ${loggedInUserName}, you are currently on 
                    <span class="status-active-color">
                        ${status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>`;
            }

            // Update UI buttons
            document.getElementById("breakBtn").style.display = "none";
            document.getElementById("lunchBtn").style.display = "none";
            document.getElementById("bioBtn").style.display = "none";
            document.getElementById("stopBtn").style.display = "inline-block";
            document.getElementById("historyBtn").style.display = "inline-block";
            document.getElementById("historyBtn").disabled = true;
            document.getElementById("logoutBtn").style.display = "none";

            // Save state locally (for restore after refresh)
            localStorage.setItem("isRunning", "true");
            localStorage.setItem("startTime", startTime);
            localStorage.setItem("initialStartTime", initialStartTime);
            localStorage.setItem("status", status);
            localStorage.setItem("lastStatus", lastStatus);
            
            // Allowed minutes
            let allowedMinutes = 0;
            if (status === "break") {
                allowedMinutes = parseInt(localStorage.getItem("breakDuration"), 10) || 0;
            } else if (status === "lunch") {
                allowedMinutes = parseInt(localStorage.getItem("lunchDuration"), 10) || 0;
            }

            const now = new Date();
            const phtOptions = { timeZone: 'Asia/Manila' };
            const phtStartTime = now.toLocaleString('en-US', phtOptions);
            let phtStopTime = '';
            if (allowedMinutes > 0) {
                const stopDateTime = new Date(now.getTime() + allowedMinutes * 60 * 1000);
                phtStopTime = stopDateTime.toLocaleString('en-US', phtOptions);
            }

            // Start timer in worker
            timerWorker.postMessage({ action: "start", data: { status, allowedMinutes, phtStartTime, phtStopTime } });

            if (timerOverlay) {
                applyOverlayBackground();
                circle.classList.add("booting");
                timerOverlay.style.display = "flex";
                setTimeout(() => circle.classList.remove("booting"), 1500);
            }

            // ✅ Queue start log in logWorker
const startLogData = {
  userId: loggedInUserId,
  name: loggedInUserName,
  status: status,                  // break, lunch, bio
  device: getDeviceType(),
  timestamp: startTimestamp,
  duration: "",                    // <--- empty string = start/pending
  expectedDurationMinutes:
    status === "break"
      ? parseInt(localStorage.getItem("breakDuration"), 10) || 0
      : status === "lunch"
      ? parseInt(localStorage.getItem("lunchDuration"), 10) || 0
      : 0,
};

// ✅ Send to worker
logWorker.postMessage({ action: "saveLog", data: startLogData });
            document.getElementById("historyBtn").disabled = false;
        },
        () => console.log("Start timer cancelled for:", status)
    );
}


// --- RESTORE TIMER ---
function restoreTimer() {
    let savedStartTime = parseInt(localStorage.getItem("startTime"), 10);
    let savedInitialStartTime = parseInt(localStorage.getItem("initialStartTime"), 10);
    let savedStatus = localStorage.getItem("status");
    let savedLastStatus = localStorage.getItem("lastStatus");

    if (!savedStartTime || !savedStatus) return;

    startTime = savedStartTime;
    initialStartTime = savedInitialStartTime || savedStartTime;
    isRunning = true;
    lastStatus = savedLastStatus;

    const agentNameElement = document.getElementById("agentName");
    const loggedInUserName = localStorage.getItem("loggedInUserName");
    if (agentNameElement && loggedInUserName) {
        agentNameElement.innerHTML =
            `Hi, ${loggedInUserName}, you are currently on 
            <span class="status-active-color">
                ${savedStatus.charAt(0).toUpperCase() + savedStatus.slice(1)}
            </span>`;
    }

    // Update UI buttons
    document.getElementById("breakBtn").style.display = "none";
    document.getElementById("lunchBtn").style.display = "none";
    document.getElementById("bioBtn").style.display = "none";
    document.getElementById("stopBtn").style.display = "inline-block";
    document.getElementById("historyBtn").style.display = "inline-block";
    document.getElementById("historyBtn").disabled = false;
    document.getElementById("logoutBtn").style.display = "none";

    let allowedMinutes = 0;
    if (savedStatus === "break") {
        allowedMinutes = parseInt(localStorage.getItem("breakDuration"), 10) || 0;
    } else if (savedStatus === "lunch") {
        allowedMinutes = parseInt(localStorage.getItem("lunchDuration"), 10) || 0;
    }

    const restoredDate = new Date(savedStartTime);
    const phtOptions = { timeZone: 'Asia/Manila' };
    const phtStartTime = restoredDate.toLocaleString('en-US', phtOptions);
    let phtStopTime = '';
    if (allowedMinutes > 0) {
        const stopDateTime = new Date(savedStartTime + allowedMinutes * 60 * 1000);
        phtStopTime = stopDateTime.toLocaleString('en-US', phtOptions);
    }

    timerWorker.postMessage({
        action: "restore",
        data: { startTime: savedStartTime, status: savedStatus, allowedMinutes, phtStartTime, phtStopTime }
    });

    console.log("Timer restored on page load for status:", savedStatus);
    enableTimerButtons();
    applyOverlayBackground();
    circle.classList.add("booting");
    timerOverlay.style.display = "flex";

    setTimeout(() => circle.classList.remove("booting"), 1500);
}


async function stopTimer() {
    if (!isRunning) return;

    isRunning = false;
    resetProgressRingColor();
    updateSettingsButtonVisibility();

    stopTime = Date.now();
    const stopTimestamp = new Date(stopTime + (8 * 60 * 60 * 1000))
        .toISOString()
        .replace("T", " ")
        .split(".")[0];

    let elapsedTime = stopTime - startTime;
    let duration = formatTime(elapsedTime);

    const timerDisplay = document.getElementById("timer");
    const warningTextElement = document.getElementById("timerWarning");
    if (timerDisplay) timerDisplay.classList.remove("exceeded");
    if (warningTextElement) warningTextElement.textContent = "";

    document.getElementById("stopBtn").style.display = "none";
    disableTimerButtons();

    if (activeButton) {
        activeButton.querySelector(".button-text").textContent =
            activeButton.id.charAt(0).toUpperCase() + activeButton.id.slice(1, -3);
        activeButton.classList.remove("active-status");
        activeButton = null;
    }

    const agentNameElement = document.getElementById("agentName");
    const loggedInUserName = localStorage.getItem("loggedInUserName");
    if (agentNameElement && loggedInUserName) {
        agentNameElement.textContent = "Welcome, " + loggedInUserName;
    }

    // Show main buttons again
    document.getElementById("breakBtn").style.display = "flex";
    document.getElementById("lunchBtn").style.display = "flex";
    document.getElementById("bioBtn").style.display = "flex";
    document.getElementById("logoutBtn").style.display = "inline-block";

    // Stop worker timer
    timerWorker.postMessage({ action: "stop" });

    // ✅ Queue stop log
const stopLogData = {
  userId: loggedInUserId,
  name: loggedInUserName,
  status: lastStatus,
  device: getDeviceType(),
  timestamp: stopTimestamp,
  duration, // <--- non-empty string = stop log
  expectedDurationMinutes:
    lastStatus === "break"
      ? parseInt(localStorage.getItem("breakDuration"), 10) || 0
      : lastStatus === "lunch"
      ? parseInt(localStorage.getItem("lunchDuration"), 10) || 0
      : 0,
};

// ✅ Send to worker
logWorker.postMessage({ action: "saveLog", data: stopLogData });

    // Clear timer state locally (UI only)
    localStorage.removeItem("isRunning");
    localStorage.removeItem("startTime");
    localStorage.removeItem("initialStartTime");
    localStorage.removeItem("status");
    localStorage.removeItem("lastStatus");
    lastStatus = "";

    document.getElementById("timer").textContent = "00:00:00";
    enableTimerButtons();
    document.getElementById("logoutBtn").style.display = "inline-block";
    document.getElementById("logoutBtn").disabled = false;
}



function playAlarm() {
  const alarmAudio = new Audio("alarm.wav"); // make sure alarm.wav is in your assets
  alarmAudio.play().catch(err => console.error("Alarm play error:", err));
}

function showSystemNotification(message) {
  if (!("Notification" in window)) {
    showAlert(message);
    return;
  }

  if (Notification.permission === "granted") {
    new Notification("Agent Break Tracker", { body: message });
  } else {
    showAlert(message); // fallback if denied
  }
}

function showSendingOverlay() {
  let overlay = document.getElementById("sendingOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "sendingOverlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0,0,0,0.3)";
    overlay.style.zIndex = "3000";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.pointerEvents = "auto"; // Block clicks
    overlay.innerHTML = `<div style="color: white; font-size: 18px;">Sending...</div>`;
    document.body.appendChild(overlay);
  } else {
    overlay.style.display = "flex";
  }
}

function hideSendingOverlay() {
  const overlay = document.getElementById("sendingOverlay");
  if (overlay) {
    overlay.style.display = "none";
  }
}

function showSentDialog() {
  let dialog = document.createElement("div");
  dialog.className = "sent-dialog";
  dialog.textContent = "Sent!";
  dialog.style.position = "fixed";
  dialog.style.top = "50%";
  dialog.style.left = "50%";
  dialog.style.transform = "translate(-50%, -50%)";
  dialog.style.background = "rgba(0, 0, 0, 0.8)";
  dialog.style.color = "lime";
  dialog.style.padding = "15px 25px";
  dialog.style.borderRadius = "10px";
  dialog.style.fontSize = "18px";
  dialog.style.zIndex = "4000";
  document.body.appendChild(dialog);

  setTimeout(() => {
    if (dialog && dialog.parentNode) {
      dialog.parentNode.removeChild(dialog);
    }
  }, 1500);
}


function disableTimerButtons() {
    document.getElementById("breakBtn").disabled = true;
    document.getElementById("lunchBtn").disabled = true;
    document.getElementById("bioBtn").disabled = true;
    document.getElementById("stopBtn").disabled = true;
    document.getElementById("historyBtn").disabled = true;
    document.getElementById("logoutBtn").disabled = true; // Add this
}

function enableTimerButtons() {
    document.getElementById("breakBtn").disabled = false;
    document.getElementById("lunchBtn").disabled = false;
    document.getElementById("bioBtn").disabled = false;
    document.getElementById("stopBtn").disabled = false;
    document.getElementById("historyBtn").disabled = false;
    document.getElementById("logoutBtn").disabled = false; // Add this
}

function createTimerWarningElement() {
    const warningElement = document.createElement("div");
    warningElement.id = "timerWarning";
    // The styling is now in the CSS
    const timerDisplay = document.getElementById("timer");
    if (timerDisplay && timerDisplay.parentNode) {
        timerDisplay.parentNode.insertBefore(warningElement, timerDisplay.nextSibling);
    }
    return warningElement;
}

function logStatus(status, duration = "", startTimeOverride = null, endTimeOverride = null, timestampOverride = null) {
  const currentLogData = {
    userId: loggedInUserId,
    name: document.getElementById("agentName").textContent.replace("Welcome, ", ""),
    status: status.replace(" pending", ""),
    device: getDeviceType(),
    timestamp: timestampOverride
      ? timestampOverride
      : new Date(Date.now() + (8 * 60 * 60 * 1000))
          .toISOString()
          .replace("T", " ")
          .split(".")[0],
    duration,
    startTime: startTimeOverride
      ? new Date(startTimeOverride).toISOString().replace("T", " ").split(".")[0]
      : undefined,
    endTime: endTimeOverride
      ? new Date(endTimeOverride).toISOString().replace("T", " ").split(".")[0]
      : undefined,
  };

  // ✅ Just queue it — don't block clicks for queued logs
  logWorker.postMessage({ action: "saveLog", data: currentLogData });
  console.log("Queued log for worker:", currentLogData);
}

const logWorker = new Worker("logWorker.js");

// Pass API URL to worker once at startup

logWorker.onmessage = (e) => {
  if (e.data.type === "logSendingStart") {
    showSendingOverlay();
  }
  if (e.data.type === "logSuccess") {
    hideSendingOverlay();
    showSentDialog();
  }
  if (e.data.type === "logFailure") {
    hideSendingOverlay();
    showAlert("Failed to send. Will retry automatically.");
  }
  if (e.data.type === "logSendingEnd") {
    hideSendingOverlay();
  }
};



function formatTime(ms) {
    let totalSeconds = Math.floor(ms / 1000);
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

document.getElementById("breakBtn").addEventListener("click", async () => await startTimer("break"));
document.getElementById("lunchBtn").addEventListener("click", async () => await startTimer("lunch"));
document.getElementById("bioBtn").addEventListener("click", async () => await startTimer("bio"));
document.getElementById("stopBtn").addEventListener("click", async () => await stopTimer());

document.getElementById("logoutBtn").addEventListener("click", async () => {
    const logoutBtn = document.getElementById("logoutBtn");
    const originalText = logoutBtn.textContent;
    logoutBtn.textContent = "Logging Out...";
    logoutBtn.disabled = true;
    const frame = document.getElementById("logoutFrame");
    frame.src = "logoutFrame.html";

    const onLoadHandler = () => {
        console.log("iframe loaded");
        createCustomDialog(
            "Are you sure you want to log out?",
            async () => {
                console.log("Custom dialog confirmed");
                logStatus("logged out");
                const clearScheduleUrl = `${apiUrl}?action=clearSchedule&userId=${loggedInUserId}`;
                try {
                    const clearResult = await fetchData(clearScheduleUrl);
                    if (clearResult && clearResult.success) {
                        console.log("Schedule removed on server.");
                        // Clear schedule from localStorage on successful server removal
                        localStorage.removeItem("shiftStart");
                        localStorage.removeItem("shiftEnd");
                        localStorage.removeItem("breakDuration");
                        localStorage.removeItem("lunchDuration");
                    } else {
                        console.error("Error removing schedule on server.");
                        showAlert("Error removing schedule on server.");
                    }
                } catch (error) {
                    console.error("Error sending remove schedule request:", error);
                    showAlert("Error communicating with the server to remove schedule.");
                }
                frame.contentWindow.postMessage("logoutConfirmed", "*");
            },
            () => {
                console.log("Custom dialog canceled");
                frame.src = "";
                logoutBtn.textContent = originalText;
                logoutBtn.disabled = false;
            }
        );
        frame.removeEventListener("load", onLoadHandler);
    };

    frame.addEventListener("load", onLoadHandler);
});

document.getElementById("closeHistoryBtn").addEventListener("click", function() {
    let historyDisplay = document.getElementById("historyDisplay"); // Get reference to historyDisplay
    historyDisplay.style.display = "none"; // Hide the history dialog

    // 2. Hide and remove the overlay
    const overlay = document.querySelector('.overlay'); // Find the active overlay
    if (overlay) { // Ensure it exists before trying to remove it
        document.body.removeChild(overlay);
    }
});

document.getElementById("exportHistoryBtn").addEventListener("click", () => {
    createCustomDialog(
        "This will download a file of all your logs. Continue?",
        () => { // Confirm callback
            const userId = localStorage.getItem("agentId");
    	    const apiUrl = "https://script.google.com/macros/s/AKfycbwYHKuwi2uq7OKqpT7VC6QPyPitxPjd9XdRmAcvH24UHhBfklHufhCTj_vjkbML0Syu3Q/exec"; // Replace with your Apps Script URL

    if (userId) {
        const url = `${apiUrl}?action=exportData&userId=${userId}`;

                const downloadLink = document.createElement("a");
                downloadLink.href = url;
                downloadLink.style.display = "none";
                document.body.appendChild(downloadLink);

                downloadLink.click();

                document.body.removeChild(downloadLink);
            } else {
                console.error("User ID not found in localStorage.");
            }
        },
        () => { // Cancel callback (no action needed)
            // Dialog will close automatically
        }
    );
});

function getCurrentAppVersion() {
    const metaTag = document.querySelector('meta[name="app-version"]');
    return metaTag ? metaTag.content : null;
}

// Function to fetch the latest app version from the server
async function fetchLatestAppVersion() {
    try {
        // Fetch index.html itself (or a small version.json file if you created one)
        // By fetching index.html, we ensure we get the latest meta tag content.
        const response = await fetch('/', { cache: 'no-store' }); // Ensure no caching for this fetch
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const latestMetaTag = doc.querySelector('meta[name="app-version"]');
        return latestMetaTag ? latestMetaTag.content : null;
    } catch (error) {
        console.error('Failed to fetch latest app version:', error);
        return null;
    }
}

// Function to check for updates and refresh if necessary
async function checkForUpdatesAndRefresh() {
    const currentVersion = getCurrentAppVersion();
    const latestVersion = await fetchLatestAppVersion();

    console.log('Current App Version:', currentVersion);
    console.log('Latest App Version:', latestVersion);

    if (currentVersion && latestVersion && currentVersion !== latestVersion) {
        console.log('New app version detected! Reloading page...');
        // Optional: Show a user-friendly message before reloading
        showAlert("A new version of the application is available. Refreshing page...", 5000);
        location.reload(true); // Forces a full reload, bypassing cache
    } else {
        console.log('App is up to date.');
    }
}


// Set up periodic check (e.g., every 5 minutes)
// // Adjust the interval as needed. Too frequent can consume bandwidth.
const CHECK_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

function displayHistory(history) {
    const overlay = document.createElement('div');
    overlay.className = 'overlay'; // Reuses your existing overlay styles
    overlay.style.display = 'block'; // Make it visible
    document.body.appendChild(overlay); // Add it to the body

    let tableBody = document.getElementById("historyTable").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = "";

    history.forEach(record => {
        let row = document.createElement("tr");
        let statusCell = document.createElement("td");
        let startTimeCell = document.createElement("td");
        let endTimeCell = document.createElement("td");
        let durationCell = document.createElement("td");

        statusCell.textContent = record.status;
        startTimeCell.textContent = record.startTime;
        endTimeCell.textContent = record.endTime;
        durationCell.textContent = record.duration;

        row.appendChild(statusCell);
        row.appendChild(startTimeCell);
        row.appendChild(endTimeCell);
        row.appendChild(durationCell);

        tableBody.appendChild(row); // Append the row to the table body
    });
}