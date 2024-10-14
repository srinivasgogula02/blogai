let isTracking = false;
let timerInterval;
let sessionStartTime;
let sessionData = [];

// Add event listener for copying text
document.addEventListener("copy", (event) => {
    const selectedText = window.getSelection().toString(); // Ensure toString() is called here
    
    // Save copied text to Chrome's local storage
    chrome.storage.local.set({ copiedText: selectedText }, () => {
        console.log('Copied text saved:', selectedText);
    });
});

// Listener for when a tab is updated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (isTracking && changeInfo.status === 'complete' && tab.url && tab.url.startsWith('http')) {
        const pageTitle = tab.title;
        const pageURL = tab.url;

        // Retrieve copied text from Chrome's local storage
        chrome.storage.local.get(['copiedText'], (result) => {
            const copiedText = result.copiedText || "";  // Default to empty string if no text copied

            const pageData = {
                pageTitle,
                pageURL,
                copiedText,
                timestamp: new Date().toISOString()
            };

            // Store page data in session
            sessionData.push(pageData);

            // Send the data to your backend API
            sendDataToBackend(pageData);
        });
    }
});

// Example function to send data to backend
function sendDataToBackend(pageData) {
    fetch('https://your-api-endpoint.com/track', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(pageData),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Data sent to backend:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}


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
        sessionStartTime = new Date();
        sessionData = [];
        startTimer();
        console.log('Session started');
        sendResponse({ status: 'Tracking started' });
    } else if (message.action === 'stop') {
        isTracking = false;
        clearInterval(timerInterval);
        console.log('Session stopped');
        sendResponse({ status: 'Tracking stopped' });
    }
});

function startTimer() {
    timerInterval = setInterval(() => {
        const now = new Date();
        const elapsedTime = now - sessionStartTime;
        chrome.storage.local.set({ elapsedTime });
    }, 1000);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'copied') {
        chrome.storage.local.set({ copiedText: message.text }, () => {
            console.log('Copied text stored:', message.text);
        });
    }
});
