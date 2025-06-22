import { saveRenderStyle, getRenderStyle } from '../dataManager.js';
import { t } from '../languageManager.js';

const renderStyleSelect = document.getElementById('render-style-select');

export function initStyleSelector() {
    if (!renderStyleSelect) {
        console.error('Render style selector not found!');
        return;
    }

    // Set initial value from state
    renderStyleSelect.value = getRenderStyle();

    // Add event listener for changes
    renderStyleSelect.addEventListener('change', (event) => {
        saveRenderStyle(event.target.value);
    });
}

export function updateStyleSelectorUI() {
    if (!renderStyleSelect) return;
    
    // This could be used to update option text if they were from translations,
    // but for now they are static in index.html.
    // We can ensure the selected value is correctly displayed if needed.
    renderStyleSelect.value = getRenderStyle();
} 