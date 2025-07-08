const Telegram = window.Telegram.WebApp;
const sendBtn = document.getElementById("sendBtn");
const daySelect = document.getElementById("day");
const monthSelect = document.getElementById("month");
const yearSelect = document.getElementById("year");
const validationMessage = document.getElementById("validationMessage");
const dateSelector = document.querySelector(".date-selector");

let selectedDate = null;

// Khmer months
const khmerMonths = [
  "មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា",
  "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"
];

// Initialize
function init() {
  populateSelects();
  setupEventListeners();
  
  // Optional: expand for full height experience
  Telegram.expand();
}

function populateSelects() {
  // Populate days
  for (let i = 1; i <= 31; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    daySelect.appendChild(option);
  }

  // Populate months
  khmerMonths.forEach((month, index) => {
    const option = document.createElement("option");
    option.value = index + 1;
    option.textContent = month;
    monthSelect.appendChild(option);
  });

  // Populate years (from current year to 1950)
  const currentYear = new Date().getFullYear();
  for (let i = currentYear; i >= 1950; i--) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    yearSelect.appendChild(option);
  }
}

function setupEventListeners() {
  [daySelect, monthSelect, yearSelect].forEach(select => {
    select.addEventListener("change", validateAndUpdate);
  });

  sendBtn.addEventListener("click", sendData);
}

function validateAndUpdate() {
  const day = parseInt(daySelect.value);
  const month = parseInt(monthSelect.value);
  const year = parseInt(yearSelect.value);

  hideValidation();

  if (day && month && year) {
    // Validate date
    const date = new Date(year, month - 1, day);
    const today = new Date();
    
    if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
      showValidation("កាលបរិច្ឆេទមិនត្រឹមត្រូវ");
      selectedDate = null;
      dateSelector.classList.remove("active");
      updateSendButton();
      return;
    }

    if (date > today) {
      showValidation("កាលបរិច្ឆេទមិនអាចជាអនាគត");
      selectedDate = null;
      dateSelector.classList.remove("active");
      updateSendButton();
      return;
    }

    // Format date as YYYY-MM-DD
    selectedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    dateSelector.classList.add("active");
  } else {
    selectedDate = null;
    dateSelector.classList.remove("active");
  }

  updateSendButton();
}

function updateSendButton() {
  const hasDate = selectedDate !== null;
  sendBtn.disabled = !hasDate;
  
  if (hasDate) {
    sendBtn.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
  } else {
    sendBtn.style.background = "#a0aec0";
  }
}

function showValidation(message) {
  validationMessage.textContent = message;
  validationMessage.classList.remove("hidden");
}

function hideValidation() {
  validationMessage.classList.add("hidden");
}

function sendData() {
  if (!selectedDate) return;

  sendBtn.classList.add("loading");
  sendBtn.disabled = true;
  sendBtn.innerHTML = '<span class="emoji">⏳</span>កំពុងបញ្ជូន...';

  setTimeout(() => {
    Telegram.sendData(selectedDate);
    Telegram.close();
  }, 300);
}

// Initialize on load
init();
