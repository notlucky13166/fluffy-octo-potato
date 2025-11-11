import { features } from '../data/content';
import './Features.css';

export const Features = () => (
  <section className="section" id="features">
    <div className="container">
      <div className="section-header">
        <span className="badge">Why teams choose AetherLearn</span>
        <h2 className="section-title">An operating system for transformational learning</h2>
        <p className="section-subtitle">
          Align every stakeholder around measurable outcomes while giving learners an experience that feels handcrafted for
          them.
        </p>
      </div>
      <div className="grid cols-3">
        {features.map((feature) => (
          <article className="card feature-card" key={feature.title}>
            <div className="feature-icon" aria-hidden="true" />
            <h3 className="card-title">{feature.title}</h3>
            <p className="card-description">{feature.description}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);
