let timerInterval;

document.getElementById('startSession').addEventListener('click', startSession);
document.getElementById('stopSession').addEventListener('click', stopSession);

function startSession() {
    chrome.runtime.sendMessage({ action: 'start' }, (response) => {
        if (response.status === 'Tracking started') {
            updateButtonState(true);
            showNotification('Session started');
            startTimer();
        }
    });
}

function stopSession() {
    chrome.runtime.sendMessage({ action: 'stop' }, (response) => {
        if (response.status === 'Tracking stopped') {
            updateButtonState(false);
            showNotification('Session stopped');
            stopTimer();
        }
    });
}

function startTimer() {
    stopTimer(); // Clear any existing interval
    updateTimerDisplay();
    timerInterval = setInterval(updateTimerDisplay, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    document.getElementById('timer').innerText = 'Session Time: 00:00:00';
}

function updateTimerDisplay() {
    chrome.runtime.sendMessage({ action: 'getElapsedTime' }, () => {
        chrome.storage.local.get(['elapsedTime'], (result) => {
            const elapsedMilliseconds = result.elapsedTime || 0;
            const elapsedTime = new Date(elapsedMilliseconds);

            const hours = String(elapsedTime.getUTCHours()).padStart(2, '0');
            const minutes = String(elapsedTime.getUTCMinutes()).padStart(2, '0');
            const seconds = String(elapsedTime.getUTCSeconds()).padStart(2, '0');

            document.getElementById('timer').innerText = `Session Time: ${hours}:${minutes}:${seconds}`;
        });
    });
}

function updateButtonState(isTracking) {
    document.getElementById('startSession').disabled = isTracking;
    document.getElementById('stopSession').disabled = !isTracking;
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.innerText = message;
    setTimeout(() => {
        notification.innerText = '';
    }, 3000);
}

// Check the current state when the popup opens
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['sessionStartTime'], (result) => {
        if (result.sessionStartTime) {
            updateButtonState(true);
            startTimer();
        } else {
            updateButtonState(false);
        }
    });
});