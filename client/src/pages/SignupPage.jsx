import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import { useAuth } from '../context/AuthContext';

/**
 * Signup form that collects initial alumni profile data and registers the user.
 */
const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    batchYear: '',
    department: '',
    currentStatus: '',
    currentRole: '',
    currentOrganization: '',
    location: '',
    shortBio: '',
    linkedinUrl: '',
    portfolioUrl: '',
    skills: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName) newErrors.fullName = 'Full name is required';
    if (!form.email) newErrors.email = 'Email is required';
    if (!form.password || form.password.length < 8)
      newErrors.password = 'Password must be at least 8 characters';
    if (!form.batchYear) newErrors.batchYear = 'Batch year is required';
    if (!form.department) newErrors.department = 'Department is required';
    if (!form.currentStatus) newErrors.currentStatus = 'Current status is required';
    if (form.shortBio && form.shortBio.length > 500)
      newErrors.shortBio = 'Short bio must be under 500 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        ...form,
        batchYear: Number(form.batchYear),
        skills: form.skills
          ? form.skills.split(',').map((skill) => skill.trim()).filter(Boolean)
          : [],
      };
      await signup(payload);
      navigate('/dashboard');
    } catch (err) {
      const responseData = err.response?.data;
      if (responseData?.errors) {
        const backendErrors = {};
        responseData.errors.forEach((error) => {
          if (error.path) {
            backendErrors[error.path] = error.msg;
          }
        });
        setErrors(backendErrors);
      } else {
        setServerError(responseData?.message || 'Signup failed, please try again');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <h2>Create your alumni account</h2>
      <p className="muted">Share a few details to join the network.</p>
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Full Name"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          error={errors.fullName}
        />
        <FormInput
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />
        <FormInput
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />
        <FormInput
          label="Batch Year"
          name="batchYear"
          type="number"
          value={form.batchYear}
          onChange={handleChange}
          error={errors.batchYear}
        />
        <FormInput
          label="Department"
          name="department"
          value={form.department}
          onChange={handleChange}
          error={errors.department}
        />
        <FormInput
          label="Current Status"
          name="currentStatus"
          placeholder="Working, Higher Studies, Entrepreneur, Looking for opportunities"
          value={form.currentStatus}
          onChange={handleChange}
          error={errors.currentStatus}
        />
        <FormInput
          label="Current Role"
          name="currentRole"
          value={form.currentRole}
          onChange={handleChange}
        />
        <FormInput
          label="Current Organization"
          name="currentOrganization"
          value={form.currentOrganization}
          onChange={handleChange}
        />
        <FormInput
          label="Location"
          name="location"
          value={form.location}
          onChange={handleChange}
        />
        <div className="form-group">
          <label htmlFor="shortBio">Short Bio (max 500 characters)</label>
          <textarea
            id="shortBio"
            name="shortBio"
            value={form.shortBio}
            onChange={handleChange}
          />
          {errors.shortBio && <p className="error-text">{errors.shortBio}</p>}
        </div>
        <FormInput
          label="LinkedIn URL"
          name="linkedinUrl"
          value={form.linkedinUrl}
          onChange={handleChange}
        />
        <FormInput
          label="Portfolio URL"
          name="portfolioUrl"
          value={form.portfolioUrl}
          onChange={handleChange}
        />
        <FormInput
          label="Skills (comma separated)"
          name="skills"
          value={form.skills}
          onChange={handleChange}
        />
        {serverError && <p className="error-text">{serverError}</p>}
        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default SignupPage;
