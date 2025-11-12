import './CallToAction.css';

export const CallToAction = () => (
  <section className="section" id="demo">
    <div className="container">
      <div className="cta gradient-border">
        <div className="cta-body">
          <span className="badge">Need a boost?</span>
          <h2>Schedule a guided study sprint with our AI coach.</h2>
          <p>
            Share the class you’re tackling and we’ll send over a personalized plan with practice sets, reminders, and a live
            kick-off session to get you moving today.
          </p>
        </div>
        <form className="cta-form" aria-label="Request a guided study sprint">
          <label>
            School email
            <input type="email" name="email" placeholder="you@student.edu" required />
          </label>
          <label>
            Course name
            <input type="text" name="course" placeholder="e.g. AP Biology, Calculus II" />
          </label>
          <label>
            Target exam date
            <input type="date" name="date" />
          </label>
          <button type="submit" className="button primary">
            Get my study sprint
          </button>
        </form>
      </div>
    </div>
  </section>
);
