import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentEntries, setRecentEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, entriesRes] = await Promise.all([
        api.get('/analytics/stats'),
        api.get('/entries?limit=5')
      ]);
      
      setStats(statsRes.data);
      setRecentEntries(entriesRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Welcome to Your Personal Diary</h1>
      
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-value">{stats.totalEntries || 0}</div>
            <div className="stat-label">Total Entries</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-value">{stats.entriesThisMonth || 0}</div>
            <div className="stat-label">This Month</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">{stats.mostCommonMood ? getMoodEmoji(stats.mostCommonMood) : '📊'}</div>
            <div className="stat-value">
              {stats.mostCommonMood ? stats.mostCommonMood.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'N/A'}
            </div>
            <div className="stat-label">Most Common Mood</div>
          </div>
        </div>
      )}

      <div className="dashboard-actions">
        <Link to="/entries/new" className="action-button primary">
          ➕ Write New Entry
        </Link>
        <Link to="/entries" className="action-button secondary">
          📚 View All Entries
        </Link>
        <Link to="/analytics" className="action-button secondary">
          📊 View Analytics
        </Link>
      </div>

      {recentEntries.length > 0 && (
        <div className="recent-entries">
          <h2>Recent Entries</h2>
          <div className="entries-list">
            {recentEntries.map(entry => (
              <Link
                key={entry._id}
                to={`/entries/${entry._id}/edit`}
                className="entry-card"
              >
                <div className="entry-header">
                  <h3>{entry.title}</h3>
                  <span className="mood-badge">{getMoodEmoji(entry.mood)}</span>
                </div>
                <p className="entry-preview">
                  {entry.content.substring(0, 150)}...
                </p>
                <div className="entry-footer">
                  <span className="entry-date">
                    {formatDate(entry.date)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

