import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useWeb3Context } from '../context/Web3Context';
import { projectApi, disputeApi, userApi } from '../services/api';
import {
  Wallet,
  Zap,
  TrendingUp,
  Users,
  Trophy,
  FileText,
  Send,
  LogOut,
  Copy,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

interface Project {
  id: number;
  title: string;
  budget: number;
  status: string;
  createdAt: string;
}

interface Dispute {
  id: number;
  projectId: number;
  status: string;
  description: string;
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { wallet, disconnectWallet } = useWeb3Context();
  const [projects, setProjects] = useState<Project[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [reputation, setReputation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const [projectsRes, disputesRes, reputationRes] = await Promise.all([
          projectApi.getProjects(5),
          disputeApi.getDisputes(5),
          userApi.getReputation(user.address),
        ]);

        setProjects(projectsRes.data.projects || []);
        setDisputes(disputesRes.data.disputes || []);
        setReputation(reputationRes.data.reputation || 0);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const copyAddress = () => {
    if (wallet?.address) {
      navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLogout = () => {
    logout();
    disconnectWallet();
    navigate('/');
  };

  const stats = [
    {
      icon: Trophy,
      label: 'Reputation Score',
      value: user?.reputation || 0,
      change: '+12',
    },
    {
      icon: TrendingUp,
      label: 'Completed Projects',
      value: user?.completedProjects || 0,
      change: '+3',
    },
    {
      icon: Users,
      label: 'Active Projects',
      value: projects.length,
      change: '+1',
    },
    {
      icon: Zap,
      label: 'Success Rate',
      value: '95%',
      change: '+5%',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-success';
      case 'in-progress':
        return 'text-neon-yellow';
      case 'pending':
        return 'text-neon-purple';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success/10';
      case 'in-progress':
        return 'bg-neon-yellow/10';
      case 'pending':
        return 'bg-neon-purple/10';
      default:
        return 'bg-gray-500/10';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-crypto flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin">
            <Zap className="w-12 h-12 text-neon-cyan mx-auto mb-4" />
          </div>
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-crypto">
      {/* Header */}
      <header className="border-b border-blockchain-border bg-blockchain-card/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-neon rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">HumanWork</h1>
              <p className="text-xs text-gray-400">Decentralized Freelancing</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {wallet?.isConnected && (
              <div className="hidden md:flex items-center gap-3 bg-blockchain-hover border border-blockchain-border rounded-lg px-4 py-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300 font-mono">
                  {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                </span>
                <button onClick={copyAddress} className="text-gray-400 hover:text-neon-cyan transition-colors">
                  {copied ? <CheckCircle className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-300 hover:text-neon-cyan transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name || 'Builder'}!</h2>
          <p className="text-gray-400">Here's your Web3 freelancing dashboard. Keep building, keep earning.</p>
        </div>

        {/* Wallet Status Card */}
        {wallet?.isConnected && (
          <div className="mb-8 bg-gradient-to-r from-blockchain-card to-blockchain-hover border border-blockchain-border rounded-xl p-6 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-400 mb-2">Connected Wallet</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <p className="font-mono text-white text-sm break-all">{wallet.address}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-2">Network</p>
                <p className="text-white font-semibold">{wallet.chainName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-2">Balance</p>
                <p className="text-white font-mono">{parseFloat(wallet.balance).toFixed(4)} ETH</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-blockchain-card border border-blockchain-border rounded-xl p-6 hover:border-blockchain-hover transition-colors group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-neon-cyan/10 flex items-center justify-center group-hover:shadow-lg transition-shadow">
                    <Icon className="w-5 h-5 text-neon-cyan" />
                  </div>
                  <span className="text-xs font-semibold text-success">{stat.change}</span>
                </div>
                <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                <p className="text-white text-2xl font-bold">{stat.value}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Recent Projects */}
          <div className="lg:col-span-2">
            <div className="bg-blockchain-card border border-blockchain-border rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-neon-cyan" />
                Active Projects
              </h3>

              <div className="space-y-3">
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <div key={project.id} className="bg-blockchain-hover border border-blockchain-border rounded-lg p-4 hover:border-neon-cyan/50 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="text-white font-semibold">{project.title}</h4>
                          <p className="text-sm text-gray-400">Client</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBg(project.status)} ${getStatusColor(project.status)}`}>
                          {project.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-blockchain-border">
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Budget</p>
                          <p className="text-white font-mono font-semibold">${project.budget}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Created</p>
                          <p className="text-white text-sm">{new Date(project.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No active projects yet</p>
                  </div>
                )}
              </div>

              <button className="w-full mt-4 bg-gradient-neon hover:shadow-neon-purple text-white font-semibold py-2 rounded-lg transition-all transform hover:scale-105">
                View All Projects
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <div className="bg-blockchain-card border border-blockchain-border rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>

              <div className="space-y-3">
                <button className="w-full bg-gradient-eth hover:shadow-lg text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105">
                  <Send className="w-4 h-4" />
                  Create Project
                </button>

                <button className="w-full bg-gradient-neon hover:shadow-lg text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105">
                  <Users className="w-4 h-4" />
                  Find Freelancers
                </button>

                <button className="w-full bg-blockchain-hover border border-blockchain-border text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:border-neon-cyan transition-colors">
                  <Trophy className="w-4 h-4" />
                  View Reputation
                </button>
              </div>
            </div>

            {/* Verification Status */}
            <div className="bg-blockchain-card border border-blockchain-border rounded-xl p-6">
              <h3 className="text-sm font-bold text-white mb-4">Verification Status</h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                  <span className="text-sm text-gray-300">Email Verified</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                  <span className="text-sm text-gray-300">Wallet Connected</span>
                </div>
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-neon-yellow flex-shrink-0" />
                  <span className="text-sm text-gray-300">KYC Pending</span>
                </div>
              </div>

              <button className="w-full mt-4 text-neon-cyan hover:text-neon-purple text-sm font-semibold transition-colors">
                Complete Verification
              </button>
            </div>
          </div>
        </div>

        {/* Blockchain Stats */}
        <div className="bg-blockchain-card border border-blockchain-border rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">On-Chain Statistics</h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-gray-400 text-sm mb-2">Total Earnings (ETH)</p>
              <p className="text-white text-3xl font-bold">12.45</p>
              <p className="text-success text-sm mt-1">↑ $28,420 USD</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Active Escrows</p>
              <p className="text-white text-3xl font-bold">3</p>
              <p className="text-neon-yellow text-sm mt-1">Value: 8.7 ETH</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Contract Interactions</p>
              <p className="text-white text-3xl font-bold">42</p>
              <p className="text-neon-cyan text-sm mt-1">Gas: ~15.3 ETH</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Dispute Resolution</p>
              <p className="text-white text-3xl font-bold">1</p>
              <p className="text-neon-purple text-sm mt-1">Resolved: 100%</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
