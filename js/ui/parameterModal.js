import { getParameters, saveParameters, isDefaultParameter } from '../dataManager.js';
import { renderAllSliders } from './sliders.js';
import { t } from '../languageManager.js';
import { showToast } from './toast.js';
import { showConfirm } from './confirmModal.js';

export function initParameterModal() {
  const modal = document.getElementById('parameter-management-modal');
  const addParameterButton = document.getElementById('add-parameter-button');
  const cancelButton = document.getElementById('cancel-parameter-button');
  const saveButton = document.getElementById('save-parameter-button');
  const nameInput = document.getElementById('parameter-name');
  const shadesInput = document.getElementById('parameter-shades');
  const form = document.getElementById('parameter-form');
  const parameterIdInput = document.getElementById('parameter-id');
  const modalTitle = document.getElementById('modal-title');
  const deleteButton = document.getElementById('delete-parameter-button');
  let lastFocusedElement;

  if (!modal || !addParameterButton || !cancelButton || !saveButton || !nameInput || !shadesInput || !form || !parameterIdInput || !modalTitle || !deleteButton) {
    console.error('Parameter modal elements not found!');
    return;
  }

  function showModal(isEdit = false) {
    form.reset();
    parameterIdInput.value = '';
    modalTitle.textContent = isEdit ? 'Edit Parameter' : 'Add Custom Parameter';
    deleteButton.classList.add('hidden'); // Hide delete button by default
    modal.classList.remove('hidden');
    nameInput.focus(); // Set focus to the first input
  }

  function hideModal() {
    modal.classList.add('hidden');
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      hideModal();
    } else if (event.key === 'Tab') {
      const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const focusableContent = modal.querySelectorAll(focusableElements);
      const firstFocusableElement = focusableContent[0];
      const lastFocusableElement = focusableContent[focusableContent.length - 1];

      if (event.shiftKey) { // if shift key pressed for shift + tab combination
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus(); // add focus for the last focusable element
          event.preventDefault();
        }
      } else { // if tab key is pressed
        if (document.activeElement === lastFocusableElement) { // if focused has reached to last focusable element then focus first focusable element after pressing tab
          firstFocusableElement.focus(); // add focus for the first focusable element
          event.preventDefault();
        }
      }
    }
  }

  function saveParameter() {
    const name = nameInput.value.trim();
    const shades = shadesInput.value.split(',').map(s => s.trim()).filter(s => s);
    const parameterId = parameterIdInput.value;

    if (!name || shades.length === 0) {
      showToast(t('validationRequired', { defaultValue: 'Name and at least one shade are required.' }), 'error');
      return;
    }

    const parameters = getParameters();
    const lowerCaseName = name.toLowerCase();
    const existingParam = parameters.find(p => p.name.toLowerCase() === lowerCaseName);

    if (existingParam && existingParam.id !== parameterId) {
      showToast(t('parameterNameExists', { name: name, defaultValue: `Parameter "${name}" already exists.` }), 'error');
      return;
    }

    if (parameterId) {
      // Editing existing parameter
      const paramToUpdate = parameters.find(p => p.id === parameterId);
      if (paramToUpdate) {
        paramToUpdate.name = name;
        paramToUpdate.shades = shades;
      }
    } else {
      // Adding new parameter
      const newParam = {
        id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: name,
        shades: shades,
        value: shades[0] // Default to the first shade
      };
      parameters.push(newParam);
    }
    
    saveParameters(parameters);
    showToast(t('parameterSaved', { defaultValue: 'Parameter saved successfully.' }), 'success');
    hideModal();
  }

  function deleteParameter() {
    const parameterId = parameterIdInput.value;
    if (!parameterId || isDefaultParameter(parameterId)) {
      showToast(t('cannotDeleteDefault', { defaultValue: 'Cannot delete a default parameter.' }), 'error');
      return;
    }

    showConfirm(t('deleteConfirm', { defaultValue: 'Are you sure you want to delete this parameter?' }), () => {
      const parameters = getParameters().filter(p => p.id !== parameterId);
      saveParameters(parameters);
      showToast(t('parameterDeleted', { defaultValue: 'Parameter deleted.' }), 'success');
      hideModal();
    });
  }

  addParameterButton.addEventListener('click', () => {
    lastFocusedElement = document.activeElement;
    showModal(false);
  });

  saveButton.addEventListener('click', saveParameter);
  deleteButton.addEventListener('click', deleteParameter);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    saveParameter();
  });

  cancelButton.addEventListener('click', hideModal);

  // Close modal if clicking on the background overlay
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      hideModal();
    }
  });

  document.addEventListener('keydown', handleKeyDown);
}

export function openModalForEdit(parameterId) {
  const modal = document.getElementById('parameter-management-modal');
  const nameInput = document.getElementById('parameter-name');
  const shadesInput = document.getElementById('parameter-shades');
  const parameterIdInput = document.getElementById('parameter-id');
  const modalTitle = document.getElementById('modal-title');
  const deleteButton = document.getElementById('delete-parameter-button');
  let lastFocusedElement = document.activeElement;
  
  const parameter = getParameters().find(p => p.id === parameterId);

  if (parameter) {
    modalTitle.textContent = t('editParameterTitle', { defaultValue: 'Edit Parameter' });
    nameInput.value = parameter.name;
    shadesInput.value = parameter.shades.join(', ');
    parameterIdInput.value = parameter.id;

    if (isDefaultParameter(parameter.id)) {
      deleteButton.classList.add('hidden');
    } else {
      deleteButton.classList.remove('hidden');
    }

    modal.classList.remove('hidden');
    nameInput.focus();
  } else {
    console.error(`Parameter with id ${parameterId} not found.`);
    showToast(t('parameterNotFound', { defaultValue: 'Parameter not found.' }), 'error');
  }
} 