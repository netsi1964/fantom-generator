import { getCaseInfo, saveCaseInfo } from '../dataManager.js';

const titleInput = document.getElementById('case-title');
const numberInput = document.getElementById('case-number');
const dateInput = document.getElementById('case-date');

let debounceTimer;
function debounce(func, delay) {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(func, delay);
}

/**
 * Loads case info data into the form fields.
 */
function loadCaseInfoToForm() {
  const caseInfo = getCaseInfo();
  titleInput.value = caseInfo.title || '';
  numberInput.value = caseInfo.caseNumber || '';
  dateInput.value = caseInfo.date || '';
}

/**
 * Handles input changes, saves data (debounced), and triggers preview update.
 */
function handleInputChange() {
  debounce(() => {
    const currentCaseInfo = {
      title: titleInput.value,
      caseNumber: numberInput.value,
      date: dateInput.value,
    };
    saveCaseInfo(currentCaseInfo);
    console.log('Case Info saved:', currentCaseInfo);
    // Dispatch event to update prompt preview
    document.dispatchEvent(new CustomEvent('caseInfoChange'));
  }, 500); // 500ms delay for text inputs
}

/**
 * Initializes the case information form functionality.
 */
export function initCaseInfo() {
  if (!titleInput || !numberInput || !dateInput) {
    console.error('Case info input elements not found!');
    return;
  }

  // Load initial data
  loadCaseInfoToForm();

  // Add event listeners for input changes
  titleInput.addEventListener('input', handleInputChange);
  numberInput.addEventListener('input', handleInputChange);
  dateInput.addEventListener('change', handleInputChange); // Use 'change' for date input
} 