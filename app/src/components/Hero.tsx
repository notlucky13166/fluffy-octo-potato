import './Hero.css';

export const Hero = () => {
  return (
    <section className="hero section">
      <div className="container">
        <div className="hero-content gradient-border">
          <div className="hero-body">
            <span className="badge">Future-ready learning platform</span>
            <h1>Design learning journeys that feel handcrafted for every team.</h1>
            <p>
              Craft transformational cohort experiences that blend live workshops, async labs, and AI copilots—all orchestrated
              from a single command center.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#programs">
                Explore programs
              </a>
              <a className="button secondary" href="#demo">
                Talk to an advisor
              </a>
            </div>
            <dl className="hero-stats">
              <div>
                <dt>Teams activated</dt>
                <dd>120+</dd>
              </div>
              <div>
                <dt>Average satisfaction</dt>
                <dd>4.9/5</dd>
              </div>
              <div>
                <dt>Launch timeline</dt>
                <dd>&lt; 3 weeks</dd>
              </div>
            </dl>
          </div>
          <div className="hero-visual">
            <div className="hero-card">
              <p className="hero-card-title">Cohort pulse</p>
              <div className="hero-card-metric">
                <span>Engagement</span>
                <strong>92%</strong>
              </div>
              <div className="hero-card-metric">
                <span>Projects shipped</span>
                <strong>48</strong>
              </div>
              <div className="hero-card-footnote">Real-time telemetry across every learning loop.</div>
            </div>
            <div className="hero-card secondary">
              <p className="hero-card-title">AI Coach</p>
              <p className="hero-card-description">
                “Here’s a warm-up activity to help your cohort practice storytelling before tomorrow’s stakeholder demo.”
              </p>
              <div className="hero-card-footnote">Powered by contextual prompts &amp; team rituals.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
