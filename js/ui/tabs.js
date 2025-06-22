export function initTabs() {
  const parametersTab = document.getElementById('parameters-tab');
  const uploadAiTab = document.getElementById('upload-ai-tab');
  const parametersTabContent = document.getElementById('parameters-tab-content');
  const uploadAiTabContent = document.getElementById('upload-ai-tab-content');

  if (!parametersTab || !uploadAiTab || !parametersTabContent || !uploadAiTabContent) {
    console.error('Tab elements not found');
    return;
  }

  function switchTab(activeTab, inactiveTab, activeContent, inactiveContent) {
    // Update button styles
    activeTab.classList.remove('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');
    activeTab.classList.add('border-indigo-500', 'text-indigo-600');
    activeTab.setAttribute('aria-selected', 'true');

    inactiveTab.classList.remove('border-indigo-500', 'text-indigo-600');
    inactiveTab.classList.add('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');
    inactiveTab.setAttribute('aria-selected', 'false');

    // Update content visibility
    activeContent.classList.remove('hidden');
    inactiveContent.classList.add('hidden');
  }

  parametersTab.addEventListener('click', () => {
    switchTab(parametersTab, uploadAiTab, parametersTabContent, uploadAiTabContent);
  });

  uploadAiTab.addEventListener('click', () => {
    switchTab(uploadAiTab, parametersTab, uploadAiTabContent, parametersTabContent);
  });

  // Set initial state
  switchTab(parametersTab, uploadAiTab, parametersTabContent, uploadAiTabContent);
} 