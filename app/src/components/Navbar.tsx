import './Navbar.css';

const links = [
  { href: '#features', label: 'Platform' },
  { href: '#programs', label: 'Programs' },
  { href: '#testimonials', label: 'Stories' },
  { href: '#demo', label: 'Get a demo' }
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
      <a className="button secondary navbar-cta" href="#demo">
        Request access
      </a>
    </div>
  </header>
);
