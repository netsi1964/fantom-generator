import { initSliders } from './ui/sliders.js';
import { initPromptGenerator } from './promptGenerator.js';
import { initCaseInfo } from './ui/caseInfo.js';
import { initParameterManager } from './ui/parameterManager.js';
import { initImportExport } from './importExport.js';
import { initLanguageManager, setLanguage, getCurrentLanguage } from './languageManager.js';
import { initStyleSelector } from './ui/styleSelector.js';
import { initGenAI } from './genaiImage.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM fully loaded and parsed');

  // Initialize language manager first to load translations
  await initLanguageManager();

  // Initialize other modules
  initCaseInfo();
  initSliders();
  initPromptGenerator();
  initParameterManager();
  initImportExport();
  initStyleSelector();
  initGenAI();

  // Setup Language Switcher
  const langSelector = document.getElementById('language-select');
  if (langSelector) {
    langSelector.value = getCurrentLanguage(); // Set initial value
    langSelector.addEventListener('change', (event) => {
      setLanguage(event.target.value);
    });
  }

  console.log('All modules initialized.');
}); 