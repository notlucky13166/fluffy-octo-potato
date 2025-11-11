import { testimonials } from '../data/content';
import './Testimonials.css';

export const Testimonials = () => (
  <section className="section" id="testimonials">
    <div className="container">
      <div className="section-header">
        <span className="badge">Loved by enablement teams</span>
        <h2 className="section-title">Designed with practitioners, for practitioners</h2>
        <p className="section-subtitle">
          We collaborate with industry mentors, people leaders, and community architects to continually evolve our playbooks.
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
