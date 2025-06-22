const modal = document.getElementById('confirmation-modal');
const messageElement = document.getElementById('confirmation-modal-message');
const confirmButton = document.getElementById('confirm-ok-button');
const cancelButton = document.getElementById('confirm-cancel-button');

let onConfirmCallback = null;

function showModal() {
  modal.classList.remove('hidden');
  confirmButton.focus();
}

function hideModal() {
  modal.classList.add('hidden');
  onConfirmCallback = null;
}

function confirmAction() {
  if (typeof onConfirmCallback === 'function') {
    onConfirmCallback();
  }
  hideModal();
}

/**
 * Shows a confirmation modal.
 * @param {string} message - The message to display in the modal.
 * @param {function} onConfirm - The function to call if the user confirms.
 */
export function showConfirm(message, onConfirm) {
  if (!modal || !messageElement || !confirmButton || !cancelButton) {
    console.error('Confirmation modal elements not found!');
    // Fallback to native confirm
    if (window.confirm(message)) {
      onConfirm();
    }
    return;
  }
  
  messageElement.textContent = message;
  onConfirmCallback = onConfirm;
  showModal();
}

function handleKeyDown(event) {
    if (modal.classList.contains('hidden')) return;
    
    if (event.key === 'Escape') {
      hideModal();
    } else if (event.key === 'Tab') {
      const firstFocusableElement = confirmButton;
      const lastFocusableElement = cancelButton;

      if (event.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus();
          event.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus();
          event.preventDefault();
        }
      }
    }
}


// --- Initialization ---

confirmButton.addEventListener('click', confirmAction);
cancelButton.addEventListener('click', hideModal);
modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        hideModal();
    }
});
document.addEventListener('keydown', handleKeyDown); 