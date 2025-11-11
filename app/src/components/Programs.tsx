import { courseTracks } from '../data/content';
import './Programs.css';

export const Programs = () => (
  <section className="section" id="programs">
    <div className="container">
      <div className="section-header">
        <span className="badge">Cohort experiences</span>
        <h2 className="section-title">Launch a flagship program in weeks, not quarters</h2>
        <p className="section-subtitle">
          Mix and match immersive tracks designed around emerging skills. Every program comes with curated playbooks,
          dedicated facilitators, and embedded AI copilots.
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
              <a href="#demo">View syllabus</a>
              <span aria-hidden="true">→</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);
