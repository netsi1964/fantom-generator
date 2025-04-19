import { getRenderStyle, saveRenderStyle } from '../dataManager.js';
import { updatePreview } from '../promptGenerator.js';
import { t } from '../languageManager.js';

const styleSelector = document.getElementById('render-style-select');
const styleOptions = [
    { value: 'Sketch', key: 'styleSketch' },
    { value: 'Realistic', key: 'styleRealistic' },
    { value: 'Cartoon', key: 'styleCartoon' },
    { value: '3D Model', key: 'style3DModel' },
    { value: 'Painting', key: 'stylePainting' },
];

/**
 * Populates the style selector options with translated text.
 */
function populateStyleOptions() {
    if (!styleSelector) return;
    styleSelector.innerHTML = ''; // Clear existing options
    styleOptions.forEach(option => {
        const optElement = document.createElement('option');
        optElement.value = option.value;
        optElement.textContent = t(option.key, { defaultValue: option.value });
        styleSelector.appendChild(optElement);
    });
}

/**
 * Updates the style selector UI elements (options and selected value).
 */
export function updateStyleSelectorUI() {
    if (!styleSelector) return;
    populateStyleOptions(); // Repopulate options with current language
    styleSelector.value = getRenderStyle(); // Set the current selection
}

/**
 * Handles changes in the style selector.
 * @param {Event} event
 */
function handleStyleChange(event) {
    const newStyle = event.target.value;
    saveRenderStyle(newStyle);
    console.log(`Render style saved as ${newStyle}`);
    // Trigger prompt update directly as style is part of it
    updatePreview();
    // Could dispatch a 'styleChange' event if other modules needed it
    // document.dispatchEvent(new CustomEvent('styleChange'));
}

/**
 * Initializes the style selector functionality.
 */
export function initStyleSelector() {
    if (!styleSelector) {
        console.error('Render style selector not found!');
        return;
    }
    updateStyleSelectorUI(); // Initial population and selection
    styleSelector.addEventListener('change', handleStyleChange);
} 