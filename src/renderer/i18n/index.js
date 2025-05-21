import en from '../locales/en.json';
import ru from '../locales/ru.json';

const translations = {
  en,
  ru
};

let currentLanguage = 'ru'; // Default language

function getNestedValue(obj, key) {
  return key.split('.').reduce((o, i) => (o && o[i] !== 'undefined') ? o[i] : undefined, obj);
}

export default {
  /**
   * Sets the current language.
   * @param {string} lang - The language code (e.g., 'en', 'ru').
   */
  setLanguage(lang) {
    if (translations[lang]) {
      currentLanguage = lang;
      console.log(`Language changed to: ${lang}`);
    } else {
      console.warn(`Language '${lang}' not found. Keeping current language: '${currentLanguage}'`);
    }
  },

  /**
   * Translates a given key into the currently selected language.
   * Fallbacks to the key itself if translation is not found.
   * @param {string} key - The key to translate (e.g., 'settings.title').
   * @returns {string} The translated string or the key if not found.
   */
  translate(key) {
    const translated = getNestedValue(translations[currentLanguage], key);
    if (translated === undefined) {
      console.warn(`Translation not found for key: '${key}' in language: '${currentLanguage}'. Returning key.`);
      return key;
    }
    return translated;
  },

  /**
   * Gets the current language.
   * @returns {string} The current language code.
   */
  getCurrentLanguage() {
    return currentLanguage;
  }
};
