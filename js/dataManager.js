/**
 * Manages the application's central state, including case information, parameters,
 * and interaction with localStorage.
 */

// --- Constants for localStorage keys ---
const APP_STATE_KEY = 'fantomAppState';

// --- Central Application State ---
let appState = {};

// --- Default Data Structures ---

export const defaultState = {
  caseInfo: {
    title: '',
    caseNumber: '',
    date: '',
  },
  parameters: [
    {
      id: 'hair-length',
      name: 'Hair Length',
      shades: ['Very short', 'Short', 'Medium', 'Long', 'Very long'],
      value: 'Medium',
    },
    {
      id: 'hair-color',
      name: 'Hair Color',
      shades: ['Black', 'Brown', 'Blonde', 'Red', 'Gray', 'White'],
      value: 'Brown',
    },
    {
      id: 'eye-color',
      name: 'Eye Color',
      shades: ['Blue', 'Green', 'Brown', 'Hazel', 'Gray', 'Black'],
      value: 'Brown',
    },
    {
      id: 'skin-tone',
      name: 'Skin Tone',
      shades: ['Pale', 'Light', 'Medium', 'Olive', 'Dark', 'Very Dark'],
      value: 'Medium',
    },
    {
      id: 'sex',
      name: 'Sex',
      shades: ['Male', 'Female', 'Other/Unspecified'],
      value: 'Male',
    },
    {
      id: 'age',
      name: 'Age',
      shades: ['Child', 'Teenager', 'Young Adult', 'Middle-aged', 'Senior'],
      value: 'Young Adult',
    },
    {
      id: 'build',
      name: 'Build',
      shades: ['Slim', 'Medium', 'Heavy', 'Muscular'],
      value: 'Medium',
    },
    {
      id: 'facial-hair',
      name: 'Facial Hair',
      shades: ['None', 'Moustache', 'Goatee', 'Short Beard', 'Full Beard'],
      value: 'None',
    },
    {
      id: 'face-shape',
      name: 'Face Shape',
      shades: ['Oval', 'Round', 'Square', 'Heart', 'Long'],
      value: 'Oval',
    },
  ],
  renderStyle: 'Sketch',
  freeText: '',
};

/**
 * Checks if a parameter is part of the default set.
 * @param {string} parameterId - The ID of the parameter to check.
 * @returns {boolean} - True if the parameter is a default parameter.
 */
export function isDefaultParameter(parameterId) {
  return defaultState.parameters.some(p => p.id === parameterId);
}

// --- Core State Management ---

/**
 * Initializes the application state by loading from localStorage or using defaults.
 */
export function initializeAppState() {
  const loadedState = JSON.parse(localStorage.getItem(APP_STATE_KEY)) || {};
  
  // Deep merge for robust state initialization
  appState = {
    ...defaultState,
    ...loadedState,
    caseInfo: { ...defaultState.caseInfo, ...loadedState.caseInfo },
    parameters: loadedState.parameters && Array.isArray(loadedState.parameters) ? loadedState.parameters : [...defaultState.parameters],
  };
  console.log('Initialized App State:', appState);
}

/**
 * Saves the entire application state to localStorage and notifies the UI.
 * @param {string} changeType - A key describing what part of the state changed.
 */
function saveAndNotify(changeType) {
  localStorage.setItem(APP_STATE_KEY, JSON.stringify(appState));
  document.dispatchEvent(new CustomEvent('stateChange', { 
    detail: { newState: appState, changedKey: changeType } 
  }));
}

// --- Public API for State Interaction ---

/**
 * Gets the entire current application state.
 * @returns {object} The application state object.
 */
export function getAppState() {
    return appState;
}

/**
 * Gets the current case information from the central state.
 * @returns {object} The case information object.
 */
export function getCaseInfo() {
  return appState.caseInfo || { ...defaultState.caseInfo };
}

/**
 * Gets the current free text from the central state.
 * @returns {string} The free text string.
 */
export function getFreeText() {
  return appState.freeText || defaultState.freeText;
}

/**
 * Updates the case information in the state and saves.
 * @param {object} caseInfo The case information object to save.
 */
export function saveCaseInfo(caseInfo) {
  appState.caseInfo = caseInfo;
  saveAndNotify('caseInfo');
}

/**
 * Gets the current parameters from the central state.
 * @returns {Array<object>} An array of parameter objects.
 */
export function getParameters() {
  return appState.parameters || [...defaultState.parameters];
}

/**
 * Updates the parameters array in the state and saves.
 * @param {Array<object>} parameters An array of parameter objects to save.
 */
export function saveParameters(parameters) {
  appState.parameters = parameters;
  saveAndNotify('parameters');
}

/**
 * Gets the current render style from the central state.
 * @returns {string} The render style string.
 */
export function getRenderStyle() {
  return appState.renderStyle;
}

/**
 * Updates the render style in the state and saves.
 * @param {string} style The render style string to save.
 */
export function saveRenderStyle(style) {
  appState.renderStyle = style;
  saveAndNotify('renderStyle');
}

/**
 * Updates the free text in the state and saves.
 * @param {string} text The free text to save.
 */
export function saveFreeText(text) {
  appState.freeText = text;
  saveAndNotify('freeText');
}

/**
 * Resets the entire application state to defaults.
 */
export function resetAppState() {
  appState = JSON.parse(JSON.stringify(defaultState)); // Deep copy
  saveAndNotify('fullReset');
}

/**
 * Resets only the parameters to their default state.
 */
export function resetParameters() {
  appState.parameters = JSON.parse(JSON.stringify(defaultState.parameters)); // Deep copy
  saveAndNotify('parameters');
}

// Initialize on load. This ensures the state is ready when other modules import from here.
initializeAppState();