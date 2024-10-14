let isTracking = false;
let sessionStartTime;
let sessionData = [];

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (isTracking && changeInfo.status === 'complete' && tab.url && tab.url.startsWith('http')) {
        const pageTitle = tab.title;
        const pageURL = tab.url;

        chrome.storage.local.get(['copiedText'], (result) => {
            const copiedText = result.copiedText || "";

            const pageData = {
                pageTitle,
                pageURL,
                copiedText,
                timestamp: new Date().toISOString()
            };

            sessionData.push(pageData);

            sendDataToBackend(pageData);
        });
    }
});

async function sendDataToBackend(pageData) {
    try {
        const response = await fetch('http://127.0.0.1:5000/store-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pageData)
        });

        if (response.ok) {
            console.log('Data sent successfully!', pageData);
        } else {
            console.error('Error sending data:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'start') {
        isTracking = true;
        sessionStartTime = Date.now();
        sessionData = [];
        chrome.storage.local.set({ sessionStartTime });
        updateElapsedTime();
        console.log('Session started');
        sendResponse({ status: 'Tracking started' });
    } else if (message.action === 'stop') {
        isTracking = false;
        sessionStartTime = null;
        chrome.storage.local.remove('sessionStartTime');
        console.log('Session stopped');
        sendResponse({ status: 'Tracking stopped' });
    } else if (message.action === 'getElapsedTime') {
        updateElapsedTime();
        sendResponse({ status: 'Time updated' });
    }
    return true; // Keeps the message channel open for async response
});

function updateElapsedTime() {
    if (isTracking && sessionStartTime) {
        const elapsedTime = Date.now() - sessionStartTime;
        chrome.storage.local.set({ elapsedTime });
        setTimeout(updateElapsedTime, 1000); // Update every second
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'copied') {
        chrome.storage.local.set({ copiedText: message.text }, () => {
            console.log('Copied text stored:', message.text);
        });
    }
});

// Check if there's an ongoing session when the background script starts
chrome.storage.local.get(['sessionStartTime'], (result) => {
    if (result.sessionStartTime) {
        isTracking = true;
        sessionStartTime = result.sessionStartTime;
        updateElapsedTime();
    }
});