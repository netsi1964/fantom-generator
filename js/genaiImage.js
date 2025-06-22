export function initGenAI() {
  const button = document.getElementById('generate-image-button');
  const resultContainer = document.getElementById('image-result');
  if (!button || !resultContainer) return;
  button.addEventListener('click', () => {
    resultContainer.textContent = 'Image generation is not available in this MVP.';
  });
}
