import './Navbar.css';

const links = [
  { href: '#features', label: 'Study tools' },
  { href: '#programs', label: 'Tracks' },
  { href: '#testimonials', label: 'Success stories' },
  { href: '#demo', label: 'Guided session' },
  { href: '#auth', label: 'Log in' }
];

export const Navbar = () => (
  <header className="navbar">
    <div className="container navbar-inner">
      <a className="navbar-logo" href="#">
        <span aria-hidden="true">⚡</span>
        AetherLearn
      </a>
      <nav className="navbar-links" aria-label="Primary">
        {links.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
      <a className="button secondary navbar-cta" href="#auth">
        Start for free
      </a>
    </div>
  </header>
);
