import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useWeb3Context } from '../context/Web3Context';
import { authApi } from '../services/api';
import {
  Mail,
  Loader,
  Wallet,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  LogOut,
  ChevronDown,
} from 'lucide-react';

export const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { wallet, connectWallet, disconnectWallet, signMessage, loading: walletLoading, error: walletError } = useWeb3Context();

  const [step, setStep] = useState<'email' | 'verification' | 'wallet' | 'connected'>('email');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showChainDropdown, setShowChainDropdown] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (wallet?.isConnected) {
      setStep('connected');
    }
  }, [wallet?.isConnected]);

  const handleSendEmail = async () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authApi.sendVerificationEmail(email);
      setStep('verification');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send email');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!verificationCode) {
      setError('Please enter the verification code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authApi.verifyEmail(email, verificationCode);
      setStep('wallet');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectWallet = async () => {
    setLoading(true);
    setError('');

    try {
      const walletInfo = await connectWallet();
      if (walletInfo) {
        setStep('connected');
      } else {
        setError(walletError || 'Failed to connect wallet');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  const handleSignInWithWallet = async () => {
    if (!wallet?.address) {
      setError('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Get message to sign
      const messageRes = await authApi.getMessage();
      const message = messageRes.data.message;

      // Sign message with connected wallet
      const signature = await signMessage(message);

      // Login
      const loginRes = await authApi.login(wallet.address, signature, message);
      login(loginRes.data.user, loginRes.data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const chains = [
    { id: 1, name: 'Ethereum Mainnet', symbol: 'ETH', icon: '⟠' },
    { id: 11155111, name: 'Sepolia Testnet', symbol: 'ETH', icon: '⟠' },
    { id: 137, name: 'Polygon', symbol: 'MATIC', icon: '⬡' },
    { id: 80001, name: 'Mumbai Testnet', symbol: 'MATIC', icon: '⬡' },
  ];

  return (
    <div className="min-h-screen bg-gradient-crypto flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-neon-purple/10 rounded-full blur-3xl opacity-50 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl opacity-50 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="mb-4 flex justify-center">
            <div className="w-16 h-16 bg-gradient-neon rounded-lg flex items-center justify-center shadow-neon-cyan transform hover:scale-105 transition-transform">
              <Wallet className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-neon bg-clip-text text-transparent mb-2">
            HumanWork
          </h1>
          <p className="text-sm text-gray-400">
            Decentralized Freelancing Protocol on Blockchain
          </p>
        </div>

        {/* Card */}
        <div className="bg-blockchain-card border border-blockchain-border rounded-xl p-8 space-y-6 shadow-lg backdrop-blur-xl">
          {step === 'email' && (
            <>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    placeholder="your@email.com"
                    className="w-full bg-dark px-4 py-2 rounded-lg border border-blockchain-border text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan transition-colors"
                    disabled={loading}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-danger/10 border border-danger/50 rounded-lg p-3 text-sm text-danger flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <button
                onClick={handleSendEmail}
                disabled={loading || !email}
                className="w-full bg-gradient-neon hover:shadow-neon-purple disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Send Verification Code
                  </>
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-blockchain-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-blockchain-card text-gray-400">or continue with</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setStep('wallet');
                  setError('');
                }}
                className="w-full bg-blockchain-hover hover:bg-blockchain-border border border-blockchain-border text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
              >
                <Wallet className="w-4 h-4" />
                Connect Crypto Wallet
              </button>

              <p className="text-xs text-gray-400 text-center">
                We respect your privacy. No spam guaranteed.
              </p>
            </>
          )}

          {step === 'verification' && (
            <>
              <div className="bg-blockchain-hover border border-blockchain-border rounded-lg p-4 text-sm text-gray-300">
                <p>
                  We sent a verification code to <strong>{email}</strong>
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => {
                      setVerificationCode(e.target.value.toUpperCase());
                      setError('');
                    }}
                    placeholder="000000"
                    maxLength={6}
                    className="w-full bg-dark px-4 py-2 rounded-lg border border-blockchain-border text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan transition-colors text-center text-2xl tracking-widest"
                    disabled={loading}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-danger/10 border border-danger/50 rounded-lg p-3 text-sm text-danger flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <button
                onClick={handleVerifyEmail}
                disabled={loading || verificationCode.length !== 6}
                className="w-full bg-gradient-neon hover:shadow-neon-purple disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Verify Code
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setStep('email');
                  setVerificationCode('');
                  setError('');
                }}
                className="w-full text-neon-cyan hover:text-neon-purple text-sm font-medium transition-colors"
              >
                Back to Email
              </button>
            </>
          )}

          {step === 'wallet' && !wallet?.isConnected && (
            <>
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-white">Connect Your Wallet</h2>
                <p className="text-sm text-gray-400">
                  Secure your account with Web3 authentication. You control your data.
                </p>
              </div>

              {error && (
                <div className="bg-danger/10 border border-danger/50 rounded-lg p-3 text-sm text-danger flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <button
                onClick={handleConnectWallet}
                disabled={walletLoading || loading}
                className="w-full bg-gradient-eth hover:shadow-neon-purple disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105"
              >
                {walletLoading || loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4" />
                    Connect MetaMask
                  </>
                )}
              </button>

              <div className="text-xs text-gray-400 text-center space-y-1">
                <p>Don't have MetaMask? Download from metamask.io</p>
                <p>Supports 15+ blockchains (Ethereum, Polygon, Arbitrum, etc.)</p>
              </div>

              <button
                onClick={() => {
                  setStep('email');
                  setError('');
                }}
                className="w-full text-neon-cyan hover:text-neon-purple text-sm font-medium transition-colors"
              >
                Back to Email
              </button>
            </>
          )}

          {step === 'connected' && wallet?.isConnected && (
            <>
              <div className="space-y-4">
                <div className="bg-success/10 border border-success/50 rounded-lg p-4 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Wallet Connected</p>
                    <p className="text-sm text-gray-300 font-mono break-all">{wallet.address}</p>
                  </div>
                </div>

                <div className="bg-blockchain-hover border border-blockchain-border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Network</span>
                    <span className="text-sm text-neon-cyan font-medium">{wallet.chainName}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Balance</span>
                    <span className="text-sm text-white font-mono">{parseFloat(wallet.balance).toFixed(4)} ETH</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSignInWithWallet}
                disabled={loading}
                className="w-full bg-gradient-neon hover:shadow-neon-purple disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Signing...
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-4 h-4" />
                    Sign In with Wallet
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  disconnectWallet();
                  setStep('wallet');
                  setError('');
                }}
                className="w-full text-neon-cyan hover:text-neon-purple text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-3 h-3" />
                Disconnect Wallet
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};
