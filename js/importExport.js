import { getAppState, getCaseInfo, saveAppState, getParameters, saveCaseInfo, getRenderStyle, getFreeText } from '../dataManager.js';
import { generatePrompt } from '../promptGenerator.js';
import { saveAs } from 'file-saver'; // Ensure file-saver is a dependency
import { t } from '../languageManager.js';
import { showToast } from '../ui/toast.js';
import { showConfirm } from '../ui/confirmModal.js';

function exportToTxt() {
  const promptText = generatePrompt();
  const blob = new Blob([promptText], { type: 'text/plain;charset=utf-8' });
  const caseInfo = getCaseInfo();
  const filename = `fantom-sketch-${caseInfo.caseNumber || 'untitled'}-${new Date().toISOString().split('T')[0]}.txt`;
  saveAs(blob, filename);
}

function exportToJson() {
  try {
    const state = getAppState();
    const jsonString = JSON.stringify(state, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
    const caseInfo = state.caseInfo;
    const filename = `fantom-sketch-data-${caseInfo.caseNumber || 'untitled'}-${new Date().toISOString().split('T')[0]}.json`;
    saveAs(blob, filename);
    showToast(t('exportSuccess', { defaultValue: 'Data exported successfully!' }), 'success');
  } catch (error) {
    console.error('Error exporting data to JSON:', error);
    showToast(t('exportError', { defaultValue: 'Error exporting data.' }), 'error');
  }
}

/**
 * Handles the logic for importing a JSON file.
 * @param {Event} event The file input change event.
 */
function handleJsonImport(event) {
  const file = event.target.files[0];
  if (!file) {
    // Reset input to allow re-selecting the same file if the dialog was cancelled
    event.target.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    showConfirm(
      t('importConfirm', { defaultValue: 'Importing a new file will overwrite your current data. Are you sure you want to continue?' }),
      () => {
        try {
          const importedState = JSON.parse(e.target.result);

          if (!importedState || typeof importedState !== 'object' ||
              !importedState.caseInfo || typeof importedState.caseInfo !== 'object' ||
              !importedState.parameters || !Array.isArray(importedState.parameters)) {
            throw new Error(t('importInvalidFormat', { defaultValue: 'Invalid file format.' }));
          }

          saveParameters(importedState.parameters || []);
          saveCaseInfo(importedState.caseInfo || {});
          saveRenderStyle(importedState.renderStyle || 'Sketch');
          saveFreeText(importedState.freeText || '');

          showToast(t('importSuccess', { defaultValue: 'Data imported successfully!' }), 'success');

        } catch (error) {
          console.error('Error importing data:', error);
          showToast(`${t('importError', { defaultValue: 'Import failed:' })} ${error.message}`, 'error');
        } finally {
          event.target.value = '';
        }
      }
    );
  };
  reader.onerror = () => {
    showToast(t('importFileReadError', { defaultValue: 'Failed to read file.' }), 'error');
    event.target.value = '';
  };
  reader.readAsText(file);
}

export function initImportExport() {
  const exportTxtButton = document.getElementById('export-txt-button');
  const exportJsonButton = document.getElementById('export-data-button');
  const importJsonInput = document.getElementById('import-data-input');

  if (exportTxtButton) {
    exportTxtButton.addEventListener('click', exportToTxt);
  }
  if (exportJsonButton) {
    exportJsonButton.addEventListener('click', exportToJson);
  }
  if (importJsonInput) {
    importJsonInput.addEventListener('change', handleJsonImport);
  }
}