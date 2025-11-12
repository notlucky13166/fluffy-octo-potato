import { courseTracks } from '../data/content';
import './Programs.css';

export const Programs = () => (
  <section className="section" id="programs">
    <div className="container">
      <div className="section-header">
        <span className="badge">Study tracks</span>
        <h2 className="section-title">Pick the path that fits your next big test</h2>
        <p className="section-subtitle">
          Each track blends quick lessons, spaced-repetition drills, and AI check-ins so you know exactly what to review each
          day.
        </p>
      </div>
      <div className="grid cols-3">
        {courseTracks.map((track) => (
          <article className="card program-card" key={track.name}>
            <header>
              <p className="program-duration">{track.duration}</p>
              <h3 className="card-title">{track.name}</h3>
            </header>
            <p className="card-description">{track.blurb}</p>
            <div className="program-footer">
              <a href="#demo">Preview schedule</a>
              <span aria-hidden="true">→</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);
