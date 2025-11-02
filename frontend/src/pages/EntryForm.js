import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import './EntryForm.css';

const EntryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: 'neutral',
    date: new Date().toISOString().split('T')[0],
    tags: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchEntry = useCallback(async () => {
    try {
      const response = await api.get(`/entries/${id}`);
      const entry = response.data;
      setFormData({
        title: entry.title,
        content: entry.content,
        mood: entry.mood,
        date: new Date(entry.date).toISOString().split('T')[0],
        tags: entry.tags ? entry.tags.join(', ') : ''
      });
    } catch (error) {
      console.error('Error fetching entry:', error);
      setError('Failed to load entry');
    }
  }, [id]);

  useEffect(() => {
    if (isEdit) {
      fetchEntry();
    }
  }, [isEdit, fetchEntry]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const tagsArray = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];

      const entryData = {
        ...formData,
        tags: tagsArray
      };

      if (isEdit) {
        await api.put(`/entries/${id}`, entryData);
      } else {
        await api.post('/entries', entryData);
      }

      navigate('/entries');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="entry-form-container">
      <div className="entry-form-card">
        <h1>{isEdit ? 'Edit Entry' : 'Create New Entry'}</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength={200}
              placeholder="What's on your mind?"
            />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Mood</label>
            <div className="mood-selector">
              <label className="mood-option">
                <input
                  type="radio"
                  name="mood"
                  value="very-happy"
                  checked={formData.mood === 'very-happy'}
                  onChange={handleChange}
                />
                <span className="mood-emoji">😄</span>
                <span className="mood-label">Very Happy</span>
              </label>
              <label className="mood-option">
                <input
                  type="radio"
                  name="mood"
                  value="happy"
                  checked={formData.mood === 'happy'}
                  onChange={handleChange}
                />
                <span className="mood-emoji">😊</span>
                <span className="mood-label">Happy</span>
              </label>
              <label className="mood-option">
                <input
                  type="radio"
                  name="mood"
                  value="neutral"
                  checked={formData.mood === 'neutral'}
                  onChange={handleChange}
                />
                <span className="mood-emoji">😐</span>
                <span className="mood-label">Neutral</span>
              </label>
              <label className="mood-option">
                <input
                  type="radio"
                  name="mood"
                  value="sad"
                  checked={formData.mood === 'sad'}
                  onChange={handleChange}
                />
                <span className="mood-emoji">😔</span>
                <span className="mood-label">Sad</span>
              </label>
              <label className="mood-option">
                <input
                  type="radio"
                  name="mood"
                  value="very-sad"
                  checked={formData.mood === 'very-sad'}
                  onChange={handleChange}
                />
                <span className="mood-emoji">😢</span>
                <span className="mood-label">Very Sad</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={10}
              placeholder="Write about your day, thoughts, feelings..."
            />
          </div>

          <div className="form-group">
            <label>Tags (comma-separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., work, family, vacation"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/entries')}
              className="cancel-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="submit-button"
            >
              {loading ? 'Saving...' : isEdit ? 'Update Entry' : 'Save Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EntryForm;

