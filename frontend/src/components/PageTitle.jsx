function PageTitle({ children, className = '' }) {
  return (
    <h1 className={`text-3xl font-bold text-stone-900 tracking-tight ${className}`}>
      {children}
    </h1>
  );
}

export default PageTitle;
