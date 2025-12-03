import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="page home-page">
      <div className="hero">
        <h1>HumanWork</h1>
        <p>Connect with verified professionals globally. Build projects with AI-powered dispute resolution.</p>
        
        <div className="hero-buttons">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-primary">
              Go to Dashboard
            </Link>
          ) : (
            <Link to="/auth" className="btn btn-primary">
              Get Started
            </Link>
          )}
          <a href="https://github.com" className="btn btn-secondary">
            Learn More
          </a>
        </div>
      </div>

      <div className="features">
        <div className="feature-card">
          <h3>🔗 Trustless & Secure</h3>
          <p>Smart contracts handle escrow. No middleman control.</p>
        </div>
        <div className="feature-card">
          <h3>⚖️ AI-Powered Disputes</h3>
          <p>Machine learning analyzes disputes fairly. Instant resolution without bias.</p>
        </div>
        <div className="feature-card">
          <h3>📦 Decentralized Storage</h3>
          <p>IPFS + Filecoin. Your files stored permanently, censorship-resistant.</p>
        </div>
        <div className="feature-card">
          <h3>🌐 Multi-Chain Support</h3>
          <p>Ethereum, Polygon, Arbitrum & more. Choose your network.</p>
        </div>
        <div className="feature-card">
          <h3>💰 Reputation Tokens</h3>
          <p>Build on-chain reputation. Portable across protocols.</p>
        </div>
        <div className="feature-card">
          <h3>💸 Zero Platform Fees</h3>
          <p>No middleman taking cuts. All earnings go directly to you.</p>
        </div>
      </div>
    </div>
  );
}
