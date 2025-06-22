import { initLanguageSwitcher, initLanguageManager } from './languageManager.js';
import { renderAllSliders } from './ui/sliders.js';
import { initCaseInfo } from './ui/caseInfo.js';
import { initParameterManager } from './ui/parameterManager.js';
import { initImportExport } from './importExport.js';
import { initStyleSelector } from './ui/styleSelector.js';
import { initGenAI } from './genaiImage.js';
import { initPromptGenerator } from './promptGenerator.js';
import { initParameterModal } from './ui/parameterModal.js';
import { initTabs } from './ui/tabs.js';
import { initImageAnalysis } from './ui/imageAnalysis.js';

/**
 * Main entry point for the application.
 * Initializes all modules after the DOM is fully loaded.
 */
async function main() {
  console.log('DOM fully loaded and parsed. Initializing application...');

  // Initialize language manager first as it loads translations.
  await initLanguageManager();
  initLanguageSwitcher();

  // Initialize UI components and managers
  initTabs();
  initCaseInfo();
  initStyleSelector();
  renderAllSliders(); // Renders the initial set of sliders
  initParameterManager(); // Manages add/reset buttons
  initParameterModal(); // Manages the add/edit parameter modal
  
  // Initialize core functionality
  initPromptGenerator();
  initImportExport();
  
  // Initialize features for the "Upload & AI" tab
  initImageAnalysis();
  initGenAI();

  console.log('Fantom Generator initialized.');
}

// --- App Entry Point ---

// Wait for the DOM to be fully loaded before running the initialization logic.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  // DOM is already ready
  main();
}