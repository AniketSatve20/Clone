import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useWeb3Context } from './context/Web3Context';
import './App.css';

// Pages
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { DisputesPage } from './pages/DisputesPage';

// Simple Protected Route
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
}

// Navigation Component
function Navigation() {
  const { user, logout } = useAuth();
  const { wallet, connectWallet } = useWeb3Context();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <h1>HumanWork</h1>
        </div>

        <div className="nav-links">
          <a href="/dashboard" className="nav-link">Dashboard</a>
          <a href="/projects" className="nav-link">Projects</a>
          <a href="/disputes" className="nav-link">Disputes</a>
        </div>

        <div className="nav-right">
          {/* Web3 Connection Status */}
          <div className="web3-status">
            {wallet && wallet.isConnected ? (
              <>
                <span className="status-indicator connected"></span>
                <span className="status-text">
                  {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                </span>
              </>
            ) : (
              <>
                <span className="status-indicator disconnected"></span>
                <span className="status-text">Disconnected</span>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="user-menu">
            <button 
              className="user-button"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              {user?.email || 'Menu'}
            </button>
            
            {showUserMenu && (
              <div className="user-dropdown">
                <button onClick={() => {
                  connectWallet();
                  setShowUserMenu(false);
                }}>
                  {wallet && wallet.isConnected ? 'Switch Account' : 'Connect Wallet'}
                </button>
                <button onClick={() => {
                  logout();
                  setShowUserMenu(false);
                }}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

// Main App Layout
function AppLayout() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="app">
      {isAuthenticated && <Navigation />}
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/projects" 
            element={
              <ProtectedRoute>
                <ProjectsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/disputes" 
            element={
              <ProtectedRoute>
                <DisputesPage />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

// Main App Component
export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
