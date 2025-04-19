import { getParameters, saveParameters } from '../dataManager.js';
import { t } from '../languageManager.js';

const slidersContainer = document.getElementById('parameter-sliders-container');

// --- Debounce Utility ---
let debounceTimer;
function debounce(func, delay) {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(func, delay);
}

/**
 * Creates a single parameter slider element.
 * @param {object} parameter - The parameter object (id, name, shades, value).
 * @returns {HTMLElement} - The created slider container element.
 */
function createSliderElement(parameter) {
  const container = document.createElement('div');
  container.className = 'p-3 border rounded shadow-sm bg-gray-50 flex flex-col';

  const label = document.createElement('label');
  label.textContent = t(parameter.name, { defaultValue: parameter.name });
  label.htmlFor = `slider-${parameter.id}`;
  label.className = 'block text-xs font-medium text-gray-700 mb-1 truncate';

  const slider = document.createElement('input');
  slider.type = 'range';
  slider.id = `slider-${parameter.id}`;
  slider.name = parameter.id;
  slider.min = 0;
  slider.max = parameter.shades.length - 1;
  slider.value = parameter.shades.indexOf(parameter.value);
  slider.className = 'w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 mt-1 mb-1';

  const valueDisplay = document.createElement('span');
  valueDisplay.textContent = parameter.value;
  valueDisplay.className = 'block text-xs text-gray-600 text-center font-semibold';

  // Event listener for slider changes
  slider.addEventListener('input', (event) => {
    const shadeIndex = parseInt(event.target.value, 10);
    const newValue = parameter.shades[shadeIndex];
    valueDisplay.textContent = newValue;

    // Update the parameter value in the main data store using debounce
    debounce(() => {
      const currentParams = getParameters();
      const paramToUpdate = currentParams.find(p => p.id === parameter.id);
      if (paramToUpdate) {
        paramToUpdate.value = newValue;
        saveParameters(currentParams);
        console.log(`Parameter ${parameter.id} saved as ${newValue}`);
        // Dispatch custom event after saving
        document.dispatchEvent(new CustomEvent('parameterChange'));
      }
    }, 300); // 300ms delay
  });

  container.appendChild(label);
  container.appendChild(slider);
  container.appendChild(valueDisplay);

  return container;
}

/**
 * Updates the text labels of existing sliders based on the current language.
 */
export function updateSliderLabels() {
  if (!slidersContainer) return;
  const labels = slidersContainer.querySelectorAll('label');
  labels.forEach(label => {
    const sliderId = label.htmlFor;
    const paramId = sliderId.replace('slider-', '');
    // Find the parameter name from the data to use as a key
    // This assumes parameter names are consistent and used as keys
    const parameters = getParameters();
    const param = parameters.find(p => p.id === paramId);
    if (param) {
      label.textContent = t(param.name, { defaultValue: param.name });
    }
  });
}

/**
 * Initializes and displays all parameter sliders.
 */
export function initSliders() {
  if (!slidersContainer) {
    console.error('Slider container not found!');
    return;
  }

  slidersContainer.innerHTML = ''; // Clear existing sliders
  const parameters = getParameters();

  parameters.forEach(parameter => {
    const sliderElement = createSliderElement(parameter);
    slidersContainer.appendChild(sliderElement);
  });
} 