import { FormEvent, useState } from 'react';
import './AuthSection.css';
import { getSupabaseClient } from '../lib/supabaseClient';

type Status = {
  type: 'success' | 'error' | 'info';
  message: string;
};

const authClient = getSupabaseClient();

const missingSupabaseMessage =
  'Supabase is not configured. Add your project URL and anon key to the environment to enable sign in.';

export const AuthSection = () => {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginStatus, setLoginStatus] = useState<Status | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '', size: '' });
  const [signupStatus, setSignupStatus] = useState<Status | null>(null);
  const [isSigningUp, setIsSigningUp] = useState(false);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginStatus(null);

    if (!authClient) {
      setLoginStatus({ type: 'error', message: missingSupabaseMessage });
      return;
    }

    setIsLoggingIn(true);

    try {
      const { error } = await authClient.auth.signInWithPassword({
        email: loginForm.email.trim(),
        password: loginForm.password
      });

      if (error) {
        throw error;
      }

      setLoginStatus({
        type: 'success',
        message: 'Welcome back! Your workspace is loading — hang tight for a second.'
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'We could not sign you in. Double-check your email and password.';
      setLoginStatus({ type: 'error', message });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!authClient) {
      setLoginStatus({ type: 'error', message: missingSupabaseMessage });
      return;
    }

    if (!loginForm.email.trim()) {
      setLoginStatus({ type: 'info', message: 'Add your school email first so we know where to send the reset link.' });
      return;
    }

    setIsResetting(true);
    setLoginStatus(null);

    try {
      const { error } = await authClient.auth.resetPasswordForEmail(loginForm.email.trim());

      if (error) {
        throw error;
      }

      setLoginStatus({
        type: 'success',
        message: 'Password reset sent! Check your inbox for the link to choose a new password.'
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'We could not send the reset email. Try again in a moment.';
      setLoginStatus({ type: 'error', message });
    } finally {
      setIsResetting(false);
    }
  };

  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSignupStatus(null);

    if (!authClient) {
      setSignupStatus({ type: 'error', message: missingSupabaseMessage });
      return;
    }

    if (!signupForm.size) {
      setSignupStatus({ type: 'info', message: 'Let us know your study group size so we can tailor the workspace.' });
      return;
    }

    setIsSigningUp(true);

    try {
      const { error } = await authClient.auth.signUp({
        email: signupForm.email.trim(),
        password: signupForm.password,
        options: {
          data: {
            full_name: signupForm.name.trim(),
            study_group_size: signupForm.size
          }
        }
      });

      if (error) {
        throw error;
      }

      setSignupStatus({
        type: 'success',
        message: 'Check your inbox to confirm your email. Once verified, your study hub will unlock automatically.'
      });
      setSignupForm({ name: '', email: '', password: '', size: '' });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'We could not create your workspace. Try again in a moment.';
      setSignupStatus({ type: 'error', message });
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
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
            <form className="auth-form" aria-label="Log in to existing workspace" onSubmit={handleLogin}>
              <h3>Log in</h3>
              <label>
                School email
                <input
                  type="email"
                  name="login-email"
                  placeholder="you@student.edu"
                  autoComplete="email"
                  required
                  value={loginForm.email}
                  onChange={(event) => setLoginForm((prev) => ({ ...prev, email: event.target.value }))}
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  name="login-password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  value={loginForm.password}
                  onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))}
                />
              </label>
              <div className="auth-form-footer">
                <button
                  type="button"
                  className="auth-link"
                  onClick={handlePasswordReset}
                  disabled={isResetting || !loginForm.email.trim()}
                >
                  {isResetting ? 'Sending link…' : 'Forgot password?'}
                </button>
                <button type="submit" className="button primary" disabled={isLoggingIn}>
                  {isLoggingIn ? 'Logging in…' : 'Log in'}
                </button>
              </div>
              {loginStatus && (
                <p className={`auth-status ${loginStatus.type}`} role="status" aria-live="polite">
                  {loginStatus.message}
                </p>
              )}
            </form>

            <form className="auth-form" aria-label="Create a new workspace" onSubmit={handleSignup}>
              <h3>Sign up</h3>
              <label>
                Full name
                <input
                  type="text"
                  name="signup-name"
                  placeholder="Ada Lovelace"
                  autoComplete="name"
                  required
                  value={signupForm.name}
                  onChange={(event) => setSignupForm((prev) => ({ ...prev, name: event.target.value }))}
                />
              </label>
              <label>
                School email
                <input
                  type="email"
                  name="signup-email"
                  placeholder="you@student.edu"
                  autoComplete="email"
                  required
                  value={signupForm.email}
                  onChange={(event) => setSignupForm((prev) => ({ ...prev, email: event.target.value }))}
                />
              </label>
              <label>
                Create password
                <input
                  type="password"
                  name="signup-password"
                  placeholder="Create a password"
                  autoComplete="new-password"
                  required
                  value={signupForm.password}
                  onChange={(event) => setSignupForm((prev) => ({ ...prev, password: event.target.value }))}
                />
              </label>
              <label>
                Study group size
                <select
                  name="signup-size"
                  required
                  value={signupForm.size}
                  onChange={(event) => setSignupForm((prev) => ({ ...prev, size: event.target.value }))}
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  <option value="solo">Just me</option>
                  <option value="2-5">2 - 5 friends</option>
                  <option value="6-10">6 - 10 classmates</option>
                  <option value="11+">11+ classmates</option>
                </select>
              </label>
              <button type="submit" className="button secondary" disabled={isSigningUp}>
                {isSigningUp ? 'Creating…' : 'Create study hub'}
              </button>
              <p className="auth-note">No credit card required. Free for students with unlimited planning and tutoring minutes.</p>
              {signupStatus && (
                <p className={`auth-status ${signupStatus.type}`} role="status" aria-live="polite">
                  {signupStatus.message}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

