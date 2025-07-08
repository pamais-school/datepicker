const Telegram = window.Telegram.WebApp;
const sendBtn = document.getElementById("sendBtn");
const daySelect = document.getElementById("day");
const monthSelect = document.getElementById("month");
const yearSelect = document.getElementById("year");
const validationMessage = document.getElementById("validationMessage");
const dateSelector = document.querySelector(".date-selector");
const langBtn = document.getElementById("langBtn");

let selectedDate = null;
let currentLanguage = 'kh'; // Default to Khmer

// Language data
const translations = {
  kh: {
    title: "ជ្រើសរើសថ្ងៃកំណើត",
    dayLabel: "ថ្ងៃ",
    monthLabel: "ខែ",
    yearLabel: "ឆ្នាំ",
    dayPlaceholder: "ជ្រើសរើសថ្ងៃ",
    monthPlaceholder: "ជ្រើសរើសខែ",
    yearPlaceholder: "ជ្រើសរើសឆ្នាំ",
    sendBtnText: "បញ្ជូន",
    followText: "តាមដានយើង",
    invalidDate: "កាលបរិច្ឆេទមិនត្រឹមត្រូវ",
    futureDate: "កាលបរិច្ឆេទមិនអាចជាអនាគត",
    sending: "កំពុងបញ្ជូន...",
    langBtnText: "🇺🇸 English",
    months: [
      "១ (មករា)", "២ (កុម្ភៈ)", "៣ (មីនា)", "៤ (មេសា)", 
      "៥ (ឧសភា)", "៦ (មិថុនា)", "៧ (កក្កដា)", "៨ (សីហា)", 
      "៩ (កញ្ញា)", "១០ (តុលា)", "១១ (វិច្ឆិកា)", "១២ (ធ្នូ)"
    ]
  },
  en: {
    title: "Select Date of Birth",
    dayLabel: "Day",
    monthLabel: "Month",
    yearLabel: "Year",
    dayPlaceholder: "Select Day",
    monthPlaceholder: "Select Month",
    yearPlaceholder: "Select Year",
    sendBtnText: "Send",
    followText: "Follow Us",
    invalidDate: "Invalid date",
    futureDate: "Date cannot be in the future",
    sending: "Sending...",
    langBtnText: "🇰🇭 ខ្មែរ",
    months: [
      "1 (January)", "2 (February)", "3 (March)", "4 (April)", 
      "5 (May)", "6 (June)", "7 (July)", "8 (August)", 
      "9 (September)", "10 (October)", "11 (November)", "12 (December)"
    ]
  }
};

// Initialize
function init() {
  populateSelects();
  setupEventListeners();
  updateLanguage();
  
  // Optional: expand for full height experience
  Telegram.expand();
}

function populateSelects() {
  // Clear existing options except first one
  daySelect.innerHTML = `<option value="" id="dayPlaceholder">${translations[currentLanguage].dayPlaceholder}</option>`;
  monthSelect.innerHTML = `<option value="" id="monthPlaceholder">${translations[currentLanguage].monthPlaceholder}</option>`;
  yearSelect.innerHTML = `<option value="" id="yearPlaceholder">${translations[currentLanguage].yearPlaceholder}</option>`;

  // Populate days
  for (let i = 1; i <= 31; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    daySelect.appendChild(option);
  }

  // Populate months
  translations[currentLanguage].months.forEach((month, index) => {
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
  langBtn.addEventListener("click", toggleLanguage);
}

function toggleLanguage() {
  currentLanguage = currentLanguage === 'kh' ? 'en' : 'kh';
  updateLanguage();
  populateSelects();
  
  // Reset selections
  daySelect.value = "";
  monthSelect.value = "";
  yearSelect.value = "";
  selectedDate = null;
  dateSelector.classList.remove("active");
  hideValidation();
  updateSendButton();
}

function updateLanguage() {
  const t = translations[currentLanguage];
  
  document.getElementById("title").textContent = t.title;
  document.getElementById("dayLabel").textContent = t.dayLabel;
  document.getElementById("monthLabel").textContent = t.monthLabel;
  document.getElementById("yearLabel").textContent = t.yearLabel;
  document.getElementById("sendBtnText").textContent = t.sendBtnText;
  document.getElementById("followText").textContent = t.followText;
  document.getElementById("langBtn").textContent = t.langBtnText;
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
      showValidation(translations[currentLanguage].invalidDate);
      selectedDate = null;
      dateSelector.classList.remove("active");
      updateSendButton();
      return;
    }

    if (date > today) {
      showValidation(translations[currentLanguage].futureDate);
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
  sendBtn.innerHTML = `<span class="emoji">⏳</span>${translations[currentLanguage].sending}`;

  setTimeout(() => {
    Telegram.sendData(selectedDate);
    Telegram.close();
  }, 300);
}

// Initialize on load
init();
