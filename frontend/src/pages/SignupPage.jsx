import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    city: '',
    location: null
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Your browser does not support geolocation.');
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((current) => ({
          ...current,
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        }));
        setLoadingLocation(false);
      },
      () => {
        setError('Location access is required to create a local profile.');
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    if (!form.location) {
      setError('Wait for geolocation to finish or allow location access.');
      setLoading(false);
      return;
    }

    try {
      await signup(form);
      navigate('/');
    } catch (signupError) {
      setError(signupError.response?.data?.message || 'Unable to create account');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-layout card">
      <div>
        <span className="eyebrow">Join the marketplace</span>
        <h1>Create your UniWORK profile</h1>
        <p>Your location powers the Near You feed and local gig posting.</p>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <label>
          Name
          <input
            type="text"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            required
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
          />
        </label>
        <label>
          City
          <input
            type="text"
            value={form.city}
            onChange={(event) => setForm({ ...form, city: event.target.value })}
            required
          />
        </label>

        {loadingLocation ? <p className="muted">Requesting your location...</p> : <p className="muted">Location captured.</p>}
        {error ? <p className="error-text">{error}</p> : null}

        <button className="primary-button" disabled={loading || loadingLocation} type="submit">
          {loading ? 'Creating account...' : 'Sign up'}
        </button>
      </form>

      <p className="muted">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </section>
  );
}