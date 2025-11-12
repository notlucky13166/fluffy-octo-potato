import './Footer.css';

const footerLinks = [
  {
    title: 'Product',
    items: ['Learning OS', 'Cohort analytics', 'AI copilots', 'Integrations']
  },
  {
    title: 'Programs',
    items: ['AI Engineering', 'Product Leadership', 'Cloud Foundations', 'Custom engagements']
  },
  {
    title: 'Company',
    items: ['About', 'Advisors', 'Careers', 'Contact']
  }
];

export const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-top">
        <div>
          <span className="logo">⚡ AetherLearn</span>
          <p>Experience design for modern learning, powered by community and intelligent workflows.</p>
        </div>
        <div className="footer-links">
          {footerLinks.map((group) => (
            <div key={group.title}>
              <p className="footer-heading">{group.title}</p>
              <nav>
                {group.items.map((item) => (
                  <a href="#" key={item}>
                    {item}
                  </a>
                ))}
              </nav>
            </div>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} AetherLearn. All rights reserved.</p>
        <div className="footer-bottom-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Accessibility</a>
        </div>
      </div>
    </div>
  </footer>
);
