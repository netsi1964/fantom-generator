import { getCaseInfo, saveCaseInfo, getParameters, saveParameters, getRenderStyle, saveRenderStyle } from './dataManager.js';
import { initSliders } from './ui/sliders.js';
import { updatePreview } from './promptGenerator.js'; // To update preview after import
import { initCaseInfo } from './ui/caseInfo.js'; // To refresh case info form after import
import { t } from './languageManager.js'; // Import t

const exportButton = document.getElementById('export-data-button');
const importInput = document.getElementById('import-data-input');

/**
 * Combines all relevant data into a single object for export.
 * @returns {object} The combined data object.
 */
function prepareExportData() {
  return {
    caseInfo: getCaseInfo(),
    parameters: getParameters(),
    renderStyle: getRenderStyle(), // Include render style
    exportFormatVersion: 1, // Versioning for future compatibility
  };
}

/**
 * Triggers a file download containing the exported data as JSON.
 */
function handleExport() {
  const exportData = prepareExportData();
  const dataStr = JSON.stringify(exportData, null, 2); // Pretty print JSON
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  // Create a filename based on case info or date
  const filename = (exportData.caseInfo.caseNumber || exportData.caseInfo.title || 'fantom-export').replace(/\W+/g, '-') + '.json';
  link.download = filename;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  console.log('Data exported.');
}

/**
 * Handles file selection for import, reads the file, validates, and loads data.
 * @param {Event} event - The file input change event.
 */
function handleImport(event) {
  const file = event.target.files[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const importedData = JSON.parse(e.target.result);

      // Basic validation - check for expected top-level keys + renderStyle
      if (!importedData || typeof importedData !== 'object' || !importedData.caseInfo || !importedData.parameters || !importedData.renderStyle) {
        throw new Error(t('importInvalidFormat'));
      }
      // TODO: Add more robust validation (schema check?)

      // Load the data
      saveCaseInfo(importedData.caseInfo);
      saveParameters(importedData.parameters);
      saveRenderStyle(importedData.renderStyle);

      console.log('Data imported successfully.');

      // Refresh UI elements
      initCaseInfo(); // Reloads form fields
      initSliders(); // Reloads sliders
      updatePreview(); // Updates the prompt preview

      alert(t('importSuccess')); // Use t()

    } catch (error) {
      console.error('Error importing data:', error);
      alert(`${t('importError')}${error.message || t('importInvalidJSON')}`); // Use t()
    } finally {
      // Reset the file input to allow importing the same file again if needed
      importInput.value = '';
    }
  };

  reader.onerror = (error) => {
    console.error('Error reading file:', error);
    alert(t('importFileReadError')); // Use t()
    importInput.value = '';
  };

  reader.readAsText(file);
}

/**
 * Initializes import/export functionality.
 */
export function initImportExport() {
  if (!exportButton || !importInput) {
    console.error('Import/Export elements not found!');
    return;
  }

  exportButton.addEventListener('click', handleExport);
  importInput.addEventListener('change', handleImport);
}

// Function to update static text on buttons/labels if needed (though data-translate handles most)
export function updateImportExportText() {
  if (exportButton) exportButton.textContent = t('exportButton');
  // The import button is a label, its text is handled by data-translate
} 