import { features } from '../data/content';
import './Features.css';

export const Features = () => (
  <section className="section" id="features">
    <div className="container">
      <div className="section-header">
        <span className="badge">Why students stick with it</span>
        <h2 className="section-title">Everything you need to study, all in one place</h2>
        <p className="section-subtitle">
          AetherLearn combines smart planning tools, friendly accountability, and quick explanations so exam weeks feel calm
          instead of chaotic.
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
