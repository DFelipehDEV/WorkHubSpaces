import { useState } from 'react';
import { Link } from "react-router";
import { Menu, X } from 'lucide-react';

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const baseUrl = import.meta.env.VITE_FRONTEND_URL;

  return (
    <div className="px-4 md:px-12 lg:px-24 pt-5 sticky top-0 z-50">
      <div className="px-6 py-4 flex gap-8 justify-between items-center rounded-3xl bg-white/75 backdrop-blur-sm border border-stone-200 shadow-sm">
        <Link to={baseUrl} className="text-stone-800 text-xl md:text-2xl font-semibold">
          Workhub Spaces
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link to={baseUrl} className="text-stone-800 text-lg font-normal tracking-tighter hover:text-stone-600 transition-colors">Home</Link>
          <Link to={`${baseUrl}/spaces`} className="text-stone-800 text-lg font-normal tracking-tighter hover:text-stone-600 transition-colors">Spaces</Link>
          <Link to={`${baseUrl}/login`} className="bg-primary-2 text-center px-5 py-2 rounded-xl tracking-tighter text-white text-md font-medium hover:opacity-90 transition-opacity">Login</Link>
        </div>
        <button
          className="md:hidden text-stone-800 p-2 cursor-pointer hover:bg-stone-100 rounded-lg transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden mt-2 p-4 bg-white border border-stone-200 rounded-2xl shadow-lg flex flex-col gap-4">
          <Link
            to={baseUrl}
            className="text-stone-800 text-lg font-normal tracking-tighter py-2 border-b border-stone-100"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to={`${baseUrl}/spaces`}
            className="text-stone-800 text-lg font-normal tracking-tighter py-2 border-b border-stone-100"
            onClick={() => setIsOpen(false)}
          >
            Spaces
          </Link>
          <Link
            to={`${baseUrl}/login`}
            className="bg-primary-2 text-center px-4 py-3 rounded-xl tracking-tighter text-white text-md font-medium mt-2"
            onClick={() => setIsOpen(false)}
          >
            Login
          </Link>
        </div>
      )}
    </div>
  );
}

export default Navigation;