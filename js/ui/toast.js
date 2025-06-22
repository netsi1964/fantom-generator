/**
 * Shows a toast notification.
 * @param {string} message - The message to display.
 * @param {string} [type='success'] - The type of toast ('success', 'error', 'info').
 * @param {number} [duration=3000] - The duration in milliseconds.
 */
export function showToast(message, type = 'success', duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) {
    console.error('Toast container not found!');
    return;
  }

  const toast = document.createElement('div');
  
  const baseClasses = 'px-4 py-3 rounded-md shadow-lg text-white text-sm transition-all duration-300 transform';
  let typeClasses = '';

  switch (type) {
    case 'error':
      typeClasses = 'bg-red-500';
      break;
    case 'info':
      typeClasses = 'bg-blue-500';
      break;
    case 'success':
    default:
      typeClasses = 'bg-green-500';
      break;
  }

  toast.className = `${baseClasses} ${typeClasses} opacity-0 translate-y-2`;
  toast.textContent = message;

  container.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.classList.remove('opacity-0', 'translate-y-2');
    toast.classList.add('opacity-100', 'translate-y-0');
  }, 10); // Small delay to allow CSS to apply initial state

  // Animate out and remove
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    toast.addEventListener('transitionend', () => {
      toast.remove();
    });
  }, duration);
} 