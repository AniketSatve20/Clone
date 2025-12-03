import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useWeb3Context } from '../context/Web3Context';
import { useToast } from '../components/Toast';
import { projectApi, disputeApi, userApi } from '../services/api';
import {
  Wallet,
  Zap,
  TrendingUp,
  Users,
  Trophy,
  LogOut,
  Settings,
  ChevronRight,
} from 'lucide-react';
import {
  StatCard,
  WalletCard,
  ProjectCard,
  DisputeCard,
  SectionHeader,
  EmptyState,
} from '../components/DashboardComponents';
import { LoadingSkeleton } from '../components/LoadingStates';

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
  const { showToast } = useToast();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [reputation, setReputation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        const [projectsRes, disputesRes, reputationRes] = await Promise.all([
          projectApi.getProjects(5).catch(err => ({ data: { projects: [] } })),
          disputeApi.getDisputes(5).catch(err => ({ data: { disputes: [] } })),
          userApi.getReputation(user.address).catch(err => ({ data: { reputation: 0 } })),
        ]);

        setProjects(projectsRes.data.projects || []);
        setDisputes(disputesRes.data.disputes || []);
        setReputation(reputationRes.data.reputation || 0);
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || err.message || 'Failed to load dashboard data';
        setError(errorMsg);
        showToast('error', errorMsg);
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, navigate, showToast]);

  const copyWalletAddress = () => {
    if (wallet?.address) {
      navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      showToast('success', 'Address copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLogout = () => {
    logout();
    disconnectWallet();
    showToast('success', 'Logged out successfully');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-crypto">
      {/* Header */}
      <div className="bg-blockchain-card/50 border-b border-blockchain-border backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">Welcome back, {user?.email || 'User'}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/profile')}
              className="p-2 hover:bg-blockchain-hover rounded-lg transition-colors text-gray-400 hover:text-white"
            >
              <Settings className="w-6 h-6" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-danger/10 hover:bg-danger/20 text-danger rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-semibold">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-danger/20 border border-danger/50 rounded-lg text-danger text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <LoadingSkeleton count={4} />
        ) : (
          <>
            {/* Wallet & Stats Section */}
            {wallet?.address && (
              <div className="mb-8">
                <WalletCard
                  address={wallet.address}
                  onCopy={copyWalletAddress}
                  copied={copied}
                />
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                icon={<Trophy className="w-5 h-5 text-neon-purple" />}
                label="Reputation Score"
                value={reputation}
                change="+12"
                color="purple"
              />
              <StatCard
                icon={<TrendingUp className="w-5 h-5 text-neon-cyan" />}
                label="Active Projects"
                value={projects.length}
                change={projects.length > 0 ? '+' + projects.length : '0'}
                color="cyan"
              />
              <StatCard
                icon={<Users className="w-5 h-5 text-success" />}
                label="Open Disputes"
                value={disputes.length}
                color="green"
              />
              <StatCard
                icon={<Zap className="w-5 h-5 text-crypto" />}
                label="Success Rate"
                value="95%"
                change="+5%"
                color="orange"
              />
            </div>

            {/* Projects Section */}
            <div className="mb-8">
              <SectionHeader
                title="Recent Projects"
                subtitle="Your active and completed projects"
                action={
                  <button
                    onClick={() => navigate('/projects')}
                    className="flex items-center gap-2 text-neon-cyan hover:text-neon-cyan/80 transition-colors"
                  >
                    <span className="text-sm font-semibold">View All</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                }
              />
              {projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.map(project => (
                    <ProjectCard
                      key={project.id}
                      {...project}
                      onClick={() => navigate(`/projects/${project.id}`)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<Wallet className="w-12 h-12" />}
                  title="No Active Projects"
                  description="Start your first project to begin earning"
                />
              )}
            </div>

            {/* Disputes Section */}
            {disputes.length > 0 && (
              <div>
                <SectionHeader
                  title="Open Disputes"
                  subtitle="Disputes requiring your attention"
                  action={
                    <button
                      onClick={() => navigate('/disputes')}
                      className="flex items-center gap-2 text-neon-cyan hover:text-neon-cyan/80 transition-colors"
                    >
                      <span className="text-sm font-semibold">View All</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  }
                />
                <div className="space-y-3">
                  {disputes.map(dispute => (
                    <DisputeCard
                      key={dispute.id}
                      {...dispute}
                      title={`Dispute for Project #${dispute.projectId}`}
                      onClick={() => navigate(`/disputes/${dispute.id}`)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
