import './Hero.css';

export const Hero = () => {
  return (
    <section className="hero section">
      <div className="container">
        <div className="hero-content gradient-border">
          <div className="hero-body">
            <span className="badge">AI study partner</span>
            <h1>Crush your classes with smarter study sessions.</h1>
            <p>
              Build a plan for every exam, get instant tutoring on tough problems, and keep your motivation high with daily
              check-ins—no campus appointment required.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#programs">
                Browse study tracks
              </a>
              <a className="button secondary" href="#demo">
                Try a guided session
              </a>
            </div>
            <dl className="hero-stats">
              <div>
                <dt>Study hours logged</dt>
                <dd>85k+</dd>
              </div>
              <div>
                <dt>Average grade lift</dt>
                <dd>+1.4 GPA</dd>
              </div>
              <div>
                <dt>Daily streaks</dt>
                <dd>32k and counting</dd>
              </div>
            </dl>
          </div>
          <div className="hero-visual">
            <div className="hero-card">
              <p className="hero-card-title">Tonight's plan</p>
              <div className="hero-card-metric">
                <span>Calc II review</span>
                <strong>45 min</strong>
              </div>
              <div className="hero-card-metric">
                <span>Flashcards mastered</span>
                <strong>38/40</strong>
              </div>
              <div className="hero-card-footnote">AI adjusts your pace as you conquer topics.</div>
            </div>
            <div className="hero-card secondary">
              <p className="hero-card-title">AI Coach</p>
              <p className="hero-card-description">
                “Let’s tackle the hardest derivative step-by-step, then I’ll quiz you with exam-style problems.”
              </p>
              <div className="hero-card-footnote">Always-on help that sounds like a supportive peer.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
