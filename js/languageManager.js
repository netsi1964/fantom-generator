import { updateParameterManagerText } from './ui/parameterManager.js';
import { updateImportExportText } from './importExport.js';
import { renderAllSliders } from './ui/sliders.js';
import { updateStyleSelectorUI } from './ui/styleSelector.js';

const LANG_STORAGE_KEY = 'fantomLang';
const SUPPORTED_LANGS = ['en', 'es', 'da', 'zh', 'hi'];
let currentLang = 'en';
let translations = {};

/**
 * Loads the translation file for the given language.
 * @param {string} lang - The language code (e.g., 'en', 'es').
 * @returns {Promise<object>} - A promise that resolves with the translation object.
 */
async function loadTranslations(lang) {
  try {
    // Use a path relative to the base URL of the current page
    // This ensures it works both locally and when deployed to GitHub Pages
    const baseUrl = new URL('./', window.location.href).href;
    const response = await fetch(`${baseUrl}lang/${lang}.json`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error loading translations for ${lang}:`, error);
    return {}; // Return empty object on error
  }
}

/**
 * Gets the translated string for a given key.
 * Falls back to the key itself if translation not found.
 * @param {string} key - The translation key.
 * @param {object} [vars={}] - Optional variables for interpolation (e.g., { count: 5 }).
 * @returns {string} - The translated string.
 */
export function t(key, vars = {}) {
  let translation = translations[key] || key; // Fallback to key
  // Basic interpolation
  Object.keys(vars).forEach(varKey => {
    const regex = new RegExp(`{${varKey}}`, 'g');
    translation = translation.replace(regex, vars[varKey]);
  });
  return translation;
}

/**
 * Sets the current language, loads translations, and updates the UI.
 * @param {string} lang - The language code to switch to.
 */
export async function setLanguage(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) {
    console.warn(`Unsupported language: ${lang}. Defaulting to 'en'.`);
    lang = 'en';
  }

  currentLang = lang;
  translations = await loadTranslations(lang);
  localStorage.setItem(LANG_STORAGE_KEY, lang);
  document.documentElement.lang = lang; // Update html lang attribute

  // Update all UI elements that need translation
  updateUITranslations();

  // Call specific update functions for modules with dynamic text
  updateParameterManagerText();
  updateImportExportText();
  renderAllSliders(); // Re-render sliders for language update
  updateStyleSelectorUI();

  console.log(`Language set to ${lang}`);
}

/**
 * Updates all static UI elements with current translations.
 * Uses data-translate attributes on HTML elements.
 */
function updateUITranslations() {
  document.querySelectorAll('[data-translate]').forEach(element => {
    const key = element.getAttribute('data-translate');
    const attribute = element.getAttribute('data-translate-attr') || 'textContent'; // Default to textContent

    if (key) {
      const translated = t(key);
      if (element[attribute] !== translated) {
        element[attribute] = translated;
      }
    }
  });
  // Note: Dynamically created elements (like sliders, modal content)
  // will need to be updated when they are created/shown or language changes.
}

/**
 * Initializes the language switcher dropdown.
 */
export function initLanguageSwitcher() {
  const langSelector = document.getElementById('language-select');
  if (langSelector) {
    langSelector.value = getCurrentLanguage();
    langSelector.addEventListener('change', (event) => {
      setLanguage(event.target.value);
    });
  }
}

/**
 * Initializes the language manager.
 */
export async function initLanguageManager() {
  const savedLang = localStorage.getItem(LANG_STORAGE_KEY);
  const initialLang = savedLang && SUPPORTED_LANGS.includes(savedLang) ? savedLang : 'en';
  await setLanguage(initialLang);
}

/**
 * Gets the current language code.
 * @returns {string} The current language code.
 */
export function getCurrentLanguage() {
  return currentLang;
} 