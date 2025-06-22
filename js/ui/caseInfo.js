import { getCaseInfo, saveCaseInfo } from '../dataManager.js';
import { t } from '../languageManager.js';

// Debounce-funktion for at undgå at overbelaste systemet med hyppige opdateringer.
let debounceTimer;
function debounce(func, delay) {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(func, delay);
}

function initCaseInfo() {
  const caseTitleInput = document.getElementById('case-title');
  const caseNumberInput = document.getElementById('case-number');
  const caseDateInput = document.getElementById('case-date');

  // Load initial data and populate the form
  const currentCaseInfo = getCaseInfo();
  caseTitleInput.value = currentCaseInfo.title || '';
  caseNumberInput.value = currentCaseInfo.caseNumber || '';
  caseDateInput.value = currentCaseInfo.date || '';

  // Function to handle saving the form data
  function handleInput() {
    debounce(() => {
      const updatedCaseInfo = {
        title: caseTitleInput.value,
        caseNumber: caseNumberInput.value,
        date: caseDateInput.value,
      };
      saveCaseInfo(updatedCaseInfo); // This now dispatches 'stateChange'
    }, 300); // 300ms debounce delay
  }

  // Add event listeners
  caseTitleInput.addEventListener('input', handleInput);
  caseNumberInput.addEventListener('input', handleInput);
  caseDateInput.addEventListener('input', handleInput);

  // Set placeholders based on current language
  function updatePlaceholders() {
    caseTitleInput.placeholder = t('case_title_placeholder');
    caseNumberInput.placeholder = t('case_number_placeholder');
  }

  // Initial placeholder setup and update on language change
  updatePlaceholders();
  document.addEventListener('languageChange', updatePlaceholders);
}

export { initCaseInfo }; 