import { getParameters, getCaseInfo, getRenderStyle } from './dataManager.js';

const previewElement = document.getElementById('prompt-preview');
const freeTextInput = document.getElementById('free-text-input');
const copyButton = document.getElementById('copy-prompt-button');

/**
 * Generates the prompt string based on current parameters, case info, and free text.
 * @returns {string} The generated prompt string.
 */
export function generatePrompt() {
  const parameters = getParameters();
  const caseInfo = getCaseInfo();
  const renderStyle = getRenderStyle();
  const freeText = freeTextInput.value.trim();

  let promptKeywords = [];

  // 1. Define the Core Subject & Style Modifiers
  let stylePrefix = "police composite sketch"; // Base subject
  let styleSuffix = ""; // Style specific additions

  switch (renderStyle) {
    case 'Realistic':
      // Emphasize realism but maintain the sketch context
      stylePrefix = "photorealistic police composite sketch";
      promptKeywords.push('high detail photograph of a face');
      break;
    case 'Cartoon':
      stylePrefix = "police composite sketch in a cartoon style";
      promptKeywords.push('illustration', 'comic book art');
      break;
    case '3D Model':
      stylePrefix = "3D model render of a police composite sketch face";
      promptKeywords.push('cgi', 'unreal engine render');
      break;
    case 'Painting':
      stylePrefix = "oil painting of a police composite sketch";
      promptKeywords.push('artwork', 'impasto'); // Example painting terms
      break;
    case 'Sketch':
    default:
      // Default is already sketch-like
      promptKeywords.push('pencil sketch', 'drawing', 'detailed lines', 'grayscale shading');
      break;
  }

  // Prepend the main subject/style phrase
  promptKeywords.unshift(stylePrefix);

  // 2. Add Parameter Keywords (using the existing helper function)
  const paramMap = new Map(parameters.map(p => [p.id, p]));

  function addKeyword(id) {
      const param = paramMap.get(id);
      if (param && param.value && param.value !== 'Other/Unspecified' && param.value !== 'None') {
          let keyword = "";
          if (id === 'age') {
              keyword = param.value.toLowerCase();
          } else if (id === 'facial-hair') {
              keyword = param.value.toLowerCase() + " facial hair";
          } else if (id === 'hair-length' || id === 'hair-color') {
              keyword = param.value.toLowerCase() + " hair";
          } else if (id === 'eye-color') {
              keyword = param.value.toLowerCase() + " eyes";
          } else if (id === 'skin-tone') {
              keyword = param.value.toLowerCase() + " skin";
          } else if (id === 'face-shape') {
              keyword = param.value.toLowerCase() + " face shape";
          } else {
              keyword = param.value.toLowerCase(); // General case (e.g., sex, build)
          }
          // Avoid adding duplicate keywords if parameter logic overlaps (e.g., hair)
          if (!promptKeywords.includes(keyword)) {
              promptKeywords.push(keyword);
          }
      }
  }

  ['sex', 'age', 'build', 'face-shape', 'skin-tone', 'hair-length', 'hair-color', 'facial-hair', 'eye-color'].forEach(addKeyword);

  // Add custom parameters
  parameters.forEach(param => {
      if (!['sex', 'age', 'build', 'face-shape', 'skin-tone', 'hair-length', 'hair-color', 'facial-hair', 'eye-color'].includes(param.id)) {
          if (param.value && param.value !== 'None') {
              const customKeyword = `${param.name.toLowerCase()}: ${param.value.toLowerCase()}`;
              if (!promptKeywords.includes(customKeyword)) {
                promptKeywords.push(customKeyword);
              }
          }
      }
  });

  // 3. Combine Keywords
  let mainPrompt = promptKeywords.join(', ');

  // 4. Add Free Text Notes
  if (freeText) {
    mainPrompt += `. Additional notes: ${freeText}`;
  }

  // 5. Add Case Info (optional, keep separate)
  let caseInfoText = "";
  if (caseInfo.title || caseInfo.caseNumber || caseInfo.date) {
    caseInfoText += "\n\n--- Case Information ---\n";
    if (caseInfo.title) caseInfoText += `Title: ${caseInfo.title}\n`;
    if (caseInfo.caseNumber) caseInfoText += `Case/Journal #: ${caseInfo.caseNumber}\n`;
    if (caseInfo.date) caseInfoText += `Date: ${caseInfo.date}\n`;
  }

  return mainPrompt + caseInfoText;
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
    // Optional: Add visual feedback for successful copy
    console.log('Prompt copied to clipboard!');
    // Simple feedback:
    const originalText = copyButton.textContent;
    copyButton.textContent = 'Copied!';
    copyButton.disabled = true;
    setTimeout(() => {
      copyButton.textContent = originalText;
      copyButton.disabled = false;
    }, 1500);
  } catch (err) {
    console.error('Failed to copy prompt: ', err);
    // Optional: Add visual feedback for error
    alert('Failed to copy prompt. Please try again or copy manually.');
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

  // Initial preview update
  updatePreview();

  // Update preview when free text changes (add debounce later)
  freeTextInput.addEventListener('input', () => {
    // TODO: Debounce this call
    updatePreview();
  });

  // Add event listener for the copy button
  copyButton.addEventListener('click', copyPromptToClipboard);

  // We also need to update the preview when sliders change.
  // This requires communication between modules or a central state manager.
  // For now, we'll add a custom event listener approach.
  document.addEventListener('parameterChange', updatePreview);

  // Listen for changes in case info as well
  document.addEventListener('caseInfoChange', updatePreview);
} 