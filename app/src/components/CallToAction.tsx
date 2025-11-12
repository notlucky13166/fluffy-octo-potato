import { FormEvent, useState } from 'react';
import './CallToAction.css';
import { apiClient } from '../lib/apiClient';
import { getSupabaseClient } from '../lib/supabaseClient';

type Status = {
  type: 'success' | 'error';
  message: string;
};

export const CallToAction = () => {
  const [form, setForm] = useState({ email: '', course: '', date: '' });
  const [status, setStatus] = useState<Status | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.email.trim()) {
      setStatus({ type: 'error', message: 'Add your school email so we can send over your sprint plan.' });
      return;
    }

    setIsSubmitting(true);
    setStatus(null);

    try {
      const supabase = getSupabaseClient();
      let authorization: string | undefined;

      if (supabase) {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        if (token) {
          authorization = `Bearer ${token}`;
        }
      }

      await apiClient('/forms/study-sprint', {
        method: 'POST',
        headers: authorization ? { Authorization: authorization } : undefined,
        body: JSON.stringify({
          email: form.email.trim(),
          course: form.course.trim() || null,
          targetExamDate: form.date || null
        })
      });

      setStatus({
        type: 'success',
        message: 'All set! Watch your inbox — we’ll send a personalized sprint plan within a few minutes.'
      });
      setForm({ email: '', course: '', date: '' });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'We hit a snag while scheduling your sprint. Please try again shortly.';
      setStatus({ type: 'error', message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
          <form className="cta-form" aria-label="Request a guided study sprint" onSubmit={handleSubmit}>
            <label>
              School email
              <input
                type="email"
                name="email"
                placeholder="you@student.edu"
                required
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              />
            </label>
            <label>
              Course name
              <input
                type="text"
                name="course"
                placeholder="e.g. AP Biology, Calculus II"
                value={form.course}
                onChange={(event) => setForm((prev) => ({ ...prev, course: event.target.value }))}
              />
            </label>
            <label>
              Target exam date
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
              />
            </label>
            <button type="submit" className="button primary" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting…' : 'Get my study sprint'}
            </button>
            {status && (
              <p className={`cta-status ${status.type}`} role="status" aria-live="polite">
                {status.message}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

