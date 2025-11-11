import './AuthSection.css';

export const AuthSection = () => (
  <section className="auth section" id="auth">
    <div className="container">
      <div className="auth-shell gradient-border">
        <div className="auth-header">
          <span className="badge">Secure workspace access</span>
          <h2>Log in or launch your AetherLearn hub.</h2>
          <p>
            Use your work email to resume where you left off or activate a new pilot for your team. All accounts include
            SSO, audit trails, and SOC 2-aligned safeguards.
          </p>
        </div>
        <div className="auth-panels">
          <form className="auth-form" aria-label="Log in to existing workspace">
            <h3>Log in</h3>
            <label>
              Work email
              <input type="email" name="login-email" placeholder="you@company.com" autoComplete="email" required />
            </label>
            <label>
              Password
              <input
                type="password"
                name="login-password"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </label>
            <div className="auth-form-footer">
              <a href="#" className="auth-link">
                Forgot password?
              </a>
              <button type="submit" className="button primary">
                Log in
              </button>
            </div>
          </form>

          <form className="auth-form" aria-label="Create a new workspace">
            <h3>Sign up</h3>
            <label>
              Full name
              <input type="text" name="signup-name" placeholder="Ada Lovelace" autoComplete="name" required />
            </label>
            <label>
              Work email
              <input type="email" name="signup-email" placeholder="you@company.com" autoComplete="email" required />
            </label>
            <label>
              Create password
              <input
                type="password"
                name="signup-password"
                placeholder="Create a password"
                autoComplete="new-password"
                required
              />
            </label>
            <label>
              Cohort size
              <select name="signup-size" defaultValue="" required>
                <option value="" disabled>
                  Select an option
                </option>
                <option value="1-20">1 - 20 learners</option>
                <option value="21-50">21 - 50 learners</option>
                <option value="51-100">51 - 100 learners</option>
                <option value="101+">101+ learners</option>
              </select>
            </label>
            <button type="submit" className="button secondary">
              Create workspace
            </button>
            <p className="auth-note">No credit card required. 30-day pilot with full analytics included.</p>
          </form>
        </div>
      </div>
    </div>
  </section>
);

