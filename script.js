let timerInterval;
let startTime;
let initialStartTime; // To store the very first start time
let stopTime; // To store the exact stop time
let isRunning = false;
let loggedInUserId = "";
const apiUrl = "https://script.google.com/macros/s/AKfycbz9huQLWfKbiwWuX8t_IxSjrIQFkEIGniaUYI362Gpoq2tzCUYRHO1nCRI9s-6vqbcmfw/exec";
let lastStatus = "";
let lastAlertTime = 0;
let failedStartLog = null; // Add this line

const timerDisplay = document.getElementById("timer");

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

// Function to create a custom dialog
function createCustomDialog(message, confirmCallback, cancelCallback) {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.style.display = 'block'; // Make the overlay visible
    document.body.appendChild(overlay);

    const dialog = document.createElement('div');
    dialog.className = 'custom-dialog';

    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    dialog.appendChild(messageElement);

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
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
        const confirmButton = document.createElement('button');
        confirmButton.textContent = 'Yes';
        confirmButton.className = 'custom-dialog-button confirm-button';
        confirmButton.addEventListener('click', () => {
            removeDialog();
            confirmCallback();
        });
        buttonContainer.appendChild(confirmButton);
    }

    const cancelButton = document.createElement('button');
    cancelButton.textContent = confirmCallback ? 'No' : 'Close';
    cancelButton.className = 'custom-dialog-button cancel-button';
    cancelButton.addEventListener('click', () => {
        removeDialog();
        if (cancelCallback) { cancelCallback(); }
    });
    buttonContainer.appendChild(cancelButton);

    dialog.appendChild(buttonContainer);
    document.body.appendChild(dialog); // Append the dialog to the body
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

    const versionParagraph = document.createElement('p');
    versionParagraph.textContent = "Version: 69.0";
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

function showScheduleUpdateDialog() {
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

    const breakDurationLabel = document.createElement('label');
    breakDurationLabel.textContent = "Default Break Duration:";
    const breakDurationSelect = document.createElement('select');
    breakDurationSelect.id = 'dialogBreakDuration';
    const breakOption15 = document.createElement('option');
    breakOption15.value = '15';
    breakOption15.textContent = '15 minutes';
    const breakOption30 = document.createElement('option');
    breakOption30.value = '30';
    breakOption30.textContent = '30 minutes';
    breakDurationSelect.appendChild(breakOption15);
    breakDurationSelect.appendChild(breakOption30);

    const lunchDurationLabel = document.createElement('label');
    lunchDurationLabel.textContent = "Default Lunch Duration:";
    const lunchDurationSelect = document.createElement('select');
    lunchDurationSelect.id = 'dialogLunchDuration';
    const lunchOption30 = document.createElement('option');
    lunchOption30.value = '30';
    lunchOption30.textContent = '30 minutes';
    const lunchOption60 = document.createElement('option');
    lunchOption60.value = '60';
    lunchOption60.textContent = '60 minutes';
    lunchDurationSelect.appendChild(lunchOption30);
    lunchDurationSelect.appendChild(lunchOption60);

    const updateButton = document.createElement('button');
    updateButton.textContent = 'Update Schedule';
    updateButton.id = 'dialogUpdateScheduleBtn';
    updateButton.className = 'custom-dialog-button confirm-button';

    dialog.appendChild(shiftStartLabel);
    dialog.appendChild(shiftStartInput);
    dialog.appendChild(shiftEndLabel);
    dialog.appendChild(shiftEndInput);
    dialog.appendChild(breakDurationLabel);
    dialog.appendChild(breakDurationSelect);
    dialog.appendChild(lunchDurationLabel);
    dialog.appendChild(lunchDurationSelect);
    dialog.appendChild(updateButton);

    document.body.appendChild(dialog);

    updateButton.addEventListener('click', async () => {
        const shiftStart = document.getElementById('dialogShiftStart').value;
        const shiftEnd = document.getElementById('dialogShiftEnd').value;
        const breakDuration = document.getElementById('dialogBreakDuration').value;
        const lunchDuration = document.getElementById('dialogLunchDuration').value;

        if (!shiftStart || !shiftEnd || !breakDuration || !lunchDuration) {
            showAlert("Please enter all schedule details.");
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

                removeScheduleDialog();
                document.getElementById("controls").style.display = "block";
                document.getElementById("logoutBtn").style.display = "inline-block";
                timerDisplay.style.display = "block";
                timerDisplay.textContent = "00:00:00";
            } else {
                showAlert("Error updating schedule.");
            }
        } catch (error) {
            updateButton.textContent = "Update Schedule";
            updateButton.disabled = false;
            showAlert("Error communicating with the server to update schedule.");
        }
    });
}

function removeScheduleDialog() {
    const overlay = document.querySelector('.overlay');
    const dialog = document.getElementById('scheduleDialog');
    if (overlay) document.body.removeChild(overlay);
    if (dialog) document.body.removeChild(dialog);
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


async function fetchData(url, retryCount = 3) {
    let attempts = 0;
    while (attempts < retryCount) {
        try {
            attempts++;
            console.log(`Fetch attempt ${attempts} to: ${url}`); // Log the fetch attempt
            const response = await fetch(url);

            if (!response.ok) {
                console.log(`Fetch attempt ${attempts} failed with status: ${response.status}`); // Log the failed status
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(`Fetch attempt ${attempts} successful:`, data); // Log the successful response
            return data;
        } catch (error) {
            console.error(`Fetch error (attempt ${attempts}):`, error); // Log the error
            if (attempts < retryCount) {
                console.log(`Retrying in 2 seconds...`);
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retrying
            } else {
                console.log(`All ${retryCount} fetch attempts failed.`); // Log the failure after retries
                showAlert("An error occurred after multiple retries. Please check your network connection.");
                return null;
            }
        }
    }
    return null; // Return null if all retries fail
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
    }
});

document.getElementById("historyBtn").addEventListener("click", async function() {
    const historyUrl = `${apiUrl}?action=history&userId=${loggedInUserId}`;

    document.getElementById("historyBtn").textContent = "Loading...";
    document.getElementById("historyBtn").disabled = true;

    // Resend any pending logs before fetching history
    await resendPendingLogs();

    try {
        const historyData = await fetchData(historyUrl);

        document.getElementById("historyBtn").textContent = "History";
        document.getElementById("historyBtn").disabled = false;

        if (historyData && historyData.success) { // Check if historyData is not null
            displayHistory(historyData.history);
            document.getElementById("historyDisplay").style.display = "block";
        } else {
            showAlert("Error retrieving history.");
        }
    } catch (error) {
        document.getElementById("historyBtn").textContent = "History";
        document.getElementById("historyBtn").disabled = false;
        // fetchData already handles error display, nothing to do here.
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
            showScheduleUpdateDialog();
        }

        if (isRunning && savedStatus) {
            restoreTimer();
            console.log("Timer restored on page load for status:", savedStatus);
        } else {
            timerDisplay.textContent = "00:00:00";
        }

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
});

let activeButton = null; // Store reference to the active button

async function resendPendingLogs() {
    const pendingStartLogData = localStorage.getItem("pendingStartLog");
    const pendingStopLogData = localStorage.getItem("pendingStopLog");

    if (pendingStartLogData) {
        const startLogData = JSON.parse(pendingStartLogData);
        console.log("Attempting to resend pending start log (on new start/fetch):", startLogData);
        const startSuccess = await logStatus(
            startLogData.status,
            "",
            startLogData.initialStartTime,
            "",
            undefined,
            startLogData.timestamp
        );
        if (startSuccess) {
            localStorage.removeItem("pendingStartLog");
            console.log("Pending start log resent successfully!");
            showAlert("Pending start log resent successfully!");
        } else {
            console.error("Failed to resend pending start log.");
            showAlert("Failed to resend pending start log.");
        }
    }

    if (pendingStopLogData) {
        const stopLogData = JSON.parse(pendingStopLogData);
        console.log("Attempting to resend pending stop log (on new start/fetch):", stopLogData);
        const stopSuccess = await logStatus(
            stopLogData.status,
            stopLogData.duration,
            stopLogData.startTime,
            stopLogData.endTime,
            undefined,
            stopLogData.timestamp
        );
        if (stopSuccess) {
            localStorage.removeItem("pendingStopLog");
            localStorage.removeItem("retryScheduled"); // Clean up retry flag if it exists
            console.log("Pending stop log resent successfully!");
            showAlert("Pending stop log resent successfully!");
        } else {
            console.error("Failed to resend pending stop log.");
            showAlert("Failed to resend pending stop log.");
        }
    }
    localStorage.removeItem("retryScheduled"); // Ensure retry flag is cleared after attempt
}

async function startTimer(status) {
    if (isRunning) return;

    // Attempt to resend any pending logs at the start of a new timer
    await resendPendingLogs();

    const confirmationMessage = `Are you sure you want to start the ${status} timer?`;

    if (status === "break" || status === "lunch" || status === "bio") {
        createCustomDialog(
            confirmationMessage,
            async () => { // Confirm callback
                startTime = Date.now();
                initialStartTime = startTime; // Record the initial start time
                const startTimestamp = new Date(startTime + (8 * 60 * 60 * 1000)).toISOString().replace("T", " ").split(".")[0]; // Capture formatted start timestamp
                isRunning = true;
                lastStatus = status;

                document.getElementById("stopBtn").style.display = "inline-block";

                // Find the clicked button and update its text and color
                if (status === "break") {
                    activeButton = document.getElementById("breakBtn");
                } else if (status === "lunch") {
                    activeButton = document.getElementById("lunchBtn");
                }
                else if (status === "bio") {
                    activeButton = document.getElementById("bioBtn");
                }

                if (activeButton) {
                    activeButton.textContent = status.charAt(0).toUpperCase() + status.slice(1) + " - In Progress";
                    activeButton.classList.add("active-status");
                }

                // Disable all action buttons and history button on timer start
                document.getElementById("breakBtn").disabled = true;
                document.getElementById("lunchBtn").disabled = true;
                document.getElementById("bioBtn").disabled = true;
                document.getElementById("historyBtn").disabled = true;

                document.getElementById("logoutBtn").style.display = "none"; // Hide logout button on timer start

                localStorage.setItem("isRunning", "true");
                localStorage.setItem("startTime", startTime);
                localStorage.setItem("initialStartTime", initialStartTime); // Save initial start time
                localStorage.setItem("status", status);
                localStorage.setItem("lastStatus", lastStatus);

                const timerDisplay = document.getElementById("timer");
                const warningTextElement = document.getElementById("timerWarning") || createTimerWarningElement(); // Get existing or create

                let breakDuration = parseInt(localStorage.getItem("breakDuration"), 10) || 0;
                let lunchDuration = parseInt(localStorage.getItem("lunchDuration"), 10) || 0;
                let isExceeded = false; // Flag to track if time has been exceeded

                timerInterval = setInterval(() => {
                    let elapsedTime = Date.now() - startTime;
                    const formattedTime = formatTime(elapsedTime);
                    timerDisplay.textContent = formattedTime;

                    let allowedDurationMinutes = 0;
                    if (status === "break") {
                        allowedDurationMinutes = breakDuration;
                    } else if (status === "lunch") {
                        allowedDurationMinutes = lunchDuration;
                    }

                    if (allowedDurationMinutes > 0 && elapsedTime > allowedDurationMinutes * 60 * 1000) {
                        // Exceeded allowed time
                        timerDisplay.classList.add("exceeded");
                        warningTextElement.textContent = `You have exceeded your allowed ${status} time. Please stop the timer.`;
                        isExceeded = true;
                    } else {
                        // Within allowed time
                        timerDisplay.classList.remove("exceeded");
                        warningTextElement.textContent = "";
                        isExceeded = false;
                    }
                }, 1000);

                const logResult = await logStatus(status, "", initialStartTime, null, undefined, startTimestamp); // Pass startTimestamp
                if (!logResult) {
                    // If logging failed, save initial start time, status, and timestamp for potential later logging
                    localStorage.setItem("pendingStartLog", JSON.stringify({ initialStartTime: initialStartTime, status: status, timestamp: startTimestamp }));
                    showAlert("Start timer log failed. Will attempt to log on next start.");
                }
                // Enable history button after start log status is done (regardless of success/failure for now)
                document.getElementById("historyBtn").disabled = false;

            },
            () => { // Cancel callback
                console.log("Start timer cancelled for:", status);
            }
        );
    }
}

function restoreTimer() {
    let savedStartTime = parseInt(localStorage.getItem("startTime"), 10);
    let savedInitialStartTime = parseInt(localStorage.getItem("initialStartTime"), 10);
    let savedStatus = localStorage.getItem("status");
    let savedLastStatus = localStorage.getItem("lastStatus");

    if (!savedStartTime || !savedStatus) return;

    startTime = savedStartTime;
    initialStartTime = savedInitialStartTime || savedStartTime; // Fallback if initialStartTime not present
    isRunning = true;
    lastStatus = savedLastStatus;

    const timerDisplay = document.getElementById("timer");
    const warningTextElement = document.getElementById("timerWarning") || createTimerWarningElement(); // Get existing or create

    let breakDuration = parseInt(localStorage.getItem("breakDuration"), 10) || 0;
    let lunchDuration = parseInt(localStorage.getItem("lunchDuration"), 10) || 0;

    // Immediately check if the restored timer has exceeded the limit
    const elapsedTime = Date.now() - startTime;
    let allowedDurationMinutes = 0;
    if (savedStatus === "break") {
        allowedDurationMinutes = breakDuration;
    } else if (savedStatus === "lunch") {
        allowedDurationMinutes = lunchDuration;
    }

    if (allowedDurationMinutes > 0 && elapsedTime > allowedDurationMinutes * 60 * 1000) {
        timerDisplay.classList.add("exceeded");
        warningTextElement.textContent = `You have exceeded your allowed ${savedStatus} time. Please stop the timer.`;
    } else {
        timerDisplay.classList.remove("exceeded");
        warningTextElement.textContent = "";
    }

    document.getElementById("stopBtn").style.display = "inline-block";

    // Update the button appearance based on the saved status
    if (savedStatus === "break") {
        activeButton = document.getElementById("breakBtn");
    } else if (savedStatus === "lunch") {
        activeButton = document.getElementById("lunchBtn");
    } else if (savedStatus === "bio") {
        activeButton = document.getElementById("bioBtn");
    }

    if (activeButton) {
        activeButton.textContent = savedStatus.charAt(0).toUpperCase() + savedStatus.slice(1) + " - In Progress";
        activeButton.classList.add("active-status");
    }

    // Gray out other buttons
    document.getElementById("breakBtn").disabled = (savedStatus !== "break");
    document.getElementById("lunchBtn").disabled = (savedStatus !== "lunch");
    document.getElementById("bioBtn").disabled = (savedStatus !== "bio");
    document.getElementById("logoutBtn").disabled = true

    // Remove the old status message if it exists
    let oldStatusMessage = document.getElementById("statusMessage");
    if (oldStatusMessage) {
        oldStatusMessage.remove();
    }

    timerInterval = setInterval(() => {
        let elapsedTime = Date.now() - startTime;
        timerDisplay.textContent = formatTime(elapsedTime);

        let allowedDurationMinutes = 0;
        if (savedStatus === "break") {
            allowedDurationMinutes = breakDuration;
        } else if (savedStatus === "lunch") {
            allowedDurationMinutes = lunchDuration;
        }

        if (allowedDurationMinutes > 0 && elapsedTime > allowedDurationMinutes * 60 * 1000) {
            timerDisplay.classList.add("exceeded");
            warningTextElement.textContent = `You have exceeded your allowed ${savedStatus} time. Please stop the timer.`;
        } else {
            timerDisplay.classList.remove("exceeded");
            warningTextElement.textContent = "";
        }
    }, 1000);

    // Store the interval ID for restoration on next load if needed (though usually cleared on stop)
    localStorage.setItem(`intervalId_${savedStatus}`, timerInterval);

    // DO NOT CALL logStatus HERE
    console.log("Timer restored on page load for status:", savedStatus);
}

async function stopTimer() {
    if (!isRunning) return;
    clearInterval(timerInterval); // Clear the general timer interval

    // Clear the specific interval associated with the stopped status
    const currentIntervalId = localStorage.getItem(`intervalId_${lastStatus}`);
    if (currentIntervalId) {
        clearInterval(parseInt(currentIntervalId, 10));
        localStorage.removeItem(`intervalId_${lastStatus}`);
    }

    isRunning = false;
    stopTime = Date.now(); // Record the stop time
    const stopTimestamp = new Date(stopTime + (8 * 60 * 60 * 1000)).toISOString().replace("T", " ").split(".")[0]; // Capture formatted stop timestamp

    let elapsedTime = stopTime - startTime;
    let duration = formatTime(elapsedTime);

    const timerDisplay = document.getElementById("timer");
    const warningTextElement = document.getElementById("timerWarning");
    if (timerDisplay) {
        timerDisplay.classList.remove("exceeded"); // Remove the exceeded class on stop
    }
    if (warningTextElement) {
        warningTextElement.textContent = "";
    }

    document.getElementById("stopBtn").style.display = "none";

    // Disable all action buttons and history button when stop is initiated
    document.getElementById("breakBtn").disabled = true;
    document.getElementById("lunchBtn").disabled = true;
    document.getElementById("bioBtn").disabled = true;
    document.getElementById("historyBtn").disabled = true;

    // Revert the active button to its original state
    if (activeButton) {
        activeButton.textContent = activeButton.id.charAt(0).toUpperCase() + activeButton.id.slice(1, -3);
        activeButton.classList.remove("active-status");
        activeButton = null;
    }

    document.getElementById("logoutBtn").style.display = "none"; // Hide logout button during logStatus

    // Attempt to send any failed start log first (as per previous logic)
    const startLogSent = await sendFailedStartLog();

    // Attempt to log the stop action
    const endTimeAtClick = new Date(stopTime + (8 * 60 * 60 * 1000)).toISOString().replace("T", " ").split(".")[0];
    const stopLogResult = await logStatus(lastStatus, duration, initialStartTime, endTimeAtClick, undefined, stopTimestamp);

    if (!stopLogResult) {
        console.error("Failed to log stop status.");
        // Save the stop log details for a retry on the next start
        const stopLogData = {
            status: lastStatus,
            duration: duration,
            startTime: initialStartTime,
            endTime: endTimeAtClick,
            timestamp: stopTimestamp
        };
        localStorage.setItem("pendingStopLog", JSON.stringify(stopLogData));
        console.log("Stop log saved for retry on next start:", stopLogData);
    }

    lastStatus = "";

    localStorage.removeItem("isRunning");
    localStorage.removeItem("startTime");
    localStorage.removeItem("initialStartTime");
    localStorage.removeItem("status");
    localStorage.removeItem("lastStatus");

    document.getElementById("timer").textContent = "00:00:00";

    // Enable all action buttons and history button after logStatus completes
    document.getElementById("breakBtn").disabled = false;
    document.getElementById("lunchBtn").disabled = false;
    document.getElementById("bioBtn").disabled = false;
    document.getElementById("historyBtn").disabled = false;
    document.getElementById("logoutBtn").style.display = "inline-block"; // Make logout button visible again
    document.getElementById("logoutBtn").disabled = false; // Enable logout after logging
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

async function logStatus(status, duration = "", startTimeOverride = null, endTimeOverride = null, retryCount = 3, timestampOverride = null) {
    console.log("Log Status called with timestampOverride:", timestampOverride); // DEBUG LOG
    let attempts = 0;
    let successIndicator = document.createElement("div");
    successIndicator.textContent = "Sending...";
    successIndicator.style.color = "blue";
    document.getElementById("controls").appendChild(successIndicator);
    let isSuccess = false;
    let currentLogData = {
        userId: loggedInUserId,
        name: document.getElementById("agentName").textContent.replace("Welcome, ", ""),
        status: status.replace(" pending", ""),
        device: getDeviceType(),
        timestamp: timestampOverride ? timestampOverride : new Date(Date.now() + (8 * 60 * 60 * 1000)).toISOString().replace("T", " ").split(".")[0]
    };
    console.log("Current Log Data Timestamp:", currentLogData.timestamp); // DEBUG LOG

    if (startTimeOverride) {
        currentLogData.startTime = new Date(startTimeOverride).toISOString().replace("T", " ").split(".")[0];
    }
    if (endTimeOverride) {
        currentLogData.endTime = new Date(endTimeOverride).toISOString().replace("T", " ").split(".")[0];
    }
    if (duration) {
        currentLogData.duration = duration;
    }

    while (attempts < retryCount) {
        try {
            attempts++;
            console.log(`Log Status attempt ${attempts}:`, currentLogData);

            const response = await fetch(apiUrl, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(currentLogData)
            });

            console.log(`Log Status response (attempt ${attempts}):`, response);
            isSuccess = true;
            break; // Exit the loop on successful send

        } catch (error) {
            console.error(`Log Status error (attempt ${attempts}):`, error);
            if (attempts < retryCount) {
                console.log("Retrying Log Status in 2 seconds...");
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    }

    successIndicator.remove();

    if (isSuccess) {
        let successMessage = document.createElement("div");
        successMessage.textContent = "Data sent!";
        successMessage.style.color = "green";
        document.getElementById("controls").appendChild(successMessage);
        setTimeout(() => {
            successMessage.remove();
            if (duration !== "") {
                document.getElementById("logoutBtn").disabled = false;
            }
        }, 3000);
        return true; // Indicate success
    } else {
        showAlert(`Error: Failed to log status (${status}) after multiple retries. Check console.`);
        if (startTimeOverride && !duration && !endTimeOverride) {
            failedStartLog = { ...currentLogData };
            console.log("Failed start log saved:", failedStartLog);
            localStorage.setItem("failedStartLog", JSON.stringify(failedStartLog));
        }
        if (duration !== "") {
            document.getElementById("logoutBtn").disabled = false;
        }
        return false; // Indicate failure
    }
}

async function sendFailedStartLog() {
    const storedFailedStartLog = localStorage.getItem("failedStartLog");
    if (storedFailedStartLog) {
        const startLogData = JSON.parse(storedFailedStartLog);
        console.log("Attempting to send failed start log:", startLogData);
        const success = await logStatus(
            startLogData.status,
            "", // No duration for start
            startLogData.startTime,
            "",  // No endTime for start
            undefined, // Use default retry count
            startLogData.timestamp // Pass the stored timestamp
        );
        if (success) {
            localStorage.removeItem("failedStartLog");
            failedStartLog = null; // Clear the in-memory variable
            showAlert("Failed start log sent successfully!");
            return true;
        } else {
            showAlert("Failed to send start log. Will retry later.");
            return false;
        }
    }
    return true; // No failed start log to send
}

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

    try {
        await resendPendingLogs();
        console.log("resendPendingLogs completed."); // Add this log
    } catch (error) {
        console.error("Error during resendPendingLogs:", error);
        showAlert("An error occurred while trying to send pending logs.");
    }

    const onLoadHandler = () => {
        console.log("iframe loaded");
        createCustomDialog(
            "Are you sure you want to log out?",
            async () => {
                console.log("Custom dialog confirmed");
                await logStatus("logged out");
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
    document.getElementById("historyDisplay").style.display = "none";
});

document.getElementById("exportHistoryBtn").addEventListener("click", () => {
    createCustomDialog(
        "This will download a file of all your logs. Continue?",
        () => { // Confirm callback
            const userId = localStorage.getItem("agentId");
    	    const apiUrl = "https://script.google.com/macros/s/AKfycbwVSGD4wv0-AEsWZs4qC5XlYRRd2dSfFlIvHqI0wvmqQI6ryBdfcc03RmOFnLtrZ7O81g/exec"; // Replace with your Apps Script URL

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

function displayHistory(history) {
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