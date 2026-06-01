import { ChevronLeft, ChevronRight } from 'lucide-react';

function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  className = "" 
}) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className={`flex flex-col sm:flex-row justify-end items-center gap-4 mt-8 px-2 py-4 border-t border-stone-200 ${className}`}>
      <nav className="flex items-center gap-1.5 order-1 sm:order-2" aria-label="Pagination">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage == 1}
          className={`flex items-center justify-center p-2 rounded-xl border border-stone-200 bg-white text-stone-600 shadow-sm transition-all duration-200 select-none
            ${currentPage == 1 
              ? 'opacity-40 cursor-not-allowed' 
              : 'hover:bg-stone-50 hover:text-primary-2 hover:border-stone-300 active:scale-95 cursor-pointer'
            }`}
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => {
            if (page == '...') {
              return (
                <span 
                  key={`ellipsis-${index}`} 
                  className="w-9 h-9 flex items-center justify-center text-stone-400 font-medium text-sm select-none"
                >
                  &bull;&bull;&bull;
                </span>
              );
            }

            const isCurrent = page == currentPage;
            return (
              <button
                key={`page-${page}`}
                onClick={() => onPageChange(page)}
                aria-current={isCurrent ? 'page' : undefined}
                className={`w-9 h-9 flex items-center justify-center text-sm font-semibold rounded-xl transition-all duration-200 select-none cursor-pointer
                  ${isCurrent 
                    ? 'bg-primary-2 text-white shadow-md shadow-primary-2/10 hover:opacity-95' 
                    : 'border border-stone-200 bg-white text-stone-600 shadow-sm hover:bg-stone-50 hover:text-stone-900 active:scale-95'
                  }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage == totalPages}
          className={`flex items-center justify-center p-2 rounded-xl border border-stone-200 bg-white text-stone-600 shadow-sm transition-all duration-200 select-none
            ${currentPage == totalPages 
              ? 'opacity-40 cursor-not-allowed' 
              : 'hover:bg-stone-50 hover:text-primary-2 hover:border-stone-300 active:scale-95 cursor-pointer'
            }`}
          aria-label="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </nav>
    </div>
  );
}

export default Pagination;
