const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const statusBtn = document.getElementById("statusBtn");

// ✅ Send message
async function sendMessage() {
    const message = input.value.trim();
    if (message === "") return;

    // Show user message
    chatBox.innerHTML += `<div class="user-message"> ${message}</div>`;

    try {
        const response = await fetch("http://127.0.0.1:5000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();

        // Show bot reply
        chatBox.innerHTML += `<div class="bot-message">${data.reply}</div>`;
    } catch (error) {
        chatBox.innerHTML += `<div class="bot-message">Error connecting to server</div>`;
    }

    input.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;
}

// ✅ Enter key support
input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
});

// ✅ Online / Offline status
function updateStatus() {
    if (navigator.onLine) {
        statusBtn.style.backgroundColor = "#64f503";
    } else {
        statusBtn.style.backgroundColor = "red";
    }
}

updateStatus();
window.addEventListener("online", updateStatus);
window.addEventListener("offline", updateStatus);

// ✅ Mic button
document.getElementById("mic-btn").addEventListener("click", function () {
    window.open("/voice", "_blank");
});