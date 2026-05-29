import { useTranslation } from 'react-i18next';

function Footer() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <footer className="px-4 sm:px-6 lg:px-8 py-5 bg-stone-200 border-t border-stone-300 mt-auto">
      <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row justify-between items-center gap-4">
        <p>&copy; Workhub</p>
        
        <div className="flex items-center gap-2">
          <select 
            id="language-select"
            className="bg-white rounded-md px-3 py-1 border border-stone-300 text-sm text-stone-700 shadow-sm cursor-pointer"
            value={i18n.language || 'en'}
            onChange={handleLanguageChange}
          >
            <option value="pt">Português</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
