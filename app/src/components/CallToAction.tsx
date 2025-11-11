import './CallToAction.css';

export const CallToAction = () => (
  <section className="section" id="demo">
    <div className="container">
      <div className="cta gradient-border">
        <div className="cta-body">
          <span className="badge">See AetherLearn in action</span>
          <h2>Orchestrate world-class learning in one place.</h2>
          <p>
            Pair a dedicated program architect with our AI copilots to launch a pilot cohort tailored to your organization’s
            goals. We’ll help you design the rituals, assets, and analytics to prove impact fast.
          </p>
        </div>
        <form className="cta-form" aria-label="Request a strategy session">
          <label>
            Work email
            <input type="email" name="email" placeholder="you@company.com" required />
          </label>
          <label>
            Team size
            <select name="team-size" defaultValue="">
              <option value="" disabled>
                Select an option
              </option>
              <option value="1-20">1 - 20 learners</option>
              <option value="21-50">21 - 50 learners</option>
              <option value="51-100">51 - 100 learners</option>
              <option value="101+">101+ learners</option>
            </select>
          </label>
          <label>
            Focus area
            <input type="text" name="focus" placeholder="e.g. AI adoption, product discovery" />
          </label>
          <button type="submit" className="button primary">
            Book strategy session
          </button>
        </form>
      </div>
    </div>
  </section>
);
