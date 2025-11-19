import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import { fetchMe, updateMe } from '../api/userApi';
import { useAuth } from '../context/AuthContext';

/**
 * Lets authenticated users edit their profile fields.
 */
const EditProfilePage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [form, setForm] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await fetchMe();
        const user = data.user;
        setForm({
          fullName: user.fullName || '',
          batchYear: user.batchYear || '',
          department: user.department || '',
          currentStatus: user.currentStatus || '',
          currentRole: user.currentRole || '',
          currentOrganization: user.currentOrganization || '',
          location: user.location || '',
          shortBio: user.shortBio || '',
          linkedinUrl: user.linkedinUrl || '',
          portfolioUrl: user.portfolioUrl || '',
          skills: (user.skills || []).join(', '),
        });
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        batchYear: Number(form.batchYear),
        skills: form.skills
          ? form.skills.split(',').map((skill) => skill.trim()).filter(Boolean)
          : [],
      };
      const { data } = await updateMe(payload);
      setUser(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (!form) return <p className="error-text">{error}</p>;

  return (
    <div className="form-card">
      <h2>Edit Profile</h2>
      <p className="muted">Keep your alumni profile up to date.</p>
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Full Name"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
        />
        <FormInput
          label="Batch Year"
          name="batchYear"
          type="number"
          value={form.batchYear}
          onChange={handleChange}
        />
        <FormInput
          label="Department"
          name="department"
          value={form.department}
          onChange={handleChange}
        />
        <FormInput
          label="Current Status"
          name="currentStatus"
          value={form.currentStatus}
          onChange={handleChange}
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
          <label htmlFor="shortBio">Short Bio</label>
          <textarea name="shortBio" id="shortBio" value={form.shortBio} onChange={handleChange} />
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
        {error && <p className="error-text">{error}</p>}
        <button className="btn" type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default EditProfilePage;
