const PAGES = [
  ["dashboard", "Dashboard"],
  ["about", "About"],
  ["log", "Log skills"],
];

export default function Header({ activePage, onNavigate }) {
  return (
    <header className="app-header">
      <div>
        <h1 className="app-brand-title">Skill Decay Lab</h1>
        <p className="app-brand-tagline">
          Memory decay forecast based on Ebbinghaus.
        </p>
      </div>
      <nav className="app-nav" aria-label="Main">
        {PAGES.map(([page, label]) => (
          <button
            key={page}
            type="button"
            onClick={() => onNavigate(page)}
            className={`app-tab${activePage === page ? " app-tab--active" : ""}`}
          >
            {label}
          </button>
        ))}
      </nav>
    </header>
  );
}
