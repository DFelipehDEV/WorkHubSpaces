import { Link } from 'react-router-dom';

function Button({ children, to, onClick, type = 'button', className = '', variant = 'primary', size = 'large', ...props }) {
  let baseStyle = "text-center tracking-wide font-medium hover:-translate-y-0.5 transition-all duration-300 cursor-pointer ";
  
  if (size === 'large') {
    baseStyle += "inline-block px-8 py-3.5 rounded-full text-lg ";
  } else if (size === 'small') {
    baseStyle += "flex items-center justify-center h-10 px-6 rounded-xl text-xs font-bold ";
  } else if (size === 'medium') {
    baseStyle += "inline-block px-4 py-2 rounded-lg text-xs font-bold ";
  }
  
  if (variant === 'primary') {
    baseStyle += "bg-primary-2 text-white hover:bg-primary-2/90 hover:shadow-[0_4px_16px_rgba(46,125,50,0.3)]";
  } else if (variant === 'danger') {
    baseStyle += "bg-red-600 text-white hover:bg-red-700 hover:shadow-[0_4px_16px_rgba(220,38,38,0.3)]";
  } else if (variant === 'danger-outline') {
    baseStyle += "border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300";
  }
  
  if (to) {
    return (
      <Link to={to} className={`${baseStyle} ${className}`} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={`${baseStyle} ${className}`} {...props}>
      {children}
    </button>
  );
}

export default Button;
