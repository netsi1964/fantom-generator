import { getParameters, saveParameters, resetParameters } from '../dataManager.js';
import { t } from '../languageManager.js';
import { showConfirm } from './confirmModal.js';

const modal = document.getElementById('parameter-management-modal');
const modalTitle = document.getElementById('modal-title');
const formContainer = document.getElementById('parameter-form-container');
const addParamButton = document.getElementById('add-parameter-button');
const saveButton = document.getElementById('save-parameter-button');
const cancelButton = document.getElementById('cancel-parameter-button');
const deleteButton = document.getElementById('delete-parameter-button');
const resetButton = document.getElementById('reset-parameters-button');

let currentEditingParamId = null; // null for adding, id for editing

// --- Modal Handling ---

function openModal(paramId = null) {
  currentEditingParamId = paramId;
  populateForm(paramId);
  modalTitle.textContent = t(paramId ? 'modalTitleEdit' : 'modalTitleAdd'); // Use t()
  deleteButton.classList.toggle('hidden', !paramId);
  modal.classList.remove('hidden');
}

function closeModal() {
  modal.classList.add('hidden');
  formContainer.innerHTML = ''; // Clear form
  currentEditingParamId = null;
}

// --- Form Population ---

function populateForm(paramId) {
  formContainer.innerHTML = ''; // Clear previous form
  const parameters = getParameters();
  const param = paramId ? parameters.find(p => p.id === paramId) : null;

  // Name Input
  const nameLabel = document.createElement('label');
  nameLabel.textContent = t('paramNameLabel'); // Use t()
  nameLabel.className = 'block text-sm font-medium text-gray-700';
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.id = 'param-name-input';
  nameInput.value = param ? param.name : '';
  nameInput.className = 'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-3';
  formContainer.appendChild(nameLabel);
  formContainer.appendChild(nameInput);

  // Shades Input (comma-separated)
  const shadesLabel = document.createElement('label');
  shadesLabel.textContent = t('paramShadesLabel'); // Use t()
  shadesLabel.className = 'block text-sm font-medium text-gray-700';
  const shadesInput = document.createElement('input');
  shadesInput.type = 'text';
  shadesInput.id = 'param-shades-input';
  shadesInput.value = param ? param.shades.join(', ') : '';
  shadesInput.className = 'mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm';
  formContainer.appendChild(shadesLabel);
  formContainer.appendChild(shadesInput);
}

// --- Data Operations ---

function handleSave() {
  const nameInput = document.getElementById('param-name-input');
  const shadesInput = document.getElementById('param-shades-input');

  const name = nameInput.value.trim();
  const shades = shadesInput.value.split(',').map(s => s.trim()).filter(s => s);

  // Basic Validation
  if (!name || shades.length === 0) {
    alert(t('validationRequired')); // Use t()
    return;
  }

  let parameters = getParameters();

  if (currentEditingParamId) {
    // Edit existing parameter
    const paramIndex = parameters.findIndex(p => p.id === currentEditingParamId);
    if (paramIndex > -1) {
      parameters[paramIndex].name = name;
      parameters[paramIndex].shades = shades;
      // Reset value if old value not in new shades, or keep if exists?
      // For simplicity, let's reset to the first shade.
      parameters[paramIndex].value = shades[0];
    }
  } else {
    // Add new parameter
    const newParam = {
      // Simple ID generation - consider more robust method later
      id: `custom-${Date.now()}`,
      name: name,
      shades: shades,
      value: shades[0], // Default to first shade
      isCustom: true, // Flag for custom parameters
    };
    parameters.push(newParam);
  }

  saveParameters(parameters);
  closeModal();
}

function handleDelete() {
  if (!currentEditingParamId) return;
  
  showConfirm(t('deleteConfirm', {defaultValue: 'Are you sure you want to delete this parameter?'}), () => {
    let parameters = getParameters();
    parameters = parameters.filter(p => p.id !== currentEditingParamId);

    saveParameters(parameters);
    closeModal();
  });
}

/**
 * Handles the click on the Reset Default Parameters button.
 */
function handleResetDefaults() {
  showConfirm(t('resetParamsConfirm', {defaultValue: 'Are you sure you want to reset all parameters to their defaults? This will remove any custom parameters.'}), () => {
    resetParameters(); // Call the reset function from dataManager
    console.log('Parameters reset to defaults.');
  });
}

// Update UI Text Function (to be called on language change)
export function updateParameterManagerText() {
  if (addParamButton) addParamButton.textContent = t('addCustomParamButton');
  if (resetButton) resetButton.textContent = t('resetParamsButton'); // Translate reset button
  if (saveButton) saveButton.textContent = t('saveButton');
  if (cancelButton) cancelButton.textContent = t('cancelButton');
  if (deleteButton) deleteButton.textContent = t('deleteButton');
  // If modal is open, update dynamic elements
  if (!modal.classList.contains('hidden')) {
    modalTitle.textContent = t(currentEditingParamId ? 'modalTitleEdit' : 'modalTitleAdd');
    const nameLabel = formContainer.querySelector('label:first-of-type');
    if (nameLabel) nameLabel.textContent = t('paramNameLabel');
    const shadesLabel = formContainer.querySelector('label:last-of-type');
    if (shadesLabel) shadesLabel.textContent = t('paramShadesLabel');
  }
}

// --- Initialization ---

export function initParameterManager() {
  if (!modal || !addParamButton || !saveButton || !cancelButton || !deleteButton || !resetButton) {
    console.error('Required elements for parameter manager not found!');
    return;
  }

  addParamButton.addEventListener('click', () => openModal());
  saveButton.addEventListener('click', handleSave);
  cancelButton.addEventListener('click', closeModal);
  deleteButton.addEventListener('click', handleDelete);
  resetButton.addEventListener('click', handleResetDefaults);

  // TODO: Add event listeners to sliders to allow editing existing parameters
  // This might involve adding an edit button next to each slider.
} 