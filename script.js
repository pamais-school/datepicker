const Telegram = window.Telegram.WebApp;
const dobInput = document.getElementById("dob");
const sendBtn = document.getElementById("sendBtn");

// Set max date to today
const today = new Date().toISOString().split("T")[0];
dobInput.setAttribute("max", today);

// Enable send button only if a valid date is selected
dobInput.addEventListener("input", () => {
  sendBtn.disabled = !dobInput.value;
  if (dobInput.value) {
    sendBtn.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
  }
});

sendBtn.addEventListener("click", () => {
  if (!dobInput.value) return;

  sendBtn.classList.add("loading");
  sendBtn.disabled = true;
  sendBtn.innerHTML = '<span class="emoji">⏳</span>កំពុងបញ្ជូន...';

  setTimeout(() => {
    Telegram.sendData(dobInput.value);
    Telegram.close();
  }, 500);
});

// Optional: expand for full height experience
Telegram.expand();
