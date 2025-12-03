import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWeb3Context } from '../context/Web3Context';

export function AuthPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { wallet, connectWallet } = useWeb3Context();
  
  // Email OTP State
  const [authMethod, setAuthMethod] = useState<'email' | 'wallet'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Email OTP Login Handler
  const handleSendOTP = async () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:3000/api/auth/email/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      setSuccess('✅ OTP sent to your email!');
      setShowOtpInput(true);
      
      // Log OTP to console for testing
      console.log('📧 OTP Code:', data.otp);
    } catch (err) {
      setError(`❌ ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/auth/email/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid OTP');
      }

      // Login with email - pass token and user from backend response
      await login({
        email,
        address: email,
        token: data.token,
        user: data.user,
      });

      navigate('/dashboard');
    } catch (err) {
      setError(`❌ ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  // Wallet Login Handler
  const handleWalletLogin = async () => {
    setLoading(true);
    setError('');

    try {
      if (!wallet) {
        await connectWallet();
        return;
      }

      // For wallet login, generate a token and user object
      const token = Buffer.from(wallet.address + Date.now()).toString('base64');
      const user = {
        address: wallet.address,
        email: '',
        name: `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`,
        verified: true,
        reputation: 0,
        totalProjects: 0,
        completedProjects: 0,
        skills: [],
        role: 'freelancer' as const,
      };

      await login({
        address: wallet.address,
        token,
        user,
      });

      navigate('/dashboard');
    } catch (err) {
      setError(`❌ ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page auth-page">
      <div className="auth-container">
        <h1>Sign In to HumanWork</h1>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* Auth Method Selector */}
        <div className="auth-method-selector">
          <button 
            className={`method-btn ${authMethod === 'email' ? 'active' : ''}`}
            onClick={() => {
              setAuthMethod('email');
              setError('');
              setSuccess('');
              setOtp('');
              setShowOtpInput(false);
            }}
          >
            📧 Email OTP
          </button>
          <button 
            className={`method-btn ${authMethod === 'wallet' ? 'active' : ''}`}
            onClick={() => {
              setAuthMethod('wallet');
              setError('');
              setSuccess('');
            }}
          >
            🦊 MetaMask
          </button>
        </div>

        {/* Email OTP Method */}
        {authMethod === 'email' && (
          <div className="auth-form">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={showOtpInput}
              />
            </div>

            {!showOtpInput ? (
              <button
                className="btn btn-primary"
                onClick={handleSendOTP}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Verification Code'}
              </button>
            ) : (
              <>
                <div className="form-group">
                  <label>Verification Code</label>
                  <p className="help-text">Check your email for the 6-digit code</p>
                  <input
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="otp-input"
                  />
                </div>

                <div className="form-buttons">
                  <button
                    className="btn btn-primary"
                    onClick={handleVerifyOTP}
                    disabled={loading || otp.length !== 6}
                  >
                    {loading ? 'Verifying...' : 'Verify'}
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowOtpInput(false);
                      setOtp('');
                      setEmail('');
                      setSuccess('');
                    }}
                  >
                    Back
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Wallet Method */}
        {authMethod === 'wallet' && (
          <div className="auth-form">
            <div className="wallet-info">
              {wallet && wallet.isConnected ? (
                <>
                  <p className="connected">✅ Wallet Connected</p>
                  <p className="wallet-address">
                    {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                  </p>
                  {wallet.chainId && (
                    <p className="chain-id">Chain ID: {wallet.chainId}</p>
                  )}
                </>
              ) : (
                <p className="disconnected">⚠️ Wallet Not Connected</p>
              )}
            </div>

            {!wallet || !wallet.isConnected ? (
              <button
                className="btn btn-primary"
                onClick={handleWalletLogin}
                disabled={loading}
              >
                {loading ? 'Connecting...' : 'Connect Wallet'}
              </button>
            ) : (
              <>
                <button
                  className="btn btn-primary"
                  onClick={handleWalletLogin}
                  disabled={loading}
                >
                  {loading ? 'Logging In...' : 'Continue with Wallet'}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={connectWallet}
                >
                  Switch Account
                </button>
              </>
            )}

            <p className="help-text">
              You can switch MetaMask accounts anytime to connect a different wallet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
