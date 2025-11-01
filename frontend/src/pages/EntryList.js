import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import './EntryList.css';

const EntryList = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await api.get('/entries');
      setEntries(response.data);
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await api.delete(`/entries/${id}`);
        setEntries(entries.filter(entry => entry._id !== id));
      } catch (error) {
        console.error('Error deleting entry:', error);
        alert('Failed to delete entry');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMoodEmoji = (mood) => {
    const emojis = {
      'very-happy': '😄',
      'happy': '😊',
      'neutral': '😐',
      'sad': '😔',
      'very-sad': '😢'
    };
    return emojis[mood] || '😐';
  };

  const filteredEntries = filter === 'all'
    ? entries
    : entries.filter(entry => entry.mood === filter);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="entry-list">
      <div className="entry-list-header">
        <h1>Your Diary Entries</h1>
        <Link to="/entries/new" className="new-entry-button">
          ➕ New Entry
        </Link>
      </div>

      <div className="filter-buttons">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={filter === 'very-happy' ? 'active' : ''}
          onClick={() => setFilter('very-happy')}
        >
          😄 Very Happy
        </button>
        <button
          className={filter === 'happy' ? 'active' : ''}
          onClick={() => setFilter('happy')}
        >
          😊 Happy
        </button>
        <button
          className={filter === 'neutral' ? 'active' : ''}
          onClick={() => setFilter('neutral')}
        >
          😐 Neutral
        </button>
        <button
          className={filter === 'sad' ? 'active' : ''}
          onClick={() => setFilter('sad')}
        >
          😔 Sad
        </button>
        <button
          className={filter === 'very-sad' ? 'active' : ''}
          onClick={() => setFilter('very-sad')}
        >
          😢 Very Sad
        </button>
      </div>

      {filteredEntries.length === 0 ? (
        <div className="no-entries">
          <p>No entries found. Start writing your first entry!</p>
          <Link to="/entries/new" className="new-entry-button">
            ➕ Create Your First Entry
          </Link>
        </div>
      ) : (
        <div className="entries-grid">
          {filteredEntries.map(entry => (
            <div key={entry._id} className="entry-card">
              <div className="entry-card-header">
                <h3>{entry.title}</h3>
                <span className="mood-badge">{getMoodEmoji(entry.mood)}</span>
              </div>
              <p className="entry-content-preview">
                {entry.content.substring(0, 200)}...
              </p>
              <div className="entry-card-footer">
                <span className="entry-date">{formatDate(entry.date)}</span>
                <div className="entry-actions">
                  <Link
                    to={`/entries/${entry._id}/edit`}
                    className="action-link edit"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(entry._id)}
                    className="action-link delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {entry.tags && entry.tags.length > 0 && (
                <div className="entry-tags">
                  {entry.tags.map((tag, index) => (
                    <span key={index} className="tag">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EntryList;

