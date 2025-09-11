// logWorker.js
const LOG_QUEUE_DB = "logQueueDB";
let logQueue = [];
let isSending = false;
let apiUrl = "https://script.google.com/macros/s/AKfycbwz8RFdHxl5FEexE7vIuGpW5hMKFRTzrXavHuxIqvJ7RwpIlpwdkbffe62fnfYUCH38hQ/exec";

// ----- IndexedDB Helpers -----
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(LOG_QUEUE_DB, 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("logs")) {
        db.createObjectStore("logs", { autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveQueue() {
  try {
    const db = await openDB();
    const tx = db.transaction("logs", "readwrite");
    const store = tx.objectStore("logs");

    // ✅ Clear once, then add all logs when clear is done
    await new Promise((resolve, reject) => {
      const clearReq = store.clear();
      clearReq.onsuccess = resolve;
      clearReq.onerror = reject;
    });

    logQueue.forEach((log) => store.add(log));

    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = reject;
    });

  } catch (e) {
    console.error("logWorker: failed to save queue", e);
  }
}

async function loadQueue() {
  try {
    const db = await openDB();
    const tx = db.transaction("logs", "readonly");
    const store = tx.objectStore("logs");
    const logs = [];
    await new Promise((resolve, reject) => {
      const req = store.openCursor();
      req.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          logs.push(cursor.value);
          cursor.continue();
        } else {
          resolve();
        }
      };
      req.onerror = reject;
    });
    logQueue = logs;
    console.log("logWorker: Restored queue with", logs.length, "items");
  } catch (e) {
    console.error("logWorker: failed to load queue", e);
  }
}

// Load existing logs at startup
loadQueue();

async function sendLog(log) {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      // Removed mode: "no-cors" to allow for a true CORS request
      headers: {
        "Content-Type": "text/plain;charset=utf-8" // Updated header as requested
      },
      body: JSON.stringify(log),
    });
    
    // Check if the response was successful
    if (response.ok) {
        console.log("logWorker: sent log successfully!", log);
        return true;
    } else {
        console.error("logWorker: send failed with status:", response.status);
        return false;
    }
  } catch (err) {
    console.error("logWorker: send failed", err);
    return false;
  }
}


async function processQueue() {
  if (isSending || logQueue.length === 0) return;
  isSending = true;

  self.postMessage({ type: "logSendingStart" });

  while (logQueue.length > 0) {
    const currentLog = logQueue[0];

    const success = await sendLog(currentLog);

    if (success) {
      // If the log was sent successfully, remove it from the queue
      logQueue.shift();
      await saveQueue();
      self.postMessage({ type: "logSuccess", data: currentLog });
    } else {
      // If sending fails, break the loop immediately
      self.postMessage({ type: "logFailure", data: currentLog });
      break; 
    }
  }

  isSending = false;
  // This message is sent after the loop is done, whether by success or a break
  self.postMessage({ type: "logSendingEnd" });
}

// ----- Message Handler -----
self.onmessage = (e) => {
  const { action, data, apiUrl: url } = e.data;

  if (action === "saveLog") {
    logQueue.push(data);
    saveQueue().then(processQueue);
  } else if (action === "flush") {
    processQueue();
  }
};
