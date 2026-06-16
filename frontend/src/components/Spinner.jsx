function Spinner({ fullPage = false, className = 'h-8 w-8 border-stone-800' }) {
  const spinner = <div className={`animate-spin rounded-full border-b-2 ${className}`}></div>;

  if (fullPage) {
    return (
      <div className="flex justify-center items-center py-20">
        {spinner}
      </div>
    );
  }

  return spinner;
}

export default Spinner;
