import { getParameters, saveParameters } from "../dataManager.js";

function showImagePreview(file) {
  const preview = document.getElementById('image-preview');
  if (!file) {
    preview.classList.add('hidden');
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    preview.src = e.target.result;
    preview.classList.remove('hidden');
  };
  reader.readAsDataURL(file);
}

function performMockAnalysis() {
  console.log('Performing mock analysis...');
  // This is a mock function. In a real scenario, this would involve an API call.
  const mockResults = {
    "Sex": "Female",
    "Age": "Senior",
    "Hair Length": "Long",
    "Hair Color": "Gray",
    "Face Shape": "Heart",
    "Eye Color": "Hazel",
  };

  const currentParameters = getParameters();
  
  const updatedParameters = currentParameters.map(param => {
    if (mockResults.hasOwnProperty(param.name)) {
      return { ...param, value: mockResults[param.name] };
    }
    return param;
  });

  saveParameters(updatedParameters);
  alert('Mock analysis complete! Parameters have been updated.');
}


export function initImageAnalysis() {
  const uploadInput = document.getElementById('image-upload-input');
  const analyzeButton = document.getElementById('analyze-image-button');

  if (!uploadInput || !analyzeButton) {
    console.error('Image analysis elements not found');
    return;
  }

  uploadInput.addEventListener('change', () => {
    const file = uploadInput.files[0];
    showImagePreview(file);
  });

  analyzeButton.addEventListener('click', () => {
    if (!uploadInput.files[0]) {
      alert('Please upload an image first.');
      return;
    }
    performMockAnalysis();
  });
} 