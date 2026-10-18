import { useEffect, useState } from 'react';
import { DEFAULT_SITE_CONTENT, isValidSiteContent } from './siteContent.js';
import { supabase } from './supabaseClient.js';

export default function Admin() {
  const [session, setSession] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [checkingAccess, setCheckingAccess] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [draft, setDraft] = useState(() =>
    JSON.stringify(DEFAULT_SITE_CONTENT, null, 2)
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!supabase) {
      setCheckingSession(false);
      return undefined;
    }

    let active = true;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (active) {
        setSession(nextSession);
        setAuthorized(false);
        setError('');
        setMessage('');
      }
    });

    supabase.auth
      .getSession()
      .then(({ data, error: sessionError }) => {
        if (!active) return;
        if (sessionError) {
          setError(sessionError.message);
        } else {
          setSession(data.session);
        }
      })
      .catch((sessionError) => {
        if (active) setError(sessionError.message);
      })
      .finally(() => {
        if (active) setCheckingSession(false);
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!supabase || !session) {
      setAuthorized(false);
      setCheckingAccess(false);
      return undefined;
    }

    let active = true;
    setCheckingAccess(true);
    setError('');

    const loadEditor = async () => {
      const { data: admin, error: adminError } = await supabase
        .from('site_content_admins')
        .select('user_id')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (adminError) throw adminError;
      if (!admin) {
        if (active) setAuthorized(false);
        return;
      }

      const { data: row, error: contentError } = await supabase
        .from('site_content')
        .select('content')
        .eq('id', 'main')
        .maybeSingle();

      if (contentError) throw contentError;
      if (row && !isValidSiteContent(row.content)) {
        throw new Error(
          'Saved site content has an invalid structure. Restore the default JSON before editing.'
        );
      }

      if (active) {
        setAuthorized(true);
        setDraft(
          JSON.stringify(row?.content ?? DEFAULT_SITE_CONTENT, null, 2)
        );
      }
    };

    loadEditor()
      .catch((loadError) => {
        if (active) setError(loadError.message);
      })
      .finally(() => {
        if (active) setCheckingAccess(false);
      });

    return () => {
      active = false;
    };
  }, [session]);

  const signIn = async (event) => {
    event.preventDefault();
    if (!supabase) return;

    setBusy(true);
    setError('');
    setMessage('');
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) setError(signInError.message);
    } catch (signInError) {
      setError(signInError.message);
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    if (!supabase) return;
    setBusy(true);
    setError('');
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) setError(signOutError.message);
    } catch (signOutError) {
      setError(signOutError.message);
    } finally {
      setBusy(false);
    }
  };

  const save = async (event) => {
    event.preventDefault();
    if (!supabase) return;

    let content;
    try {
      content = JSON.parse(draft);
    } catch (parseError) {
      setError(`Invalid JSON: ${parseError.message}`);
      setMessage('');
      return;
    }

    if (!isValidSiteContent(content)) {
      setError(
        'The JSON structure does not match the site content schema. Edit values without changing the existing keys or value types.'
      );
      setMessage('');
      return;
    }

    setBusy(true);
    setError('');
    setMessage('');
    try {
      const { error: saveError } = await supabase
        .from('site_content')
        .upsert({ id: 'main', content }, { onConflict: 'id' });
      if (saveError) {
        setError(saveError.message);
      } else {
        setDraft(JSON.stringify(content, null, 2));
        setMessage('Changes saved and published to the website.');
      }
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="admin-shell">
      <section className="admin-card">
        <a className="admin-back" href="/">
          ← View website
        </a>
        <p className="admin-eyebrow">THE WINDS HOMESTAY</p>
        <h1>Website content</h1>

        {!supabase ? (
          <p className="admin-alert" role="alert">
            Supabase is not configured. Set VITE_SUPABASE_URL and
            VITE_SUPABASE_PUBLISHABLE_KEY in your local environment.
          </p>
        ) : checkingSession ? (
          <p>Checking your session…</p>
        ) : !session ? (
          <form className="admin-form" onSubmit={signIn}>
            <p>Sign in with the Supabase account authorized to edit this site.</p>
            <label>
              Email
              <input
                autoComplete="username"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>
            <label>
              Password
              <input
                autoComplete="current-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
            <button className="admin-button" disabled={busy}>
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        ) : checkingAccess ? (
          <p>Checking editor access…</p>
        ) : !authorized ? (
          <div>
            <p className="admin-alert" role="alert">
              This account is not authorized to edit website content.
            </p>
            <button
              className="admin-button secondary"
              onClick={signOut}
              disabled={busy}
            >
              Sign out
            </button>
          </div>
        ) : (
          <form className="admin-form" onSubmit={save}>
            <p>
              Edit the JSON below to update the website text, prices, contact
              details, image names, FAQs and other content. Keep the existing
              keys and value types; arrays can be reordered or have entries
              added or removed.
            </p>
            <label className="admin-content-label" htmlFor="site-content">
              Site content JSON
            </label>
            <textarea
              id="site-content"
              className="admin-editor"
              spellCheck="false"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
            />
            {error && (
              <p className="admin-alert" role="alert">
                {error}
              </p>
            )}
            {message && (
              <p className="admin-success" role="status">
                {message}
              </p>
            )}
            <div className="admin-actions">
              <button className="admin-button" disabled={busy}>
                {busy ? 'Saving…' : 'Save and publish'}
              </button>
              <button
                className="admin-button secondary"
                type="button"
                onClick={signOut}
                disabled={busy}
              >
                Sign out
              </button>
            </div>
          </form>
        )}

        {error && !authorized && session && (
          <p className="admin-alert" role="alert">
            {error}
          </p>
        )}
      </section>
    </main>
  );
}
