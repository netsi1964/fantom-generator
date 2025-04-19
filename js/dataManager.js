/**
 * Manages application data, including case information, parameters,
 * and interaction with localStorage.
 */

const CASE_INFO_KEY = 'fantomCaseInfo';
const PARAMETERS_KEY = 'fantomParameters';
const RENDER_STYLE_KEY = 'fantomRenderStyle'; // Key for render style

// --- Default Data ---

const defaultCaseInfo = {
  title: '',
  caseNumber: '',
  date: '',
};

const defaultParameters = [
  {
    id: 'hair-length',
    name: 'Hair Length',
    shades: ['Very short', 'Short', 'Medium', 'Long', 'Very long'],
    value: 'Medium', // Default value often center
    // Future AI mapping hint: aiConcept: 'hair_length_category'
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
    // Future AI mapping hint: aiConcept: 'skin_tone_scale'
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
    // Using descriptive ranges instead of a numeric slider for simplicity
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
  // New parameters can be added here or dynamically via parameter manager.
  // The structure is designed to be extensible for future parameter types
  // (e.g., color pickers, boolean flags) by potentially adding a 'type' field.
];

const defaultRenderStyle = 'Sketch'; // Default rendering style

// --- Utility Functions ---

/**
 * Loads data from localStorage.
 * @param {string} key The localStorage key.
 * @param {any} defaultValue The default value if key not found or error occurs.
 * @returns {any} The loaded data or the default value.
 */
function loadFromStorage(key, defaultValue) {
  try {
    const storedValue = localStorage.getItem(key);
    if (storedValue === null) {
      return defaultValue;
    }
    // Check if it's the render style key and looks like a plain string
    // or if it's just not JSON-like
    if ((key === RENDER_STYLE_KEY || (!storedValue.startsWith('{') && !storedValue.startsWith('['))) && storedValue !== 'null') {
        return storedValue; // Return plain string value
    }
    // Otherwise, parse as JSON
    return JSON.parse(storedValue);
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
}

/**
 * Saves data to localStorage.
 * @param {string} key The localStorage key.
 * @param {any} value The value to save.
 */
function saveToStorage(key, value) {
  try {
    // Store non-JSON strings directly for render style
    const valueToStore = (typeof value === 'string' && (key === RENDER_STYLE_KEY)) ? value : JSON.stringify(value);
    localStorage.setItem(key, valueToStore);
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

// --- Public API ---

/**
 * Gets the current case information, loading from storage or using defaults.
 * @returns {object} The case information object.
 */
export function getCaseInfo() {
  return loadFromStorage(CASE_INFO_KEY, { ...defaultCaseInfo });
}

/**
 * Saves the provided case information to storage.
 * @param {object} caseInfo The case information object to save.
 */
export function saveCaseInfo(caseInfo) {
  // Basic validation could be added here
  saveToStorage(CASE_INFO_KEY, caseInfo);
}

/**
 * Gets the current parameters, loading from storage or using defaults.
 * @returns {Array<object>} An array of parameter objects.
 */
export function getParameters() {
  // Deep copy default parameters to avoid mutation issues
  const defaultCopy = defaultParameters.map(p => ({ ...p }));
  return loadFromStorage(PARAMETERS_KEY, defaultCopy);
}

/**
 * Saves the provided parameters array to storage.
 * @param {Array<object>} parameters An array of parameter objects to save.
 */
export function saveParameters(parameters) {
  // Basic validation could be added here
  // Ensure parameters array structure is valid
  // TODO: Implement validation based on expected parameter structure
  // This structure can be extended to include AI-specific fields if needed.
  saveToStorage(PARAMETERS_KEY, parameters);
}

/**
 * Resets parameters to their default values and saves.
 */
export function resetParameters() {
  const defaultCopy = defaultParameters.map(p => ({ ...p }));
  saveParameters(defaultCopy);
}

/**
 * Resets case information to its default values and saves.
 */
export function resetCaseInfo() {
  saveCaseInfo({ ...defaultCaseInfo });
}

// --- Render Style Functions ---

/**
 * Gets the current render style, loading from storage or using default.
 * @returns {string} The render style string.
 */
export function getRenderStyle() {
  return loadFromStorage(RENDER_STYLE_KEY, defaultRenderStyle);
}

/**
 * Saves the provided render style to storage.
 * @param {string} style The render style string to save.
 */
export function saveRenderStyle(style) {
  // Basic validation could be added here
  saveToStorage(RENDER_STYLE_KEY, style);
} 