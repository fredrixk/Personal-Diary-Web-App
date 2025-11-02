import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import api from '../utils/api';
import './Analytics.css';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [moodDistribution, setMoodDistribution] = useState(null);
  const [moodTrends, setMoodTrends] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  const fetchAnalytics = useCallback(async () => {
    try {
      const [statsRes, distributionRes, trendsRes] = await Promise.all([
        api.get('/analytics/stats'),
        api.get('/analytics/mood-distribution'),
        api.get(`/analytics/mood-trends?days=${days}`)
      ]);

      setStats(statsRes.data);
      setMoodDistribution(distributionRes.data);
      
      // Transform trends data for chart
      const trendsData = Object.entries(trendsRes.data).map(([date, moods]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        ...moods
      }));

      setMoodTrends(trendsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const COLORS = {
    'very-happy': '#4CAF50',
    'happy': '#8BC34A',
    'neutral': '#FFC107',
    'sad': '#FF9800',
    'very-sad': '#F44336'
  };

  const moodLabels = {
    'very-happy': 'Very Happy',
    'happy': 'Happy',
    'neutral': 'Neutral',
    'sad': 'Sad',
    'very-sad': 'Very Sad'
  };

  const pieData = moodDistribution
    ? Object.entries(moodDistribution).map(([mood, value]) => ({
        name: moodLabels[mood],
        value,
        color: COLORS[mood]
      })).filter(item => item.value > 0)
    : [];

  if (loading) {
    return <div className="loading">Loading analytics...</div>;
  }

  return (
    <div className="analytics">
      <h1>Your Diary Analytics</h1>

      {stats && (
        <div className="analytics-stats">
          <div className="stat-box">
            <h3>Total Entries</h3>
            <p className="stat-number">{stats.totalEntries || 0}</p>
          </div>
          <div className="stat-box">
            <h3>Entries This Month</h3>
            <p className="stat-number">{stats.entriesThisMonth || 0}</p>
          </div>
          <div className="stat-box">
            <h3>Most Common Mood</h3>
            <p className="stat-text">
              {stats.mostCommonMood
                ? moodLabels[stats.mostCommonMood] || stats.mostCommonMood
                : 'N/A'}
            </p>
          </div>
          {stats.firstEntryDate && (
            <div className="stat-box">
              <h3>First Entry</h3>
              <p className="stat-text">
                {new Date(stats.firstEntryDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="charts-container">
        {pieData.length > 0 && (
          <div className="chart-card">
            <h2>Mood Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {moodDistribution && (
          <div className="chart-card">
            <h2>Mood Count</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={Object.entries(moodDistribution).map(([mood, value]) => ({
                mood: moodLabels[mood],
                count: value,
                color: COLORS[mood]
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mood" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#667eea">
                  {Object.entries(moodDistribution).map(([mood, value], index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[mood]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {moodTrends && moodTrends.length > 0 && (
          <div className="chart-card">
            <div className="chart-header">
              <h2>Mood Trends</h2>
              <select
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="days-selector"
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={moodTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {['very-happy', 'happy', 'neutral', 'sad', 'very-sad'].map(mood => (
                  <Line
                    key={mood}
                    type="monotone"
                    dataKey={mood}
                    stroke={COLORS[mood]}
                    name={moodLabels[mood]}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {(!moodTrends || moodTrends.length === 0) && (
        <div className="no-data">
          <p>Not enough data to display analytics. Start writing entries to see your mood trends!</p>
        </div>
      )}
    </div>
  );
};

export default Analytics;

