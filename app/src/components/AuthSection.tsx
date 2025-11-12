import './AuthSection.css';

export const AuthSection = () => (
  <section className="auth section" id="auth">
    <div className="container">
      <div className="auth-shell gradient-border">
        <div className="auth-header">
          <span className="badge">Student access</span>
          <h2>Log in or start your free study hub.</h2>
          <p>
            Jump back into your saved plans or spin up a fresh space for the semester. Every account includes AI tutoring,
            streak tracking, and private storage for your notes.
          </p>
        </div>
        <div className="auth-panels">
          <form className="auth-form" aria-label="Log in to existing workspace">
            <h3>Log in</h3>
            <label>
              School email
              <input type="email" name="login-email" placeholder="you@student.edu" autoComplete="email" required />
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
              School email
              <input type="email" name="signup-email" placeholder="you@student.edu" autoComplete="email" required />
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
              Study group size
              <select name="signup-size" defaultValue="" required>
                <option value="" disabled>
                  Select an option
                </option>
                <option value="solo">Just me</option>
                <option value="2-5">2 - 5 friends</option>
                <option value="6-10">6 - 10 classmates</option>
                <option value="11+">11+ classmates</option>
              </select>
            </label>
            <button type="submit" className="button secondary">
              Create study hub
            </button>
            <p className="auth-note">No credit card required. Free for students with unlimited planning and tutoring minutes.</p>
          </form>
        </div>
      </div>
    </div>
  </section>
);

