import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import { useAuth } from '../context/AuthContext';

/**
 * Simple login form that authenticates the user and updates global auth state.
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(form);
      const redirectPath = location.state?.from?.pathname || '/dashboard';
      navigate(redirectPath);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <h2>Login</h2>
      <p className="muted">Welcome back! Log in to access the alumni network.</p>
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
        />
        <FormInput
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />
        {error && <p className="error-text">{error}</p>}
        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Create one</Link>
      </p>
    </div>
  );
};

export default LoginPage;
