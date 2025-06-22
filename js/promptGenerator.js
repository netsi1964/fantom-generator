import { getParameters, getCaseInfo, getRenderStyle, getFreeText, saveFreeText, getAppState } from './dataManager.js';
import { getCurrentLanguage, t } from './languageManager.js';
import { debounce } from './utils.js';
import { showToast } from './ui/toast.js';

let promptPreview;

const previewElement = document.getElementById('prompt-preview');
const freeTextInput = document.getElementById('free-text-input');
const copyButton = document.getElementById('copy-prompt-button');

/**
 * Generates the prompt string based on current parameters, case info, and free text.
 * @returns {string} The generated prompt string.
 */
export function generatePrompt() {
  const { caseInfo, parameters, freeText, renderStyle } = getAppState();
  const lang = getCurrentLanguage();

  let promptParts = [];

  // 1. Start with the core style and subject
  const styleKey = renderStyle || 'Sketch'; // Default to Sketch
  const stylePrefix = t(`style.${styleKey}.prefix`, lang) || t('style.Sketch.prefix', lang);
  promptParts.push(stylePrefix);

  const styleKeywords = t(`style.${styleKey}.keywords`, lang) || t('style.Sketch.keywords', lang);
  if (styleKeywords) {
    promptParts.push(styleKeywords);
  }

  // 2. Add translated parameter values
  const parameterStrings = parameters.map(p => {
    const paramName = t(p.name, lang);
    const paramValue = t(p.value, lang);
    return `${paramName}: ${paramValue}`;
  });
  promptParts.push(...parameterStrings);

  // 3. Add free text if it exists
  if (freeText && freeText.trim() !== '') {
    promptParts.push(freeText.trim());
  }

  // 4. Combine into a single prompt string
  const mainPrompt = promptParts.join(', ') + '.';

  // 5. Build the case information string separately
  const caseInfoParts = [
    caseInfo.title && `${t('Title', lang)}: ${caseInfo.title}`,
    caseInfo.caseNumber && `${t('Case/Journal #', lang)}: ${caseInfo.caseNumber}`,
    caseInfo.date && `${t('Date', lang)}: ${caseInfo.date}`
  ].filter(Boolean);

  const caseInfoString = caseInfoParts.length > 0 
    ? `\n\n--- ${t('Case Information', lang)} ---\n` + caseInfoParts.join('\n')
    : '';

  return mainPrompt + caseInfoString;
}

/**
 * Updates the prompt preview area.
 */
export function updatePreview() {
  if (!previewElement) {
    console.error('Preview element not found!');
    return;
  }
  const promptText = generatePrompt();
  previewElement.textContent = promptText;
}

/**
 * Copies the generated prompt to the clipboard.
 */
async function copyPromptToClipboard() {
  const promptText = generatePrompt();
  try {
    await navigator.clipboard.writeText(promptText);
    showToast(t('promptCopiedToast', { defaultValue: 'Prompt copied to clipboard!' }), 'success');
  } catch (err) {
    console.error('Failed to copy prompt: ', err);
    showToast(t('promptCopyFailedToast', { defaultValue: 'Failed to copy prompt.' }), 'error');
  }
}

/**
 * Initializes the prompt generator functionality.
 */
export function initPromptGenerator() {
  if (!previewElement || !freeTextInput || !copyButton) {
    console.error('Required elements for prompt generator not found!');
    return;
  }

  // Listen for the global stateChange event instead of specific ones
  document.addEventListener('stateChange', updatePreview);

  // Initial generation
  updatePreview();

  // Update preview when free text changes
  freeTextInput.addEventListener('input', debounce((event) => {
    saveFreeText(event.target.value);
  }, 300));

  // Add event listener for the copy button
  copyButton.addEventListener('click', copyPromptToClipboard);
} 