import { useTranslation } from 'react-i18next';

function LanguageToggle() {
  const { i18n } = useTranslation();

  const switchLang = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <div className="flex items-center text-xs font-semibold border rounded-full overflow-hidden">
      <button
        onClick={() => switchLang('en')}
        className={`px-2.5 py-1 transition-colors ${
          i18n.language === 'en' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => switchLang('hi')}
        className={`px-2.5 py-1 transition-colors ${
          i18n.language === 'hi' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'
        }`}
      >
        हिं
      </button>
    </div>
  );
}

export default LanguageToggle;