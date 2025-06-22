import { getParameters, saveParameters } from '../dataManager.js';
import { t } from '../languageManager.js';
import { openModalForEdit } from './parameterModal.js';
import { debounce } from '../utils.js';

const slidersContainer = document.getElementById('parameter-sliders-container');

/**
 * Renderer en enkelt, fuldt funktionel slider-komponent.
 * @param {object} parameter - Parameterobjektet fra dataManager.
 */
function renderSlider(parameter) {
  const sliderWrapper = document.createElement('div');
  sliderWrapper.className = 'slider-wrapper p-3 border rounded shadow-sm bg-gray-50 hover:shadow-md transition-shadow duration-200 cursor-pointer';
  sliderWrapper.setAttribute('data-parameter-id', parameter.id);

  const label = document.createElement('label');
  label.htmlFor = `slider-${parameter.id}`;
  label.className = 'slider-label block text-sm font-medium text-gray-700 mb-1';
  label.textContent = t(parameter.name, { defaultValue: parameter.name });

  const valueOutput = document.createElement('span');
  valueOutput.className = 'slider-value float-right text-gray-600';
  valueOutput.textContent = t(parameter.value, { defaultValue: parameter.value });

  const sliderInput = document.createElement('input');
  sliderInput.type = 'range';
  sliderInput.id = `slider-${parameter.id}`;
  sliderInput.name = parameter.id;
  sliderInput.min = 0;
  sliderInput.max = parameter.shades.length - 1;
  sliderInput.step = 1;
  sliderInput.className = 'w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 mt-2';
  const currentIndex = parameter.shades.indexOf(parameter.value);
  sliderInput.value = currentIndex !== -1 ? currentIndex : 0;

  // Add click listener to the wrapper to open the edit modal
  sliderWrapper.addEventListener('click', (event) => {
    // Only open modal if the click is not on the slider input itself
    if (event.target.type !== 'range') {
      openModalForEdit(parameter.id);
    }
  });

  // Event listener til at håndtere slider-ændringer
  sliderInput.addEventListener('input', () => {
    const selectedShade = parameter.shades[sliderInput.value];
    valueOutput.textContent = t(selectedShade) || selectedShade; // Translate if possible
  });

  sliderInput.addEventListener('change', () => {
    debounce(() => {
      const currentParams = getParameters();
      const paramToUpdate = currentParams.find(p => p.id === parameter.id);
      if (paramToUpdate) {
        paramToUpdate.value = parameter.shades[sliderInput.value];
        saveParameters(currentParams); // This now dispatches 'stateChange'
      }
    }, 300);
  });

  // Sammensæt elementerne
  label.appendChild(valueOutput);
  sliderWrapper.appendChild(label);
  sliderWrapper.appendChild(sliderInput);
  slidersContainer.appendChild(sliderWrapper);
}

/**
 * Rydder og gen-renderer alle sliders. Bruges ved initialisering og sprogskift.
 */
export function renderAllSliders() {
  if (!slidersContainer) {
    console.error('Slider container not found!');
    return;
  }
  // Find the buttons that are inside the container
  const buttons = slidersContainer.querySelectorAll('div.col-span-full');

  slidersContainer.innerHTML = ''; // Ryd eksisterende indhold
  const parameters = getParameters();
  parameters.forEach(renderSlider);

  // Re-append the buttons after clearing
  buttons.forEach(buttonDiv => {
    slidersContainer.appendChild(buttonDiv);
  });
}

// Listen for state changes to re-render the sliders if parameters change
document.addEventListener('stateChange', (e) => {
  if (e.detail && (e.detail.changedKey === 'parameters' || e.detail.changedKey === 'fullReset')) {
    console.log('Detected state change for parameters, re-rendering sliders.');
    renderAllSliders();
  }
});
