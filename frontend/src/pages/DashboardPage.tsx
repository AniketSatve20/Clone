import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWeb3Context } from '../context/Web3Context';

interface Stats {
  totalProjects: number;
  activeProjects: number;
  totalDisputes: number;
  activeDisputes: number;
}

export function DashboardPage() {
  const { user } = useAuth();
  const { wallet } = useWeb3Context();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
      setError('');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page dashboard-page">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back, {user?.email || 'User'}!</p>
      </div>

      {/* User Status */}
      <div className="status-section">
        <div className="status-card">
          <h3>👤 Account</h3>
          <p className="value">{user?.email}</p>
        </div>
        <div className="status-card">
          <h3>🦊 Wallet</h3>
          <p className="value">
            {wallet && wallet.isConnected
              ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`
              : 'Not Connected'
            }
          </p>
          <p className="status">
            {wallet && wallet.isConnected ? '✅ Connected' : '⚠️ Disconnected'}
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <h2>System Statistics</h2>
        
        {error && (
          <div className="alert alert-error">{error}</div>
        )}

        {loading ? (
          <p className="loading">Loading statistics...</p>
        ) : stats ? (
          <div className="stats-grid">
            <div className="stat-card">
              <h3>📁 Total Projects</h3>
              <p className="stat-value">{stats.totalProjects}</p>
            </div>
            <div className="stat-card">
              <h3>🚀 Active Projects</h3>
              <p className="stat-value">{stats.activeProjects}</p>
            </div>
            <div className="stat-card">
              <h3>⚖️ Total Disputes</h3>
              <p className="stat-value">{stats.totalDisputes}</p>
            </div>
            <div className="stat-card">
              <h3>🔥 Active Disputes</h3>
              <p className="stat-value">{stats.activeDisputes}</p>
            </div>
          </div>
        ) : null}
      </div>

      {/* Quick Actions */}
      <div className="actions-section">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <a href="/projects" className="btn btn-primary">
            View Projects
          </a>
          <a href="/disputes" className="btn btn-primary">
            View Disputes
          </a>
          <button className="btn btn-secondary" onClick={fetchStats}>
            Refresh Stats
          </button>
        </div>
      </div>
    </div>
  );
}
