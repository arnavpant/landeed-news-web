export default function Header({
  onMenuToggle,
}: {
  onMenuToggle?: () => void;
}) {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md">
      <div className="px-6 h-20 flex items-center">
        {/* Mobile menu button */}
        <button
          onClick={onMenuToggle}
          className="md:hidden size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300 mr-3"
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src="https://cdn.prod.website-files.com/64897dbf5ae300633717ee2e/673834bb4da80eda38325c94_landeed%20logo.svg"
            alt="Landeed"
            className="h-8"
          />
        </div>
      </div>
    </header>
  );
}
