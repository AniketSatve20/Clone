import React from 'react';
import { Copy, CheckCircle } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: string;
  color?: 'purple' | 'cyan' | 'green' | 'orange';
}

const colorClasses = {
  purple: 'from-neon-purple/20 to-neon-purple/5 border-neon-purple/30',
  cyan: 'from-neon-cyan/20 to-neon-cyan/5 border-neon-cyan/30',
  green: 'from-success/20 to-success/5 border-success/30',
  orange: 'from-crypto/20 to-crypto/5 border-crypto/30',
};

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  change,
  color = 'purple',
}) => (
  <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-lg p-6 backdrop-blur-sm`}>
    <div className="flex items-start justify-between mb-4">
      <div className="text-gray-400">{icon}</div>
      {change && <span className="text-success text-xs font-semibold">{change}</span>}
    </div>
    <p className="text-gray-400 text-sm mb-1">{label}</p>
    <p className="text-2xl font-bold text-white">{value}</p>
  </div>
);

export const WalletCard: React.FC<{ address: string; onCopy: () => void; copied: boolean }> = ({
  address,
  onCopy,
  copied,
}) => (
  <div className="bg-gradient-to-r from-blockchain-card to-blockchain-hover border border-blockchain-border rounded-lg p-6">
    <h3 className="text-gray-400 text-sm mb-3">Wallet Address</h3>
    <div className="flex items-center gap-3">
      <code className="text-neon-cyan font-mono text-sm flex-1 truncate">{address}</code>
      <button
        onClick={onCopy}
        className="p-2 hover:bg-blockchain-hover rounded transition-colors text-neon-cyan hover:text-neon-cyan/80"
      >
        {copied ? (
          <CheckCircle className="w-5 h-5 text-success" />
        ) : (
          <Copy className="w-5 h-5" />
        )}
      </button>
    </div>
  </div>
);

export const ProjectCard: React.FC<{
  title: string;
  budget: number;
  status: string;
  createdAt: string;
  onClick?: () => void;
}> = ({ title, budget, status, createdAt, onClick }) => (
  <div
    onClick={onClick}
    className="bg-blockchain-card border border-blockchain-border rounded-lg p-4 hover:bg-blockchain-hover transition-colors cursor-pointer group"
  >
    <div className="flex items-start justify-between mb-3">
      <h4 className="font-semibold text-white group-hover:text-neon-cyan transition-colors">{title}</h4>
      <span className={`text-xs px-2 py-1 rounded-full ${getStatusStyle(status)}`}>{status}</span>
    </div>
    <div className="flex justify-between text-sm text-gray-400">
      <span>${budget.toLocaleString()}</span>
      <span>{new Date(createdAt).toLocaleDateString()}</span>
    </div>
  </div>
);

export const DisputeCard: React.FC<{
  title: string;
  projectId: number;
  status: string;
  description: string;
  onClick?: () => void;
}> = ({ title, projectId, status, description, onClick }) => (
  <div
    onClick={onClick}
    className="bg-blockchain-card border border-danger/30 rounded-lg p-4 hover:bg-blockchain-hover transition-colors cursor-pointer group"
  >
    <div className="flex items-start justify-between mb-2">
      <h4 className="font-semibold text-white group-hover:text-neon-cyan transition-colors">Project #{projectId}</h4>
      <span className={`text-xs px-2 py-1 rounded-full ${getStatusStyle(status)}`}>{status}</span>
    </div>
    <p className="text-sm text-gray-400 line-clamp-2">{description}</p>
  </div>
);

function getStatusStyle(status: string): string {
  switch (status) {
    case 'completed':
    case 'resolved':
      return 'bg-success/20 text-success';
    case 'in-progress':
    case 'open':
      return 'bg-neon-yellow/20 text-neon-yellow';
    case 'pending':
      return 'bg-neon-purple/20 text-neon-purple';
    case 'disputed':
    case 'failed':
      return 'bg-danger/20 text-danger';
    default:
      return 'bg-gray-500/20 text-gray-400';
  }
}

export const SectionHeader: React.FC<{
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}> = ({ title, subtitle, action }) => (
  <div className="flex items-center justify-between mb-6">
    <div>
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
    </div>
    {action}
  </div>
);

export const EmptyState: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({
  icon,
  title,
  description,
}) => (
  <div className="text-center py-12">
    <div className="flex justify-center mb-4 opacity-50">{icon}</div>
    <h3 className="text-white font-semibold mb-1">{title}</h3>
    <p className="text-gray-400 text-sm">{description}</p>
  </div>
);
