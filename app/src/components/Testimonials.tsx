import { testimonials } from '../data/content';
import './Testimonials.css';

export const Testimonials = () => (
  <section className="section" id="testimonials">
    <div className="container">
      <div className="section-header">
        <span className="badge">Real student wins</span>
        <h2 className="section-title">Built with learners, tested during crunch time</h2>
        <p className="section-subtitle">
          From high school finals to college midterms, students use AetherLearn to stay confident, consistent, and ahead of the
          curve.
        </p>
      </div>
      <div className="grid cols-3 testimonial-grid">
        {testimonials.map((testimonial) => (
          <article className="card testimonial" key={testimonial.name}>
            <p className="testimonial-quote">{testimonial.quote}</p>
            <div>
              <p className="testimonial-author">{testimonial.name}</p>
              <p className="testimonial-role">{testimonial.role}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);
