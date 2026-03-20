import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/tasks/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data.data);
    } catch (error) {
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#ffc107';
      case 'in-progress': return '#17a2b8';
      case 'completed': return '#28a745';
      default: return '#6c757d';
    }
  };

  return (
    <div className="dashboard">
      <h1>Welcome, {user?.name}!</h1>
      
      {error && <div className="message error">{error}</div>}

      <div className="stats-container">
        <h2>Task Statistics</h2>
        <div className="stats-grid">
          {stats && stats.map((stat, index) => (
            <div 
              key={index} 
              className="stat-card"
              style={{ borderLeftColor: getStatusColor(stat._id) }}
            >
              <h3>{stat._id}</h3>
              <p className="stat-count">{stat.count} tasks</p>
              <p className="stat-priority">
                Avg Priority: {stat.avgPriority?.toFixed(1) || 'N/A'}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button onClick={() => window.location.href = '/tasks'}>
            Manage Tasks
          </button>
          {user?.role === 'admin' && (
            <button onClick={() => window.location.href = '/admin'}>
              Admin Panel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;