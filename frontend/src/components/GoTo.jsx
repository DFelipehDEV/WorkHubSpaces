import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function GoTo({ to, text, direction = 'left', align = 'left', className = '', linkClassName = '' }) {
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight;
  
  const containerClasses = `flex ${align === 'right' ? 'justify-end' : 'justify-start'} ${className}`;
  const defaultLinkColors = 'text-stone-500 hover:text-primary-2';
  const linkClasses = `flex items-center gap-1.5 w-fit transition-colors ${linkClassName || defaultLinkColors}`;

  return (
    <div className={containerClasses}>
      <Link to={to} className={linkClasses}>
        {direction === 'left' && <Icon size={18} />}
        <span className="font-medium text-sm">{text}</span>
        {direction === 'right' && <Icon size={18} />}
      </Link>
    </div>
  );
}

export default GoTo;
